import { query, Request, Response } from 'express'
import { Connect, Query } from '../mysql.js'
import logger from '../logger.js'
import NotFoundError from '../errors/notFoundError.js'
import { Connection } from 'mysql'
import paginate from '../utils/pagination.js'
import { pizzaModelToPizzaDto } from '../converters/pizzaConverters.js'

declare global {
    interface IPizzaModel {
        id: number,
        name: String,
        price: number
        ingredients: String
        count: number
    }

    interface IPizzaDto {
        id: number,
        name: String,
        price: number,
        ingredients: String[],
        count: number
    }

    interface ICreatePizzaDto {
        name: String,
        price: number,
        ingredients: number[],
        count: Number
    }

    interface IUpdatePizzaDto {
        name?: String,
        price?: number,
        ingredients?: number[],
        number?: number,
        count?: number
    }
}


const NAMESPACE = "pizza controller"

const getPizzasCount = async (req: Request, res: Response, connection: Connection) => {

    const result = await Query<{ count: number }[]>(connection, 'SELECT COUNT(pizzas.id) as "count" FROM pizzas')

    return res.status(200).json(result[0])

}

const getAllPizzas = async (req: Request<any, any, any, IPaginationOptions>, res: Response, connection: Connection) => {
    const paginationOptions = req.query

    const QUERY = 'SELECT pizzas.id, pizzas.name, pizzas.price, GROUP_CONCAT(ingredients.name) AS ingredients, pizzas.count '
        + 'FROM pizzas '
        + 'LEFT join pizzas_ingredients ON pizzas_ingredients.pizza_id = pizzas.id '
        + 'LEFT join ingredients ON ingredients.id = pizzas_ingredients.ingredient_id '
        + 'GROUP BY pizzas.id '
        + 'ORDER BY pizzas.id'

    const result = await Query<IPizzaModel[]>(connection, QUERY)

    let pizzaDtos: IPizzaDto[] = [];

    result.forEach(element => {
        const ingredients = element.ingredients != null ? element.ingredients.split(",") : []

        pizzaDtos.push(pizzaModelToPizzaDto(element, ingredients))
    })

    return res.status(200).json(paginate(pizzaDtos, paginationOptions))

}


const getPizza = async (req: Request<{ id: number }>, res: Response, connection: Connection) => {
    const id = req.params.id

    const QUERY = 'SELECT pizzas.id, pizzas.name, pizzas.price, GROUP_CONCAT(ingredients.name) AS ingredients '
        + 'FROM pizzas '
        + 'LEFT join pizzas_ingredients ON pizzas_ingredients.pizza_id = pizzas.id '
        + 'LEFT join ingredients ON ingredients.id = pizzas_ingredients.ingredient_id '
        + `WHERE pizzas.id = ${id} `
        + 'GROUP BY pizzas.id'

    const result = await Query<IPizzaModel[]>(connection, QUERY)

    let pizzaDto: IPizzaDto;

    if (result.length == 0)
        throw new NotFoundError(`Pizza with id ${id} not found at getPizza`, 'pizza not found')

    const ingredients = result[0].ingredients != null ? result[0].ingredients.split(",") : []

    pizzaDto = pizzaModelToPizzaDto(result[0], ingredients)

    return res.status(200).json(pizzaDto)

}

const createPizza = async (req: Request<{}, {}, ICreatePizzaDto>, res: Response, connection: Connection) => {
    const createPizzaDto = req.body

    const QUERY = `INSERT INTO pizzas (name, price, count) VALUES ('${createPizzaDto.name}', ${createPizzaDto.price}, ${createPizzaDto.count})`

    const result = await Query<any>(connection, QUERY)

    const id = result.insertId

    for (const ingredientId of createPizzaDto.ingredients) {
        await Query(connection, `INSERT INTO pizzas_ingredients VALUES (${id}, ${ingredientId})`)
    }

    return res.status(201).send({ id })

}

const deletePizza = async (req: Request<{ id: number }>, res: Response, connection: Connection) => {
    const id = req.params.id


    const result = await Query<IPizzaModel[]>(connection, `SELECT pizzas.id FROM pizzas WHERE pizzas.id = ${id}`)

    if (result.length == 0)
        throw new NotFoundError(`Pizza with id ${id} not found at deletePizza`, 'pizza not found')

    await Query(connection, `DELETE FROM pizzas_ingredients WHERE pizza_id = ${id}`)
    await Query(connection, `DELETE FROM pizzas WHERE id = ${id}`)

    return res.status(204).send("Pizza deleted successfully")

}

const updatePizza = async (req: Request<{ id: number }, {}, IUpdatePizzaDto>, res: Response, connection: Connection) => {

    const id = req.params.id
    const updatePizza = req.body

    const updates: string[] = []

    const result = await Query<IPizzaModel[]>(connection, `SELECT pizzas.id FROM pizzas WHERE pizzas.id = ${id}`)

    if (result.length == 0)
        throw new NotFoundError(`Pizza with id ${id} not found at updatePizza`, 'pizza not found')

    if (updatePizza.name != null)
        updates.push(`name='${updatePizza.name}'`)

    if (updatePizza.price != null)
        updates.push(`price=${updatePizza.price}`)

    if (updatePizza.count != null)
        updates.push(`count=${updatePizza.count}`)

    if (updates.length > 0)
        await Query(connection, `UPDATE pizzas SET ${updates} WHERE pizzas.id = ${id}`)

    if (updatePizza.ingredients != null) {
        await Query(connection, `DELETE FROM pizzas_ingredients WHERE pizza_id = ${id}`)

        for (const ingredientId of updatePizza.ingredients) {
            await Query(connection, `INSERT INTO pizzas_ingredients VALUES (${id}, ${ingredientId})`)
        }
    }

    return res.send("Pizza updated successfully").status(200)

}

export default {
    getPizzasCount,
    getAllPizzas,
    getPizza,
    createPizza,
    deletePizza,
    updatePizza
}
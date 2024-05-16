import { query, Request, Response } from 'express'
import { Connect, Query } from '../mysql.js'
import logger from '../logger.js'
import NotFoundError from '../errors/notFoundError.js'
import { Connection } from 'mysql'
import paginate from '../utils/pagination.js'

declare global {
    interface IPizzaModel {
        id: number,
        name: String,
        price: number
        ingredients: String
    }

    interface IPizzaDto {
        id?: number,
        name: String,
        price: number,
        ingredients: String[],
    }

    interface ICreatePizzaDto {
        name: String,
        price: number,
        ingredients: number[],
    }

    interface IUpdatePizzaDto {
        name?: String,
        price?: number,
        ingredients?: number[],
    }
}


const NAMESPACE = "pizza controller"

const getAllPizzas = async (req: Request<any, any, any, IPaginationOptions>, res: Response, connection: Connection) => {
    const paginationOptions = req.query

    const QUERY = 'SELECT pizzas.id, pizzas.name, pizzas.price, GROUP_CONCAT(ingredients.name) AS ingredients '
        + 'FROM pizzas '
        + 'LEFT join pizzas_ingredients ON pizzas_ingredients.pizza_id = pizzas.id '
        + 'LEFT join ingredients ON ingredients.id = pizzas_ingredients.ingredient_id '
        + 'GROUP BY pizzas.id '
        + 'ORDER BY pizzas.id'

    const result = await Query<IPizzaModel[]>(connection, QUERY)

    let pizzaDtos: IPizzaDto[] = [];

    result.forEach(element => {
        const ingredients = element.ingredients != null ? element.ingredients.split(",") : []

        pizzaDtos.push({
            id: element.id,
            name: element.name,
            price: element.price,
            ingredients: ingredients
        })
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

    pizzaDto = {
        id: result[0].id,
        name: result[0].name,
        price: result[0].price,
        ingredients: ingredients
    }

    return res.status(200).json(pizzaDto)

}

const createPizza = async (req: Request<{}, {}, ICreatePizzaDto>, res: Response, connection: Connection) => {
    const createPizzaDto = req.body

    const QUERY = `INSERT INTO pizzas (name, price) VALUES ('${createPizzaDto.name}', ${createPizzaDto.price})`

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

    const result = await Query<IPizzaModel[]>(connection, `SELECT pizzas.id FROM pizzas WHERE pizzas.id = ${id}`)

    if (result.length == 0)
        throw new NotFoundError(`Pizza with id ${id} not found at updatePizza`, 'pizza not found')

    if (updatePizza.name != null)
        await Query(connection, `UPDATE pizzas SET name='${updatePizza.name}' WHERE id=${id}`)

    if (updatePizza.price != null)
        await Query(connection, `UPDATE pizzas SET price=${updatePizza.price} WHERE id=${id}`)

    if (updatePizza.ingredients != null) {
        await Query(connection, `DELETE FROM pizzas_ingredients WHERE pizza_id = ${id}`)

        for (const ingredientId of updatePizza.ingredients) {
            await Query(connection, `INSERT INTO pizzas_ingredients VALUES (${id}, ${ingredientId})`)
        }
    }

    return res.send("Pizza updated successfully").status(200)

}

export default {
    getAllPizzas,
    getPizza,
    createPizza,
    deletePizza,
    updatePizza
}
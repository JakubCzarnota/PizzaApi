import { query, Request, Response } from 'express'
import { Connect, Query } from '../mysql.js'
import logger from '../logger.js'

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


const NAMESPACE = "pizza controller"

const getAllPizzas = async (req: Request, res: Response) => {
    const QUERY = 'SELECT pizzas.id, pizzas.name, pizzas.price, GROUP_CONCAT(ingredients.name) AS ingredients '
        + 'FROM pizzas '
        + 'LEFT join pizzas_ingredients ON pizzas_ingredients.pizza_id = pizzas.id '
        + 'LEFT join ingredients ON ingredients.id = pizzas_ingredients.ingredient_id '
        + 'GROUP BY pizzas.id'

    const connection = await Connect()

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

    res.json(pizzaDtos)
    res.status(200)

    connection.end()


}

const getPizza = async (req: Request<{ id: number }>, res: Response) => {
    const id = req.params.id

    const QUERY = 'SELECT pizzas.id, pizzas.name, pizzas.price, GROUP_CONCAT(ingredients.name) AS ingredients '
        + 'FROM pizzas '
        + 'LEFT join pizzas_ingredients ON pizzas_ingredients.pizza_id = pizzas.id '
        + 'LEFT join ingredients ON ingredients.id = pizzas_ingredients.ingredient_id '
        + `WHERE pizzas.id = ${id} `
        + 'GROUP BY pizzas.id'

    const connection = await Connect()

    const result = await Query<IPizzaModel[]>(connection, QUERY)

    let pizzaDto: IPizzaDto | null = null;

    if (result.length > 0) {
        const ingredients = result[0].ingredients != null ? result[0].ingredients.split(",") : []

        pizzaDto = {
            id: result[0].id,
            name: result[0].name,
            price: result[0].price,
            ingredients: ingredients
        }
    }

    res.json(pizzaDto)
    res.status(200)


    connection.end()

}

const createPizza = async (req: Request<{}, {}, ICreatePizzaDto>, res: Response) => {
    const newPizza = req.body

    const QUERY = `INSERT INTO pizzas (name, price) VALUES ('${newPizza.name}', ${newPizza.price})`

    const connection = await Connect()

    const result = await Query<any>(connection, QUERY)

    const id = result.insertId

    newPizza.ingredients.forEach(element => {
        Query(connection, `INSERT INTO pizzas_ingredients VALUES (${id}, ${element})`)
    })

    res.send({ id })
    res.status(201)

    connection.end()

}

const deletePizza = async (req: Request<{ id: number }>, res: Response) => {
    const id = req.params.id

    const QUERY = `DELETE FROM pizzas WHERE id = ${id}`
    const QUERY2 = `DELETE FROM pizzas_ingredients WHERE pizza_id = ${id}`

    const connection = await Connect()

    await Query(connection, QUERY2)
    await Query(connection, QUERY)

    res.send("Successfully deleted")
    res.status(204)

    connection.end()

}

const updatePizza = async (req: Request<{ id: number }, {}, IUpdatePizzaDto>, res: Response) => {

    const id = req.params.id
    const updatePizza = req.body

    const connection = await Connect()

    if (updatePizza.name != null)
        await Query(connection, `UPDATE pizzas SET name='${updatePizza.name}' WHERE id=${id}`)

    if (updatePizza.price != null)
        await Query(connection, `UPDATE pizzas SET price=${updatePizza.price} WHERE id=${id}`)

    if (updatePizza.ingredients != null) {
        await Query(connection, `DELETE FROM pizzas_ingredients WHERE pizza_id = ${id}`)

        updatePizza.ingredients.forEach(async element => {
            await Query(connection, `INSERT INTO pizzas_ingredients VALUES (${id}, ${element})`)
        });
    }

    res.send("Updated Successfully")
    res.status(200)

    connection.end()

}

export default {
    getAllPizzas,
    getPizza,
    createPizza,
    deletePizza,
    updatePizza
}
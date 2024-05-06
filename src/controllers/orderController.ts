import { query, Request, Response } from 'express'
import { Connect, Query } from '../mysql.js'
import logger from '../logger.js'
import NotFoundError from '../errors/notFoundError.js'

declare global {
    interface IOrdersPizzasModel {
        orderId: number,
        pizzaId: number
    }

    interface IOrderModel {
        id: number,
        first_name: string,
        last_name: string,
        phone_number: string,
        city: string,
        street: string,
        building_number: string
    }

    interface IOrderDto {
        id: number,
        first_name: string,
        last_name: string,
        phone_number: string,
        city: string,
        street: string,
        building_number: string
        pizzas: IPizzaDto[]
    }

    interface ICreateOrderDto {
        first_name: string,
        last_name: string,
        phone_number: string,
        city: string,
        street: string,
        building_number: string
        pizzas: number[]
    }

    interface IUpdateOrderDto {
        first_name?: string,
        last_name?: string,
        phone_number?: string,
        city?: string,
        street?: string,
        building_number?: string
        pizzas?: number[]
    }
}

const getAllOrders = async (req: Request, res: Response) => {

    const conntection = await Connect()

    const result = await Query<IOrderModel[]>(conntection, 'SELECT orders.id, orders.first_name, orders.last_name, orders.phone_number, orders.city, orders.street, orders.building_number FROM orders')

    let orderDtos: IOrderDto[] = []

    for (const item of result) {
        const ordersPizzasModels = await Query<IOrdersPizzasModel[]>(conntection, `SELECT orders_pizzas.order_id AS orderId ,orders_pizzas.pizza_id AS pizzaId FROM orders_pizzas WHERE orders_pizzas.order_id = ${item.id}`)

        const pizzaIds = ordersPizzasModels.map(value => {
            return value.pizzaId as number
        })

        let pizzaModels: IPizzaModel[] = []

        for (const pizzaId of pizzaIds) {
            const query = 'SELECT pizzas.id, pizzas.name, pizzas.price, GROUP_CONCAT(ingredients.name) AS ingredients '
                + 'FROM pizzas '
                + 'LEFT join pizzas_ingredients ON pizzas_ingredients.pizza_id = pizzas.id '
                + 'LEFT join ingredients ON ingredients.id = pizzas_ingredients.ingredient_id '
                + `WHERE pizzas.id = ${pizzaId} `
                + 'GROUP BY pizzas.id'

            pizzaModels.push((await Query<IPizzaModel[]>(conntection, query))[0])
        }

        const pizzaDtos: IPizzaDto[] = pizzaModels.map(value => {
            const ingredients = value.ingredients != null ? value.ingredients.split(",") : []

            return {
                id: value.id,
                name: value.name,
                price: value.price,
                ingredients: ingredients
            }
        })

        orderDtos.push({
            id: item.id,
            first_name: item.first_name,
            last_name: item.last_name,
            phone_number: item.phone_number,
            city: item.city,
            street: item.street,
            building_number: item.building_number,
            pizzas: pizzaDtos
        })
    }

    conntection.end()

    return res.status(200).json(orderDtos)

}

const getOrder = async (req: Request<{ id: number }>, res: Response) => {
    const id = req.params.id

    const conntection = await Connect()

    const result = await Query<IOrderModel[]>(conntection, `SELECT orders.id, orders.first_name, orders.last_name, orders.phone_number, orders.city, orders.street, orders.building_number FROM orders WHERE orders.id = ${id}`)

    if (result.length == 0)
        throw new NotFoundError(`Order with id ${id} not found at getOrder`, 'order not found')

    const item = result[0]

    const ordersPizzasModels = await Query<IOrdersPizzasModel[]>(conntection, `SELECT orders_pizzas.order_id AS orderId ,orders_pizzas.pizza_id AS pizzaId FROM orders_pizzas WHERE orders_pizzas.order_id = ${item.id}`)

    const pizzaIds = ordersPizzasModels.map(value => {
        return value.pizzaId as number
    })

    let pizzaModels: IPizzaModel[] = []

    for (const pizzaId of pizzaIds) {
        const query = 'SELECT pizzas.id, pizzas.name, pizzas.price, GROUP_CONCAT(ingredients.name) AS ingredients '
            + 'FROM pizzas '
            + 'LEFT join pizzas_ingredients ON pizzas_ingredients.pizza_id = pizzas.id '
            + 'LEFT join ingredients ON ingredients.id = pizzas_ingredients.ingredient_id '
            + `WHERE pizzas.id = ${pizzaId} `
            + 'GROUP BY pizzas.id'

        pizzaModels.push((await Query<IPizzaModel[]>(conntection, query))[0])
    }

    const pizzaDtos: IPizzaDto[] = pizzaModels.map(value => {
        const ingredients = value.ingredients != null ? value.ingredients.split(",") : []

        return {
            id: value.id,
            name: value.name,
            price: value.price,
            ingredients: ingredients
        }
    })

    const orderDto: IOrderDto = {
        id: item.id,
        first_name: item.first_name,
        last_name: item.last_name,
        phone_number: item.phone_number,
        city: item.city,
        street: item.street,
        building_number: item.building_number,
        pizzas: pizzaDtos
    }


    conntection.end()

    return res.status(200).json(orderDto)

}

const createOrder = async (req: Request<{}, {}, ICreateOrderDto>, res: Response) => {
    const createOrderDto = req.body

    const connection = await Connect()

    const query = `INSERT INTO orders `
        + `(orders.first_name, orders.Last_name, orders.phone_number, orders.city, orders.street, orders.building_number) `
        + `VALUES `
        + `('${createOrderDto.first_name}', '${createOrderDto.last_name}', '${createOrderDto.phone_number}', '${createOrderDto.city}' ,'${createOrderDto.street}', '${createOrderDto.building_number}')`

    const result = await Query<any>(connection, query)

    const id = result.insertId

    for (const pizzaId of createOrderDto.pizzas) {
        await Query(connection, `INSERT INTO orders_pizzas VALUES (${id}, ${pizzaId})`)
    }

    connection.end()

    return res.status(201).json(id)

}

const deleteOrder = async (req: Request<{ id: number }>, res: Response) => {
    const id = req.params.id

    const connection = await Connect()

    await Query(connection, `DELETE FROM orders_pizzas WHERE orders_pizzas.order_id = ${id}`)
    await Query(connection, `DELETE FROM orders WHERE orders.id = ${id}`)

    connection.end()

    return res.status(204).send("Order deleted successfully")

}

const updateOrder = async (req: Request<{ id: number }, {}, IUpdateOrderDto>, res: Response) => {
    const id = req.params.id

    const updateOrderDto = req.body

    const connection = await Connect()

    if (updateOrderDto.first_name != null)
        await Query(connection, `UPDATE orders SET orders.first_name = '${updateOrderDto.first_name}' WHERE orders.id = ${id}`)

    if (updateOrderDto.last_name != null)
        await Query(connection, `UPDATE orders SET orders.last_name = '${updateOrderDto.last_name}' WHERE orders.id = ${id}`)

    if (updateOrderDto.phone_number != null)
        await Query(connection, `UPDATE orders SET orders.phone_number = '${updateOrderDto.phone_number}' WHERE orders.id = ${id}`)

    if (updateOrderDto.city != null)
        await Query(connection, `UPDATE orders SET orders.city = '${updateOrderDto.city}' WHERE orders.id = ${id}`)

    if (updateOrderDto.street != null)
        await Query(connection, `UPDATE orders SET orders.street = '${updateOrderDto.street}' WHERE orders.id = ${id}`)

    if (updateOrderDto.building_number != null)
        await Query(connection, `UPDATE orders SET orders.building_number = '${updateOrderDto.building_number}' WHERE orders.id = ${id}`)

    if (updateOrderDto.pizzas != null) {
        await Query(connection, `DELETE FROM orders_pizzas WHERE orders_pizzas.order_id = ${id}`)

        for (const pizzaId of updateOrderDto.pizzas) {
            await Query(connection, `INSERT INTO orders_pizzas VALUES (${id}, ${pizzaId})`)
        }
    }

    connection.end()

    return res.send("Order updated successfully").status(200)
}

export default {
    getAllOrders,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder
}
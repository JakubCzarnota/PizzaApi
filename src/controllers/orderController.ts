import { query, Request, Response } from 'express'
import { Connect, Query } from '../mysql.js'
import logger from '../logger.js'
import NotFoundError from '../errors/notFoundError.js'
import { Connection } from 'mysql'
import paginate from '../utils/pagination.js'
import UnavalibleError from '../errors/unavalibleError.js'

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

const getOrdersCount = async (req: Request, res: Response, connection: Connection) => {

    const result = await Query<{ count: number }[]>(connection, 'SELECT COUNT(orders.id) as "count" FROM orders')

    return res.status(200).json(result[0])

}

const getAllOrders = async (req: Request<any, any, any, IPaginationOptions>, res: Response, connection: Connection) => {
    const paginationOptions = req.query

    const query = 'SELECT orders.id, orders.first_name, orders.last_name, orders.phone_number, addresses.city, addresses.street, addresses.building_number FROM orders INNER JOIN addresses ON orders.address_id = addresses.id ORDER BY orders.id'

    const result = await Query<IOrderModel[]>(connection, query)

    let orderDtos: IOrderDto[] = []

    for (const item of result) {
        const ordersPizzasModels = await Query<IOrdersPizzasModel[]>(connection, `SELECT orders_pizzas.order_id AS orderId ,orders_pizzas.pizza_id AS pizzaId FROM orders_pizzas WHERE orders_pizzas.order_id = ${item.id}`)

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

            pizzaModels.push((await Query<IPizzaModel[]>(connection, query))[0])
        }

        const pizzaDtos: IPizzaDto[] = pizzaModels.map(value => {
            const ingredients = value.ingredients != null ? value.ingredients.split(",") : []

            return {
                id: value.id,
                name: value.name,
                price: value.price,
                ingredients: ingredients,
                count: value.count
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

    return res.status(200).json(paginate(orderDtos, paginationOptions))

}

const getOrder = async (req: Request<{ id: number }>, res: Response, connection: Connection) => {
    const id = req.params.id

    const query = `SELECT orders.id, orders.first_name, orders.last_name, orders.phone_number, addresses.city, addresses.street, addresses.building_number FROM orders INNER JOIN addresses ON orders.address_id = addresses.id WHERE orders.id = ${id}`

    const result = await Query<IOrderModel[]>(connection, query)

    if (result.length == 0)
        throw new NotFoundError(`Order with id ${id} not found at getOrder`, 'order not found')

    const item = result[0]

    const ordersPizzasModels = await Query<IOrdersPizzasModel[]>(connection, `SELECT orders_pizzas.order_id AS orderId ,orders_pizzas.pizza_id AS pizzaId FROM orders_pizzas WHERE orders_pizzas.order_id = ${item.id}`)

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

        pizzaModels.push((await Query<IPizzaModel[]>(connection, query))[0])
    }

    const pizzaDtos: IPizzaDto[] = pizzaModels.map(value => {
        const ingredients = value.ingredients != null ? value.ingredients.split(",") : []

        return {
            id: value.id,
            name: value.name,
            price: value.price,
            ingredients: ingredients,
            count: value.count
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

    return res.status(200).json(orderDto)

}

const arePizzasAvalible = async (pizzaIds: number[], connection: Connection) => {

    const distinctPizzaIds = [...new Set(pizzaIds)]

    for (const id of distinctPizzaIds) {
        const count = pizzaIds.filter(x => x == id).length

        const result = (await Query<{ count: number }[]>(connection, `SELECT pizzas.count AS count FROM pizzas WHERE pizzas.id = ${id}`))[0]

        if (count > result.count)
            return false
    }

    return true

}

const decrementPizzaCounts = async (pizzaIds: number[], connection: Connection) => {

    const distinctPizzaIds = [...new Set(pizzaIds)]

    for (const id of distinctPizzaIds) {
        const count = pizzaIds.filter(x => x == id).length

        await Query(connection, `UPDATE pizzas SET pizzas.count = pizzas.count - ${count} WHERE pizzas.id = ${id} AND pizzas.count > ${count - 1}`)
    }

}

const createOrder = async (req: Request<{}, {}, ICreateOrderDto>, res: Response, connection: Connection) => {
    const createOrderDto = req.body

    if (!(await arePizzasAvalible(createOrderDto.pizzas, connection)))
        throw new UnavalibleError(`Order cannot be created because of not enough pizzas`, 'not all pizzas are avalible')

    await decrementPizzaCounts(createOrderDto.pizzas, connection)

    const adressResult = await Query<{ id: number }[]>(connection, `SELECT adresses.id WHERE adresses.city = '${createOrderDto.city}' AND adresses.street = '${createOrderDto.street}' AND adresses.building_number = '${createOrderDto.building_number}'`)

    let adressesId: number;

    if (adressResult.length > 0)
        adressesId = adressResult[0].id
    else {
        adressesId = (await Query<any>(connection, `INSERT INTO addresses (addresses.city, addresses.street, addresses.building_number)VALUES ('${createOrderDto.city}', '${createOrderDto.street}', '${createOrderDto.building_number}')`)).insertId
    }

    const query = `INSERT INTO orders `
        + `(orders.first_name, orders.Last_name, orders.phone_number, orders.address_id) `
        + `VALUES `
        + `('${createOrderDto.first_name}', '${createOrderDto.last_name}', '${createOrderDto.phone_number}', ${adressesId})`

    const result = await Query<any>(connection, query)

    const id = result.insertId

    for (const pizzaId of createOrderDto.pizzas) {
        await Query(connection, `INSERT INTO orders_pizzas VALUES (${id}, ${pizzaId})`)
    }

    return res.status(201).json(id)

}

const deleteOrder = async (req: Request<{ id: number }>, res: Response, connection: Connection) => {
    const id = req.params.id

    const result = await Query<IOrderModel[]>(connection, `SELECT orders.id FROM orders where orders.id = ${id}`)

    if (result.length == 0)
        throw new NotFoundError(`Order with id ${id} not found at deleteOrder`, 'order not found')

    await Query(connection, `DELETE FROM orders_pizzas WHERE orders_pizzas.order_id = ${id}`)
    await Query(connection, `DELETE FROM orders WHERE orders.id = ${id}`)


    return res.status(204).send("Order deleted successfully")

}

const updateOrder = async (req: Request<{ id: number }, {}, IUpdateOrderDto>, res: Response, connection: Connection) => {
    const id = req.params.id

    const updateOrderDto = req.body

    const result = await Query<IOrderModel[]>(connection, `SELECT orders.id FROM orders where orders.id = ${id}`)

    if (result.length == 0)
        throw new NotFoundError(`Order with id ${id} not found at deleteOrder`, 'order not found')

    const updates: string[] = []

    if (updateOrderDto.first_name != null)
        updates.push(`first_name='${updateOrderDto.first_name}'`)

    if (updateOrderDto.last_name != null)
        updates.push(`last_name='${updateOrderDto.last_name}'`)

    if (updateOrderDto.phone_number != null)
        updates.push(`phone_number='${updateOrderDto.phone_number}'`)

    if (updates.length > 0)
        await Query(connection, `UPDATE orders SET ${updates} WHERE orders.id = ${id}`)

    let addressesUpdates: string[] = []

    if (updateOrderDto.city != null)
        addressesUpdates.push(`city='${updateOrderDto.city}' `)

    if (updateOrderDto.street != null)
        addressesUpdates.push(`street='${updateOrderDto.street}' `)

    if (updateOrderDto.building_number != null)
        addressesUpdates.push(`building_number='${updateOrderDto.building_number}'`)

    if (addressesUpdates.length > 0) {
        const adressesId = (await Query<{ id: number }[]>(connection, `SELECT orders.address_id AS "id" WHERE orders.id = ${id}`))[0].id

        await Query(connection, `UPDATE addresses SET ${addressesUpdates} WHERE addresses.id = ${adressesId}`)
    }

    if (updateOrderDto.pizzas != null) {
        await Query(connection, `DELETE FROM orders_pizzas WHERE orders_pizzas.order_id = ${id}`)

        for (const pizzaId of updateOrderDto.pizzas) {
            await Query(connection, `INSERT INTO orders_pizzas VALUES (${id}, ${pizzaId})`)
        }
    }

    return res.send("Order updated successfully").status(200)
}

export default {
    getOrdersCount,
    getAllOrders,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder
}
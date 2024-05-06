import { query, Request, Response } from 'express'
import { Connect, Query } from '../mysql.js'
import logger from '../logger.js'
import NotFoundError from '../errors/notFoundError.js'
import { Connection } from 'mysql'

declare global {
    interface IIngredientModel {
        id: number,
        name: string
    }

    interface IIngredientDto {
        id: number,
        name: string
    }

    interface ICreateIngredientDto {
        name: string
    }
    interface IUpdateIngredientDto {
        name: string
    }
}

const getAllIngredients = async (req: Request, res: Response, connection: Connection) => {

    const result = await Query<IIngredientModel[]>(connection, 'SELECT ingredients.id, ingredients.name FROM ingredients')

    return res.status(200).json(result as IIngredientDto[])

}

const getIngredient = async (req: Request<{ id: number }>, res: Response, connection: Connection) => {
    const id = req.params.id

    const result = await Query<IIngredientModel[]>(connection, `SELECT ingredients.id, ingredients.name FROM ingredients WHERE ingredients.id = ${id}`)

    if (result.length == 0)
        throw new NotFoundError(`Ingredient with id ${id} not found at getPizza`, 'ingredient not found')

    return res.status(200).json(result[0] as IIngredientDto)

}

const createIngredient = async (req: Request<{}, {}, ICreateIngredientDto>, res: Response, connection: Connection) => {
    const createIngredientDto = req.body

    const result = await Query<any>(connection, `INSERT INTO ingredients (ingredients.name) VALUES ('${createIngredientDto.name}')`)

    const id = result.insertId

    return res.status(201).json(id)

}

const deleteIngredient = async (req: Request<{ id: number }>, res: Response, connection: Connection) => {
    const id = req.params.id

    const result = await Query<IIngredientModel[]>(connection, `SELECT ingredients.id FROM ingredients WHERE ingredients.id = ${id}`)

    if (result.length == 0)
        throw new NotFoundError(`Ingredient with id ${id} not found at getPizza`, 'ingredient not found')

    await Query(connection, `DELETE FROM pizzas_ingredients WHERE pizzas_ingredients.ingredient_id = ${id}`)
    await Query(connection, `DELETE FROM ingredients WHERE id = ${id}`)

    return res.status(204).send('Ingredient deleted successfully')

}

const updateIngredient = async (req: Request<{ id: number }, {}, IUpdateIngredientDto>, res: Response, connection: Connection) => {
    const id = req.params.id
    const updateIngredientDto = req.body

    const result = await Query<IIngredientModel[]>(connection, `SELECT ingredients.id FROM ingredients WHERE ingredients.id = ${id}`)

    if (result.length == 0)
        throw new NotFoundError(`Ingredient with id ${id} not found at getPizza`, 'ingredient not found')

    await Query(connection, `UPDATE ingredients SET ingredients.name = '${updateIngredientDto.name}' WHERE id = ${id}`)

    return res.status(200).send('Ingredient updated successfully')

}

export default {
    getAllIngredients,
    getIngredient,
    createIngredient,
    deleteIngredient,
    updateIngredient
}
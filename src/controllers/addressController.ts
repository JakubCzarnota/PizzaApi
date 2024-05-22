import { Request, Response } from 'express'

import { Query } from '../mysql.js'
import { Connection } from 'mysql'
import { AddressModelToAddressDto } from '../converters/addressConverters.js'
import paginate from '../utils/pagination.js'
import NotFoundError from '../errors/notFoundError.js'
import UnavalibleError from '../errors/unavalibleError.js'

declare global {
    interface IAddressModel {
        id: number,
        city: string,
        street: string,
        buildingNumber: string
    }

    interface IAddressDto {
        id: number,
        city: string,
        street: string,
        buildingNumber: string
    }

    interface ICreateAddressDto {
        city: string,
        street: string,
        buildingNumber: string
    }

    interface IUpdateAddressDto {
        city?: string,
        street?: string,
        buildingNumber?: string
    }
}

const getAddressesCount = async (req: Request, res: Response, connection: Connection) => {

    const result = await Query<{ count: number }[]>(connection, 'SELECT COUNT(addresses.id) as "count" FROM addresses')

    res.status(200).json(result[0])

}

const getAllAddresses = async (req: Request<any, any, any, IPaginationOptions>, res: Response, connection: Connection) => {

    const paginationOptions = req.query

    const result = await Query<IAddressModel[]>(connection, 'SELECT addresses.id, addresses.city, addresses.street, addresses.building_number AS "buildingNumber" FROM addresses')

    const addressDtos = result.map(value => AddressModelToAddressDto(value))

    res.status(200).json(paginate(addressDtos, paginationOptions))

}

const getAddress = async (req: Request<{ id: number }>, res: Response, connection: Connection) => {

    const id = req.params.id

    const result = await Query<IAddressModel[]>(connection, `SELECT addresses.id, addresses.city, addresses.street, addresses.building_number AS "buildingNumber" FROM addresses WHERE addresses.id = ${id}`)

    if (result.length == 0)
        throw new NotFoundError(`Address with id ${id} not found at getaddress`, 'address not found')

    const addressDto = AddressModelToAddressDto(result[0])

    res.status(200).json(addressDto)

}

const createAddress = async (req: Request<any, any, ICreateAddressDto>, res: Response, connection: Connection) => {

    const createAddressDto = req.body

    const result = await Query<any>(connection, `INSERT INTO addresses (addresses.city, addresses.street, addresses.building_number)VALUES ('${createAddressDto.city}', '${createAddressDto.street}', '${createAddressDto.buildingNumber}')`)

    const id = result.insertId

    res.status(200).json(id)

}

const deleteAddress = async (req: Request<{ id: number }>, res: Response, connection: Connection) => {

    const id = req.params.id

    const result = await Query<IAddressModel[]>(connection, `SELECT addresses.id FROM addresses WHERE addresses.id = ${id}`)

    if (result.length == 0)
        throw new NotFoundError(`address with id ${id} not found at deleteaddress`, 'address not found')

    const addressCountInOrders = (await Query<{ count: number }[]>(connection, `SELECT COUNT(orders.id) AS count FROM orders WHERE orders.address_id = ${id}`))[0]

    if (addressCountInOrders.count > 0)
        throw new UnavalibleError(`address cannot be deleted because it is being use in orderss`, 'this address is being used, cannot delete')

    await Query(connection, `DELETE FROM addresses WHERE addresses.id = ${id}`)

    res.status(200).send('Address deleted successfully')

}


const updateAddress = async (req: Request<{ id: number }, any, IUpdateAddressDto>, res: Response, connection: Connection) => {

    const id = req.params.id
    const updateaddress = req.body

    const result = await Query<IAddressModel[]>(connection, `SELECT addresses.id FROM addresses WHERE addresses.id = ${id}`)

    if (result.length == 0)
        throw new NotFoundError(`address with id ${id} not found at deleteaddress`, 'address not found')

    let updates: string[] = []

    if (updateaddress.city != null)
        updates.push(`addresses.city = '${updateaddress.city}'`)

    if (updateaddress.street != null)
        updates.push(`addresses.street = '${updateaddress.street}'`)

    if (updateaddress.buildingNumber != null)
        updates.push(`addresses.building_number = '${updateaddress.buildingNumber}'`)

    if (updates.length > 0)
        await Query(connection, `UPDATE addresses SET ${updates} WHERE addresses.id = ${id}`)

    return res.status(200).send('address updated successfully')

}

export default {
    getAddressesCount,
    getAllAddresses,
    getAddress,
    createAddress,
    deleteAddress,
    updateAddress
}
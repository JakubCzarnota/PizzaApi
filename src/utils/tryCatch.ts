import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import ValidationError from '../errors/validationError.js'
import { Connection } from 'mysql'
import { Connect } from '../mysql.js'

const tryCatch = <P, ResBody, ReqBody, ReqQuery>(controller: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, connection: Connection) => Promise<any>) => async (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => {
    const connection = await Connect()

    try {
        const errors = validationResult(req as Request)
        if (!errors.isEmpty()) {
            throw new ValidationError("Validation error", 400, errors.array())
        }
        await controller(req, res, connection)

        connection.end()
    } catch (error) {
        connection.end()
        return next(error)
    }
}



export default tryCatch
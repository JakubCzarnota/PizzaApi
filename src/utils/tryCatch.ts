import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import ValidationError from '../errors/validationError.js'

const tryCatch = <P, ResBody, ReqBody>(controller: (req: Request<P, ResBody, ReqBody>, res: Response) => Promise<any>) => async (req: Request<P, ResBody, ReqBody>, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req as Request)
        if (!errors.isEmpty()) {
            throw new ValidationError("Validation error", 400, errors.array())
        }

        await controller(req, res)
    } catch (error) {
        return next(error)
    }
}

export default tryCatch
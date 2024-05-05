import { Request, Response, NextFunction, Errback } from 'express'
import logger from '../logger.js'

import ValidationError from '../errors/validationError.js'

const NAMESPACE = "errorHandlingMiddleware"

const errorHandlingMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
    error.message = error.message || "Something went wrong..."
    logger.error(NAMESPACE, error.message, error)

    if (error instanceof ValidationError) {
        const validationError = error as ValidationError

        return res.status(validationError.statusCode).json({
            status: validationError.statusCode,
            errors: validationError.errors
        })
    }

    return res.status(500).json({
        status: 500,
        error: "Something went wrong..."
    })
}

export default errorHandlingMiddleware
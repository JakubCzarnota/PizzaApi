import { Request, Response, NextFunction, Errback } from 'express'
import logger from '../logger.js'

const NAMESPACE = "errorHandlingMiddleware"

const errorHandlingMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
    error.message = error.message || "Something went wrong..."

    logger.error(NAMESPACE, error.message, error)

    res.status(500).json({
        status: 500,
        message: "Something went wrong..."
    })
}

export default errorHandlingMiddleware
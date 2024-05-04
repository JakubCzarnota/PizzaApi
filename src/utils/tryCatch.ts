import { Request, Response, NextFunction } from 'express'

const tryCatch = <RequestType>(controller: (req: RequestType, res: Response) => Promise<void>) => async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        await controller(req, res)
    } catch (error) {
        return next(error)
    }
}

export default tryCatch
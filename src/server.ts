import express from 'express'
import config from './config.js'

import errorHandlingMiddleware from './middlewares/errorHandlingMiddleware.js'

import pizzaRouter from './routers/pizzaRouter.js'
import ingredientRouter from './routers/ingredientRouter.js'
import orderRouter from './routers/orderRouter.js'
import adressRouter from './routers/addressRouter.js'

import NotFoundError from './errors/notFoundError.js'

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/pizzas', pizzaRouter)

app.use('/ingredients', ingredientRouter)

app.use('/orders', orderRouter)

app.use('/adresses', adressRouter)

app.all('/*', (req, res, next) => {
    next(new NotFoundError(`Invalid path: ${req.url}`, 'Not found'))
})

app.use(errorHandlingMiddleware)

app.listen(config.server.port, () => {
    console.log(`Listening on port ${config.server.port}`);
})


import express from 'express'
import config from './config.js'

import errorHandlingMiddleware from './middlewares/errorHandlingMiddleware.js'

import pizzaRouter from './routers/pizza.js'

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/pizza', pizzaRouter)

app.listen(config.server.port, () => {
    console.log(`Listening on port ${config.server.port}`);
})

app.use(errorHandlingMiddleware)
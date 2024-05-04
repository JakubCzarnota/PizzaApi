import express from 'express'
import pizzaController from '../controllers/pizza.js'

import tryCatch from '../utils/tryCatch.js'

const NAMESPACE = "pizza"

const router = express.Router()

router.get('/', tryCatch(pizzaController.getAllPizzas))

router.get('/:id', tryCatch(pizzaController.getPizza))

router.post('/', tryCatch(pizzaController.createPizza))

router.delete('/:id', tryCatch(pizzaController.deletePizza))

router.patch('/:id', tryCatch(pizzaController.updatePizza))

export default router
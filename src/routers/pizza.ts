import express from 'express'
import pizzaController from '../controllers/pizza.js'

const NAMESPACE = "pizza"

const router = express.Router()

router.get('/', pizzaController.getAllPizzas)

router.get('/:id', pizzaController.getPizza)

router.post('/', pizzaController.createPizza)

router.delete('/:id', pizzaController.deletePizza)

router.patch('/:id', pizzaController.updatePizza)

export default router
import express from 'express'
import pizzaController from '../controllers/pizza.js'

import tryCatch from '../utils/tryCatch.js'
import { check } from 'express-validator'

const NAMESPACE = "pizza"

const router = express.Router()

router.get('/', tryCatch(pizzaController.getAllPizzas))

router.get('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int")
    ],
    tryCatch(pizzaController.getPizza))

router.post('/',
    [
        check('name')
            .notEmpty().withMessage('name cannot be empty')
            .isString().withMessage("name must be string")
            .isLength({ max: 45 }).withMessage('namme cannot be longer than 45 characters'),
        check('price')
            .notEmpty().withMessage('price cannot be empty')
            .isCurrency({ allow_decimal: true, allow_negatives: false }).withMessage('price must be currency'),
        check('ingredients')
            .isArray().withMessage('ingredients must be an array')
    ],
    tryCatch(pizzaController.createPizza))

router.delete('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int")
    ],
    tryCatch(pizzaController.deletePizza))

router.patch('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int"),
        check('name')
            .notEmpty().withMessage('name cannot be empty')
            .isString().withMessage("name must be string")
            .isLength({ max: 45 }).withMessage('namme cannot be longer than 45 characters'),
        check('price')
            .notEmpty().withMessage('price cannot be empty')
            .isCurrency({ allow_decimal: true, allow_negatives: false }).withMessage('price must be valid price'),
        check('ingredients')
            .isArray().withMessage('ingredients must be an array')
    ],
    tryCatch(pizzaController.updatePizza))

export default router
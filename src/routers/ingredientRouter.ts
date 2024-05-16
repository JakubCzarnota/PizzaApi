import express from 'express'
import ingredientController from '../controllers/ingredientController.js'

import tryCatch from '../utils/tryCatch.js'
import { check } from 'express-validator'

const NAMESPACE = "ingredientRouter"

const router = express.Router()

router.get('/count', tryCatch(ingredientController.getIngredientsCount))

router.get('/',
    [
        check("page")
            .optional()
            .isInt({ min: 0 }).withMessage("page must be int, greater or equal 0"),
        check("count")
            .optional()
            .isInt({ min: 0 }).withMessage("page must be int, greater or equal 0")
    ],
    tryCatch(ingredientController.getAllIngredients))

router.get('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int")
    ],
    tryCatch(ingredientController.getIngredient))

router.post('/',
    [
        check('name')
            .notEmpty().withMessage('name cannot be empty')
            .isString().withMessage("name must be string")
            .isLength({ max: 45 }).withMessage('namme cannot be longer than 45 characters'),
    ],
    tryCatch(ingredientController.createIngredient))

router.delete('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int")
    ],
    tryCatch(ingredientController.deleteIngredient))

router.patch('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int"),
        check('name')
            .notEmpty().withMessage('name cannot be empty')
            .isString().withMessage("name must be string")
            .isLength({ max: 45 }).withMessage('namme cannot be longer than 45 characters'),
    ],
    tryCatch(ingredientController.updateIngredient))

export default router
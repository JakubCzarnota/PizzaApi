import express from 'express'
import orderControler from '../controllers/orderController.js'

import tryCatch from '../utils/tryCatch.js'
import { check } from 'express-validator'

const router = express.Router()

router.get('/count', tryCatch(orderControler.getOrdersCount))

router.get('/',
    [
        check("page")
            .optional()
            .isInt({ min: 0 }).withMessage("page must be int, greater or equal 0"),
        check("count")
            .optional()
            .isInt({ min: 0 }).withMessage("page must be int, greater or equal 0")
    ],
    tryCatch(orderControler.getAllOrders))

router.get('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int")
    ],
    tryCatch(orderControler.getOrder))

router.post('/',
    [
        check('first_name')
            .notEmpty().withMessage('first name cannot be empty')
            .isString().withMessage('first name must be string')
            .isLength({ max: 45 }).withMessage('first name cannot be longer than 45 characters'),
        check('last_name')
            .notEmpty().withMessage('last name cannot be empty')
            .isString().withMessage('last name must be string')
            .isLength({ max: 45 }).withMessage('Last name cannot be longer than 45 characters'),
        check('phone_number')
            .notEmpty().withMessage('phone number name cannot be empty')
            .isString().withMessage('phone number must be string')
            .isLength({ max: 45 }).withMessage('Phone number cannot be longer than 12 characters'),
        check('city')
            .notEmpty().withMessage('city cannot be empty')
            .isString().withMessage('city must be string')
            .isLength({ max: 45 }).withMessage('City cannot be longer than 45 characters'),
        check('street')
            .notEmpty().withMessage('street cannot be empty')
            .isString().withMessage('street must be string')
            .isLength({ max: 45 }).withMessage('street cannot be longer than 45 characters'),
        check('pizzas')
            .isArray()
    ],
    tryCatch(orderControler.createOrder))

router.delete('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int")
    ],
    tryCatch(orderControler.deleteOrder))

router.patch('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int"),
        check('first_name')
            .optional()
            .notEmpty().withMessage('first name cannot be empty')
            .isString().withMessage('first name must be string')
            .isLength({ max: 45 }).withMessage('first name cannot be longer than 45 characters'),
        check('last_name')
            .optional()
            .notEmpty().withMessage('last name cannot be empty')
            .isString().withMessage('last name must be string')
            .isLength({ max: 45 }).withMessage('Last name cannot be longer than 45 characters'),
        check('phone_number')
            .optional()
            .notEmpty().withMessage('phone number name cannot be empty')
            .isString().withMessage('phone number must be string')
            .isLength({ max: 45 }).withMessage('Phone number cannot be longer than 12 characters'),
        check('city')
            .optional()
            .notEmpty().withMessage('city cannot be empty')
            .isString().withMessage('city must be string')
            .isLength({ max: 45 }).withMessage('City cannot be longer than 45 characters'),
        check('street')
            .optional()
            .notEmpty().withMessage('street cannot be empty')
            .isString().withMessage('street must be string')
            .isLength({ max: 45 }).withMessage('street cannot be longer than 45 characters'),
        check('pizzas')
            .optional()
            .isArray()
    ],
    tryCatch(orderControler.updateOrder))

export default router
import express from 'express'
import orderControler from '../controllers/orderController.js'

import tryCatch from '../utils/tryCatch.js'
import { check } from 'express-validator'

const router = express.Router()

router.get('/', tryCatch(orderControler.getAllOrders))

router.get('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int")
    ],
    tryCatch(orderControler.getOrder))

router.post('/',

    tryCatch(orderControler.createOrder))

router.delete('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int")
    ],
    tryCatch(orderControler.deleteOrder))

router.patch('/:id',

    tryCatch(orderControler.updateOrder))

export default router
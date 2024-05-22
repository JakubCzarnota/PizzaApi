import express from 'express'
import addressController from '../controllers/addressController.js'

import tryCatch from '../utils/tryCatch.js'
import { check } from 'express-validator'

const NAMESPACE = "adressRouter"

const router = express.Router()

router.get('/count', tryCatch(addressController.getAddressesCount))

router.get('/',
    [
        check("page")
            .optional()
            .isInt({ min: 1 }).withMessage("page must be int, greater or equal 1"),
        check("count")
            .optional()
            .isInt({ min: 1 }).withMessage("page must be int, greater or equal 1")
    ],
    tryCatch(addressController.getAllAddresses))

router.get('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int")
    ],
    tryCatch(addressController.getAddress))

router.post('/',
    [
        check('city')
            .notEmpty().withMessage('name cannot be empty')
            .isString().withMessage("name must be string")
            .isLength({ max: 45 }).withMessage('namme cannot be longer than 45 characters'),
        check('street')
            .notEmpty().withMessage('name cannot be empty')
            .isString().withMessage("name must be string")
            .isLength({ max: 45 }).withMessage('namme cannot be longer than 45 characters'),
        check('buildingNumber')
            .notEmpty().withMessage('name cannot be empty')
            .isString().withMessage("name must be string")
            .isLength({ max: 45 }).withMessage('namme cannot be longer than 45 characters'),
    ],
    tryCatch(addressController.createAddress))

router.delete('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int")
    ],
    tryCatch(addressController.deleteAddress))

router.patch('/:id',
    [
        check("id")
            .notEmpty().withMessage("id cannot be null")
            .isInt().withMessage("id must be int"),
        check('city')
            .optional()
            .isString().withMessage("name must be string")
            .isLength({ max: 45 }).withMessage('namme cannot be longer than 45 characters'),
        check('street')
            .optional()
            .isString().withMessage("name must be string")
            .isLength({ max: 45 }).withMessage('namme cannot be longer than 45 characters'),
        check('buildingNumber')
            .optional()
            .isString().withMessage("name must be string")
            .isLength({ max: 45 }).withMessage('namme cannot be longer than 45 characters'),
    ],
    tryCatch(addressController.updateAddress))

export default router
const { body } = require("express-validator");

const validateProduct = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 3, max: 80 })
        .withMessage('Product name should be at least 3-80 characters long'),

    body("description")
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 100, max: 500 })
        .withMessage('Product description should be at least 100-500 characters long'),

    body("image")
        .isString()
        .notEmpty()
        .withMessage('Image is required'),

    body("price")
        .trim()
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),

    body("brand")
        .trim()
        .notEmpty()
        .withMessage('Product brand name is required'),

    body("quantity")
        .trim()
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),

    body("category")
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
];

module.exports = { validateProduct };
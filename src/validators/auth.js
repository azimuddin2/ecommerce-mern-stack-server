const { body } = require('express-validator');

const validateUserRegistration = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage('Name is required. Enter your full name')
        .isLength({ min: 3, max: 31 })
        .withMessage('Name should be at least 3-31 characters long'),
    body("email")
        .trim()
        .notEmpty()
        .withMessage('Email is required. Enter your email address')
        .isEmail()
        .withMessage('Invalid email address'),
    body("password")
        .trim()
        .notEmpty()
        .withMessage('Password is required. Enter your possword')
        .isLength({ min: 6 })
        .withMessage('Password should be at least 6 characters long.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password should contain at least one uppercase latter, one lowercase latter, one number, and one special character.'),
    body("address")
        .trim()
        .notEmpty()
        .withMessage('Address is required. Enter your  address')
        .isLength({ min: 3 })
        .withMessage('Address should be at least 3 characters long'),
    body("phone")
        .trim()
        .notEmpty()
        .withMessage('Phone is required. Enter your phone number'),
    body("image")
        .optional()
        .isString()
];

module.exports = { validateUserRegistration };
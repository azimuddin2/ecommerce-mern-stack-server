const express = require('express');
const { handleCreateCategory } = require('../controllers/categoryController');
const { validateCategory } = require('../validators/category');
const runValidation = require('../validators');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');
const categoryRouter = express.Router();

categoryRouter.post(
    '/',
    validateCategory,
    runValidation,
    isLoggedIn,
    isAdmin,
    handleCreateCategory
);

module.exports = categoryRouter;
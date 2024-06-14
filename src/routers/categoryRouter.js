const express = require('express');
const { handleCreateCategory, handleGetCategories, handleGetCategory, handleUpdateCategory } = require('../controllers/categoryController');
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
categoryRouter.get(
    '/',
    handleGetCategories
);
categoryRouter.get(
    '/:slug',
    handleGetCategory
);
categoryRouter.put(
    '/:slug',
    validateCategory,
    runValidation,
    isLoggedIn,
    isAdmin,
    handleUpdateCategory
);

module.exports = categoryRouter;
const express = require('express');
const {
    handleCreateProduct,
    handleGetProducts,
    handleGetProduct
} = require('../controllers/productController');
const { validateProduct } = require('../validators/product');
const runValidation = require('../validators');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');
const productRouter = express.Router();

productRouter.post(
    '/',
    validateProduct,
    runValidation,
    isLoggedIn,
    isAdmin,
    handleCreateProduct
);
productRouter.get(
    '/',
    handleGetProducts
);
productRouter.get(
    '/:slug',
    handleGetProduct
);

module.exports = productRouter;
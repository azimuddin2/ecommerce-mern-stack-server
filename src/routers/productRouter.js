const express = require('express');
const {
    handleCreateProduct,
    handleGetProducts,
    handleGetProduct,
    handleDeleteProduct,
    handleUpdateProduct
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
productRouter.delete(
    '/:slug',
    isLoggedIn,
    isAdmin,
    handleDeleteProduct
);
productRouter.put(
    '/:slug',
    validateProduct,
    runValidation,
    isLoggedIn,
    isAdmin,
    handleUpdateProduct
);

module.exports = productRouter;
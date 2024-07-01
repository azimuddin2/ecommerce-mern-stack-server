const { createProduct, getProducts } = require("../services/productService");
const { successResponse } = require("./responseController");

const handleCreateProduct = async (req, res, next) => {
    try {
        const newProduct = await createProduct(req);

        return successResponse(res, {
            statusCode: 200,
            message: 'Product was created successfully',
            payload: newProduct,
        });
    } catch (error) {
        next(error);
    }
};

const handleGetProducts = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 4;

        const { products, pagination } = await getProducts(search, page, limit);

        return successResponse(res, {
            statusCode: 200,
            message: 'Products were fetched successfully',
            payload: {
                products,
                pagination
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleCreateProduct,
    handleGetProducts,
};
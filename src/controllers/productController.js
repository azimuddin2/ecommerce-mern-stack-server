const { createProduct } = require("../services/productService");
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
}

module.exports = {
    handleCreateProduct,
};
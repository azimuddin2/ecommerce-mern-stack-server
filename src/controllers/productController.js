const { successResponse } = require("./responseController");

const handleCreateProduct = async (req, res, next) => {
    try {

        return successResponse(res, {
            statusCode: 200,
            message: 'Product was created successfully',
            payload: {},
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleCreateProduct,
};
const { successResponse } = require("./responseController");
const { createCategory } = require("../services/categoryService");

const handleCreateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const newCategory = await createCategory(name);

        return successResponse(res, {
            statusCode: 200,
            message: 'category was created successfully',
            payload: newCategory,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleCreateCategory,
};
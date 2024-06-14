const { successResponse } = require("./responseController");
const { createCategory, getCategories, getCategory, updateCategory } = require("../services/categoryService");

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

const handleGetCategories = async (req, res, next) => {
    try {
        const categories = await getCategories();

        return successResponse(res, {
            statusCode: 200,
            message: 'categories fetched successfully',
            payload: categories,
        });
    } catch (error) {
        next(error);
    }
};

const handleGetCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const category = await getCategory(slug);

        return successResponse(res, {
            statusCode: 200,
            message: 'category fetched successfully',
            payload: category,
        });
    } catch (error) {
        next(error);
    }
};

const handleUpdateCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const { name } = req.body;

        const result = await updateCategory(slug, name);

        return successResponse(res, {
            statusCode: 200,
            message: 'category was updated successfully',
            payload: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleCreateCategory,
    handleGetCategories,
    handleGetCategory,
    handleUpdateCategory,
};
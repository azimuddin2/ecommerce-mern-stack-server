const createError = require("http-errors");
const slugify = require("slugify");
const Category = require("../models/categoryModel");

const createCategory = async (name) => {
    try {
        const filter = { name: name };
        const categoryExists = await Category.exists(filter);
        if (categoryExists) {
            throw createError(
                409,
                `${name} category already exists.`
            );
        }

        const newCategory = await Category.create({
            name: name,
            slug: slugify(name)
        });

        if (!newCategory) {
            throw createError(
                401,
                'Category was not created successfully'
            );
        }

        return newCategory;
    } catch (error) {
        throw error;
    }
};

const getCategories = async () => {
    try {
        const categories = await Category.find({}).select('name slug').lean();

        if (!categories || categories.length === 0) {
            throw createError(
                404,
                'No categories found'
            );
        }

        return categories;
    } catch (error) {
        throw error;
    }
};

const getCategory = async (slug) => {
    try {
        const filter = { slug: slug };
        const category = await Category.findOne(filter).select('name slug').lean();

        if (!category) {
            throw createError(
                404,
                `${slug} category is not found`
            )
        }

        return category;
    } catch (error) {
        throw error;
    }
};

const updateCategory = async (slug, name) => {
    try {
        const filter = { slug: slug };
        const category = await Category.findOne(filter);

        if (!category) {
            throw createError(
                404,
                `${slug} category is not found`
            );
        }

        const updateDoc = {
            $set: {
                name: name,
                slug: slugify(name),
            },
        };
        const options = { new: true };

        const updatedCategory = await Category.findOneAndUpdate(filter, updateDoc, options);

        if (!updatedCategory) {
            throw createError(
                401,
                'Category was not updated successfully'
            );
        }

        return updatedCategory;
    } catch (error) {
        throw error;
    }
};

const deleteCategory = async (slug) => {
    try {
        const filter = { slug: slug };
        const category = await Category.findOne(filter);

        if (!category) {
            throw createError(
                404,
                `${slug} category is not found`
            );
        }

        const result = await Category.findOneAndDelete(filter);

        if (!result) {
            throw createError(
                401,
                'Category was not deleted successfully'
            );
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
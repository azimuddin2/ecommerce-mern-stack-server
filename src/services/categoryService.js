const createError = require("http-errors");
const slugify = require("slugify");
const Category = require("../models/categoryModel");

const createCategory = async (name) => {
    const newCategory = await Category.create({
        name: name,
        slug: slugify(name)
    });

    return newCategory;
};

const getCategories = async () => {
    const categories = await Category.find({}).select('name slug').lean();

    if (!categories || categories.length === 0) {
        throw createError(
            404,
            'No categories found'
        );
    }

    return categories;
};

const getCategory = async (slug) => {
    const filter = { slug: slug };
    const category = await Category.findOne(filter).select('name slug').lean();

    if (!category) {
        throw createError(
            404,
            `${slug} category is not found`
        )
    }

    return category;
};

const updateCategory = async (slug, name) => {
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
};

const deleteCategory = async (slug) => {
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
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
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
            `${slug} category not found`
        )
    }

    return category;
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
};
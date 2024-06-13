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
    return categories;
};

module.exports = {
    createCategory,
    getCategories,
};
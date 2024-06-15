const createError = require("http-errors");
const data = require("../data");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const seedUsers = async (req, res, next) => {
    try {
        await User.deleteMany({});

        const users = await User.insertMany(data.users);
        return res.status(201).json(users);

    } catch (error) {
        next(error);
    }
};

const seedProducts = async (req, res, next) => {
    try {
        await Product.deleteMany({});

        const products = await Product.insertMany(data.products);

        if (!products) {
            throw createError(
                401,
                'Seed products for testing was not successfully'
            );
        }

        return res.status(201).json(products);
    } catch (error) {
        next(error);
    }
};

module.exports = { seedUsers, seedProducts };
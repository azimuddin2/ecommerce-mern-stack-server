const createError = require("http-errors");
const slugify = require("slugify");
const Product = require("../models/productModel");

const createProduct = async (req) => {
    const { name, description, image, price, brand, quantity, sold, category, shipping } = req.body;

    const filter = { name: name };
    const productExists = await Product.findOne(filter);
    if (productExists) {
        createError(
            409,
            `${name} product already exists.`
        );
    }

    const productData = {
        name: name,
        slug: slugify(name),
        description: description,
        price: price,
        brand: brand,
        quantity: quantity,
        category: category,
        sold: sold,
        shipping: shipping,
        image: image
    };

    const product = await Product.create(productData);
    if (!product) {
        throw createError(
            401,
            'Product was not created successfully'
        );
    }

    return product;
};

module.exports = {
    createProduct,
};
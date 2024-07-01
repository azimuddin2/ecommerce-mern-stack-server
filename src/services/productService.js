const createError = require("http-errors");
const slugify = require("slugify");
const Product = require("../models/productModel");

const createProduct = async (req) => {
    const { name, description, image, price, brand, quantity, sold, category, shipping } = req.body;

    const filter = { name: name };
    const productExists = await Product.exists(filter);
    if (productExists) {
        throw createError(
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

const getProducts = async (search, page, limit) => {
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
        $or: [
            { name: { $regex: searchRegExp } },
            { brand: { $regex: searchRegExp } },
        ],
    };

    const products = await Product.find(filter)
        .populate('category')
        .limit(limit)
        .skip((page - 1) * limit);

    if (!products || products.length === 0) {
        throw createError(
            404,
            'No products found'
        );
    }

    const productCount = await Product.find(filter).countDocuments();

    return {
        products,
        pagination: {
            totalProduct: productCount,
            totalPages: Math.ceil(productCount / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(productCount / limit) ? page + 1 : null,
        },
    };
};

const getProduct = async (slug) => {
    const filter = { slug: slug };
    const product = await Product.findOne(filter).populate('category');

    if (!product) {
        throw createError(
            404,
            `${slug} product is not found`
        )
    }

    return product;
};

const deleteProduct = async (slug) => {
    const filter = { slug: slug };
    const product = await Product.findOne(filter);

    if (!product) {
        throw createError(
            404,
            `${slug} product is not found`
        )
    }

    const result = await Product.findOneAndDelete(filter);
    if (!result) {
        throw createError(
            401,
            'Product was not deleted successfully'
        );
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
};
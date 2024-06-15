const { Schema, model } = require("mongoose");

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [3, 'The length of product name can be minimum 3 characters'],
        maxlength: [80, 'The length of product name can be maximum 80 characters']
    },
    slug: {
        type: String,
        required: [true, 'Product slug is required'],
        lowercase: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        minlength: [100, 'The length of product description can be minimum 100 characters'],
        maxlength: [500, 'The length of product description can be maximum 500 characters'],
    },
    image: {
        type: String,
        required: [true, 'Product image is required'],
    },
    price: {
        type: Number,
        required: [true, 'Product Price is required'],
        trim: true,
        validate: {
            validator: (v) => {
                return v > 0;
            },
            message: (props) => {
                `${props.value} is not a valid price`
            }
        }
    },
    brand: {
        type: String,
        required: [true, 'Product brand name is required'],
        trim: true,
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        trim: true,
        validate: {
            validator: (v) => {
                return v > 0;
            },
            message: (props) => {
                `${props.value} is not a valid quantity! Quantity must be greater than 0`
            }
        }
    },
    sold: {
        type: Number,
        required: [true, 'Product sold quantity is required'],
        trim: true,
        default: 0,
        validate: {
            validator: (v) => {
                return v > 0;
            },
            message: (props) => {
                `${props.value} is not a valid sold quantity! Sold quantity must be greater than 0`
            }
        }
    },
    shipping: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },

}, { timestamps: true });

const Product = model('Product', productSchema);

module.exports = Product;
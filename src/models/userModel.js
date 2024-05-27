const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require("../secret");

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minlength: [3, 'The length of user name can be minimum 3 characters'],
        maxlength: [31, 'The length of user name can be maximum 31 characters']
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email',
        },
    },
    password: {
        type: String,
        required: [true, 'User Password is required'],
        minlength: [6, 'The length of user password can be minimum 6 characters'],
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
        type: String,
        default: defaultImagePath,
    },
    address: {
        type: String,
        required: [true, 'User address is required'],
    },
    phone: {
        type: String,
        required: [true, 'User phone is required'],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const User = model('Users', userSchema);


module.exports = User;
const createHttpError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findWithId");
const { deleteImage } = require("../helper/deleteImage");
const { createJsonWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey, clientURL } = require("../secret");

const getUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;

        const searchRegExp = new RegExp(".*" + search + ".*", "i");
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } },
            ],
        };

        const options = { password: 0 };

        const users = await User.find(filter, options)
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await User.find(filter).countDocuments();

        if (!users) {
            throw createHttpError(404, 'no users found');
        };

        return successResponse(res, {
            statusCode: 200,
            message: 'Users were returned successfully',
            payload: {
                users,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };

        const user = await findWithId(User, id, options);

        return successResponse(res, {
            statusCode: 200,
            message: 'User were returned successfully',
            payload: { user },
        });
    } catch (error) {
        next(error);
    }
};

const deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(User, id, options);

        const userImagePath = user.image;
        deleteImage(userImagePath);

        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false,
        });

        return successResponse(res, {
            statusCode: 200,
            message: 'User were deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

const processRegister = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const userExists = await User.exists({ email: email });
        if (userExists) {
            throw createHttpError(
                409,
                'User with this email already exists. Please sign in'
            );
        }

        // create json web token
        const token = createJsonWebToken(
            { name, email, password, phone, address },
            jwtActivationKey,
            '1h'
        );

        // prepare email
        const emailData = {
            email,
            subject: 'Account Activation Email',
            html: `
                <h2> Hello ${name}! </h2>
                <p> Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank"> activate your account </a> </p>
            `,
        };

        // send email with nodemailer

        return successResponse(res, {
            statusCode: 200,
            message: 'user was created successfully',
            payload: { token },
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getUsers,
    getUserById,
    deleteUserById,
    processRegister,
};
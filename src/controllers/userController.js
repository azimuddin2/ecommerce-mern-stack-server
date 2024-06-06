const createHttpError = require("http-errors");
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findWithId");
const { deleteImage } = require("../helper/deleteImage");
const { createJsonWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey, clientURL } = require("../secret");
const emailWithNodeMailer = require("../helper/email");
const { MAX_FILE_SIZE } = require("../config");
const { handleUserAction, findUsers, findUserById } = require("../services/userService");

const handleGetUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;

        const { users, pagination } = await findUsers(search, page, limit);

        return successResponse(res, {
            statusCode: 200,
            message: 'Users were returned successfully',
            payload: {
                users,
                pagination
            },
        });
    } catch (error) {
        next(error);
    }
};

const handleGetUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await findUserById(id);

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

        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false,
        });

        if (user && user.image) {
            await deleteImage(user.image);
        }

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

        const image = req.file?.path;
        if (image && image.size > MAX_FILE_SIZE) {
            throw createHttpError(400, 'File to large. It must be less than 2 MB');
        }

        const userExists = await User.exists({ email: email });
        if (userExists) {
            throw createHttpError(
                409,
                'User with this email already exists. Please sign in'
            );
        }

        // create json web token
        const tokenPayload = {
            name,
            email,
            password,
            phone,
            address,
        };

        if (image) {
            tokenPayload.image = image;
        }

        const token = createJsonWebToken(
            tokenPayload,
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
        try {
            await emailWithNodeMailer(emailData);
        } catch (emailError) {
            next(createHttpError(500, 'Failed to send verification email'));
            return;
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} for completing your registration process`,
            payload: { token },
        });

    } catch (error) {
        next(error);
    }
};

const activateUserAccount = async (req, res, next) => {
    try {
        const token = req.body.token;
        if (!token) {
            throw createHttpError(404, 'token not found');
        }

        try {
            const decoded = jwt.verify(token, jwtActivationKey);
            if (!decoded) {
                throw createHttpError(401, 'Unable to verify user');
            }

            const userExists = await User.exists({ email: decoded.email });
            if (userExists) {
                throw createHttpError(
                    409,
                    'User with this email already exists. Please sign in'
                );
            }

            await User.create(decoded);

            return successResponse(res, {
                statusCode: 201,
                message: 'user was registered successfully',
            });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw createHttpError(401, 'Token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw createHttpError(401, 'Invalid token');
            } else {
                throw error;
            }
        }

    } catch (error) {
        next(error);
    }
};

const updateUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(User, userId, options);

        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {};

        const allowedFields = ['name', 'password', 'address', 'phone'];

        for (let key in req.body) {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
            else if (['email'].includes(key)) {
                throw createHttpError(400, 'Email can not ve updated');
            }
        }

        const image = req.file?.path;
        if (image) {
            if (image.size > MAX_FILE_SIZE) {
                throw createHttpError(400, 'File to large. It must be less than 2 MB');
            }
            updates.image = image;
            user.image !== 'user.png' && deleteImage(user.image);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select('-password');

        if (!updatedUser) {
            throw createHttpError(404, 'User with this ID does not exist');
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'user was updated successfully',
            payload: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

const handleManageUserStatusById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const action = req.body.action;

        const { updatedUser, successMessage } = await handleUserAction(id, action);

        return successResponse(res, {
            statusCode: 200,
            message: successMessage,
            payload: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleGetUsers,
    handleGetUserById,
    deleteUserById,
    processRegister,
    activateUserAccount,
    updateUserById,
    handleManageUserStatusById
};
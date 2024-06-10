const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { deleteImage } = require("../helper/deleteImage");
const { MAX_FILE_SIZE } = require("../config");
const { createJsonWebToken } = require("../helper/jsonWebToken");
const { jwtResetPasswordKey, clientURL } = require("../secret");
const emailWithNodeMailer = require("../helper/email");

const findUsers = async (search, page, limit) => {
    try {
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
            throw createError(404, 'no users found');
        };

        return {
            users,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page - 1 : null,
                nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
            },
        };

    } catch (error) {
        throw error;
    }
};

const findUserById = async (id) => {
    try {
        const options = { password: 0 };

        const user = await User.findById(id, options).select('-password');
        if (!user) {
            throw createError(404, 'User not found');
        }

        return user;

    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, 'Invalid Id');
        }
        throw error;
    }
};

const deleteUserById = async (id) => {
    try {
        const options = { password: 0 };
        const user = await findUserById(id, options);

        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false,
        });

        if (user && user.image) {
            await deleteImage(user.image);
        }

    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, 'Invalid Id');
        }
        throw error;
    }
};

const updateUserById = async (id, req) => {
    try {
        const options = { password: 0 };
        const user = await findUserById(id, options);

        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {};

        const allowedFields = ['name', 'password', 'address', 'phone'];

        for (let key in req.body) {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
            else if (['email'].includes(key)) {
                throw createError(400, 'Email can not be updated');
            }
        }

        const image = req.file?.path;
        if (image) {
            if (image.size > MAX_FILE_SIZE) {
                throw createError(400, 'File to large. It must be less than 2 MB');
            }
            updates.image = image;
            user.image !== 'user.png' && deleteImage(user.image);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updates,
            updateOptions
        ).select('-password');

        if (!updatedUser) {
            throw createError(404, 'User with this ID does not exist');
        }

        return updatedUser;

    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, 'Invalid Id');
        }
        throw error;
    }
};

const handleUserAction = async (id, action) => {
    try {
        let update;
        let successMessage;

        if (action === 'ban') {
            update = { isBanned: true };
            successMessage = "User was banned successfully";
        } else if (action === 'unban') {
            update = { isBanned: false };
            successMessage = "User was unbanned successfully";
        } else {
            throw createError(
                400,
                'Invalid action. Use "ban" or "unban"'
            );
        }

        const options = { new: true, runValidators: true, context: 'query' };

        const updatedUser = await User.findByIdAndUpdate(
            id,
            update,
            options
        ).select('-password');

        if (!updatedUser) {
            throw createError(
                400,
                'User was not banned successfully'
            );
        }

        return { updatedUser, successMessage };

    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, 'Invalid Id');
        }
        throw error;
    }
};

const updateUserPasswordById = async (id, email, oldPassword, newPassword, confirmedPassword) => {
    try {
        const query = { email: email };
        const user = await User.findOne(query);

        if (!user) {
            throw createError(
                404,
                'User is not found with this email'
            );
        }

        if (newPassword !== confirmedPassword) {
            throw createError(
                400,
                'New password and confirmed password did not match'
            );
        }

        // compare the password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            throw createError(
                401,
                'Old password is not correct'
            );
        }

        const update = {
            $set: {
                password: newPassword,
            },
        };
        const options = { new: true };

        const updatedUser = await User.findByIdAndUpdate(
            id,
            update,
            options
        ).select('-password');

        if (!updatedUser) {
            throw createError(
                401,
                'User was not updated successfully'
            );
        }

        return updatedUser;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, 'Invalid Id');
        }
        throw error;
    }
};

const forgetPasswordByEmail = async (email) => {
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            throw createError(
                404,
                'Email is incorrect or you have not verified your email address. Please register yourself first'
            );
        }

        // create json web token
        const token = createJsonWebToken(
            { email },
            jwtResetPasswordKey,
            '1h'
        );

        // prepare email
        const emailData = {
            email,
            subject: 'Reset Password Email',
            html: `
        <h2> Hello ${user.name}! </h2>
        <p> Please click here to <a href="${clientURL}/api/users/reset-password/${token}" target="_blank"> Reset your password </a> </p>
    `,
        };

        // send email with nodemailer
        try {
            await emailWithNodeMailer(emailData);
        } catch (emailError) {
            next(createError(500, 'Failed to send reset password email'));
            return;
        }

        return token;
    } catch (error) {
        throw error;
    }
};

const resetPassword = async (token, password) => {
    try {
        const decoded = jwt.verify(token, jwtResetPasswordKey);

        if (!decoded) {
            throw createError(
                400,
                'Invalid or expired token'
            );
        }

        const filter = { email: decoded.email };
        const update = {
            $set: {
                password: password,
            },
        };
        const options = { new: true };

        const updatedUser = await User.findOneAndUpdate(
            filter,
            update,
            options
        ).select('-password');

        if (!updatedUser) {
            throw createError(
                400,
                'Password reset failed'
            );
        }

    } catch (error) {
        throw error;
    }
};

module.exports = {
    findUsers,
    findUserById,
    deleteUserById,
    updateUserById,
    handleUserAction,
    updateUserPasswordById,
    forgetPasswordByEmail,
    resetPassword,
};
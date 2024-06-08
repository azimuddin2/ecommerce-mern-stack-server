const createError = require("http-errors");
const bcrypt = require('bcryptjs');
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJsonWebToken } = require("../helper/jsonWebToken");
const { jwtAccessKey } = require("../secret");

const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // isExist
        const user = await User.findOne({ email });
        if (!user) {
            throw createError(
                404,
                'User does not exist with this email. Please register first'
            );
        }

        // compare the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw createError(
                401,
                'Password did not match'
            );
        }

        // isBanned
        if (user.isBanned === true) {
            throw createError(
                403,
                'You are banned. Please contact authority'
            );
        }

        // token, cookie
        const accessToken = createJsonWebToken(
            { user },
            jwtAccessKey,
            '30m'
        );
        res.cookie('accessToken', accessToken, {
            maxAge: 30 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        const userWithoutPassword = await User.findOne({ email }).select("-password");

        return successResponse(res, {
            statusCode: 200,
            message: 'User login successfully',
            payload: { userWithoutPassword },
        })
    } catch (error) {
        next(error);
    }
};

const handleLogout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken');

        return successResponse(res, {
            statusCode: 200,
            message: 'User logout successfully',
            payload: {},
        })
    } catch (error) {
        next(error);
    }
};


module.exports = { handleLogin, handleLogout };
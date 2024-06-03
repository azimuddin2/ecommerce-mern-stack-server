const createHttpError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const bcrypt = require('bcryptjs');
const { createJsonWebToken } = require("../helper/jsonWebToken");
const { jwtAccessKey } = require("../secret");

const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // isExist
        const user = await User.findOne({ email });
        if (!user) {
            throw createHttpError(
                404,
                'User does not exist with this email. Please register first'
            );
        }

        // compare the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw createHttpError(
                401,
                'Password did not match'
            );
        }

        // isBanned
        if (user.isBanned === true) {
            throw createHttpError(
                403,
                'You are banned. Please contact authority'
            );
        }

        // token, cookie
        const accessToken = createJsonWebToken(
            { email },
            jwtAccessKey,
            '1h'
        );
        res.cookie('access_token', accessToken, {
            maxAge: 15 * 60 * 1000, // 15 minutes
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return successResponse(res, {
            statusCode: 200,
            message: 'User login successfully',
            payload: { user },
        })
    } catch (error) {
        next(error);
    }
};

module.exports = { handleLogin };
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJsonWebToken } = require("../helper/jsonWebToken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const { setAccessTokenCookie, setRefreshTokenCookie } = require("../helper/cookie");

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
        setAccessTokenCookie(res, accessToken);

        const refreshToken = createJsonWebToken(
            { user },
            jwtRefreshKey,
            '7d'
        );
        setRefreshTokenCookie(res, refreshToken);

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

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
        res.clearCookie('refreshToken');

        return successResponse(res, {
            statusCode: 200,
            message: 'User logout successfully',
            payload: {},
        })
    } catch (error) {
        next(error);
    }
};

const handleRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        const decodedToken = jwt.verify(refreshToken, jwtRefreshKey);

        if (!decodedToken) {
            createError(
                401,
                'Invalid refresh token. Please login again'
            );
        }

        const accessToken = createJsonWebToken(
            decodedToken.user,
            jwtAccessKey,
            '30m'
        );
        setAccessTokenCookie(res, accessToken);

        return successResponse(res, {
            statusCode: 200,
            message: 'New access token is generated',
            payload: {},
        })
    } catch (error) {
        next(error);
    }
};

const handleProtectedRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        const decodedToken = jwt.verify(accessToken, jwtAccessKey);

        if (!decodedToken) {
            createError(
                401,
                'Invalid access token. Please login again'
            );
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Protected resources accessed successfully',
            payload: {}
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleLogin,
    handleLogout,
    handleRefreshToken,
    handleProtectedRoute,
};
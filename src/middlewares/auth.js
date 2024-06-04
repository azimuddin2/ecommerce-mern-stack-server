const createError = require("http-errors");
const jwt = require('jsonwebtoken');
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw createError(
                401,
                'Access token not found. Please login'
            );
        }

        const decoded = jwt.verify(accessToken, jwtAccessKey);
        if (!decoded) {
            throw createError(
                401,
                'Invalid access token. Please login again'
            );
        }

        req.body.userId = decoded._id;
        next();
    } catch (error) {
        next(error);
    }
};

const isLoggedOut = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, jwtAccessKey);
                if (decoded) {
                    throw createError(
                        400,
                        'User is already login'
                    );
                }
            } catch (error) {
                throw error;
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { isLoggedIn, isLoggedOut };
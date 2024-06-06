const createError = require("http-errors");
const User = require("../models/userModel");

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
        throw error;
    }
};

module.exports = {
    findUsers,
    handleUserAction,
};
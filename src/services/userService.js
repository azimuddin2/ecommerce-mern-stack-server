const createError = require("http-errors");
const User = require("../models/userModel");

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

module.exports = { handleUserAction };
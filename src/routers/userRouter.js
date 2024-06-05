const express = require('express');
const {
    getUsers,
    getUserById,
    deleteUserById,
    processRegister,
    activateUserAccount,
    updateUserById,
    handleBannedUserById,
    handleUnbannedUserById,
} = require('../controllers/userController');
const uploadUserImage = require('../middlewares/uploadFile');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middlewares/auth');
const userRouter = express.Router();

userRouter.post(
    '/process-register',
    uploadUserImage.single("image"),
    isLoggedOut,
    validateUserRegistration,
    runValidation,
    processRegister
);
userRouter.post(
    '/activate',
    isLoggedOut,
    activateUserAccount
);
userRouter.get(
    '/',
    isLoggedIn,
    isAdmin,
    getUsers
);
userRouter.get(
    '/:id',
    isLoggedIn,
    getUserById
);
userRouter.delete(
    '/:id',
    isLoggedIn,
    deleteUserById
);
userRouter.put(
    '/:id',
    isLoggedIn,
    uploadUserImage.single("image"),
    updateUserById
);
userRouter.put(
    '/banned-user/:id',
    isLoggedIn,
    isAdmin,
    handleBannedUserById
);
userRouter.put(
    '/unbanned-user/:id',
    isLoggedIn,
    isAdmin,
    handleUnbannedUserById
);

module.exports = userRouter;
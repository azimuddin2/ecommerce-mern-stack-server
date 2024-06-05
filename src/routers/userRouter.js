const express = require('express');
const {
    getUsers,
    getUserById,
    deleteUserById,
    processRegister,
    activateUserAccount,
    updateUserById,
    handleBanUserById
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
    '/ban-user/:id',
    isLoggedIn,
    isAdmin,
    handleBanUserById
);

module.exports = userRouter;
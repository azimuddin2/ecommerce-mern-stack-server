const express = require('express');
const {
    processRegister,
    activateUserAccount,
    updateUserById,
    handleGetUsers,
    handleGetUserById,
    handleDeleteUserById,
    handleManageUserStatusById,
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
    handleGetUsers
);
userRouter.get(
    '/:id',
    isLoggedIn,
    handleGetUserById
);
userRouter.delete(
    '/:id',
    isLoggedIn,
    isAdmin,
    handleDeleteUserById
);
userRouter.put(
    '/:id',
    isLoggedIn,
    uploadUserImage.single("image"),
    updateUserById
);
userRouter.put(
    '/manage-user/:id',
    isLoggedIn,
    isAdmin,
    handleManageUserStatusById
);

module.exports = userRouter;
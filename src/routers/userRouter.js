const express = require('express');
const {
    handleProcessRegister,
    handleActivateUserAccount,
    handleGetUsers,
    handleGetUserById,
    handleDeleteUserById,
    handleUpdateUserById,
    handleManageUserStatusById,
    handleUpdatePassword,
    handleForgetPassword,
    handleResetPassword,
} = require('../controllers/userController');
const { uploadUserImage } = require('../middlewares/uploadFile');
const {
    validateUserRegistration,
    validateUserPasswordUpdate,
    validateUserForgetPassword,
    validateUserResetPassword
} = require('../validators/auth');
const runValidation = require('../validators');
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middlewares/auth');
const userRouter = express.Router();

userRouter.post(
    '/process-register',
    uploadUserImage.single("image"),
    isLoggedOut,
    validateUserRegistration,
    runValidation,
    handleProcessRegister
);
userRouter.post(
    '/activate',
    isLoggedOut,
    handleActivateUserAccount
);
userRouter.get(
    '/',
    isLoggedIn,
    isAdmin,
    handleGetUsers
);
userRouter.get(
    '/:id([0-9a-fA-F]{24})',
    isLoggedIn,
    handleGetUserById
);
userRouter.delete(
    '/:id([0-9a-fA-F]{24})',
    isLoggedIn,
    isAdmin,
    handleDeleteUserById
);
userRouter.put(
    '/reset-password',
    validateUserResetPassword,
    runValidation,
    handleResetPassword
);
userRouter.put(
    '/:id([0-9a-fA-F]{24})',
    isLoggedIn,
    uploadUserImage.single("image"),
    handleUpdateUserById
);
userRouter.put(
    '/manage-user/:id([0-9a-fA-F]{24})',
    isLoggedIn,
    isAdmin,
    handleManageUserStatusById
);
userRouter.put(
    '/update-password/:id([0-9a-fA-F]{24})',
    validateUserPasswordUpdate,
    runValidation,
    isLoggedIn,
    handleUpdatePassword
);
userRouter.post(
    '/forget-password',
    validateUserForgetPassword,
    runValidation,
    handleForgetPassword
);

module.exports = userRouter;
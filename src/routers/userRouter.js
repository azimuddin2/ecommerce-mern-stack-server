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
} = require('../controllers/userController');
const uploadUserImage = require('../middlewares/uploadFile');
const { validateUserRegistration, validateUserPasswordUpdate } = require('../validators/auth');
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
    handleUpdateUserById
);
userRouter.put(
    '/manage-user/:id',
    isLoggedIn,
    isAdmin,
    handleManageUserStatusById
);
userRouter.put(
    '/update-password/:id',
    validateUserPasswordUpdate,
    runValidation,
    isLoggedIn,
    handleUpdatePassword
);

module.exports = userRouter;
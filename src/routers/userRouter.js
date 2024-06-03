const express = require('express');
const {
    getUsers,
    getUserById,
    deleteUserById,
    processRegister,
    activateUserAccount,
    updateUserById
} = require('../controllers/userController');
const uploadUserImage = require('../middlewares/uploadFile');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');
const { isLoggedIn } = require('../middlewares/auth');
const userRouter = express.Router();

userRouter.post(
    '/process-register',
    uploadUserImage.single("image"),
    validateUserRegistration,
    runValidation,
    processRegister
);
userRouter.post(
    '/activate',
    activateUserAccount
);
userRouter.get(
    '/',
    isLoggedIn,
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

module.exports = userRouter;
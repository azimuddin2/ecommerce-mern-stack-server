const express = require('express');
const { handleLogin, handleLogout } = require('../controllers/authController');
const { isLoggedOut, isLoggedIn } = require('../middlewares/auth');
const authRouter = express.Router();

authRouter.post('/login', isLoggedOut, handleLogin);
authRouter.post('/logout', isLoggedIn, handleLogout);

module.exports = authRouter;
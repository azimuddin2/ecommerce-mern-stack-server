require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 5001;

const mongodbURL = process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerceMernDB";

const defaultImagePath = process.env.DEFAULT_IMAGE_PATH || "public/images/users/user.png";

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "75ebaee6e91737af8da5b444744bb500328f29192b4185c1d22a";

const jwtAccessKey = process.env.JWT_ACCESS_KEY || "8d0ac31bb03ee4dad3a99df7s13ke34k4b338781361dce86dd2f4c2"

const jwtRefreshKey = process.env.JWT_REFRESH_KEY || "40aa51d8b2cd071884d146ed6cb1e7eca4a8dab9a6db615ffc7e8bf3482739cb271";

const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || "5eff0a820b3853f15c9840b20a5f785d6641465b360e4a10b0964783";

const smtpUsername = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";

const clientURL = process.env.CLIENT_URL;

module.exports = {
    serverPort,
    mongodbURL,
    defaultImagePath,
    jwtActivationKey,
    jwtAccessKey,
    jwtRefreshKey,
    jwtResetPasswordKey,
    smtpUsername,
    smtpPassword,
    clientURL,
};
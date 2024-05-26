require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 5001;

const mongodbURL = process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerceMernDB";

const defaultImagePath = process.env.DEFAULT_IMAGE_PATH || "public/images/users/user.png";

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "adlf#kjafd3k0dsk3kl9$lk2%k3&4kdv74@k%kk$se";

const smtpUsername = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";

const clientURL = process.env.CLIENT_URL;

module.exports = {
    serverPort,
    mongodbURL,
    defaultImagePath,
    jwtActivationKey,
    smtpUsername,
    smtpPassword,
    clientURL,
};
const users = require("../models/userModel");


const getUsers = (req, res, next) => {
    try {
        res.status(200).send({
            message: 'Users were returned',
            users,
        });
    } catch (error) {
        next(error)
    }
};


module.exports = { getUsers };

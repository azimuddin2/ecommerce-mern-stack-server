const mongoose = require('mongoose');
const { mongodbURL } = require('../secret');

const connectDatabase = async (options = {}) => {
    try {
        await mongoose.connect(mongodbURL, options);
        console.log('Connection to database is successfully established');

        mongoose.connection.on('error', (error) => {
            console.error('DB connection error: ', error);
        })
    } catch (error) {
        console.error('Could not connect to DB: ', error);
    }
};


module.exports = connectDatabase;
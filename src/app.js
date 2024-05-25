const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const xssClean = require('xss-clean');
const { rateLimit } = require('express-rate-limit');
const userRouter = require('./routers/userRouter');
const seedRouter = require('./routers/seedRouter');
const { errorResponse } = require('./controllers/responseController');
const app = express();

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Too many requests from thiw IP. Please try again later',
});

app.use(rateLimiter);
app.use(morgan("dev"));
app.use(xssClean());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);
app.use('/api/users', userRouter);


app.get('/test', (req, res) => {
    res.send({
        message: "API testing is working fine"
    })
});

app.get('/', (req, res) => {
    res.send({
        message: 'Ecommerce MERN Stack Server App Running.'
    });
});

// client error handling
app.use((req, res, next) => {
    next(createError(404, 'route not found'));
});

// server error handling
app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message,
    });
});


module.exports = app;

const express = require('express')
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')

const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')

// Setup morgan middleware
app.use(morgan('dev'));

// Setup bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes which should handle requests
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

// Handle routes error
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;
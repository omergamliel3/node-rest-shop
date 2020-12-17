const express = require('express')
const app = express();
const morgan = require('morgan')

const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')

// Routes which should handle requests
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

module.exports = app;
const express = require('express')
const router = express.Router();

// Handle incoming GET requests to /orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

// Handle incoming POST requests to /orders
router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Order was created'
    });
});

// Handle incoming GET requests to /orders/orderId
router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

// Handle incoming DELETE requests to /orders/:orderId
router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});

module.exports = router
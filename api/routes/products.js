const express = require('express')
const router = express.Router();

// Handle incoming GET requests to /products
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    })
});

// Handle incoming POST requests to /products
router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Handling POST requests to /products'
    })
});

// Handle incoming GET requests to /products/productId
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id == null || id == '') {
        res.status(404).json({
            message: 'No ID passed',
        });
    }
    else if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID',
            id: id
        });
    }
});

// Handle incoming PATCH requests to /products/productId
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id == '' || id == null) {
        res.status(404).json({
            message: 'No ID passed',
        });
    } else {
        res.status(200).json({
            message: 'Updated product!',
            id: id
        })
    }
});

// Handle incoming DELETE requests to /products/productId
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id == '' || id == null) {
        res.status(404).json({
            message: 'No ID passed',
        });
    } else {
        res.status(200).json({
            message: 'Deleted product!',
            id: id
        })
    }
});

module.exports = router
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

const Product = require('../models/product')


// Handle incoming GET requests to /products
router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs) {
                res.status(200).json(docs);
            } else {
                res.status(404).json({ message: 'No entries found in database' })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error: error
            });
        });
});

// Handle incoming POST requests to /products
router.post('/', (req, res, next) => {

    // Extract product name and price from request body
    let reqName = req.body.name;
    let reqPrice = req.body.price;

    // null check for name and price 
    if (reqName == null || reqName === ''
        || reqPrice == null || reqPrice === '') {
        // return an error message
        res.status(500).json({
            error: {
                message: 'No name or ID passed'
            }
        });
    }

    // Create new Product instance
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: reqName,
        price: reqPrice
    });

    // Saves this document by inserting a new document into the database
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Product added to database',
                createdProduct: product
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });


});

// Handle incoming GET requests to /products/productId
router.get('/:productId', (req, res, next) => {
    // Extract product id from request body
    const id = req.params.productId;
    // Return 404 and error message if id is null
    if (id == null || id == '') {
        res.status(404).json({
            error: {
                message: 'No ID passed'
            }
        });
    } else {
        // find product by the passed id
        Product.findById(id)
            .exec()
            .then(doc => {
                console.log(doc);
                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res.status(404).json({ message: 'No valid entry found for provided ID' });
                }
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({
                    error: error
                });
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

    // Null check for product id
    if (id == '' || id == null) {
        res.status(404).json({
            message: 'No ID passed',
        });
    
    } else {
        // Find product with the given id
        Product.findByIdAndDelete(id)
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Deleted product!',
                    id: id
                });
            })
            .catch(error => {
                console.log(error);
                res.status(404).json({
                    message: 'No valid entry found for provided ID',
                    id: id
                });
            });

    }
});

module.exports = router
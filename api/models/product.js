const mongoose = require('mongoose')

// Create product mongoDB schema
const productSchema = mongoose.Schema({
        _id: mongoose.Types.ObjectId,
        name: String,
        price: Number
    });

// Exports the product schema
module.exports = mongoose.model('Product', productSchema);
const mongoose = require("mongoose");

// Create product mongoDB schema
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  productImage: { type: String, require: true }
});

// Exports the product schema
module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

// Create order mongoDB schema
const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  productId: String,
  quantity: Number,
});

// Exports the product schema
module.exports = mongoose.model("Order", orderSchema);

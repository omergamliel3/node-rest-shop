const mongoose = require("mongoose");

// Create order mongoDB schema
const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
});

// Exports the product schema
module.exports = mongoose.model("Order", orderSchema);

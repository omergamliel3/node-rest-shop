const mongoose = require("mongoose");

// Create order mongoDB schema
const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1 },
});

// Exports the product schema
module.exports = mongoose.model("Order", orderSchema);

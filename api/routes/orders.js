const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const checkAuth = require("../middleware/check_auth");

// Handle incoming GET requests to /orders
router.get("/", checkAuth, async (req, res, next) => {
  try {
    // Find order from the database
    const docs = await Order.find()
      .select("product quantity _id")
      .populate("product", "_id name price");

    // Deconstruct reponse
    const response = {
      count: docs.length,
      orders: docs.map((doc) => {
        return {
          id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
        };
      }),
    };
    // Success response
    res.status(200).json(response);
  } catch (error) {
    // Error response
    res.status(500).json({
      error: error,
    });
  }
});

// Handle incoming POST requests to /orders
router.post("/", checkAuth, async (req, res, next) => {
  try {
    // Find product by id
    const product = await Product.findById(req.body.productId);

    // Return error response if no product found in database
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    // Create a new Order instance
    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      product: req.body.productId,
      quantity: req.body.quantity,
    });

    // Insert order into the database
    await order.save();
    const response = {
      message: "Created order successfully",
    };
    // Return success response
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

// Handle incoming GET requests to /orders/orderId
router.get("/:orderId", checkAuth, async (req, res, next) => {
  try {
    // Find order by id
    const doc = await Order.findById(req.params.orderId).populate(
      "product",
      "_id name price"
    );

    // Deconstruct reponse
    const response = {
      id: doc._id,
      product: doc.product,
      quantity: doc.quantity,
    };
    // Success response
    res.status(200).json(response);
  } catch (error) {
    // Error response
    res.status(500).json({
      error: error,
    });
  }
});

// Handle incoming DELETE requests to /orders/:orderId
router.delete("/:orderId", checkAuth, async (req, res, next) => {
  try {
    // Find order by id
    const result = await Order.remove({ _id: req.params.orderId });
    // Success response
    res.status(200).json({
      message: "Order deleted",
    });
  } catch (error) {
    // Error response
    res.status(404).json({
      message: "No valid entry found for provided ID",
    });
  }
});

module.exports = router;

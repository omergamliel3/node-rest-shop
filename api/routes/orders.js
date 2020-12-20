const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { discriminator } = require("../models/order");

const Order = require("../models/order");
const Product = require("../models/product");

// Handle incoming GET requests to /orders
router.get("/", (req, res, next) => {
  // Get all orders from the database
  Order.find()
    .select("product quantity _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

// Handle incoming POST requests to /orders
router.post("/", (req, res, next) => {
  // Find product by id
  Product.findById(req.body.productId)
    .exec()
    .then((product) => {
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
      // Insert new Order to the database
      return order.save();
    })
    .then((doc) => {
      const response = {
        message: "Created order successfully",
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

// Handle incoming GET requests to /orders/orderId
router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((doc) => {
      const response = {
        id: doc._id,
        product: doc.product,
        quantity: doc.quantity,
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

// Handle incoming DELETE requests to /orders/:orderId
router.delete("/:orderId", (req, res, next) => {
  // Find order with the given id
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
      });
    })
    .catch((error) => {
      res.status(404).json({
        message: "No valid entry found for provided ID",
        error: error,
      });
    });
});

module.exports = router;

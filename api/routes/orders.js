const express = require("express");
const router = express.Router();

const Order = require("../models/order");

// Handle incoming GET requests to /orders
router.get("/", (req, res, next) => {
  Order.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({ message: "No entries found in database" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

// Handle incoming POST requests to /orders
router.post("/", (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  res.status(201).json({
    message: "Order was created",
    order: order,
  });
});

// Handle incoming GET requests to /orders/orderId
router.get("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Order details",
    orderId: req.params.orderId,
  });
});

// Handle incoming DELETE requests to /orders/:orderId
router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Order deleted",
    orderId: req.params.orderId,
  });
});

module.exports = router;

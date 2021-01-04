const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

// Get all orders
exports.orders_get_all = async (req, res, next) => {
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
};

// Create new order
exports.orders_create_order = async (req, res, next) => {
  try {
    if (req.body.productId == undefined) {
      return res.status(404).json({
        message: "You must pass a product id property",
      });
    }
    // Find product by id
    const product = await Product.findById(req.body.productId);

    // Return error response if no product found in database
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.quantity === 0) {
      return res.status(404).json({
        message: "Product is out of stock",
      });
    }

    // Return error response if request quantity
    // is greater then available product's quantity
    if (req.body.quantity > product.quantity) {
      return res.status(404).json({
        message: "You can order max " + product.quantity + " of this product",
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

    // Handle order
    await Product.update(
      { _id: product._id },
      {
        $set: {
          quantity: product.quantity - req.body.quantity,
        },
      }
    );

    const response = {
      message: "Created order successfully",
    };

    // Return success response
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

// Get order by id
exports.orders_get_order = async (req, res, next) => {
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
};

// Delete order
exports.orders_delete_order = async (req, res, next) => {
  try {
    // Find order by id
    await Order.remove({ _id: req.params.orderId });
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
};

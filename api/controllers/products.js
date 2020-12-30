const mongoose = require("mongoose");
const Product = require("../models/product");

// Get all products
exports.products_get_all = async (req, res, next) => {
  try {
    // Get all products from the database
    const docs = await Product.find().select(
      "name price _id productImage quantity"
    );
    // Create response
    const response = {
      count: docs.length,
      products: docs.map((doc) => {
        return {
          id: doc._id,
          name: doc.name,
          price: doc.price,
          quantity: doc.quantity,
          productImage: doc.productImage || "No product image available",
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + doc._id,
          },
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

// Create new product
exports.products_create_product = async (req, res, next) => {
  // Create new Product instance
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
    productImage: req.file.path,
  });

  try {
    // Insert new Product to the database
    const doc = await product.save();
    // Create response object
    const response = {
      message: "Created product successfully",
      createdProduct: {
        id: doc._id,
        name: doc.name,
        price: doc.price,
        quantity: doc.quantity,
        productImage: doc.productImage || "No product image available",
      },
    };
    // Success response
    res.status(201).json(response);
  } catch (error) {
    // Error response
    res.status(500).json({
      error: error,
    });
  }
};

// Get product by id
exports.products_get_product = async (req, res, next) => {
  try {
    // Find product with the given id
    const doc = await Product.findById(req.params.productId).select(
      "name price _id productImage quantity"
    );
    // check if the returned doc is not null
    if (doc) {
      // Success response
      return res.status(200).json({
        id: doc._id,
        name: doc.name,
        price: doc.price,
        quantity: doc.quantity,
        productImage: doc.productImage || "No product image available",
      });
    }
    // Can not find product response
    res.status(404).json({ message: "No valid entry found for provided ID" });
  } catch (error) {
    // Error response
    res.status(500).json({
      error: error,
    });
  }
};

// Update product
exports.products_update_product = async (req, res, next) => {
  // product id
  const id = req.params.productId;
  // update operations
  const updateOps = {};
  // add name property if defined
  if (req.body.name != undefined) {
    updateOps["name"] = req.body.name;
  }
  // add price property if defined
  if (req.body.price != undefined) {
    updateOps["price"] = req.body.price;
  }
  // add quantity property if defined
  if (req.body.quantity != undefined) {
    updateOps["quantity"] = req.body.quantity;
  }

  try {
    // Update product with the given id
    await Product.update({ _id: id }, { $set: updateOps });
    const response = {
      message: "Product updated",
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

// Delete product
exports.products_delete_product = async (req, res, next) => {
  // product id
  const id = req.params.productId;
  try {
    // Remove product from the database
    await Product.remove({ _id: id });
    // Success response
    res.status(200).json({
      message: "Product deleted",
    });
  } catch (error) {
    // Error response
    res.status(404).json({
      message: "No valid entry found for provided ID",
      error: error,
    });
  }
};

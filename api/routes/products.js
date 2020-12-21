const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const Product = require("../models/product");

// Create a multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

// Create a file filter, only accept jpeg and png format
const fileFilter = (req, file, callback) => {
  // accept a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  }
  // reject a file
  else {
    callback(new Error("Bad file type"), false);
  }
};

// Config multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// Handle incoming GET requests to /products
router.get("/", async (req, res, next) => {
  try {
    // Get all products from the database
    const docs = await Product.find().select("name price _id productImage");
    // Create response
    const response = {
      count: docs.length,
      products: docs.map((doc) => {
        return {
          id: doc._id,
          name: doc.name,
          price: doc.price,
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
});

// Handle incoming POST requests to /products
router.post("/", upload.single("productImage"), async (req, res, next) => {
  // Create new Product instance
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
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
        productImage: doc.productImage || "No product image available",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + doc._id,
        },
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
});

// Handle incoming GET requests to /products/productId
router.get("/:productId", async (req, res, next) => {
  try {
    // Find product with the given id
    const doc = await Product.findById(req.params.productId).select(
      "name price _id productImage"
    );
    // check if the returned doc is not null
    if (doc) {
      // Success response
      return res.status(200).json({
        id: doc._id,
        name: doc.name,
        price: doc.price,
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
});

// Handle incoming PATCH requests to /products/productId
router.patch("/:productId", async (req, res, next) => {
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

  try {
    // Update product with the given id
    await Product.update({ _id: id }, { $set: updateOps });
    const response = {
      message: "Product updated",
      request: {
        type: "GET",
        url: "http://localhost:3000/products/" + id,
      },
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

// Handle incoming DELETE requests to /products/productId
router.delete("/:productId", async (req, res, next) => {
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
});

module.exports = router;

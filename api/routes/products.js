const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

// Handle incoming GET requests to /products
router.get("/", (req, res, next) => {
  // Get all product from the database
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            id: doc._id,
            name: doc.name,
            price: doc.price,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

// Handle incoming POST requests to /products
router.post("/", (req, res, next) => {
  // Extract product name and price from request body
  const reqName = req.body.name;
  const reqPrice = req.body.price;

  // Create new Product instance
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: reqName,
    price: reqPrice,
  });

  // Saves this document by inserting a new document into the database
  product
    .save()
    .then((doc) => {
      const response = {
        message: "Created product successfully",
        createdProduct: {
          id: doc._id,
          name: doc.name,
          price: doc.price,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + doc._id,
          },
        },
      };
      res.status(201).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

// Handle incoming GET requests to /products/productId
router.get("/:productId", (req, res, next) => {
  // Extract product id from request body
  const id = req.params.productId;

  // Find product with the given id
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          id: doc._id,
          name: doc.name,
          price: doc.price,
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

// Handle incoming PATCH requests to /products/productId
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  if (req.body.name != undefined) {
    updateOps["name"] = req.body.name;
  }
  if (req.body.price != undefined) {
    updateOps["price"] = req.body.price;
  }
  // Update product 
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      const response = {
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

// Handle incoming DELETE requests to /products/productId
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;

  // Find product with the given id
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted",
      });
    })
    .catch((error) => {
      res.status(404).json({
        message: "No valid entry found for provided ID",
      });
    });
});

module.exports = router;

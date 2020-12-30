const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");
const usersRoutes = require("./api/routes/users");

// enable all cors requests
app.use(cors());

// Setup mongoose
mongoose.connect(
  "mongodb+srv://admin:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.noupx.mongodb.net/rest-shop-api?retryWrites=true&w=majority"
);

// Setup morgan middleware
app.use(morgan("dev"));

// Expose uploads image folder to /uploads
app.use("/uploads", express.static("uploads"));

// Setup bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes which should handle requests
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/users", usersRoutes);

// Handle routes error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;

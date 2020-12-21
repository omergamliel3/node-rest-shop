const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Handle incoming GET requests to /users
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handle users GET requests!",
  });
});

// Handle incoming POST requests to /users/signup
router.post("/signup", (req, res, next) => {
  res.status(200).json({
    message: "Handle users signup POST requests!",
  });
});

module.exports = router;

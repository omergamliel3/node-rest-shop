const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Handle incoming POST requests to /users/signup
router.post("/signup", async (req, res, next) => {
  // Search for users with the same email
  const docs = await User.find({ email: req.body.email });
  // if found any users
  if (docs.length > 0) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }
  // Encrypt password
  let hash = bcrypt.hashSync(req.body.password, 10);
  // Create new User instance
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    password: hash,
  });
  try {
    // Insert new user to the database
    await user.save();
    // Success response
    res.status(201).json({
      message: "User created",
    });
  } catch (error) {
    // Error response
    res.status(500).json({
      error: error,
    });
  }
});

// Handle incoming POST requests to /users/signin
router.get("/signin", async (req, res, next) => {
  const docs = await User.find({ email: req.body.email });
  if (docs.length == 0) {
    // Email not found response
    return res.status(500).json({
      message: "Email is not found",
    });
  }
  // Compare the given password with the hash password from the database
  const match = await bcrypt.compare(req.body.password, docs[0].password);
  // Password match
  if (match) {
    // Success response
    // return JWT with the response
    res.status(200).json({
      message: "email and password are valid",
    });
  } else {
    // Wrong password response
    res.status(500).json({
      message: "Wrong password",
    });
  }
});

// Handle incoming DELETE requests to /users/userId
router.delete("/:userId", async (req, res, next) => {
  try {
    // Remove user from the database
    await User.remove({ _id: req.params.userId });
    // Success response
    res.status(200).json({
      message: "User deleted",
    });
  } catch (error) {
    // Error response
    res.status(500).json({
      error: error,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const User = require("../models/user");

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

// Handle incoming POST requests to /users/login
router.post("/login", async (req, res, next) => {
  const docs = await User.find({ email: req.body.email });
  if (docs.length == 0) {
    // Email not found response
    return res.status(401).json({
      message: "Auth failed",
    });
  }
  // Compare the given password with the hash password from the database
  const match = await bcrypt.compare(req.body.password, docs[0].password);
  // Password match
  if (match) {
    // Create token
    const token = jwt.sign(
      { email: docs[0].email, userId: docs[0]._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    // Success response 86400
    res.status(200).json({
      auth: true,
      token: token,
    });
  } else {
    // Wrong password response
    res.status(401).json({
      message: "Auth failed",
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

router.get("/me", (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    res.status(200).send(decoded);
  });
});

module.exports = router;

const mongoose = require("mongoose");

// Create user mongoDB schema
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, require: true },
  password: { type: String, require: true },
});

// Exports the user schema
module.exports = mongoose.model("User", userSchema);

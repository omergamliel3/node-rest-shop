const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check_auth");
const UsersController = require("../controllers/users");

// Handle incoming POST requests to /users/register
router.post("/register", UsersController.users_register);

// Handle incoming POST requests to /users/login
router.post("/login", UsersController.users_login);

// Handle incoming DELETE requests to /users/userId
router.delete("/:userId", checkAuth, UsersController.users_delete_user);

module.exports = router;

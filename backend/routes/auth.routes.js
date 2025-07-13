const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/auth.controller');

/**
 * Authentication Routes
 *
 * This file defines the routes for user authentication, including registration, login, and logout.
 * Each route delegates its logic to the corresponding controller function.
 */

// Route for registering a new user
// Expects user details in the request body (e.g., firstName, lastName, email, password, etc.)
// Calls the registerUser controller to handle registration logic
router.post('/register', registerUser);

// Route for logging in a user
// Expects email and password in the request body
// Calls the loginUser controller to handle authentication and token generation
router.post('/login', loginUser);

// Route for logging out a user
// This is a placeholder route; actual logout logic (like token invalidation) can be implemented as needed
router.post('/logout', (req, res) => {
  // Optional: Log user logout activity or clear session/token on client side
  res.json({ message: 'User logged out' });
});

module.exports = router; // Export the router to be used in the main app file

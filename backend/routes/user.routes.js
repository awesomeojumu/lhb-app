const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/user.controller');

/**
 * User Routes
 * 
 * This file defines the routes for user management.
 * Each route delegates its logic to the corresponding controller function.
 */

// Route for registering a new user
// POST /api/users/register
// Expects user details in the request body (e.g., firstName, lastName, email, password, etc.)
// Calls the registerUser controller to handle registration logic
router.post('/register', registerUser);

module.exports = router; // Export the router to be used in the main app file
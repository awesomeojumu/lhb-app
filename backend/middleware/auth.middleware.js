const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to authenticate requests using JWT tokens.
 *
 * How it works:
 * 1. Checks for the Authorization header and verifies it starts with 'Bearer '.
 * 2. Extracts the token from the header.
 * 3. Verifies the token using the JWT secret from environment variables.
 * 4. If valid, fetches the user from the database (excluding the password field) and attaches it to req.user.
 * 5. If any step fails, responds with 401 Unauthorized.
 *
 * This middleware should be used on routes that require authentication.
 */
const authenticate = async (req, res, next) => {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  // Extract the token from the header (format: 'Bearer <token>')
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the decoded token, exclude the password field
    req.user = await User.findById(decoded.id).select('-password');

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If verification fails, log the error and respond with 401 Unauthorized
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = {
  authenticate,
};

const jwt = require('jsonwebtoken')
const User = require('../models/User')

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
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')

    //  ADD THIS: Check if user is still active
    if (!req.user || req.user.status !== 'active') {
      return res.status(401).json({
        message: 'Account deactivated. Please contact your battalion commander.'
      })
    }

    next()
  } catch (err) {
    console.error('Auth error:', err.message)
    res.status(401).json({ message: 'Unauthorized: Invalid token' })
  }
}

module.exports = {
  authenticate
}

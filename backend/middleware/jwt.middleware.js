const jwt = require('jsonwebtoken')
const User = require('../models/User')

// In-memory token blacklist (in production, use Redis)
const tokenBlacklist = new Set()

/**
 * Add token to blacklist
 */
const blacklistToken = (token) => {
  tokenBlacklist.add(token)
  console.log(`Token blacklisted: ${token.substring(0, 20)}...`)
}

/**
 * Check if token is blacklisted
 */
const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token)
}

/**
 * Enhanced JWT authentication middleware with blacklist support
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token' })
  }

  const token = authHeader.split(' ')[1]

  // Check if token is blacklisted
  if (isTokenBlacklisted(token)) {
    return res.status(401).json({
      message: 'Token has been revoked. Please login again.'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')

    // Check if user is still active
    if (!req.user || req.user.status !== 'active') {
      return res.status(401).json({
        message: 'Account deactivated. Please contact your battalion commander.'
      })
    }

    // Add token to request for potential blacklisting
    req.token = token
    next()
  } catch (err) {
    console.error('Auth error:', err.message)
    res.status(401).json({ message: 'Unauthorized: Invalid token' })
  }
}

/**
 * Logout middleware - blacklists the token
 */
const logout = (req, res, next) => {
  if (req.token) {
    blacklistToken(req.token)
  }
  res.json({ message: 'User logged out successfully' })
}

/**
 * Generate JWT token with shorter expiration
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '4h' } // Reduced from 1 day to 4 hours
  )
}

/**
 * Generate refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

/**
 * Verify refresh token
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type')
    }
    return decoded
  } catch (error) {
    throw new Error('Invalid refresh token')
  }
}

module.exports = {
  authenticate,
  logout,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  blacklistToken,
  isTokenBlacklisted
}

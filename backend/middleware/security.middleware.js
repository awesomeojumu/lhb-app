// Import security packages with error handling
let rateLimit, helmet, mongoSanitize, xss, hpp

try {
  rateLimit = require('express-rate-limit')
  helmet = require('helmet')
  mongoSanitize = require('express-mongo-sanitize')
  xss = require('xss-clean')
  hpp = require('hpp')
} catch (error) {
  console.warn('Some security packages not installed, using fallbacks:', error.message)
}

/**
 * Security middleware collection
 */

// Rate limiting for auth endpoints
const authLimiter = rateLimit ? rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'Too many login attempts, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
}) : (req, res, next) => next()

// General rate limiting
const generalLimiter = rateLimit ? rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    error: 'Too many requests, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
}) : (req, res, next) => next()

// Security headers
const securityHeaders = helmet
  ? helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })
  : (req, res, next) => next()

// Data sanitization against NoSQL injection
const noSqlSanitize = mongoSanitize
  ? mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.warn(`NoSQL injection attempt detected: ${key}`, req.url)
    }
  })
  : (req, res, next) => next()

// XSS protection
const xssProtection = xss ? xss({
  whiteList: {}, // empty means no HTML allowed
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script']
}) : (req, res, next) => next()

// HTTP Parameter Pollution protection
const hppProtection = hpp ? hpp() : (req, res, next) => next()

// Request size limits
const requestSizeLimit = (req, res, next) => {
  // Set body size limit (1MB)
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 1024 * 1024) {
    return res.status(413).json({
      error: 'Request entity too large',
      message: 'Request body exceeds 1MB limit'
    })
  }
  next()
}

// Password strength validation
const validatePasswordStrength = (req, res, next) => {
  if (req.body.password) {
    const password = req.body.password
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (password.length < minLength) {
      return res.status(400).json({
        error: 'Password too short',
        message: `Password must be at least ${minLength} characters long`
      })
    }

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return res.status(400).json({
        error: 'Password too weak',
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      })
    }
  }
  next()
}

// Email validation
const validateEmail = (req, res, next) => {
  if (req.body.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      })
    }
  }
  next()
}

module.exports = {
  authLimiter,
  generalLimiter,
  securityHeaders,
  noSqlSanitize,
  xssProtection,
  hppProtection,
  requestSizeLimit,
  validatePasswordStrength,
  validateEmail
}

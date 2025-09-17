const cors = require('cors')

/**
 * CORS configuration for production security
 */
const corsOptions = {
  origin (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) { return callback(null, true) }

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173',
      'https://lhbapp.netlify.app',
      'https://lhbapp.vercel.app'
    ].filter(Boolean) // Remove undefined values

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`CORS: Blocked request from origin: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400 // 24 hours
}

// Development CORS (more permissive)
const devCorsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 0
}

module.exports = {
  corsOptions,
  devCorsOptions,
  cors: cors(process.env.NODE_ENV === 'production' ? corsOptions : devCorsOptions)
}

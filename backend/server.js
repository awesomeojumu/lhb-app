// SERVER ENTRY POINT

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const { errorHandler } = require('./utils/errors');

require('dotenv').config(); // Load environment variables from .env file

// =======================
// Environment Validation
// =======================

// Critical environment variables that must be present
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];

// Validate required environment variables
requiredEnvVars.forEach((name) => {
  if (!process.env[name]) {
    console.error(`❌ Missing required environment variable: ${name}`);
    process.exit(1);
  }
});

console.log('✅ All required environment variables are present');

const app = express();
const server = http.createServer(app);

// =======================
// Middleware Configuration
// =======================

// CORS configuration - Allow all origins for debugging
app.use(
  cors({
    origin: true, // Allow all origins temporarily
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

// Parse incoming JSON requests
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// =======================
// Default Route
// =======================

// Basic health check route to verify the API is running
app.get('/', (req, res) => {
  res.send('LHB App API running...');
});

// Health check endpoint for production monitoring
app.get('/api/health', (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
    database: 'connected', // This will be updated based on actual DB status
  };

  res.status(200).json(healthCheck);
});

// Readiness check endpoint
app.get('/api/ready', (req, res) => {
  // Check if database is connected
  const isDbConnected = mongoose.connection.readyState === 1;

  if (isDbConnected) {
    res.status(200).json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

// =======================
// Route Imports & Mounting
// =======================

// Import user-related routes (e.g., registration)
const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes); // Mount user routes at /api/users

// Import KPI-related routes (e.g., assign KPI)
const kpiRoutes = require('./routes/kpi.routes');
app.use('/api/kpis', kpiRoutes); // Mount KPI routes at /api/kpis

// Import authentication routes (e.g., login, register)
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes); // Mount auth routes at /api/auth

// Import notification routes
const notificationRoutes = require('./routes/notification.routes');
app.use('/api/notifications', notificationRoutes); // Mount notification routes at /api/notifications

// Import metrics routes
const metricsRoutes = require('./routes/metrics.routes');
app.use('/api/metrics', metricsRoutes); // Mount metrics routes at /api/metrics

// Import onboarding routes
const onboardingRoutes = require('./routes/onboarding.routes');
app.use('/api/onboarding', onboardingRoutes); // Mount onboarding routes at /api/onboarding

// =======================
// Error Handling
// =======================

// Global error handler (must be last middleware)
app.use(errorHandler);

// Import notification service
const notificationService = require('./services/notificationService');

// Import WebSocket service
const websocketService = require('./services/websocketService');

// =======================
// Database Connection & Server Startup
// =======================

// Set the port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB using the URI from environment variables
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // If connection is successful, start the HTTP server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      // Start the notification service
      notificationService.start();
      console.log('📧 Notification service started');

      // Start the WebSocket service
      websocketService.start(server);
      console.log('🔌 WebSocket service started');
    });
  })
  .catch((err) => {
    // If connection fails, log the error
    console.error('MongoDB connection failed:', err);
  });

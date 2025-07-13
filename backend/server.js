// SERVER ENTRY POINT

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { getMe } = require('./controllers/user.controller');
const { authenticate } = require('./middleware/auth.middleware');
const router = express.Router();
const dotenv = require('dotenv'); // Import dotenv to manage environment variables
require('dotenv').config(); // Load environment variables from .env file


const app = express();

// =======================
// Middleware Configuration
// =======================

// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

// Parse incoming JSON requests and put the parsed data in req.body
app.use(express.json());

// =======================
// Default Route
// =======================

// Basic health check route to verify the API is running
app.get('/', (req, res) => {
  res.send('LHB App API running...');
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

// =======================
// Database Connection & Server Startup
// =======================

// Set the port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB using the URI from environment variables
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // If connection is successful, start the Express server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    // If connection fails, log the error
    console.error('MongoDB connection failed:', err); 
  });
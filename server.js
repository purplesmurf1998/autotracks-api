// Default imports
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const connect = require('./config/mongodb');
const cookieParser = require('cookie-parser');

// Load environment variables from config.env
dotenv.config({ path: './config/config.env' });

// Create server
const app = express();

// Declare any middleware used throughout the API
// Dev logging middleware for development environment
if (process.env.NODE_ENVIRONMENT === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());

// Cors
app.use(cors());

// Cookie parser
app.use(cookieParser());

// Import routes
const authRoutes = require('./routes/auth');
const dealershipRoutes = require('./routes/dealerships');
const vehicleRoutes = require('./routes/vehicles');
const locationRoutes = require('./routes/locations');

// Mount routes to the server
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dealerships', dealershipRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/locations', locationRoutes);

// Set the port and start the server
const port = process.env.PORT || 8000
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port} in ${process.env.NODE_ENVIRONMENT} mode.`.yellow.bold);
  connect();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
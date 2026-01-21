/**
 * EXPRESS SERVER WITH MONGODB
 * Main server file that initializes Express and connects to MongoDB
 */

// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');  // Web framework for Node.js
const cors = require('cors');        // Enable Cross-Origin Resource Sharing
const path = require('path');        // Work with file paths
const { connectDB } = require('./config/database');  // MongoDB connection function
const projectRoutes = require('./routes/projectRoutes');  // Import project routes

// Create Express application
const app = express();

// Set server port (use environment variable or default to 5000)
const PORT = process.env.PORT || 5000;

// ===== CONNECT TO MONGODB =====
// Establish database connection before starting server
connectDB();

// ===== MIDDLEWARE SETUP =====
// Middleware runs before your route handlers and can modify requests/responses

// Enable CORS - allows React app (port 3000) to communicate with this API (port 5000)
app.use(cors());

// Parse JSON request bodies - converts JSON strings to JavaScript objects
app.use(express.json());

// Parse URL-encoded request bodies - handles form submissions
app.use(express.urlencoded({ extended: true }));

// ===== STATIC FILE SERVING =====
// Serve static files (images, documents, etc.) from these directories
app.use('/media', express.static(path.join(__dirname, 'Media')));
app.use('/documents', express.static(path.join(__dirname, 'Documents')));

// ===== API ROUTES =====
// All project-related routes are handled by projectRoutes
// URLs starting with '/api/projects' will use the projectRoutes handlers
app.use('/api/projects', projectRoutes);

// ===== HEALTH CHECK ENDPOINT =====
// Simple endpoint to verify the server is running
// Access at: http://localhost:5000/api/health
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: 'MongoDB connected'
  });
});

// ===== ERROR HANDLING MIDDLEWARE =====
// This catches any errors that occur in route handlers
// Must be defined AFTER all other app.use() and routes
app.use((err, req, res, next) => {
  // Log the error to console for debugging
  console.error(err.stack);
  
  // Send error response to client
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// ===== START SERVER =====
// Listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/projects`);
});

// Export app for testing purposes
module.exports = app;

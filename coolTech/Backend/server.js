// Import dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const ouRoutes = require('./routes/ou.routes');
const divisionRoutes = require('./routes/division.routes');
const credentialRoutes = require('./routes/credential.routes');
const userRoutes = require('./routes/user.routes');

// Initialize express
const app = express();

// Set up port for server to listen on
const PORT = process.env.PORT || 4500;

// Connect to the database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI).then(
  () => { console.log('Successfully connected to the database!'); },
  err => { console.log('Could not connect to the database...' + err); }
);

// Middleware - Allow app to accept json and url encoded values
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Set up routes to be handled from: http://localhost:5000/api/auth
app.use('/api/auth', authRoutes);
app.use('/api/ou', ouRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cool Tech API is running' });
});

// Test database
app.get('/api/test-db', async (req, res) => {
  try {
    const User = require('./models/user.model');
    const count = await User.countDocuments();
    res.json({ success: true, userCount: count, dbState: mongoose.connection.readyState });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start up express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

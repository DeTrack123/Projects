/**
 * DATABASE CONNECTION
 * Manages MongoDB connection using Mongoose
 */

const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Connect to MongoDB
 * Uses the connection string from .env file
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB (Mongoose 6+ doesn't need these options anymore)
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit if can't connect to database
  }
};

module.exports = { connectDB };

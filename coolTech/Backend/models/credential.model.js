const mongoose = require('mongoose');

// Credential schema for storing login details (passwords, usernames, URLs)
const CredentialSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: [true, 'Please provide a service name'],
    trim: true,
    maxlength: [100, 'Service name cannot be more than 100 characters']
  },
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password']
  },
  url: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: [true, 'Please specify the division']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true  // For soft delete functionality
  }
});

// Automatically update timestamp when credential is modified
CredentialSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Credential', CredentialSchema);

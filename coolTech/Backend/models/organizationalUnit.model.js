const mongoose = require('mongoose');

// Define the Organizational Unit Schema
const OrganizationalUnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an organizational unit name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('OrganizationalUnit', OrganizationalUnitSchema);

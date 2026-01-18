const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User model with authentication and role-based access control
let UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['normal', 'management', 'admin'],  // Three access levels
    default: 'normal'
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: false
  },
  organizationalUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrganizationalUnit',
    required: false
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now
  },
  active: {
    type: Boolean,
    required: false,
    default: true  // For soft delete functionality
  }
});

// Automatically hash password before saving to database
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password during login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

let User = mongoose.model('User', UserSchema);

module.exports = User;

const mongoose = require('mongoose');

// Define the Division Schema
const DivisionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a division name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  organizationalUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrganizationalUnit',
    required: [true, 'Please specify the organizational unit']
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

// Index to ensure division names are unique within an OU
DivisionSchema.index({ name: 1, organizationalUnit: 1 }, { unique: true });

module.exports = mongoose.model('Division', DivisionSchema);

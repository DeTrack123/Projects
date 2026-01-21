/**
 * PROJECT MODEL (Mongoose Schema)
 * Defines the structure and behavior of Project documents in MongoDB
 * Mongoose handles all database operations with this model
 */

const mongoose = require('mongoose');

/**
 * WORKFLOW STEP SCHEMA
 * Sub-schema for individual workflow steps
 * Stores information about each step in the project workflow
 */
const workflowStepSchema = new mongoose.Schema({
  // The step name (e.g., "Design", "Manufacturing")
  step: {
    type: String,
    required: true
  },
  // Person responsible for this step
  responsiblePerson: {
    type: String,
    default: ''
  },
  // Due date for this step
  dueDate: {
    type: Date,
    default: null
  },
  // Whether this step is completed
  completed: {
    type: Boolean,
    default: false
  },
  // Date when this step was completed
  completedDate: {
    type: Date,
    default: null
  },
  // Person who completed this step
  completedBy: {
    type: String,
    default: ''
  }
}, { _id: false }); // Don't create separate IDs for sub-documents

/**
 * PROJECT SCHEMA
 * Defines the structure of a project document in MongoDB
 * Each field has a type, validation rules, and default values
 */
const projectSchema = new mongoose.Schema({
  // Project identification
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true, // Remove whitespace from ends
    maxlength: [10, 'The MCP number must be at most 10 characters']
  },
  
  projectDescription: {
    type: String,
    default: '',
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Client information
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  
  clientEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  // Project status (from constants.js options)
  status: {
    type: String,
    required: true,
    enum: {
      values: ['not-started', 'pending', 'in-progress', 'completed', 'on-hold', 'cancelled', 'delivered', 'emergency'],
      message: '{VALUE} is not a valid status'
    },
    default: 'not-started'
  },
  
  // Person responsible for the project
  responsiblePerson: {
    type: String,
    default: ''
  },
  
  // Important dates
  deliveryDate: {
    type: Date,
    required: [true, 'Delivery date is required']
  },
  
  startDate: {
    type: Date,
    default: Date.now
  },
  
  // Workflow configuration
  workflowStage: {
    type: String,
    enum: ['default', 'equipment1', 'equipment2', 'equipment3'],
    default: 'default'
  },
  
  currentStage: {
    type: String,
    default: ''
  },
  
  // Array of workflow steps
  workflowSteps: [workflowStepSchema],
  
  // Additional notes
  notes: {
    type: String,
    default: '',
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true,
  
  // Transform output when converting to JSON (for API responses)
  toJSON: {
    transform: function(doc, ret) {
      // Convert MongoDB _id to id for consistency with old code
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v; // Remove version key
      return ret;
    }
  }
});

/**
 * INDEXES
 * Speed up common queries
 */
// Index for searching by project name
projectSchema.index({ projectName: 'text', projectDescription: 'text', clientName: 'text' });
// Index for filtering by status
projectSchema.index({ status: 1 });
// Index for sorting by delivery date
projectSchema.index({ deliveryDate: 1 });

/**
 * STATIC METHODS
 * Custom query methods attached to the model
 * These make it easier to perform common operations
 */

// Search projects by text
projectSchema.statics.searchProjects = function(searchTerm) {
  return this.find({
    $or: [
      { projectName: { $regex: searchTerm, $options: 'i' } },
      { projectDescription: { $regex: searchTerm, $options: 'i' } },
      { clientName: { $regex: searchTerm, $options: 'i' } },
      { responsiblePerson: { $regex: searchTerm, $options: 'i' } }
    ]
  });
};

// Get projects by status
projectSchema.statics.getByStatus = function(status) {
  return this.find({ status });
};

// Get overdue projects
projectSchema.statics.getOverdue = function() {
  return this.find({
    deliveryDate: { $lt: new Date() },
    status: { $nin: ['completed', 'cancelled'] }
  });
};

/**
 * INSTANCE METHODS
 * Methods that work on individual project documents
 */

// Check if project is overdue
projectSchema.methods.isOverdue = function() {
  return this.deliveryDate < new Date() && 
         !['completed', 'cancelled'].includes(this.status);
};

// Mark a workflow step as complete
projectSchema.methods.completeWorkflowStep = function(stepName, person) {
  const step = this.workflow.find(s => s.step === stepName);
  if (step) {
    step.completed = true;
    step.completedDate = new Date();
    step.completedBy = person;
  }
  return this.save();
};

/**
 * PRE-SAVE MIDDLEWARE
 * Runs before saving a document
 * In Mongoose 7+, async functions don't need next() callback
 */
projectSchema.pre('save', async function() {
  // You can add custom logic here
  // For example: validation, auto-population, etc.
  // No need to call next() in async middleware
});

// Create and export the model
// First parameter: model name (will create 'projects' collection)
// Second parameter: schema definition
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

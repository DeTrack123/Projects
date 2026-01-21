/**
 * PROJECT CONTROLLER (MongoDB/Mongoose Version)
 * This file contains all the logic for handling API requests
 * Each function is called by a route and handles one specific operation
 * Now uses Mongoose models instead of JSON file operations
 */

// Import the Mongoose Project model
const Project = require('../models/ProjectModel');
// Import configuration constants
const { projectStatuses, teamMembers, workflowStages, stageLabels } = require('../config/constants');

/**
 * GET ALL PROJECTS
 * Retrieves all projects from MongoDB and sends them to the client
 * @param {Object} req - The request object (can include query params for filtering)
 * @param {Object} res - The response object to send data back
 */
const getAllProjects = async (req, res) => {
  try {
    // Query parameters for filtering and sorting
    const { status, search, sortBy = 'deliveryDate', order = 'asc' } = req.query;
    
    // Build query object
    let query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Search across multiple fields if search term provided
    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { projectDescription: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { responsiblePerson: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with sorting
    const projects = await Project.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .lean(); // Returns plain JS objects instead of Mongoose documents (faster)
    
    // Send projects array as JSON response
    res.json(projects);
  } catch (error) {
    // If something goes wrong, send an error response
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve projects', 
      message: error.message 
    });
  }
};

/**
 * GET PROJECT BY ID
 * Retrieves a single project by its MongoDB _id
 * @param {Object} req - The request object containing the project ID in req.params.id
 * @param {Object} res - The response object
 */
const getProjectById = async (req, res) => {
  try {
    // Find project by ID using Mongoose
    // findById automatically handles ObjectId conversion
    const project = await Project.findById(req.params.id);
    
    // If project not found, send 404 error
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Send the found project
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid project ID format' });
    }
    
    res.status(500).json({ 
      error: 'Failed to retrieve project', 
      message: error.message 
    });
  }
};

/**
 * CREATE NEW PROJECT
 * Creates a new project document in MongoDB
 * @param {Object} req - Request object with project data in req.body
 * @param {Object} res - Response object
 */
const createProject = async (req, res) => {
  try {
    // Log the incoming request data for debugging
    console.log('📝 Received project data:', JSON.stringify(req.body, null, 2));
    
    // Create new project using Mongoose model
    // Mongoose will validate the data according to the schema
    const newProject = new Project(req.body);
    
    // Save to database
    await newProject.save();
    
    console.log('✅ Project created successfully:', newProject._id);
    
    // Send back the created project with 201 (Created) status
    res.status(201).json(newProject);
  } catch (error) {
    console.error('❌ Error creating project:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errorDetails = Object.values(error.errors).map(err => err.message);
      console.error('Validation errors:', errorDetails);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errorDetails
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create project', 
      message: error.message 
    });
  }
};

/**
 * UPDATE PROJECT
 * Updates an existing project with new data
 * @param {Object} req - Request with project ID in params and new data in body
 * @param {Object} res - Response object
 */
const updateProject = async (req, res) => {
  try {
    // Check if all workflow steps are completed
    if (req.body.workflowSteps && req.body.workflowSteps.length > 0) {
      const allCompleted = req.body.workflowSteps.every(step => step.completed === true);
      
      // If all steps completed and status is in-progress, on-hold, or pending, auto-change to completed
      if (allCompleted && ['in-progress', 'on-hold', 'pending'].includes(req.body.status)) {
        req.body.status = 'completed';
        console.log('All workflow steps completed - automatically setting status to completed');
      }
    }
    
    // Find and update project in one operation
    // { new: true } returns the updated document
    // { runValidators: true } ensures validation rules are checked on update
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,           // Return the modified document
        runValidators: true  // Run schema validators
      }
    );
    
    // If project not found, return 404
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Send back the updated project
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid project ID format' });
    }
    
    res.status(500).json({ 
      error: 'Failed to update project', 
      message: error.message 
    });
  }
};

/**
 * DELETE PROJECT
 * Removes a project from MongoDB
 * @param {Object} req - Request with project ID in params
 * @param {Object} res - Response object
 */
const deleteProject = async (req, res) => {
  try {
    // Find and delete project
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    
    // Check if project was found and deleted
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Send success message with deleted project data
    res.json({ 
      message: 'Project deleted successfully',
      project: deletedProject
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid project ID format' });
    }
    
    res.status(500).json({ 
      error: 'Failed to delete project', 
      message: error.message 
    });
  }
};

/**
 * GET CONFIGURATION
 * Sends all configuration data to the frontend
 * This includes project statuses, team members, and workflow stages
 * @param {Object} req - Request object (not used)
 * @param {Object} res - Response object
 */
const getConfig = (req, res) => {
  // Send all configuration as JSON
  // No async/await needed since we're just sending constants
  res.json({
    projectStatuses,  // All available project statuses with colors
    teamMembers,      // List of all team members
    workflowStages,   // All workflow stages and their steps
    stageLabels       // User-friendly labels for workflow stages
  });
};

/**
 * ADDITIONAL HELPER ENDPOINTS
 */

/**
 * GET OVERDUE PROJECTS
 * Returns all projects that are past their delivery date
 */
const getOverdueProjects = async (req, res) => {
  try {
    const overdueProjects = await Project.getOverdue();
    res.json(overdueProjects);
  } catch (error) {
    console.error('Error fetching overdue projects:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve overdue projects', 
      message: error.message 
    });
  }
};

/**
 * SEARCH PROJECTS
 * Advanced search functionality
 */
const searchProjects = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const results = await Project.searchProjects(q);
    res.json(results);
  } catch (error) {
    console.error('Error searching projects:', error);
    res.status(500).json({ 
      error: 'Failed to search projects', 
      message: error.message 
    });
  }
};

// Export all controller functions so they can be used by routes
module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getConfig,
  getOverdueProjects,
  searchProjects
};

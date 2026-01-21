/**
 * PROJECT ROUTES
 * This file defines all the API endpoints (routes) for project operations
 * Each route is connected to a controller function that handles the logic
 */

const express = require('express');
const router = express.Router();  // Create a router to define routes
const projectController = require('../controllers/projectController');

// ===== PROJECT CRUD ROUTES =====
// These routes handle Create, Read, Update, Delete operations

/**
 * GET /api/projects
 * Get all projects from the database
 * Example: http://localhost:5000/api/projects
 */
router.get('/', projectController.getAllProjects);

/**
 * GET /api/projects/:id
 * Get a single project by its ID
 * :id is a route parameter - a placeholder for the actual project ID
 * Example: http://localhost:5000/api/projects/1234567890
 */
router.get('/:id', projectController.getProjectById);

/**
 * POST /api/projects
 * Create a new project
 * The project data comes in the request body as JSON
 * Example: POST to http://localhost:5000/api/projects with project data
 */
router.post('/', projectController.createProject);

/**
 * PUT /api/projects/:id
 * Update an existing project
 * :id specifies which project to update
 * The updated data comes in the request body as JSON
 * Example: PUT to http://localhost:5000/api/projects/1234567890 with new data
 */
router.put('/:id', projectController.updateProject);

/**
 * DELETE /api/projects/:id
 * Delete a project by its ID
 * Example: DELETE to http://localhost:5000/api/projects/1234567890
 */
router.delete('/:id', projectController.deleteProject);

// ===== CONFIGURATION ROUTE =====
/**
 * GET /api/projects/config/all
 * Get configuration data (project statuses, team members, workflow stages)
 * This provides all the dropdown options and settings for the frontend
 * Example: http://localhost:5000/api/projects/config/all
 */
router.get('/config/all', projectController.getConfig);

// Export the router so it can be used in server.js
module.exports = router;

/**
 * PROJECT SERVICE
 * This file handles all communication with the backend API
 * It acts as a "service layer" between our React components and the server
 * All API calls go through here, making it easy to manage and update
 */

// Get the API URL from environment variable or use localhost as default
// In production, you'd set REACT_APP_API_URL to your actual server URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * The projectService object contains all the functions for interacting with projects
 * Each function returns a Promise (because they're async operations)
 */
export const projectService = {
  /**
   * Check server health
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (!response.ok) {
        return { status: 'ERROR', message: 'Server responded with error' };
      }
      return await response.json();
    } catch (error) {
      return { status: 'ERROR', message: 'Server not reachable' };
    }
  },

  /**
   * Get all projects from the backend
   * @returns {Promise<Array>} Array of project objects
   */
  async getAllProjects() {
    // fetch() is the browser's built-in function for making HTTP requests
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  },

  async getProjectById(id) {
    const response = await fetch(`${API_URL}/projects/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    return response.json();
  },

  async createProject(projectData) {
    console.log('📤 Sending project data to backend:', projectData);
    console.log('🌐 API URL:', `${API_URL}/projects`);
    
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    // Log the response for debugging
    console.log('📥 Response status:', response.status, response.statusText);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      // Try to get the error details from the response
      const responseText = await response.text();
      console.error('❌ Backend response body:', responseText);
      
      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ Could not parse error response as JSON');
      }
      
      console.error('❌ Backend error:', errorData);
      
      // Throw a more detailed error
      const errorMessage = errorData.details 
        ? `Validation failed: ${errorData.details.join(', ')}`
        : errorData.error || errorData.message || responseText || 'Failed to create project';
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    console.log('✅ Project created successfully:', result);
    return result;
  },

  /**
   * Update an existing project
   * @param {String} id - The project's MongoDB ObjectId
   * @param {Object} projectData - The updated project data
   * @returns {Promise<Object>} The updated project
   */
  async updateProject(id, projectData) {
    console.log('🔄 Updating project:', id, projectData);
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',                            // HTTP method for updating
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),        // Send updated data as JSON
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Update failed:', response.status, errorData);
      throw new Error(errorData.error || errorData.message || 'Failed to update project');
    }
    
    const result = await response.json();
    console.log('✅ Project updated successfully:', result);
    return result;
  },

  /**
   * Delete a project
   * @param {String} id - The project's MongoDB ObjectId to delete
   * @returns {Promise<Object>} Confirmation message
   */
  async deleteProject(id) {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',                         // HTTP method for deleting
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
    return response.json();
  },

  /**
   * Get configuration data
   * Loads project statuses, team members, and workflow stages
   * @returns {Promise<Object>} Configuration object
   */
  async getConfig() {
    const response = await fetch(`${API_URL}/projects/config/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch configuration');
    }
    return response.json();
  },

  /**
   * Export projects to Excel file
   * Uses the SheetJS library (loaded in index.html via CDN)
   * @param {Array} projects - Array of projects to export
   */
  async exportToExcel(projects) {
    // ===== CHECK LIBRARY AVAILABILITY =====
    // SheetJS is loaded globally in index.html
    const XLSX = window.XLSX;
    if (!XLSX) {
      throw new Error('Excel library not loaded');
    }

    // ===== TRANSFORM DATA FOR EXCEL =====
    // Convert each project into a flat object with columns for Excel
    const excelData = projects.map(project => ({
      "MCP Number": project.projectName,
      "Project Description": project.projectDescription || "",
      "Delivery Date": new Date(project.deliveryDate).toLocaleDateString(),
      "Status": project.status,
      "Responsible Person": project.responsiblePerson || "",
      "Equipment/Method": project.currentStage || "",
    }));

    // ===== CREATE EXCEL WORKBOOK =====
    // Convert JSON data to Excel worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Create new workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects");

    // ===== SET COLUMN WIDTHS =====
    // Make columns readable by setting custom widths
    const colWidths = [
      { wch: 15 }, // MCP Number
      { wch: 30 }, // Project Description
      { wch: 15 }, // Delivery Date
      { wch: 15 }, // Status
      { wch: 20 }, // Responsible Person
      { wch: 25 }, // Equipment/Method
      { wch: 50 }  // Workflow Steps
    ];
    ws['!cols'] = colWidths;

    // ===== GENERATE FILENAME WITH DATE =====
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const time = `${String(today.getHours()).padStart(2, '0')}-${String(today.getMinutes()).padStart(2, '0')}-${String(today.getSeconds()).padStart(2, '0')}`;
    const filename = `Project_Tracker_Export_${dateStr}_${time}.xlsx`;

    // ===== TRIGGER DOWNLOAD =====
    // This creates and downloads the Excel file to the user's computer
    XLSX.writeFile(wb, filename);
  }
};

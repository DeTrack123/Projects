/**
 * MAIN APPLICATION COMPONENT
 * This is the root component that manages the entire application state
 * and coordinates all child components
 */

import React, { useState, useEffect } from 'react';
import './App.css';

// Import all child components
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import EditModal from './components/EditModal';
import Header from './components/Header';

// Import service to communicate with backend API
import { projectService } from './services/projectService';

function App() {
  // ===== STATE MANAGEMENT =====
  // React uses "state" to store data that can change over time
  // When state changes, React automatically re-renders the component
  
  // Store all projects from the database
  const [projects, setProjects] = useState([]);
  
  // Controls whether the "New Project" form is visible
  const [showForm, setShowForm] = useState(false);
  
  // Stores the project being edited (null if no project is being edited)
  const [editingProject, setEditingProject] = useState(null);
  
  // Stores configuration data (statuses, team members, workflows)
  const [config, setConfig] = useState(null);
  
  // Tracks if data is currently loading from the server
  const [loading, setLoading] = useState(true);
  
  // State to track server health status
  const [serverStatus, setServerStatus] = useState({ status: 'OK', lastCheck: null });

  // ===== HEALTH CHECK MONITORING =====
  // Check server health every hour
  useEffect(() => {
    const checkServerHealth = async () => {
      const health = await projectService.checkHealth();
      const now = new Date().toLocaleTimeString();
      
      if (health.status === 'ERROR') {
        console.error('⚠️ Server health check failed at', now, ':', health.message);
        setServerStatus({ status: 'ERROR', lastCheck: now, message: health.message });
        
        // Show alert only on first failure
        if (serverStatus.status !== 'ERROR') {
          alert('⚠️ Backend server is not responding! Please check if the server is running.');
        }
      } else {
        console.log('✅ Server health check passed at', now);
        setServerStatus({ status: 'OK', lastCheck: now });
      }
    };
    
    // Check immediately on mount
    checkServerHealth();
    
    // Then check every hour (3600000 ms)
    const healthCheckInterval = setInterval(checkServerHealth, 3600000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(healthCheckInterval);
  }, [serverStatus.status]); // Re-run when status changes

  // ===== INITIAL DATA LOADING =====
  // useEffect runs when the component first loads
  // The empty array [] means it only runs once on mount
  useEffect(() => {
    loadProjects();  // Load all projects from backend
    loadConfig();    // Load configuration data
  }, []);

  /**
   * Load all projects from the backend API
   */
  const loadProjects = async () => {
    try {
      setLoading(true);  // Show loading indicator
      
      // Call the API to get projects
      const data = await projectService.getAllProjects();
      
      // Update state with the received projects
      setProjects(data);
    } catch (error) {
      // If something goes wrong, log it and show an alert
      console.error('Failed to load projects:', error);
      alert('Failed to load projects. Please try again.');
    } finally {
      // Always stop loading, whether successful or not
      setLoading(false);
    }
  };

  /**
   * Load configuration data (statuses, team members, workflows)
   */
  const loadConfig = async () => {
    try {
      const configData = await projectService.getConfig();
      setConfig(configData);
    } catch (error) {
      console.error('Failed to load configuration:', error);
    }
  };

  /**
   * Handle creating a new project
   * @param {Object} projectData - The project data from the form
   */
  const handleCreateProject = async (projectData) => {
    try {
      // Send the new project to the backend
      await projectService.createProject(projectData);
      
      // Reload projects to show the new one
      await loadProjects();
      
      // Hide the form
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  /**
   * Handle updating an existing project
   * @param {number} id - The project ID
   * @param {Object} projectData - The updated project data
   */
  const handleUpdateProject = async (id, projectData) => {
    try {
      console.log('📝 Updating project ID:', id, 'with data:', projectData);
      // Send the updated data to the backend
      await projectService.updateProject(id, projectData);
      
      // Reload projects to show the changes
      await loadProjects();
      
      // Close the edit modal
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to update project:', error);
      alert(`Failed to update project: ${error.message}`);
    }
  };

  /**
   * Handle deleting a project
   * @param {number} id - The project ID to delete
   */
  const handleDeleteProject = async (id) => {
    // Ask for confirmation before deleting
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // Send delete request to backend
        await projectService.deleteProject(id);
        
        // Reload projects to remove the deleted one from view
        await loadProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  /**
   * Handle exporting all projects to Excel
   */
  const handleExportExcel = async () => {
    if (window.confirm('Are you sure you want to export all projects to Excel?')) {
      try {
        // Call the export function from projectService
        await projectService.exportToExcel(projects);
        alert('Projects exported successfully!');
      } catch (error) {
        console.error('Failed to export projects:', error);
        alert('Failed to export projects. Please try again.');
      }
    }
  };

  // ===== RENDER UI =====
  // This is what gets displayed on the screen
  return (
    <div className="App">

      <div className="container">
        {/* Header with title, action buttons, and server status */}
        <Header 
          onNewProject={() => setShowForm(true)}  // Show form when "New Project" clicked
          onExportExcel={handleExportExcel}       // Export when button clicked
          serverStatus={serverStatus}             // Pass server health status
        />

        {/* Show the project form if showForm is true AND config is loaded */}
        {showForm && config && (
          <ProjectForm
            config={config}
            onSave={handleCreateProject}      // Called when user saves the form
            onCancel={() => setShowForm(false)}  // Hide form when user cancels
          />
        )}

        {/* Show loading message or the project list */}
        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : (
          <ProjectList
            projects={projects}
            config={config}
            onEdit={setEditingProject}      // When edit clicked, store project in state
            onDelete={handleDeleteProject}  // When delete clicked, call delete handler
          />
        )}

        {/* Show edit modal if a project is being edited AND config is loaded */}
        {editingProject && config && (
          <EditModal
            project={editingProject}
            config={config}
            onSave={(data) => handleUpdateProject(editingProject._id, data)}
            onClose={() => setEditingProject(null)}  // Close modal
          />
        )}
      </div>
    </div>
  );
}

export default App;

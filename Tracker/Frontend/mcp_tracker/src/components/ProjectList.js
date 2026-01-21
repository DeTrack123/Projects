/**
 * PROJECT LIST COMPONENT
 * Displays all projects or a message if there are no projects
 * 
 * @param {Array} projects - Array of project objects to display
 * @param {Object} config - Configuration data (statuses, team members, etc.)
 * @param {Function} onEdit - Called when user clicks edit on a project
 * @param {Function} onDelete - Called when user clicks delete on a project
 */

import React from 'react';
import ProjectCard from './ProjectCard';

function ProjectList({ projects, config, onEdit, onDelete }) {
  // If there are no projects, show a helpful message
  if (!projects || projects.length === 0) {
    return (
      <div id="projectsContainer">
        <p>No projects yet. Click "New Project" to get started.</p>
      </div>
    );
  }

  // If there are projects, display them
  return (
    <div id="projectsContainer">
      {/* Loop through each project and create a ProjectCard for it */}
      {/* map() creates a new array by transforming each item */}
      {/* key helps React track which cards have changed */}
      {projects.map((project) => (
        <ProjectCard
          key={project._id || project.id}  // Use MongoDB _id or fallback to id
          project={project}      // Pass the project data
          config={config}        // Pass configuration
          onEdit={onEdit}        // Pass edit handler
          onDelete={onDelete}    // Pass delete handler
        />
      ))}
    </div>
  );
}

export default ProjectList;

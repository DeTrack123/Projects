/**
 * PROJECT FORM COMPONENT
 * Form for creating a new project
 * Collects all project information including workflow steps
 * 
 * @param {Object} config - Configuration data (statuses, team members, workflow stages)
 * @param {Function} onSave - Called when user submits the form (receives project data)
 * @param {Function} onCancel - Called when user clicks cancel
 */

import React, { useState } from 'react';
import WorkflowUI from './WorkflowUI';

function ProjectForm({ config, onSave, onCancel }) {
  // ===== STATE MANAGEMENT =====
  // Initialize form with empty values for a new project
  const [formData, setFormData] = useState({
    projectName: '',              // MCP Number
    projectDescription: '',       // Project description
    clientName: '',              // Client contact name
    clientEmail: '',             // Client email address
    deliveryDate: '',            // Expected delivery date
    status: 'not-started',       // Initial status
    responsiblePerson: '',       // Project manager
    notes: '',                   // Additional notes
    currentStage: ''             // Equipment/workflow stage
  });

  // Workflow steps are managed separately (array of step objects)
  const [workflowSteps, setWorkflowSteps] = useState([]);

  /**
   * Handle input changes
   * Called whenever user types in any form field
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update only the changed field while preserving all others
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle form submission
   * Validates and saves the new project
   * @param {Event} e - The form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();  // Don't reload the page
    
    // ===== VALIDATION =====
    // Ensure all required fields are filled
    if (!formData.projectName || !formData.clientName || !formData.clientEmail || !formData.deliveryDate) {
      alert('Please fill in all required fields.');
      return;
    }

    // Combine all form data into a single project object
    const projectData = {
      ...formData,        // All form fields
      workflowSteps       // Workflow steps from WorkflowUI
    };

    // Send the new project to parent component (App.js)
    onSave(projectData);
  };

  return (
    <section id="projectFormSection">
      <h2>New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectName">MCP Number *</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            placeholder="MCP251****"
            value={formData.projectName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectDescription">Project Description *</label>
          <input
            type="text"
            id="projectDescription"
            name="projectDescription"
            placeholder="Description of the project"
            value={formData.projectDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="clientName">Client Name *</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            placeholder="Contact Name"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="clientEmail">Client Email *</label>
          <input
            type="email"
            id="clientEmail"
            name="clientEmail"
            placeholder="client@megchem.com"
            value={formData.clientEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deliveryDate">Expected Delivery Date *</label>
          <input
            type="date"
            id="deliveryDate"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Project Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="not-started">Not Started</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="responsiblePerson">Responsible Person</label>
          <select
            id="responsiblePerson"
            name="responsiblePerson"
            value={formData.responsiblePerson}
            onChange={handleChange}
          >
            <option value="">Select Person</option>
            {config.teamMembers.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="currentStage">Equipment/Method</label>
          <select
            id="currentStage"
            name="currentStage"
            value={formData.currentStage}
            onChange={handleChange}
          >
            <option value="">--- Please select ---</option>
            {Object.keys(config.workflowStages).map(stage => (
              <option key={stage} value={stage}>
                {config.stageLabels[stage] || stage}
              </option>
            ))}
          </select>
        </div>

        <WorkflowUI
          currentStage={formData.currentStage}
          config={config}
          workflowSteps={workflowSteps}
          setWorkflowSteps={setWorkflowSteps}
        />

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="4"
            placeholder="Additional notes..."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Project
          </button>
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProjectForm;

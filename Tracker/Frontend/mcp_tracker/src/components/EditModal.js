/**
 * EDIT MODAL COMPONENT
 * A modal dialog for editing existing projects
 * This component pre-fills the form with the project's current data
 * 
 * @param {Object} project - The project to edit (contains all current data)
 * @param {Object} config - Configuration data (statuses, team members, workflows)
 * @param {Function} onSave - Called when user saves changes (receives updated project data)
 * @param {Function} onClose - Called when user closes the modal without saving
 */

import React, { useState, useEffect } from 'react';
import WorkflowUI from './WorkflowUI';

function EditModal({ project, config, onSave, onClose }) {
  // Helper function to convert ISO date to yyyy-MM-dd format
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
  };

  // ===== STATE MANAGEMENT =====
  // Pre-fill the form with existing project data
  // The || '' syntax provides default empty strings if values don't exist
  const [formData, setFormData] = useState({
    projectName: project.projectName || '',
    projectDescription: project.projectDescription || '',
    clientName: project.clientName || '',
    clientEmail: project.clientEmail || '',
    deliveryDate: formatDateForInput(project.deliveryDate),
    status: project.status || 'not-started',
    responsiblePerson: project.responsiblePerson || '',
    notes: project.notes || '',
    currentStage: project.currentStage || ''
  });

  // Store workflow steps separately (they have their own update logic)
  // Format dates in workflow steps
  const [workflowSteps, setWorkflowSteps] = useState(
    (project.workflowSteps || []).map(step => ({
      ...step,
      dueDate: formatDateForInput(step.dueDate)
    }))
  );

  /**
   * Handle input field changes
   * Updates the formData state when user types in any field
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    // Destructure to get the field name and its new value
    const { name, value } = e.target;
    
    // Update state: keep all previous data, only update the changed field
    setFormData(prev => ({
      ...prev,           // Spread: keep all existing fields
      [name]: value      // Update only the field that changed
    }));
  };

  /**
   * Handle form submission
   * Validates required fields and calls the onSave callback
   * @param {Event} e - The form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent page reload (default form behavior)
    
    // ===== VALIDATION =====
    // Check that all required fields are filled
    if (!formData.projectName || !formData.clientName || !formData.clientEmail || !formData.deliveryDate) {
      alert('Please fill in all required fields.');
      return;  // Stop here if validation fails
    }

    // ===== AUTO-COMPLETE STATUS =====
    // Check if all workflow steps are marked as completed
    let finalStatus = formData.status;
    if (workflowSteps.length > 0) {
      const allCompleted = workflowSteps.every(step => step.completed === true);
      
      // If all steps done and status is in-progress/on-hold/pending, auto-set to completed
      if (allCompleted && ['in-progress', 'on-hold', 'pending'].includes(formData.status)) {
        finalStatus = 'completed';
      }
    }

    // Combine form data with workflow steps
    const projectData = {
      ...formData,      // All the form fields
      status: finalStatus,  // Use the auto-updated status
      workflowSteps     // The workflow steps array
    };

    // Call parent component's save function with updated data
    onSave(projectData);
  };

  // ===== RENDER THE MODAL =====
  return (
    // Modal overlay - clicking it closes the modal
    <div className="modal" onClick={onClose}>
      {/* Modal content box - prevent clicks from bubbling to overlay */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Project</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="editProjectName">MCP Number *</label>
            <input
              type="text"
              id="editProjectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editProjectDescription">Project Description *</label>
            <input
              type="text"
              id="editProjectDescription"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editClientName">Client Name *</label>
            <input
              type="text"
              id="editClientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editClientEmail">Client Email *</label>
            <input
              type="email"
              id="editClientEmail"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editDeliveryDate">Expected Delivery Date *</label>
            <input
              type="date"
              id="editDeliveryDate"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editStatus">Project Status</label>
            <select
              id="editStatus"
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
            <label htmlFor="editResponsiblePerson">Responsible Person</label>
            <select
              id="editResponsiblePerson"
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
            <label htmlFor="editCurrentStage">Equipment/Method</label>
            <select
              id="editCurrentStage"
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
            <label htmlFor="editNotes">Notes</label>
            <textarea
              id="editNotes"
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;

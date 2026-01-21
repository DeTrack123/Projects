/**
 * WORKFLOW UI COMPONENT
 * Manages the workflow steps selection and configuration
 * Displays checkboxes for each workflow step and collects step details
 * 
 * @param {String} currentStage - The selected equipment/workflow stage (e.g., 'equipment1')
 * @param {Object} config - Configuration with workflow stages and their steps
 * @param {Array} workflowSteps - Current workflow steps data
 * @param {Function} setWorkflowSteps - Function to update workflow steps
 */

import React, { useState, useEffect } from 'react';

function WorkflowUI({ currentStage, config, workflowSteps, setWorkflowSteps }) {
  // Track which steps are selected (checked)
  // Object format: { stepIndex: true/false }
  const [selectedSteps, setSelectedSteps] = useState({});

  // Get the list of workflow steps for the selected stage
  // If no stage selected, stages will be an empty array
  const stages = config.workflowStages[currentStage] || [];

  /**
   * Initialize workflow steps when component loads or when workflowSteps changes
   * This sets up the checkboxes based on existing workflow data
   */
  useEffect(() => {
    if (workflowSteps && workflowSteps.length > 0 && stages.length > 0) {
      // Build selectedSteps object from existing workflowSteps
      const initialSelected = {};
      stages.forEach((stage, index) => {
        // Check if this stage exists in workflowSteps
        const exists = workflowSteps.some(ws => ws.step === stage);
        if (exists) {
          initialSelected[index] = true;
        }
      });
      setSelectedSteps(initialSelected);
    }
  }, [currentStage]); // Only run when currentStage changes or component mounts

  /**
   * Reset workflow when the stage changes to a new stage
   * This useEffect runs whenever currentStage changes
   */
  useEffect(() => {
    // Only clear if there are no existing workflow steps
    // This allows editing existing projects without losing data
    if (workflowSteps.length === 0) {
      setSelectedSteps({});      // Uncheck all checkboxes
    }
  }, [currentStage]);  // Dependencies: re-run when these change

  /**
   * Handle checkbox selection/deselection
   * When user checks/unchecks a step, add or remove it from workflow
   * @param {String} step - The step name
   * @param {Number} index - The step's index in the stages array
   */
  const handleCheckboxChange = (step, index) => {
    // Toggle the checkbox state
    const isChecked = !selectedSteps[index];
    
    // Update the selected steps tracking object
    setSelectedSteps(prev => ({
      ...prev,
      [index]: isChecked
    }));

    if (!isChecked) {
      // User unchecked the box - remove this step from workflow
      setWorkflowSteps(prev => prev.filter(s => s.step !== step));
    } else {
      // User checked the box - add this step to workflow with default values
      setWorkflowSteps(prev => [...prev, {
        step,                    // The step name
        responsiblePerson: '',   // Who's responsible (empty initially)
        dueDate: '',            // When it's due (empty initially)
        completed: false        // Not completed yet
      }]);
    }
  };

  /**
   * Update the responsible person for a workflow step
   * @param {String} step - The step name to update
   * @param {String} value - The selected person's name
   */
  const handlePersonChange = (step, value) => {
    // Map through all steps and update only the matching one
    setWorkflowSteps(prev => prev.map(s => 
      s.step === step ? { ...s, responsiblePerson: value } : s
    ));
  };

  /**
   * Update the due date for a workflow step
   * @param {String} step - The step name to update
   * @param {String} value - The selected date
   */
  const handleDateChange = (step, value) => {
    // Map through all steps and update only the matching one
    setWorkflowSteps(prev => prev.map(s => 
      s.step === step ? { ...s, dueDate: value } : s
    ));
  };

  /**
   * Toggle the completion status of a workflow step
   * @param {String} step - The step name to update
   */
  const handleCompleteToggle = (step) => {
    setWorkflowSteps(prev => prev.map(s => {
      if (s.step === step) {
        const isNowCompleted = !s.completed;
        return {
          ...s,
          completed: isNowCompleted,
          completedDate: isNowCompleted ? new Date().toISOString() : null,
          completedBy: isNowCompleted ? s.responsiblePerson : ''
        };
      }
      return s;
    }));
  };

  // ===== CONDITIONAL RENDERING =====
  // Don't show anything if no stage is selected or stage has no steps
  if (!currentStage || stages.length === 0) {
    return null;  // Return nothing (component won't render)
  }

  // ===== RENDER WORKFLOW STEPS =====
  return (
    <div id="workflowStepsContainer" style={{ marginTop: '20px' }}>
      <h3>Workflow Steps</h3>
      <div id="workflowSteps">
        {/* Loop through each step in the selected stage */}
        {stages.map((step, index) => {
          const stepData = workflowSteps.find(s => s.step === step);
          const isSelected = selectedSteps[index] || false;
          const isCompleted = stepData?.completed || false;
          
          return (
            <div 
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 0.8fr',
                gap: '10px',
                marginBottom: '1px',
                padding: '10px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                backgroundColor: isCompleted ? '#f0fdf4' : '#f8fafc',
                alignItems: 'center'
              }}
            >
              {/* Step name with selection checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCheckboxChange(step, index)}
                  style={{ width: 'auto', marginRight: '8px' }}
                />
                {step}
                {isCompleted && <span style={{ marginLeft: '8px', color: '#10b981', fontSize: '0.9rem' }}> Complete</span>}
              </label>

              {/* Responsible person dropdown */}
              <select
                value={stepData?.responsiblePerson || ''}
                onChange={(e) => handlePersonChange(step, e.target.value)}
                disabled={!isSelected}
                style={{
                  padding: '6px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  backgroundColor: isSelected ? 'white' : '#f1f5f9',
                  opacity: isSelected ? 1 : 0.6
                }}
              >
                <option value="">Select Person</option>
                {config.teamMembers.map(person => (
                  <option key={person} value={person}>{person}</option>
                ))}
              </select>

              {/* Due date input */}
              <input
                type="date"
                value={stepData?.dueDate || ''}
                onChange={(e) => handleDateChange(step, e.target.value)}
                disabled={!isSelected}
                style={{
                  padding: '6px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  backgroundColor: isSelected ? 'white' : '#f1f5f9',
                  opacity: isSelected ? 1 : 0.6
                }}
              />

              {/* Completion checkbox */}
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '5px',
                fontSize: '0.9rem',
                opacity: isSelected ? 1 : 0.3,
                pointerEvents: isSelected ? 'auto' : 'none'
              }}>
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => handleCompleteToggle(step)}
                  disabled={!isSelected}
                  style={{ width: 'auto' }}
                />
                Done
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WorkflowUI;

/**
 * EMAIL GENERATOR UTILITY
 * Creates formatted HTML email for project updates
 * This HTML can be copied to clipboard and pasted into an email client
 * 
 * @param {Object} project - The project data to include in the email
 * @param {Object} config - Configuration for labels and formatting
 * @returns {String} Formatted HTML email content ready to send
 */

export const generateProjectEmail = (project, config) => {
  // ===== STATUS LABELS =====
  // Map internal status codes to user-friendly labels
  const statusLabels = {
    'not-started': 'Not Started',
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'on-hold': 'On Hold',
    'completed': 'Completed',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'emergency': 'Emergency'
  };

  /**
   * Get status color based on completion and due date
   * @param {Object} step - Workflow step object
   * @returns {Object} Object with background color and text color
   */
  const getStatusColor = (step) => {
    const today = new Date();
    const dueDate = step.dueDate ? new Date(step.dueDate) : null;
    
    // Reset time to midnight for accurate date comparison
    today.setHours(0, 0, 0, 0);
    if (dueDate) {
      dueDate.setHours(0, 0, 0, 0);
    }

    // Completed - Green
    if (step.completed) {
      return {
        bg: '#d1fae5',      // Light green
        text: '#065f46',    // Dark green
        status: 'Completed'
      };
    }
    
    // Overdue - Red
    if (dueDate && dueDate < today) {
      return {
        bg: '#fee2e2',      // Light red
        text: '#991b1b',    // Dark red
        status: 'Overdue'
      };
    }
    
    // Due Today - Yellow
    if (dueDate && dueDate.getTime() === today.getTime()) {
      return {
        bg: '#fef3c7',      // Light yellow
        text: '#92400e',    // Dark brown
        status: 'Due Today'
      };
    }
    
    // In Progress - Yellow/Orange
    return {
      bg: '#f3dc82ff',        // Light yellow
      text: '#92400e',      // Dark brown
      status: 'In Progress'
    };
  };

  // Simple ISO date -> yyyy-mm-dd formatter for emails
  const fmtDate = (iso) => {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    if (isNaN(d)) return 'N/A';
    return d.toISOString().split('T')[0];
  };

  // Format due date with color based on status
  const formatDueDateWithColor = (step) => {
    if (!step.dueDate) {
      return '<em style="color: #9ca3af;">Not set</em>';
    }
    
    const today = new Date();
    const dueDate = new Date(step.dueDate);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const dateStr = fmtDate(step.dueDate);
    
    // If completed, show normal (no color)
    if (step.completed) {
      return dateStr;
    }
    
    // If overdue, show red
    if (dueDate < today) {
      return `<span style="background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-weight: 600; display: inline-block;">${dateStr}</span>`;
    }
    
    // If due today, show yellow
    if (dueDate.getTime() === today.getTime()) {
      return `<span style="background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-weight: 600; display: inline-block;">${dateStr}</span>`;
    }
    
    // Future date - normal
    return dateStr;
  };

  // Get delivery date styling based on comparison with today
  const getDeliveryDateHTML = () => {
    const today = new Date();
    const deliveryDate = new Date(project.deliveryDate);
    
    today.setHours(0, 0, 0, 0);
    deliveryDate.setHours(0, 0, 0, 0);
    
    const formattedDate = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    if (deliveryDate.getTime() === today.getTime()) {
      // Due Today - Yellow
      return `<span style="background-color: #fef3c7; color: #92400e; padding: 6px 12px; border-radius: 4px; font-weight: bold; display: inline-block;">${formattedDate}</span>`;
    } else if (deliveryDate < today) {
      // Overdue - Red
      return `<span style="background-color: #fee2e2; color: #991b1b; padding: 6px 12px; border-radius: 4px; font-weight: bold; display: inline-block;">${formattedDate}</span>`;
    }
    return formattedDate; // Future date - no special styling
  };

  // ===== BUILD HTML EMAIL CONTENT =====
  let emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9fafb; padding: 20px; }
    .section { background-color: white; margin-bottom: 20px; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .section-title { color: #1e40af; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background-color: #2563eb; color: white; padding: 12px; text-align: left; font-weight: 600; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    tr:hover { background-color: #f3f4f6; }
    .status-badge { padding: 6px 12px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 14px; }
    .footer { background-color: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; }
  </style>
</head>
<body>    
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>${project.clientName}</strong>,</p>
      <p style="margin-bottom: 20px;">We are pleased to provide you with an update on your project. Below is the current status and details:</p>      
      <!-- Project Details Section -->
      <div class="section">
        <div class="section-title">PROJECT DETAILS</div>
        <table style="border: none;">
          <tr>
            <td style="border: none; width: 200px; font-weight: 600; color: #4b5563;">MCP Number:</td>
            <td style="border: none;">${project.projectName || 'N/A'}</td>
          </tr>
          <tr>
            <td style="border: none; font-weight: 600; color: #4b5563;">Description:</td>
            <td style="border: none;">${project.projectDescription || 'N/A'}</td>
          </tr>
          <tr>
            <td style="border: none; font-weight: 600; color: #4b5563;">Delivery date:</td>
            <td style="border: none;">${getDeliveryDateHTML()}</td>
          </tr>
          ${project.notes ? `
          <tr>
            <td style="border: none; font-weight: 600; color: #4b5563; vertical-align: top;">Notes:</td>
            <td style="border: none;">${project.notes}</td>
          </tr>
          ` : ''}
        </table>
      </div>`;
  // ===== WORKFLOW STEPS TABLE =====
  // Only include this section if there are workflow steps
  if (project.workflowSteps && project.workflowSteps.length > 0) {
    emailContent += `
      <!-- Project Activities & Timeline Section -->
      <div class="section">
        <div class="section-title">PROJECT ACTIVITIES & TIMELINE</div>
        <table>
          <thead>
            <tr>
              <th style="width: 40px;"></th>
              <th>Activity</th>
              <th>Responsible Person</th>
              <th>Due Date</th>
              <th style="text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>`;    
    // Loop through each workflow step and add table row
    project.workflowSteps.forEach((step, index) => {
      const colors = getStatusColor(step);
      
      emailContent += `
            <tr>
              <td style="font-weight: 600; color: #6b7280;">${index + 1}</td>
              <td style="font-weight: 500;">${step.step}</td>
              <td>${step.responsiblePerson || '<em style="color: #9ca3af;">Not assigned</em>'}</td>
              <td>${step.dueDate ? fmtDate(step.dueDate) : '<em style="color: #9ca3af;">Not set</em>'}</td>
              <td style="text-align: center;">
                <span class="status-badge" style="background-color: ${colors.bg}; color: ${colors.text};">
                  ${colors.status}
                </span>
              </td>
            </tr>`;
    });
    
    emailContent += `
          </tbody>
        </table>
      </div>`;
  }

  // ===== CLOSING =====
  emailContent += `
      <p style="margin-top: 30px; font-size: 15px;">If you have any questions or require additional information, please do not hesitate to contact us.</p>
    </div>
    
  </div>
</body>
</html>`;

  return emailContent;
};

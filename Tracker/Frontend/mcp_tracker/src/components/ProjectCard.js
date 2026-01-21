/**
 * PROJECT CARD COMPONENT
 * Displays a single project with all its details
 * This component handles displaying project info, workflow steps, and action buttons
 *
 * @param {Object} project - The project data to display
 * @param {Object} config - Configuration data (statuses, team members, workflow labels)
 * @param {Function} onEdit - Called when user clicks edit button
 * @param {Function} onDelete - Called when user clicks delete button
 */

import React from "react";
import { generateProjectEmail } from "../utils/emailGenerator";

// Format ISO date (or Date string) to yyyy-mm-dd
const formatISOToYYYYMMDD = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

function ProjectCard({ project, config, onEdit, onDelete }) {
  // Don't render anything if config hasn't loaded yet
  if (!config) return null;

  // Get the color styling for this project's status
  // If status not found in config, use a default blue color
  const statusColor = config.projectStatuses[project.status] || {
    bg: "#e0f2fe",
    color: "#0369a1",
  };

  // ===== CHECK IF DELIVERY DATE IS OVERDUE OR DUE TODAY =====
  // Create Date objects for comparison
  const deliveryDate = new Date(project.deliveryDate);
  const today = new Date();

  // Reset time to midnight so we only compare dates, not times
  today.setHours(0, 0, 0, 0);
  deliveryDate.setHours(0, 0, 0, 0);

  // Determine date styling based on comparison
  let dateStyle = {};
  if (deliveryDate < today) {
    // Overdue - Red
    dateStyle = {
      backgroundColor: "#fee2e2", // Light red background
      color: "#991b1b", // Dark red text
      padding: "4px 8px",
      borderRadius: "4px",
      fontWeight: "bold",
    };
  } else if (deliveryDate.getTime() === today.getTime()) {
    // Due Today - Yellow
    dateStyle = {
      backgroundColor: "#fef3c7", // Light yellow background
      color: "#92400e", // Dark brown text
      padding: "4px 8px",
      borderRadius: "4px",
      fontWeight: "bold",
    };
  }

  /**
   * Handle the Email button click
   * Generates email HTML and opens it in a new window for copying
   */
  const handleEmail = () => {
    // Generate formatted HTML email
    const emailContent = generateProjectEmail(project, config);

    // Open in new window for preview
    const emailWindow = window.open("", "_blank", "width=900,height=700");
    if (emailWindow) {
      emailWindow.document.write(emailContent);
      emailWindow.document.close();

      // Wait for DOM to be ready, then add copy functionality
      setTimeout(() => {
        const copyPanel = emailWindow.document.createElement("div");
        copyPanel.innerHTML = `
          <div style="position: fixed; top: 10px; right: 10px; z-index: 10000; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); width: 280px;">
            <button id="_copyBtn" style="
              background-color: #2563eb; color: white; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1); width: 100%; margin-bottom: 8px;">
              📋 Copy Email Content
            </button>
          </div>
        `;
        emailWindow.document.body.appendChild(copyPanel);

        // Attach click handler
        const copyBtn = emailWindow.document.getElementById("_copyBtn");
        const copyMsg = emailWindow.document.getElementById("_copyMsg");

        copyBtn.onclick = async function () {
          console.log("Copy button clicked!");
          const container =
            emailWindow.document.querySelector(".content") ||
            emailWindow.document.body;

          if (!container) {
            copyMsg.innerText = "❌ Unable to find email content";
            copyMsg.style.color = "#dc2626";
            console.error("Container not found");
            return;
          }

          console.log("Container found:", container.className);

          // Method 1: Try modern Clipboard API with HTML
          try {
            if (navigator.clipboard && window.ClipboardItem) {
              console.log("Trying Clipboard API with HTML...");
              const htmlContent = container.innerHTML;
              const textContent = container.innerText;

              const htmlBlob = new Blob([htmlContent], { type: "text/html" });
              const textBlob = new Blob([textContent], { type: "text/plain" });

              const clipboardItem = new ClipboardItem({
                "text/html": htmlBlob,
                "text/plain": textBlob,
              });

              await navigator.clipboard.write([clipboardItem]);

              copyBtn.innerText = "✅ Copied with Formatting!";
              copyBtn.style.backgroundColor = "#10b981";
              copyMsg.innerText =
                "Paste into your email now - colors preserved!";
              copyMsg.style.color = "#10b981";
              console.log(
                "✅ Copy successful via Clipboard API (HTML preserved)",
              );

              setTimeout(() => {
                copyBtn.innerText = "📋 Copy Email Content";
                copyBtn.style.backgroundColor = "#2563eb";
                copyMsg.innerText =
                  "Click button to copy, then paste into your email client";
                copyMsg.style.color = "#64748b";
              }, 3000);
              return;
            }
          } catch (err) {
            console.warn("Clipboard API failed:", err);
          }

          // Method 2: Fallback to execCommand (still preserves some formatting)
          try {
            console.log("Trying execCommand...");
            const range = emailWindow.document.createRange();
            range.selectNodeContents(container);
            const sel = emailWindow.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

            const success = emailWindow.document.execCommand("copy");
            sel.removeAllRanges();

            if (success) {
              copyBtn.innerText = "✅ Copied!";
              copyBtn.style.backgroundColor = "#10b981";
              copyMsg.innerText =
                "Paste into your email - formatting should be preserved";
              copyMsg.style.color = "#10b981";
              console.log("✅ Copy successful via execCommand");

              setTimeout(() => {
                copyBtn.innerText = "📋 Copy Email Content";
                copyBtn.style.backgroundColor = "#2563eb";
                copyMsg.innerText =
                  "Click button to copy, then paste into your email client";
                copyMsg.style.color = "#64748b";
              }, 3000);
              return;
            }
          } catch (err) {
            console.warn("execCommand failed:", err);
          }

          // Method 3: Manual instructions
          copyBtn.innerText = "⚠️ Select & Copy Manually";
          copyBtn.style.backgroundColor = "#f59e0b";
          copyMsg.innerText =
            "Select all content below, press Ctrl+C, then paste into your email";
          copyMsg.style.color = "#f59e0b";
        };
      }, 100);
    } else {
      alert("Please allow pop-ups to view the email preview");
    }
  };

  return (
    <div className="project-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0 }}>
          <strong>{project.projectName}</strong>
        </h3>
        <span
          style={{
            padding: "4px 10px",
            backgroundColor: statusColor.bg,
            color: statusColor.color,
            borderRadius: "4px",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          {project.status}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          marginBottom: "-9px",
        }}
      >
        <p>
          <strong>Project Description:</strong>{" "}
          {project.projectDescription || ""}
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          marginBottom: "1px",
        }}
      >
        <div>
          <p>
            <strong>Delivery Date:</strong>{" "}
            <span style={dateStyle}>
              {formatISOToYYYYMMDD(project.deliveryDate)}
            </span>
          </p>
          <p>
            <strong>Current Stage:</strong>{" "}
            {config.stageLabels[project.currentStage] || project.currentStage}
          </p>
        </div>
        <div>
          <p>
            <strong>Client:</strong> {project.clientName || ""}
          </p>
          <p>
            <strong>Responsible Person:</strong>{" "}
            {project.responsiblePerson || ""}
          </p>
        </div>
      </div>

      {project.workflowSteps && project.workflowSteps.length > 0 && (
        <div
          style={{
            backgroundColor: "#f0f7ffff",
            borderRadius: "6px",
            borderLeft: "3px solid #2563eb",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {project.workflowSteps.map((step, index) => {
              let activityDateStyle = {};
              if (step.dueDate) {
                if (step.completed) {
                  activityDateStyle = {
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  };
                } else {
                  const activityDueDate = new Date(step.dueDate);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  activityDueDate.setHours(0, 0, 0, 0);
                  const isActivityDue = activityDueDate <= today;
                  if (isActivityDue) {
                    activityDateStyle = {
                      backgroundColor: "#fee2e2",
                      color: "#991b1b",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                    };
                  }
                }
              }

              return (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.5fr 1fr",
                    gap: "8px",
                    fontSize: "0.7rem",
                    padding: "3px",
                    backgroundColor: "white",
                    borderRadius: "4px",
                  }}
                >
                  <div style={{ color: "#1e293b", fontWeight: 500 }}>
                    • {step.step}
                  </div>
                  <div style={{ color: "#64748b" }}>
                    {step.responsiblePerson || "Not assigned"}
                  </div>
                  <div style={{ color: "#64748b" }}>
                    {step.dueDate ? (
                      <span style={activityDateStyle}>
                        {formatISOToYYYYMMDD(step.dueDate)}
                      </span>
                    ) : (
                      "No date"
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {project.notes && (
        <div style={{ fontSize: "0.8rem" }}>
          <p>Note: {project.notes}</p>
        </div>
      )}

      <div className="actions">
        <button className="edit-btn" onClick={() => onEdit(project)}>
          Edit
        </button>
        <button className="email-btn" onClick={handleEmail}>
          Email
        </button>
        <button className="delete-btn" onClick={() => onDelete(project.id)}>
          Delete
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
            marginLeft: "420px",
          }}
        >
          <img
            src="/megchem_logo2.jpg"
            alt="Megchem Logo"
            style={{ maxWidth: "100px" }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;

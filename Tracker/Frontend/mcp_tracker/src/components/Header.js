/**
 * HEADER COMPONENT
 * Displays the application title, action buttons, and server status
 * This is a simple "presentational" component - it just displays what it's given
 * 
 * @param {Function} onNewProject - Called when "New Project" button is clicked
 * @param {Function} onExportExcel - Called when "Export to Excel" button is clicked
 * @param {Object} serverStatus - Server health status object
 */

import React from 'react';

function Header({ onNewProject, onExportExcel, serverStatus }) {
  return (
    <header>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Project Tracker</h1>
          <p style={{ margin: '5px 0' }}>Manage and communicate project status</p>
        </div>
        
        {/* Server Status Indicator */}
        {serverStatus && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            backgroundColor: serverStatus.status === 'OK' ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${serverStatus.status === 'OK' ? '#10b981' : '#dc2626'}`
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: serverStatus.status === 'OK' ? '#10b981' : '#dc2626',
              animation: serverStatus.status === 'OK' ? 'none' : 'pulse 2s infinite'
            }} />
            <span style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              color: serverStatus.status === 'OK' ? '#065f46' : '#991b1b'
            }}>
              {serverStatus.status === 'OK' ? 'Server Online' : 'Server Offline'}
            </span>
            {serverStatus.lastCheck && (
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                (Last check: {serverStatus.lastCheck})
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Button container with flex layout for spacing */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
        {/* New Project button - triggers onNewProject when clicked */}
        <button onClick={onNewProject} className="btn-primary">
          + New Project
        </button>
        
        {/* Export button - triggers onExportExcel when clicked */}
        <button onClick={onExportExcel} className="btn-success">
          Export to Excel
        </button>
      </div>
    </header>
  );
}

export default Header;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Header from './Header';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <Header />
      <header className="dashboard-header">
        <h1>Cool Tech Credential Management</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.username}!</h2>
          <p className="user-info">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="user-info">
            <strong>Role:</strong> <span className="role-badge">{user?.role}</span>
          </p>
        </div>

        <div className="action-cards">
          <div className="action-card" onClick={() => navigate('/credentials')}>
            <div className="card-icon"><img src="/credentials.png" alt="Credentials" /></div>
            <h3>Credentials</h3>
            <p>View and manage service credentials</p>
            <button className="card-button">Go to Credentials →</button>
          </div>

          {user?.role === 'admin' && (
            <div className="action-card" onClick={() => navigate('/users')}>
              <div className="card-icon"><img src="/User_Management.png" alt="User Management" /></div>
              <h3>User Management</h3>
              <p>Manage users, roles, and assignments</p>
              <button className="card-button">Manage Users →</button>
            </div>
          )}

          <div className="action-card">
            <div className="card-icon"><img src="/Your_Role.png" alt="Your Role" /></div>
            <h3>Your Role</h3>
            <p>
              {user?.role === 'admin' && 'Full access to all credentials and settings'}
              {user?.role === 'management' && 'Can view, add, and update credentials'}
              {user?.role === 'normal' && 'Can view and add credentials'}
            </p>
          </div>
        </div>

        <div className="info-card">
          <h3>Authentication System Active</h3>
          <p>You are successfully logged in to the Cool Tech credential management system.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

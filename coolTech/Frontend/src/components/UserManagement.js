import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, divisionService, authService } from '../services/api';
import { toast } from 'react-toastify';
import Header from './Header';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    // Check if user is admin
    if (currentUser?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }

    fetchUsers();
    fetchDivisions();
  }, [currentUser, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setLoading(false);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await divisionService.getAll();
      setDivisions(response.data || []);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setSelectedDivision(user.division?._id || '');
    setSelectedRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setSelectedDivision('');
    setSelectedRole('');
  };

  const handleAssignDivision = async () => {
    if (!editingUser || !selectedDivision) {
      toast.error('Please select a division');
      return;
    }

    try {
      await userService.assignToDivision(editingUser._id, selectedDivision);
      toast.success('User assigned to division successfully');
      fetchUsers();
      handleCancelEdit();
    } catch (error) {
      console.error('Error assigning division:', error);
      toast.error(error.response?.data?.message || 'Failed to assign division');
    }
  };

  const handleDeassignDivision = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user from their division?')) {
      return;
    }

    try {
      await userService.deassignFromDivision(userId);
      toast.success('User removed from division successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deassigning division:', error);
      toast.error(error.response?.data?.message || 'Failed to remove division');
    }
  };

  const handleChangeRole = async () => {
    if (!editingUser || !selectedRole) {
      toast.error('Please select a role');
      return;
    }

    if (selectedRole === editingUser.role) {
      toast.info('User already has this role');
      return;
    }

    try {
      await userService.changeRole(editingUser._id, selectedRole);
      toast.success(`User role changed to ${selectedRole} successfully`);
      fetchUsers();
      handleCancelEdit();
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error(error.response?.data?.message || 'Failed to change role');
    }
  };

  const handleDeactivateUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to deactivate user "${username}"?`)) {
      return;
    }

    try {
      await userService.deactivate(userId);
      toast.success('User deactivated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error(error.response?.data?.message || 'Failed to deactivate user');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'role-badge role-admin';
      case 'management':
        return 'role-badge role-management';
      default:
        return 'role-badge role-normal';
    }
  };

  if (loading) {
    return (
      <div className="user-management-container">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <Header />
      <div className="user-management-header">
        <div>
          <h2>User Management</h2>
          <p className="subtitle">Manage user roles, divisions, and organizational units</p>
        </div>
        <button 
          className="btn-secondary" 
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {editingUser && (
        <div className="edit-modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Manage User: {editingUser.username}</h3>
            
            <div className="edit-section">
              <h4>Change Role</h4>
              <div className="form-group">
                <label>Select Role:</label>
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="form-select"
                >
                  <option value="normal">Normal</option>
                  <option value="management">Management</option>
                  <option value="admin">Admin</option>
                </select>
                <button 
                  className="btn-primary"
                  onClick={handleChangeRole}
                  disabled={selectedRole === editingUser.role}
                >
                  Update Role
                </button>
              </div>
            </div>

            <div className="edit-section">
              <h4>Assign Division</h4>
              <div className="form-group">
                <label>Select Division:</label>
                <select 
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- Select Division --</option>
                  {divisions.map((division) => (
                    <option key={division._id} value={division._id}>
                      {division.name} ({division.organizationalUnit?.name || 'No OU'})
                    </option>
                  ))}
                </select>
                <button 
                  className="btn-primary"
                  onClick={handleAssignDivision}
                  disabled={!selectedDivision}
                >
                  Assign Division
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCancelEdit}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Division</th>
              <th>Organizational Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <strong>{user.username}</strong>
                  {user._id === currentUser?.id}
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={getRoleBadgeClass(user.role)}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.division ? (
                    <div className="division-cell">
                      <span>{user.division.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted">Not assigned</span>
                  )}
                </td>
                <td>
                  {user.organizationalUnit ? (
                    user.organizationalUnit.name
                  ) : (
                    <span className="text-muted">Not assigned</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit-small"
                      onClick={() => handleEditUser(user)}
                      title="Manage user"
                    >
                      Manage
                    </button>
                    {user._id !== currentUser?.id && (
                      <button
                        className="btn-delete-small"
                        onClick={() => handleDeactivateUser(user._id, user.username)}
                        title="Deactivate user"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="no-users">
          <p>No users found</p>
        </div>
      )}
    </div>
  );
}

export default UserManagement;

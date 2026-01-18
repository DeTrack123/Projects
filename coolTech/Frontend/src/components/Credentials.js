import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { credentialService, authService, divisionService } from '../services/api';
import { toast } from 'react-toastify';
import Header from './Header';
import './Credentials.css';

function Credentials() {
  const [credentials, setCredentials] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState({});
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchDivisions();
    fetchCredentials();
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await divisionService.getAll();
      setDivisions(response.data || []);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchCredentials = async () => {
    try {
      const response = await credentialService.getAll();
      setCredentials(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      toast.error('Failed to load credentials');
      setLoading(false);
    }
  };

  const handleDivisionFilter = async (divisionId) => {
    setSelectedDivision(divisionId);
    setLoading(true);
    
    try {
      if (divisionId === 'all') {
        const response = await credentialService.getAll();
        setCredentials(response.data || []);
      } else {
        const response = await credentialService.getByDivision(divisionId);
        setCredentials(response.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching filtered credentials:', error);
      toast.error('Failed to load credentials');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this credential?')) {
      return;
    }

    try {
      await credentialService.delete(id);
      toast.success('Credential deleted successfully');
      fetchCredentials();
    } catch (error) {
      console.error('Error deleting credential:', error);
      toast.error(error.response?.data?.message || 'Failed to delete credential');
    }
  };

  const canUpdate = currentUser?.role === 'management' || currentUser?.role === 'admin';
  const canDelete = currentUser?.role === 'admin';

  if (loading) {
    return <div className="credentials-container"><p>Loading credentials...</p></div>;
  }

  return (
    <div className="credentials-container">
      <Header />
      <div className="credentials-header">
        <h2>Credential Repository</h2>
        <div className="header-actions">
          <button 
            className="btn-back" 
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <button 
            className="btn-add" 
            onClick={() => navigate('/credentials/add')}
          >
            + Add Credential
          </button>
        </div>
      </div>

      <div className="credentials-filters">
        <label htmlFor="division-filter">Filter by Division:</label>
        <select 
          id="division-filter"
          className="filter-select"
          value={selectedDivision}
          onChange={(e) => handleDivisionFilter(e.target.value)}
        >
          <option value="all">All Divisions</option>
          {divisions.map((division) => (
            <option key={division._id} value={division._id}>
              {division.name} ({division.organizationalUnit?.name || 'No OU'})
            </option>
          ))}
        </select>
        {selectedDivision !== 'all' && (
          <button 
            className="btn-view-division"
            onClick={() => navigate(`/credentials/division/${selectedDivision}`)}
          >
            View Division Details →
          </button>
        )}
      </div>

      {credentials.length === 0 ? (
        <div className="no-credentials">
          <p>No credentials found. Add your first credential to get started.</p>
        </div>
      ) : (
        <div className="credentials-grid">
          {credentials.map((cred) => (
            <div key={cred._id} className="credential-card">
              <div className="credential-header">
                <h3>{cred.serviceName}</h3>
                <div className="credential-actions">
                  {canUpdate && (
                    <button 
                      className="btn-edit"
                      onClick={() => navigate(`/credentials/edit/${cred._id}`)}
                      title="Edit"
                    >🖊️
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(cred._id)}
                      title="Delete"
                    >🗑️
                    </button>
                  )}

                </div>
              </div>

              <div className="credential-details">
                <div className="detail-row">
                  <span className="label">Username:</span>
                  <span className="value">{cred.username}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Password:</span>
                  <div className="password-field">
                    <span className="value password">
                      {showPassword[cred._id] ? cred.password : '••••••••'}
                    </span>
                    <button 
                      className="btn-toggle-password"
                      onClick={() => togglePasswordVisibility(cred._id)}
                    >
                      {showPassword[cred._id] ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {cred.url && (
                  <div className="detail-row">
                    <span className="label">URL:</span>
                    <a href={cred.url} target="_blank" rel="noopener noreferrer" className="value link">
                      {cred.url}
                    </a>
                  </div>
                )}

                {cred.description && (
                  <div className="detail-row">
                    <span className="label">Description:</span>
                    <span className="value">{cred.description}</span>
                  </div>
                )}

                {cred.division && (
                  <div className="detail-row">
                    <span className="label">Division:</span>
                    <span className="value badge">
                      {cred.division.name}
                      {cred.division.organizationalUnit && 
                        ` (${cred.division.organizationalUnit.name})`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Credentials;

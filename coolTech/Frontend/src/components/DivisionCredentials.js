import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { credentialService, divisionService, authService } from '../services/api';
import { toast } from 'react-toastify';
import Header from './Header';
import './Credentials.css';

function DivisionCredentials() {
  const { divisionId } = useParams();
  const [credentials, setCredentials] = useState([]);
  const [division, setDivision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState({});
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchDivisionAndCredentials();
  }, [divisionId]);

  const fetchDivisionAndCredentials = async () => {
    try {
      // Fetch division details
      const divResponse = await divisionService.getById(divisionId);
      setDivision(divResponse.data);

      // Fetch credentials for this division
      const credResponse = await credentialService.getByDivision(divisionId);
      setCredentials(credResponse.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching division credentials:', error);
      toast.error('Failed to load division credentials');
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
      fetchDivisionAndCredentials();
    } catch (error) {
      console.error('Error deleting credential:', error);
      toast.error(error.response?.data?.message || 'Failed to delete credential');
    }
  };

  const canUpdate = currentUser?.role === 'management' || currentUser?.role === 'admin';
  const canDelete = currentUser?.role === 'admin';

  if (loading) {
    return (
      <div className="credentials-container">
        <p>Loading credentials...</p>
      </div>
    );
  }

  return (
    <div className="credentials-container">
      <Header />
      <div className="credentials-header">
        <div>
          <h2>Division Credential Repository</h2>
          {division && (
            <p className="division-info">
              <strong>{division.name}</strong> - {division.organizationalUnit?.name}
              <br />
              <small>{division.description}</small>
            </p>
          )}
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/credentials')}
          >
            ← Back to All Credentials
          </button>
          <button 
            className="btn-add" 
            onClick={() => navigate(`/credentials/add?division=${divisionId}`)}
          >
            + Add Credential
          </button>
        </div>
      </div>

      {credentials.length === 0 ? (
        <div className="no-credentials">
          <p>No credentials found in this division.</p>
          <button 
            className="btn-add" 
            onClick={() => navigate(`/credentials/add?division=${divisionId}`)}
          >
            Add First Credential
          </button>
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
                    >
                      ✏️
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(cred._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              <div className="credential-body">
                <div className="credential-field">
                  <label>Username:</label>
                  <span>{cred.username}</span>
                </div>

                <div className="credential-field">
                  <label>Password:</label>
                  <div className="password-field">
                    <span className="password-value">
                      {showPassword[cred._id] ? cred.password : '••••••••'}
                    </span>
                    <button 
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility(cred._id)}
                    >
                      {showPassword[cred._id] ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {cred.url && (
                  <div className="credential-field">
                    <label>URL:</label>
                    <a href={cred.url} target="_blank" rel="noopener noreferrer">
                      {cred.url}
                    </a>
                  </div>
                )}

                {cred.description && (
                  <div className="credential-field">
                    <label>Description:</label>
                    <span>{cred.description}</span>
                  </div>
                )}

                <div className="credential-meta">
                  <small>
                    Created by: {cred.createdBy?.username || 'Unknown'} on{' '}
                    {new Date(cred.createdAt).toLocaleDateString()}
                  </small>
                  {cred.updatedAt && cred.updatedAt !== cred.createdAt && (
                    <small>
                      Last updated by: {cred.updatedBy?.username || 'Unknown'} on{' '}
                      {new Date(cred.updatedAt).toLocaleDateString()}
                    </small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DivisionCredentials;

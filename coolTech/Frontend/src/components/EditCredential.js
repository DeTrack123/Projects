import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { credentialService, divisionService, ouService } from '../services/api';
import { toast } from 'react-toastify';import Header from './Header';import './Credentials.css';

function EditCredential() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ous, setOus] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [filteredDivisions, setFilteredDivisions] = useState([]);
  
  const [formData, setFormData] = useState({
    serviceName: '',
    username: '',
    password: '',
    url: '',
    description: '',
    division: ''
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [credResponse, ouResponse, divisionResponse] = await Promise.all([
        credentialService.getById(id),
        ouService.getAll(),
        divisionService.getAll()
      ]);
      
      const credential = credResponse.data;
      setFormData({
        serviceName: credential.serviceName || '',
        username: credential.username || '',
        password: credential.password || '',
        url: credential.url || '',
        description: credential.description || '',
        division: credential.division?._id || ''
      });

      setOus(ouResponse.data || []);
      setDivisions(divisionResponse.data || []);
      setFilteredDivisions(divisionResponse.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load credential');
      navigate('/credentials');
    }
  };

  const handleOUChange = (ouId) => {
    if (ouId) {
      const filtered = divisions.filter(
        div => div.organizationalUnit._id === ouId
      );
      setFilteredDivisions(filtered);
    } else {
      setFilteredDivisions(divisions);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.serviceName || !formData.username || !formData.password || !formData.division) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      await credentialService.update(id, formData);
      toast.success('Credential updated successfully!');
      navigate('/credentials');
    } catch (error) {
      console.error('Error updating credential:', error);
      toast.error(error.response?.data?.message || 'Failed to update credential');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <Header />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <Header />
      <div className="form-header">
        <h2>Edit Credential</h2>
        <button 
          className="btn-back" 
          onClick={() => navigate('/credentials')}
        >
          ← Back to Credentials
        </button>
      </div>

      <form onSubmit={handleSubmit} className="credential-form">
        <div className="form-group">
          <label htmlFor="serviceName">
            Service Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            placeholder="e.g., Gmail, AWS, GitHub"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">
            Username/Email <span className="required">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username or email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password <span className="required">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">URL</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ou">Filter by Organizational Unit</label>
          <select
            id="ou"
            onChange={(e) => handleOUChange(e.target.value)}
          >
            <option value="">All Organizational Units</option>
            {ous.map(ou => (
              <option key={ou._id} value={ou._id}>
                {ou.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="division">
            Division <span className="required">*</span>
          </label>
          <select
            id="division"
            name="division"
            value={formData.division}
            onChange={handleChange}
            required
          >
            <option value="">Select a division</option>
            {filteredDivisions.map(division => (
              <option key={division._id} value={division._id}>
                {division.name} ({division.organizationalUnit.name})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add any additional notes or description"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/credentials')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={saving}
          >
            {saving ? 'Updating...' : 'Update Credential'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCredential;

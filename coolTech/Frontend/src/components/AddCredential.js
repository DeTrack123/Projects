import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { credentialService, divisionService, ouService } from '../services/api';
import { toast } from 'react-toastify';
import Header from './Header';
import './Credentials.css';

function AddCredential() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    fetchOUsAndDivisions();
  }, []);

  const fetchOUsAndDivisions = async () => {
    try {
      const [ouResponse, divisionResponse] = await Promise.all([
        ouService.getAll(),
        divisionService.getAll()
      ]);
      
      setOus(ouResponse.data || []);
      setDivisions(divisionResponse.data || []);
      setFilteredDivisions(divisionResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load organizational units and divisions');
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
    setFormData(prev => ({ ...prev, division: '' }));
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

    setLoading(true);

    try {
      await credentialService.create(formData);
      toast.success('Credential added successfully!');
      navigate('/credentials');
    } catch (error) {
      console.error('Error creating credential:', error);
      toast.error(error.response?.data?.message || 'Failed to create credential');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Header />
      <div className="form-header">
        <h2>Add New Credential</h2>
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
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Credential'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCredential;

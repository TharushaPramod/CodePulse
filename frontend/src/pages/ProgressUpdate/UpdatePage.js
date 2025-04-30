import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    selectCourse: '',
    allLevels: '',
    completeLevels: '',
    templateType: '',
    content: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdate = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:8080/api/progress-updates/${encodeURIComponent(id)}`);
        setFormData({
          userId: response.data.userId?.toString() || '',
          selectCourse: response.data.selectCourse || '',
          allLevels: response.data.allLevels?.toString() || '',
          completeLevels: response.data.completeLevels?.toString() || '',
          templateType: response.data.templateType || '',
          content: response.data.content || '',
        });
      } catch (error) {
        console.error('Error fetching update:', error);
        let errorMessage = 'Error fetching update.';
        if (error.response) {
          errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = 'No response from server. Please check if the server is running.';
        } else {
          errorMessage = error.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.userId.trim()) return 'User ID is required';
    if (isNaN(formData.userId) || parseInt(formData.userId) <= 0)
      return 'User ID must be a positive number';
    if (!formData.selectCourse.trim()) return 'Course is required';
    if (!formData.allLevels.trim()) return 'All Levels is required';
    if (isNaN(formData.allLevels) || parseInt(formData.allLevels) <= 0)
      return 'All Levels must be a positive number';
    if (!formData.completeLevels.trim()) return 'Completed Levels is required';
    if (isNaN(formData.completeLevels) || parseInt(formData.completeLevels) < 0)
      return 'Completed Levels must be a non-negative number';
    if (!formData.templateType) return 'Template Type is required';
    if (!formData.content.trim()) return 'Content is required';
    if (parseInt(formData.completeLevels) > parseInt(formData.allLevels))
      return 'Completed Levels cannot exceed All Levels';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        userId: parseInt(formData.userId),
        allLevels: parseInt(formData.allLevels),
        completeLevels: parseInt(formData.completeLevels),
      };
      const response = await axios.put(
        `http://localhost:8080/api/progress-updates/${encodeURIComponent(id)}`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('Progress update updated successfully!');
      navigate('/progress/learningview', { replace: true });
    } catch (error) {
      console.error('Error updating progress:', error);
      let errorMessage = 'Error updating progress update.';
      if (error.response) {
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if the server is running.';
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleBack = () => {
    navigate('/progress/learningview');
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '1.8rem',
          color: '#333',
        }}
      >
        Update Progress Update
      </h2>
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            color: '#721c24',
            backgroundColor: '#f8d7da',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #f5c6cb',
            marginBottom: '15px',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#333' }}>Loading...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor="userId"
              style={{ marginBottom: '8px', fontWeight: 'bold', color: '#333' }}
            >
              User ID
            </label>
            <input
              id="userId"
              type="number"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              aria-required="true"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor="selectCourse"
              style={{ marginBottom: '8px', fontWeight: 'bold', color: '#333' }}
            >
              Course
            </label>
            <input
              id="selectCourse"
              type="text"
              name="selectCourse"
              value={formData.selectCourse}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              aria-required="true"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor="allLevels"
              style={{ marginBottom: '8px', fontWeight: 'bold', color: '#333' }}
            >
              All Levels
            </label>
            <input
              id="allLevels"
              type="number"
              name="allLevels"
              value={formData.allLevels}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              aria-required="true"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor="completeLevels"
              style={{ marginBottom: '8px', fontWeight: 'bold', color: '#333' }}
            >
              Completed Levels
            </label>
            <input
              id="completeLevels"
              type="number"
              name="completeLevels"
              value={formData.completeLevels}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              aria-required="true"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor="templateType"
              style={{ marginBottom: '8px', fontWeight: 'bold', color: '#333' }}
            >
              Template Type
            </label>
            <select
              id="templateType"
              name="templateType"
              value={formData.templateType}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              aria-required="true"
            >
              <option value="">Select Type</option>
              <option value="completed_tutorial">Completed Tutorial</option>
              <option value="new_skill">New Skill</option>
              <option value="ongoing_project">Ongoing Project</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor="content"
              style={{ marginBottom: '8px', fontWeight: 'bold', color: '#333' }}
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                minHeight: '120px',
                resize: 'vertical',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px',
              backgroundColor: isSubmitting ? '#aaa' : '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => !isSubmitting && (e.target.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => !isSubmitting && (e.target.style.backgroundColor = '#007bff')}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
          <button
        onClick={handleBack}
        style={{
          padding: '10px 16px',
          backgroundColor: '#6b7280',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          marginBottom: '20px',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#4b5563')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#6b7280')}
        aria-label="Go back to progress list"
      >
        Back
      </button>
          
        </form>
      )}
    </div>
  );
};

export default UpdatePage;
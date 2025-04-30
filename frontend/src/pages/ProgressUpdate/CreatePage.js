// CreatePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePage = () => {
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
      await axios.post(
        'http://localhost:8080/api/progress-updates',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('Progress update created successfully!');
      navigate('/progress/learningview', { replace: true });
    } catch (error) {
      let errorMessage = 'An error occurred while creating the progress update.';
      if (error.response) {
        errorMessage =
          error.response.data.message ||
          `Server error: ${error.response.status} ${error.response.statusText}`;
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
        Create Progress Update
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
        {[
          { id: 'userId', label: 'User ID', type: 'number' },
          { id: 'selectCourse', label: 'Course', type: 'text' },
          { id: 'allLevels', label: 'All Levels', type: 'number' },
          { id: 'completeLevels', label: 'Completed Levels', type: 'number' },
        ].map(({ id, label, type }) => (
          <div key={id} style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor={id}
              style={{ marginBottom: '8px', fontWeight: 'bold', color: '#333' }}
            >
              {label}
            </label>
            <input
              id={id}
              type={type}
              name={id}
              value={formData[id]}
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
        ))}
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
              resize: 'vertical',
              minHeight: '100px',
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
            backgroundColor: '#007bff',
            color: '#fff',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) =>
            !isSubmitting && (e.target.style.backgroundColor = '#0056b3')
          }
          onMouseOut={(e) =>
            !isSubmitting && (e.target.style.backgroundColor = '#007bff')
          }
        >
          {isSubmitting ? 'Submitting...' : 'Create Update'}
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
    </div>
  );
};

export default CreatePage;

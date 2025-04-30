// frontend/src/components/ProgressUpdate.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  createProgressUpdate,
  getProgressUpdatesByUserId,
  updateProgressUpdate,
  deleteProgressUpdate,
} from '../../services/progressUpdateService';
import '../../css/ProgressUpdate.css';

const ProgressUpdate = ({ userId }) => {
  const [updates, setUpdates] = useState([]);
  const [form, setForm] = useState({
    selectCourse: '',
    allLevels: '',
    completeLevels: '',
    templateType: 'completed_tutorial',
    content: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Memoize fetchUpdates to prevent unnecessary re-renders
  const fetchUpdates = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getProgressUpdatesByUserId(userId);
      setUpdates(data);
    } catch (error) {
      setError('Failed to load updates. Please try again later.');
      console.error('Error fetching updates:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]); // userId is a dependency of fetchUpdates

  // Fetch updates on mount and when userId changes
  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]); // Include fetchUpdates in the dependency array

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!form.selectCourse.trim()) return 'Please select a course.';
    if (!form.allLevels || isNaN(form.allLevels) || form.allLevels <= 0)
      return 'Total levels must be a positive number.';
    if (!form.completeLevels || isNaN(form.completeLevels) || form.completeLevels < 0)
      return 'Completed levels must be a non-negative number.';
    if (parseInt(form.completeLevels) > parseInt(form.allLevels))
      return 'Completed levels cannot exceed total levels.';
    if (!form.content.trim()) return 'Content cannot be empty.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      if (editingId) {
        await updateProgressUpdate(editingId, { ...form, userId });
        setEditingId(null);
      } else {
        await createProgressUpdate({ ...form, userId });
      }
      setForm({
        selectCourse: '',
        allLevels: '',
        completeLevels: '',
        templateType: 'completed_tutorial',
        content: '',
      });
      fetchUpdates();
    } catch (error) {
      setError('Failed to save update: ' + (error.response?.data?.message || error.message));
      console.error('Error saving update:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (update) => {
    setForm({
      selectCourse: update.selectCourse,
      allLevels: update.allLevels,
      completeLevels: update.completeLevels,
      templateType: update.templateType,
      content: update.content,
    });
    setEditingId(update.id);
    setError('');
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteProgressUpdate(id);
      fetchUpdates();
    } catch (error) {
      setError('Failed to delete update: ' + (error.response?.data?.message || error.message));
      console.error('Error deleting update:', error);
    }
  };

  return (
    <div className="progress-update-container">
      <h2>Learning Progress Updates</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="progress-form">
        <div className="form-group">
          <label htmlFor="selectCourse">Select Course</label>
          <input
            type="text"
            name="selectCourse"
            value={form.selectCourse}
            onChange={handleInputChange}
            placeholder="e.g., Java Programming"
            disabled={isSubmitting || isLoading}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="allLevels">Total Levels</label>
          <input
            type="number"
            name="allLevels"
            value={form.allLevels}
            onChange={handleInputChange}
            placeholder="e.g., 10"
            min="1"
            disabled={isSubmitting || isLoading}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="completeLevels">Completed Levels</label>
          <input
            type="number"
            name="completeLevels"
            value={form.completeLevels}
            onChange={handleInputChange}
            placeholder="e.g., 5"
            min="0"
            disabled={isSubmitting || isLoading}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="templateType">Progress Type</label>
          <select
            name="templateType"
            value={form.templateType}
            onChange={handleInputChange}
            disabled={isSubmitting || isLoading}
          >
            <option value="completed_tutorial">Completed Tutorial</option>
            <option value="new_skill">New Skill Learned</option>
            <option value="ongoing_project">Ongoing Project</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="content">Description</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleInputChange}
            placeholder="Describe your progress..."
            maxLength="500"
            disabled={isSubmitting || isLoading}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Add'} Progress
        </button>
      </form>

      <div className="updates-list">
        <h3>Your Updates</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : updates.length === 0 ? (
          <p>No updates yet.</p>
        ) : (
          <ul>
            {updates.map((update) => (
              <li key={update.id} className="update-item">
                <div>
                  <strong>Course:</strong> {update.selectCourse} <br />
                  <strong>Levels:</strong> {update.completeLevels}/{update.allLevels} <br />
                  <strong>Type:</strong>{' '}
                  {update.templateType
                    .replace('_', ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}{' '}
                  <br />
                  <strong>Description:</strong> {update.content}
                </div>
                <div className="update-actions">
                  <button
                    onClick={() => handleEdit(update)}
                    disabled={isSubmitting || isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(update.id)}
                    disabled={isSubmitting || isLoading}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProgressUpdate;
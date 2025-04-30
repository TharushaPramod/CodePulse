import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  return (
    <nav
      style={{
        backgroundColor: '#2563eb', // Matches Tailwind's bg-blue-600
        padding: '16px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          Learning Progress
        </h1>
        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          <Link
            to="/progress/learningview"
            style={{
              color: '#fff',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.color = '#bfdbfe')} // Matches hover:text-blue-200
            onMouseOut={(e) => (e.target.style.color = '#fff')}
          >
            Home
          </Link>
          <Link
            to="/progress/create"
            style={{
              color: '#fff',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.color = '#bfdbfe')}
            onMouseOut={(e) => (e.target.style.color = '#fff')}
          >
            Create Progress
          </Link>
        </div>
      </div>
    </nav>
  );
};

const ViewPage = () => {
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8080/api/progress-updates');
        if (Array.isArray(response.data)) {
          setProgressUpdates(response.data);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (error) {
        console.error('Error fetching progress updates:', error);
        setError('Failed to fetch progress updates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUpdates = progressUpdates.filter((update) => {
    const userId = update.userId?.toString() || '';
    const selectCourse = update.selectCourse?.toString().toLowerCase() || '';
    const templateType = update.templateType?.toString().toLowerCase() || '';
    const content = update.content?.toString().toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return (
      userId.includes(search) ||
      selectCourse.includes(search) ||
      templateType.includes(search) ||
      content.includes(search)
    );
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this progress update?')) {
      try {
        await axios.delete(`http://localhost:8080/api/progress-updates/${id}`);
        setProgressUpdates((prevUpdates) => prevUpdates.filter((update) => update.id !== id));
        alert('Progress update deleted successfully!');
      } catch (error) {
        console.error('Error deleting progress update:', error);
        alert('Failed to delete progress update.');
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/progress/update/${id}`);
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Header />
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '16px 0',
          color: '#333',
        }}
      >
        All Progress Updates
      </h2>
      <div
        style={{
          marginBottom: '16px',
        }}
      >
        <input
          type="text"
          placeholder="Search by User ID, Course, Template Type, or Content"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
      </div>
      {loading ? (
        <p style={{ textAlign: 'center', color: '#333' }}>Loading...</p>
      ) : error ? (
        <p
          style={{
            textAlign: 'center',
            color: '#dc2626', // Matches Tailwind's text-red-500
          }}
        >
          {error}
        </p>
      ) : (
        <div
          style={{
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb', // Matches Tailwind's border
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#e5e7eb', // Matches bg-gray-200
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '8px', border: '1px solid #e5e7eb' }}>User ID</th>
                <th style={{ padding: '8px', border: '1px solid #e5e7eb' }}>Course</th>
                <th style={{ padding: '8px', border: '1px solid #e5e7eb' }}>All Levels</th>
                <th style={{ padding: '8px', border: '1px solid #e5e7eb' }}>Completed Levels</th>
                <th style={{ padding: '8px', border: '1px solid #e5e7eb' }}>Template Type</th>
                <th style={{ padding: '8px', border: '1px solid #e5e7eb' }}>Content</th>
                <th style={{ padding: '8px', border: '1px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUpdates.length > 0 ? (
                filteredUpdates.map((update) => (
                  <tr
                    key={update.id}
                    style={{
                      transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')} // Matches hover:bg-gray-100
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                  >
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb' }}>
                      {update.userId ?? 'N/A'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb' }}>
                      {update.selectCourse ?? 'N/A'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb' }}>
                      {update.allLevels ?? 'N/A'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb' }}>
                      {update.completeLevels ?? 'N/A'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb' }}>
                      {update.templateType ?? 'N/A'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb' }}>
                      {update.content ?? 'N/A'}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        gap: '8px',
                      }}
                    >
                      <button
                        onClick={() => handleUpdate(update.id)}
                        style={{
                          backgroundColor: '#3b82f6', // Matches bg-blue-500
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#1d4ed8')} // Matches hover:bg-blue-600
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#3b82f6')}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(update.id)}
                        style={{
                          backgroundColor: '#ef4444', // Matches bg-red-500
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#b91c1c')} // Matches hover:bg-red-600
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#ef4444')}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    No progress updates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewPage;
// src/pages/PostDetails.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/view.css';
import Comment from './Comment';

function PostDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const post = state?.post;

  const handleBackClick = () => {
    navigate('/');
  };

  if (!post) {
    return (
      <div className="app-container">
        <div className="post-details">
          <p>Post not found.</p>
          <button onClick={handleBackClick}>Back to Posts</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="post-details">
        <h2>Post Details</h2>
        <div className="post-card">
          <p><strong>ID:</strong> {post.id}</p>
          <p><strong>User ID:</strong> {post.userId}</p>
          <p><strong>Description:</strong> {post.description}</p>
          <p><strong>Media Files:</strong></p>
          {post.mediaFiles && post.mediaFiles.length > 0 ? (
            post.mediaFiles.map((file, index) => (
              <img
                key={index}
                src={`http://localhost:8080${file}`}
                alt={`Media ${index}`}
                style={{ width: '100px', height: '100px', marginRight: '10px' }}
              />
            ))
          ) : (
            <p>No media</p>
          )}
          <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
        </div>
        <button onClick={handleBackClick} style={{ marginTop: '20px' }}>
          Back to Posts
        </button>
      </div>

          <Comment/>





    </div>
  );
}

export default PostDetails;
// src/pages/PostDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/view.css';

function PostDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const post = state?.post;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    content: '',
  });
  const [error, setError] = useState(null);

  // Fetch comments for the specific post on component mount
  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/post/${post.id}`);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments.');
    }
  };

  // Handle form input changes for adding a new comment
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment({ ...newComment, [name]: value });
  };

  // Add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.content.trim()) {
      setError('Please enter a comment.');
      return;
    }

    const commentToAdd = { // payload
      postId: post.id, // Use post.id directly
      userId: post.userId, // Use post.userId directly
      content: newComment.content,
    };

    try {
      await axios.post('http://localhost:8080/api/comments', commentToAdd);
      setNewComment({ content: '' }); // Reset the form
      fetchComments(); // Refresh the comments list
      setError(null);
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  };

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

        {/* Comment Form */}
        <div className="comments-section">
          <h3>Add a Comment</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleAddComment} className="comment-form">
            <div className="form-group">
              <label>Post ID</label>
              <input
                type="text"
                name="postId"
                value={post.id}
                readOnly // Make it read-only since it's not meant to be changed
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>User ID</label>
              <input
                type="number"
                name="userId"
                value={post.userId}
                readOnly // Make it read-only since it's not meant to be changed
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Comment (Required)</label>
              <textarea
                name="content"
                value={newComment.content}
                onChange={handleInputChange}
                placeholder="Add a comment..."
                rows="3"
                required
                className="form-textarea"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Comment
            </button>
          </form>

          {/* List of Comments */}
          <h3>Comments</h3>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <p><strong>User ID:</strong> {comment.userId}</p>
                  <p>{comment.content}</p>
                  <small>Posted on: {new Date(comment.createdAt).toLocaleString()}</small>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleBackClick} style={{ marginTop: '20px' }}>
          Back to Posts
        </button>
      </div>
    </div>
  );
}

export default PostDetails;
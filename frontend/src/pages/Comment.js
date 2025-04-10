import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comment =()=> {

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({
      content: '',
      author: '',
    });
    const [editComment, setEditComment] = useState(null); 

    // Fetch all comments on component mount
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/comments');
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
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
    try {
      await axios.post('http://localhost:8080/api/comments', newComment);
      setNewComment({ content: '', author: '' });
      fetchComments(); // Refresh the list
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/comments/${id}`);
      fetchComments(); // Refresh the list
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Start editing a comment
  const handleEditComment = (comment) => {
    setEditComment(comment);
  };

  // Handle form input changes for editing a comment
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditComment({ ...editComment, [name]: value });
  };

  // Update a comment
  const handleUpdateComment = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/comments/${editComment.id}`, editComment);
      setEditComment(null);
      fetchComments(); // Refresh the list
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Comment System</h1>

<div>
      {/* Form to add a new comment */}
      <form onSubmit={handleAddComment} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            name="author"
            value={newComment.author}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea
            className="form-control"
            name="content"
            value={newComment.content}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Comment
        </button>
      </form>

      {/* Form to edit a comment */}
      {editComment && (
        <form onSubmit={handleUpdateComment} className="mb-4">
          <h3>Edit Comment</h3>
          <div className="mb-3">
            <label className="form-label">Author</label>
            <input
              type="text"
              className="form-control"
              name="author"
              value={editComment.author}
              onChange={handleEditInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Comment</label>
            <textarea
              className="form-control"
              name="content"
              value={editComment.content}
              onChange={handleEditInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success me-2">
            Update Comment
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setEditComment(null)}
          >
            Cancel
          </button>
        </form>
      )}

      {/* List of comments */}
      <h2>Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="list-group">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>Author:</strong> {comment.author} <br />
                <strong>Comment:</strong> {comment.content}
              </div>
              <div>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEditComment(comment)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteComment(comment.id)}
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
export default Comment;

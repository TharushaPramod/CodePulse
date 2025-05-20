import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Post.css';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';

function PostDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const post = state?.post;
  const userName = state?.userName || 'Guest'; // Retrieve userName from state

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: '' });
  const [editComment, setEditComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/comments/post/${post.id}`);
      setComments(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editComment) {
      setEditComment({ ...editComment, [name]: value });
    } else {
      setNewComment({ ...newComment, [name]: value });
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const content = editComment ? editComment.content : newComment.content;

    if (!content.trim()) {
      setError('Please enter a comment.');
      return;
    }

    setLoading(true);
    try {
      if (editComment) {
        await axios.put(`${API_BASE_URL}/api/comments/${editComment.id}`, {
          content: editComment.content,
          userName: userName,
          postId: editComment.postId,
        });
        setEditComment(null);
      } else {
        await axios.post(`${API_BASE_URL}/api/comments`, {
          postId: post.id,
          userName: userName,
          content: newComment.content,
        });
        setNewComment({ content: '' });
      }

      fetchComments();
      setError(null);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditComment({ ...comment });
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/comments/${id}`);
      fetchComments();
      setError(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/view');
  };

  // Function to check if the file is a video
  const isVideoFile = (fileUrl) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const extension = fileUrl?.toLowerCase().slice(fileUrl.lastIndexOf('.')) || '';
    return videoExtensions.includes(extension);
  };

  if (!post) {
    return (
      <div>
        <p>Post not found.</p>
        <button onClick={handleBackClick}>Back to Posts</button>
      </div>
    );
  }

  return (
    <div className='post-comment-section'>
      <div className='comment-section-sub'>
        <div className="post-details">
          <div className='comment-section-media'>
            {post.mediaFiles && post.mediaFiles.length > 0 ? (
              post.mediaFiles.map((file, index) => {
                const fullUrl = `${API_BASE_URL}${file}`;
                return isVideoFile(file) ? (
                  <video
                    key={index}
                    className="media"
                    src={fullUrl}
                    controls
                    muted
                    autoPlay
                    loop
                  />
                ) : (
                  <img
                    key={index}
                    className="img"
                    src={fullUrl}
                    alt={`Media ${index}`}
                  />
                );
              })
            ) : (
              <p>No media</p>
            )}
          </div>
          <div className='comment-section-post-all-deatils'>
            <div className='comment-section-name'>
             {post.userName || post.userId}
            </div>
            <div className='comment-section-description'>{post.description}</div>
            <div className='comment-seection-post-date'>
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="add-comment-section">
          <h3>{editComment ? 'Edit Comment' : 'Add a Comment'}</h3>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmitComment} className='comment-form-section'>
            <textarea
              className='comment-text-area'
              name="content"
              value={editComment ? editComment.content : newComment.content}
              onChange={handleInputChange}
              placeholder={editComment ? 'Edit your comment...' : 'Add a comment...'}
              rows="3"
              required
              disabled={loading}
            />
            <div className="form-button-group">
              <button type="submit" disabled={loading} className='add-comment'>
                {loading
                  ? (editComment ? 'Updating...' : 'Adding...')
                  : (editComment ? 'Update' : 'Add Comment')}
              </button>
              {editComment && (
                <button
                  type="button"
                  onClick={() => setEditComment(null)}
                  disabled={loading}
                  className='add-comment cancel-edit'
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className='all-comments-container'>
          <h3>Comments</h3>
          {loading && <p>Loading...</p>}
          {!loading && comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className='all-comments-container-sub'>
                <div className='all-comments'>
                  <p className='all-comment-section-userName'>
                     {comment.userName}
                  </p>
                  <div>
                    <p>{comment.content}</p>
                    <small className='commented-date'>
                      Posted on: {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  </div>
                  {comment.userName === userName && ( // Only show buttons for comment owner
                    <div className='update-delete-comment-btn-container'>
                      <UpdateIcon
                        onClick={() => handleEditComment(comment)}
                        disabled={loading}
                      />
                      <DeleteIcon
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={loading}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <button className='back-to-post-btn' onClick={handleBackClick}>Back to Posts</button>
      </div>
    </div>
  );
}

export default PostDetails;

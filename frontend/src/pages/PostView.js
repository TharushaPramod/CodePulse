import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './PostView.css';
import Sidenavbar from '../components/Sidenavbar';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function PostList() {
  const [posts, setPosts] = useState([]);
  const API_BASE_URL = 'http://localhost:8080';
  const navigate = useNavigate();
  const location = useLocation();

  const userName = localStorage.getItem('userName') || 'Guest';
  const userId = localStorage.getItem('userId') || 'Guest';

  useEffect(() => {
    if (!userName || userName === 'Guest') {
      console.log('No userName found, redirecting to login');
      navigate('/login');
    }
  }, [userName, navigate]);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/posts`);
      console.log('Fetched posts:', response.data);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCommentClick = (post) => {
    navigate(`/post/${post.id}`, { state: { post, userName, userId } });
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="main-container">
      <div className="navbar">
        <Sidenavbar />
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="post-view-container">
        <h2>Welcome, {userName}!</h2>

        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <div className="all-post">
            {posts.map((post) => (
              <div key={post.id} className="one-post">
                <div className="media-container">
                  {post.mediaFiles && post.mediaFiles.length > 0 ? (
                    <img
                      className="img"
                      src={`${API_BASE_URL}${post.mediaFiles[0]}`}
                      alt="Post media"
                    />
                  ) : (
                    <div className="no-available">
                      <span>No media available</span>
                    </div>
                  )}
                </div>

                <div className="post_all_details">
                  <h3 className="post_user">User Name: {post.userName || post.userId}</h3>
                  <p className="description-container">{post.description}</p>
                  <span className="post-date">
                    Created At: {new Date(post.createdAt).toLocaleString()}
                  </span>

                  <div className="btn-container">
                    <CommentIcon
                      onClick={() => handleCommentClick(post)}
                      className="btn"
                    />
                    <ThumbUpIcon className="btn" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostList;
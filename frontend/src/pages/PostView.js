import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './PostView.css';
import Sidenavbar from '../components/Sidenavbar';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [mediaErrors, setMediaErrors] = useState({});
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
      // Normalize likedBy and likeCount
      const normalizedPosts = response.data.map(post => ({
        ...post,
        likeCount: post.likeCount || 0,
        likedBy: Array.isArray(post.likedBy) ? post.likedBy : [],
        userName: post.userName || 'Unknown', // Fallback for userName
      }));
      normalizedPosts.forEach(post => {
        if (post.mediaFiles && post.mediaFiles.length > 0) {
          post.mediaFiles.forEach(file => {
            console.log(`Media file URL: ${API_BASE_URL}${file}`);
          });
        }
      });
      setPosts(normalizedPosts);
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

  const handleLikeClick = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post.likedBy.includes(userName)) {
        console.log('User has already liked this post');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/posts/${postId}/like`,
        JSON.stringify(userName),
        { headers: { 'Content-Type': 'application/json' } }
      );

      setPosts(posts.map(p =>
        p.id === postId
          ? {
              ...p,
              likeCount: response.data.likeCount,
              likedBy: response.data.likedBy,
            }
          : p
      ));
    } catch (error) {
      console.error('Error liking post:', error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const isVideoFile = (fileUrl) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const extension = fileUrl?.toLowerCase().slice(fileUrl.lastIndexOf('.')) || '';
    return videoExtensions.includes(extension);
  };

  const handleMediaError = (postId, error) => {
    console.error(`Media error for post ${postId}:`, error);
    setMediaErrors(prev => ({
      ...prev,
      [postId]: 'Failed to load media. Please try again later.',
    }));
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
                    <>
                      {mediaErrors[post.id] ? (
                        <div className="media-error">
                          <span>{mediaErrors[post.id]}</span>
                        </div>
                      ) : isVideoFile(post.mediaFiles[0]) ? (
                        <video
                          className="media"
                          src={`${API_BASE_URL}${post.mediaFiles[0]}`}
                          controls
                          muted
                          autoPlay
                          loop
                          onError={(e) => handleMediaError(post.id, e)}
                          alt="Post video"
                        />
                      ) : (
                        <img
                          className="img"
                          src={`${API_BASE_URL}${post.mediaFiles[0]}`}
                          alt="Post media"
                          onError={(e) => handleMediaError(post.id, e)}
                        />
                      )}
                    </>
                  ) : (
                    <div className="no-available">
                      <span>No media available</span>
                    </div>
                  )}
                </div>

                <div className="post_all_details">
                  <h3 className="post_user"> {post.userName}</h3>
                  <p className="description-container">{post.description}</p>
                  <span className="post-date">
                    Created At: {new Date(post.createdAt).toLocaleString()}
                  </span>
                  <div className="like-container">
                    <span>{post.likeCount} Likes</span>
                  </div>

                  <div className="btn-container">
                    <CommentIcon
                      onClick={() => handleCommentClick(post)}
                      className="btn"
                    />
                    <ThumbUpIcon
                      onClick={() => handleLikeClick(post.id)}
                      className={`btn ${post.likedBy.includes(userName) ? 'liked' : ''}`}
                    />
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
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PostView.css'

function PostList() {
  const [posts, setPosts] = useState([]);
  const API_BASE_URL = 'http://localhost:8080';
  const navigate = useNavigate();

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
    navigate(`/post/${post.id}`, { state: { post } });
  };

  return (
    <div className='main-container'>
    <div className='post-view-container'>
     
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <div className='all-post'>
          {posts.map((post) => (
             <div className='postssss'>
            <div key={post.id} className='one-post'>
             
              <div className='user_name'>
                <h3>User Name: {post.userId}</h3>
              </div>
              <div className='media-container'>
                {post.mediaFiles && post.mediaFiles.length > 0 ? (
                  <img
                    src={`${API_BASE_URL}${post.mediaFiles[0]}`}
                    alt="Post media"
                  />
                ) : (
                  <div className='no-available'>
                    <span>No media available</span>
                  </div>
                )}
              </div>
              <div className='post-description'>
              <h5 className='description'>description</h5>
              <p className='description-container'> {post.description}</p>
          
              </div>
              <div className='post-date'>
                <span>Created At: {new Date(post.createdAt).toLocaleString()}</span>
                </div> 
                <div className='btn-container'>
                <button onClick={() => handleCommentClick(post)} className='btn-comment'>
                  Comment
                </button>
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
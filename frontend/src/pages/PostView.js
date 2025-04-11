// src/pages/PostList.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/view.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const API_BASE_URL = 'http://localhost:8080';
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    const response = await axios.get(`${API_BASE_URL}/api/posts`);
    console.log('Fetched posts:', response.data);
    setPosts(response.data);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCommentClick = (post) => {
    navigate(`/post/${post.id}`, { state: { post } }); // Pass the post data via state
  };

  return (
    <div className="app-container">
      <div className="posts-table">
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Description</th>
                <th>Media Files</th>
                <th>Created At</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.userId}</td>
                  <td>{post.description}</td>
                  <td>
                    {post.mediaFiles && post.mediaFiles.length > 0 ? (
                      post.mediaFiles.map((file, index) => (
                        <img
                          key={index}
                          src={`${API_BASE_URL}${file}`}
                          alt={`Media ${index}`}
                          style={{ width: '50px', height: '50px', marginRight: '5px' }}
                        />
                      ))
                    ) : (
                      'No media'
                    )}
                  </td>
                  <td>{new Date(post.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleCommentClick(post)}>
                      Comment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PostList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [editDescription, setEditDescription] = useState('');
    const [editFiles, setEditFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // For fetching posts
    const [isSubmitting, setIsSubmitting] = useState(false); // For creating/editing posts
    const [error, setError] = useState(''); // For error messages

    const API_BASE_URL = 'http://localhost:8080';

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setError(''); // Clear previous errors
            try {
                const response = await axios.get(`${API_BASE_URL}/api/posts`);
                console.log('Fetched posts:', response.data);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to load posts. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleFileChange = (e) => {
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length > 3) {
            setError('Max 3 files allowed!');
            return;
        }

        for (const file of selectedFiles) {
            if (file.size > maxSize) {
                setError(`File "${file.name}" is too large! Max size is 5MB.`);
                return;
            }
        }

        setFiles(selectedFiles);
        setError(''); // Clear error if validation passes
    };

    const handleEditFileChange = (e) => {
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length > 3) {
            setError('Max 3 files allowed!');
            return;
        }

        for (const file of selectedFiles) {
            if (file.size > maxSize) {
                setError(`File "${file.name}" is too large! Max size is 5MB.`);
                return;
            }
        }

        setEditFiles(selectedFiles);
        setError(''); // Clear error if validation passes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(''); // Clear previous errors
        const formData = new FormData();
        formData.append('description', description);
        files.forEach(file => formData.append('files', file));

        try {
            const response = await axios.post(`${API_BASE_URL}/api/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setPosts([response.data, ...posts]);
            setDescription('');
            setFiles([]);
            document.querySelector('input[type="file"]').value = null;
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (postId) => {
        setError(''); // Clear previous errors
        try {
            await axios.delete(`${API_BASE_URL}/api/posts/${postId}`);
            setPosts(posts.filter(p => p.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete post: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEditStart = (post) => {
        setEditingPost(post.id);
        setEditDescription(post.description);
        setEditFiles([]);
        setError(''); // Clear previous errors
    };

    const handleEditSubmit = async (e, postId) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(''); // Clear previous errors
        const formData = new FormData();
        formData.append('description', editDescription);
        editFiles.forEach(file => formData.append('files', file));

        try {
            const response = await axios.put(`${API_BASE_URL}/api/posts/${postId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setPosts(posts.map(p => p.id === postId ? response.data : p));
            setEditingPost(null);
            setEditDescription('');
            setEditFiles([]);
        } catch (error) {
            console.error('Error updating post:', error);
            setError('Failed to update post: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="app-container">
            <div className="create-post">
                <h1>Create Post</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write your post..."
                        disabled={isSubmitting}
                    />
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*"
                        disabled={isSubmitting}
                    />
                    <button className="submit-btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </form>
            </div>

            <div className="posts-feed">
                <h2>Posts Feed</h2>
                {isLoading ? (
                    <p className="loading">Loading posts...</p>
                ) : error && !posts.length ? (
                    <p className="error">{error}</p>
                ) : posts.length === 0 ? (
                    <p>No posts yet.</p>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="post">
                            {editingPost === post.id ? (
                                <form onSubmit={(e) => handleEditSubmit(e, post.id)}>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        placeholder="Edit your post..."
                                        disabled={isSubmitting}
                                    />
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleEditFileChange}
                                        accept="image/*"
                                        disabled={isSubmitting}
                                    />
                                    <div className="post-buttons">
                                        <button className="save-btn" type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            className="cancel-btn"
                                            type="button"
                                            onClick={() => setEditingPost(null)}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p>{post.description}</p>
                                    {post.mediaFiles && post.mediaFiles.length > 0 ? (
                                        post.mediaFiles.map((file, index) => (
                                            <img
                                                key={index}
                                                src={`${API_BASE_URL}${file}`}
                                                alt="Post media"
                                                className="post-image"
                                                onError={(e) => {
                                                    e.target.src = '/fallback-image.jpg';
                                                    console.error(`Failed to load image: ${file}`);
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <p className="no-media">No media files.</p>
                                    )}
                                    <div className="post-buttons">
                                        <button className="delete-btn" onClick={() => handleDelete(post.id)}>
                                            Delete
                                        </button>
                                        <button className="edit-btn" onClick={() => handleEditStart(post)}>
                                            Edit
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default App;
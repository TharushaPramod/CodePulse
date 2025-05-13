import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PostItem from './PostItem';
import Sidenavbar from './components/Sidenavbar';
import './App.css';

function App() {
    const [description, setDescription] = useState('');
    const [userName, setUserName] = useState('');
    const [files, setFiles] = useState([]);
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [editDescription, setEditDescription] = useState('');
    const [editFiles, setEditFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const API_BASE_URL = 'http://localhost:8080';

    // Fetch userName from localStorage on mount
    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        if (!storedUserName) {
            setError('Please log in to create or view your posts.');
            navigate('/login');
            return;
        }
        setUserName(storedUserName);
    }, [navigate]);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_BASE_URL}/api/posts`, { timeout: 10000 });
            console.log('Fetched posts:', response.data);
            response.data.forEach(post => {
                if (post.mediaFiles && post.mediaFiles.length > 0) {
                    post.mediaFiles.forEach(file => {
                        console.log(`Media file URL: ${API_BASE_URL}${file}`);
                    });
                }
            });
            // Filter posts by userName
            const storedUserName = localStorage.getItem('userName');
            const filteredPosts = response.data.filter(post => post.userName === storedUserName);
            const sortedPosts = filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to load posts: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userName) {
            fetchPosts();
        }
    }, [fetchPosts, userName]);

    const handleFileChange = (e) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
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
        setError('');
    };

    const handleEditFileChange = (e) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
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
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userName) {
            setError('Please log in to create a post.');
            navigate('/login');
            return;
        }
        setIsSubmitting(true);
        setError('');
        const formData = new FormData();
        formData.append('description', description);
        formData.append('userName', userName);
        files.forEach(file => formData.append('files', file));

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            await axios.post(`${API_BASE_URL}/api/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 10000
            });
            setDescription('');
            setFiles([]);
            document.querySelector('input[type="file"]').value = null;
            await fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post: ' + (error.response?.data || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = useCallback(async (postId) => {
        if (!userName) {
            setError('Please log in to delete a post.');
            navigate('/login');
            return;
        }
        setError('');
        try {
            await axios.delete(`${API_BASE_URL}/api/posts/${postId}?userName=${encodeURIComponent(userName)}`, {
                timeout: 10000
            });
            setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete post: ' + (error.response?.data || error.message));
        }
    }, [userName, navigate]);

    const handleEditStart = useCallback((post) => {
        if (!userName) {
            setError('Please log in to edit a post.');
            navigate('/login');
            return;
        }
        setEditingPost(post.id);
        setEditDescription(post.description);
        setEditFiles([]);
        setError('');
    }, [userName, navigate]);

    const handleEditSubmit = async (e, postId) => {
        e.preventDefault();
        if (!userName) {
            setError('Please log in to edit a post.');
            navigate('/login');
            return;
        }
        setIsSubmitting(true);
        setError('');
        const formData = new FormData();
        formData.append('description', editDescription);
        formData.append('userName', userName);
        editFiles.forEach(file => formData.append('files', file));

        try {
            await axios.put(`${API_BASE_URL}/api/posts/${postId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 10000
            });
            setEditingPost(null);
            setEditDescription('');
            setEditFiles([]);
            await fetchPosts();
        } catch (error) {
            console.error('Error updating post:', error);
            setError('Failed to update post: ' + (error.response?.data || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle back button navigation
    const handleBack = () => {
        navigate('/view');
    };

    return (
        <div className="app-container">
         
            <div className="content">
                
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
                            accept="image/*,video/*"
                            disabled={isSubmitting}
                        />
                        <button className="submit-btn" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </form>
                </div>

                <div className="posts-feed">
                    <h2>Your Posts</h2>
                    {isLoading ? (
                        <p className="loading">Loading posts...</p>
                    ) : error && !posts.length ? (
                        <p className="error">{error}</p>
                    ) : posts.length === 0 ? (
                        <p>No posts yet.</p>
                    ) : (
                        posts.map(post => (
                            <PostItem
                                key={post.id}
                                post={post}
                                editingPost={editingPost}
                                editDescription={editDescription}
                                setEditDescription={setEditDescription}
                                editFiles={editFiles}
                                setEditFiles={setEditFiles}
                                isSubmitting={isSubmitting}
                                handleEditFileChange={handleEditFileChange}
                                handleEditSubmit={handleEditSubmit}
                                setEditingPost={setEditingPost}
                                handleDelete={handleDelete}
                                handleEditStart={handleEditStart}
                                API_BASE_URL={API_BASE_URL}
                                userName={userName}
                            />
                        ))
                    )}
                </div>
            </div>
            <button className="back-btn" onClick={handleBack}>
                    Back to View
                </button>
        </div>
    );
}

export default App;
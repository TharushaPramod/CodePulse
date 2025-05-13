import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PostItem from './PostItem';
import './App.css';

function App() {
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [editDescription, setEditDescription] = useState('');
    const [editFiles, setEditFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const API_BASE_URL = 'http://localhost:8080';

    // Fetch posts from the backend
    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_BASE_URL}/api/posts`);
            console.log('Fetched posts:', response.data);
            // Log media file URLs to verify they are correct
            response.data.forEach(post => {
                if (post.mediaFiles && post.mediaFiles.length > 0) {
                    post.mediaFiles.forEach(file => {
                        console.log(`Media file URL: ${API_BASE_URL}${file}`);
                    });
                }
            });
            // Sort posts by createdAt in descending order (newest first) as a fallback
            const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to load posts. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

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
        setError('');
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
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const formData = new FormData();
        formData.append('description', description);
        files.forEach(file => formData.append('files', file));

        try {
            await axios.post(`${API_BASE_URL}/api/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDescription('');
            setFiles([]);
            document.querySelector('input[type="file"]').value = null;
            await fetchPosts(); // Refresh the post list
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = useCallback(async (postId) => {
        setError('');
        try {
            await axios.delete(`${API_BASE_URL}/api/posts/${postId}`);
            setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete post: ' + (error.response?.data?.message || error.message));
        }
    }, []);

    const handleEditStart = useCallback((post) => {
        setEditingPost(post.id);
        setEditDescription(post.description);
        setEditFiles([]);
        setError('');
    }, []);

    const handleEditSubmit = async (e, postId) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const formData = new FormData();
        formData.append('description', editDescription);
        editFiles.forEach(file => formData.append('files', file));

        try {
            await axios.put(`${API_BASE_URL}/api/posts/${postId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setEditingPost(null);
            setEditDescription('');
            setEditFiles([]);
            await fetchPosts(); // Refresh the post list
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
                        accept="image/*,video/*" // Allow both images and videos
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
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default App;
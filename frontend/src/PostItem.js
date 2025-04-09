import React, { memo, useState } from 'react';

const PostItem = ({
    post,
    editingPost,
    editDescription,
    setEditDescription,
    editFiles,
    setEditFiles,
    isSubmitting,
    handleEditFileChange,
    handleEditSubmit,
    setEditingPost,
    handleDelete,
    handleEditStart,
    API_BASE_URL
}) => {
    // State to track if an image has failed to load (to prevent repeated onError calls)
    const [failedImages, setFailedImages] = useState(new Set());

    // Log to debug re-rendering
    console.log(`Rendering PostItem for post ${post.id}`);

    const handleImageError = (file, e) => {
        if (!failedImages.has(file)) {
            setFailedImages(prev => new Set(prev).add(file));
            e.target.src = '/fallback-image.jpg';
            console.error(`Failed to load image: ${file}`);
        }
    };

    return (
        <div className="post">
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
                                key={`${post.id}-${index}`} // Use a unique key
                                src={`${API_BASE_URL}${file}`}
                                alt="Post media"
                                className="post-image"
                                onError={(e) => handleImageError(file, e)}
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
    );
};

export default memo(PostItem);
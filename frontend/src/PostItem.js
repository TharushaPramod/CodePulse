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
    API_BASE_URL,
    userName
}) => {
    const [failedMedia, setFailedMedia] = useState(new Set());

    console.log(`Rendering PostItem for post ${post.id}`);

    const handleMediaError = (file) => {
        if (!failedMedia.has(file)) {
            setFailedMedia(prev => new Set(prev).add(file));
            console.error(`Failed to load media: ${file}`);
        }
    };

    const renderMedia = (file, index) => {
        const fileExtension = file.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);
        const mediaUrl = `${API_BASE_URL}${file}`;

        if (failedMedia.has(file)) {
            return <p key={`${post.id}-${index}`} className="media-error">Failed to load media.</p>;
        }

        if (isVideo) {
            return (
                <video
                    key={`${post.id}-${index}`}
                    controls
                    className="post-media"
                    onError={() => handleMediaError(file)}
                >
                    <source src={mediaUrl} type={`video/${fileExtension}`} />
                    Your browser does not support the video tag.
                </video>
            );
        } else {
            return (
                <img
                    key={`${post.id}-${index}`}
                    src={mediaUrl}
                    alt="Post media"
                    className="post-media"
                    onError={() => handleMediaError(file)}
                />
            );
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
                        accept="image/*,video/*"
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
                    <h3>{post.userName}</h3>
                    <p>{post.description}</p>
                    {post.mediaFiles && post.mediaFiles.length > 0 ? (
                        post.mediaFiles.map((file, index) => renderMedia(file, index))
                    ) : (
                        <p className="no-media">No media files.</p>
                    )}
                    <p>Likes: {post.likeCount}</p>
                    <p>Posted: {new Date(post.createdAt).toLocaleString()}</p>
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
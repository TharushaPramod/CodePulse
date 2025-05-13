import React, { memo, useState } from 'react';
import Sidenavbar from './components/Sidenavbar';

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
    // State to track if a media file has failed to load
    const [failedMedia, setFailedMedia] = useState(new Set());

    // Log to debug re-rendering
    console.log(`Rendering PostItem for post ${post.id}`);

    const handleMediaError = (file) => {
        if (!failedMedia.has(file)) {
            setFailedMedia(prev => new Set(prev).add(file));
            console.error(`Failed to load media: ${file}`);
        }
    };

    // Determine if the file is an image or video based on its extension
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
        <div>
        <div className="navbar">
                <Sidenavbar />
               
              </div>
       
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
                        accept="image/*,video/*" // Allow both images and videos
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
                        post.mediaFiles.map((file, index) => renderMedia(file, index))
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
        </div>
    );
};

export default memo(PostItem);
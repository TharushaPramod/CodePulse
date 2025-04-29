import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/LearningPlansPage.css';

const LearningPlansPage = () => {
    const [plans, setPlans] = useState([]);
    const [form, setForm] = useState({ id: '', title: '', description: '', timeline: '', topics: [] });
    const [expandedPlan, setExpandedPlan] = useState(null);
    const [videoModal, setVideoModal] = useState({ isOpen: false, url: '' });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        const url = 'http://localhost:8080/api/learning-plans';
        try {
            const response = await axios.get(url);
            setPlans(response.data.value || response.data);
        } catch (error) {
            console.error('Error fetching plans:', error.response ? error.response.status : error.message);
        }
    };

    const handleInputChange = (e, index = null, type = null, resourceIndex = null) => {
        const { name, value } = e.target;
        if (type === 'resource') {
            const updatedTopics = [...form.topics];
            updatedTopics[index].resources[resourceIndex][name] = value;
            setForm({ ...form, topics: updatedTopics });
        } else if (type === 'topic') {
            const updatedTopics = [...form.topics];
            updatedTopics[index][name] = value;
            setForm({ ...form, topics: updatedTopics });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleFileChange = async (e, topicIndex, resourceIndex) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await axios.post('http://localhost:8080/api/learning-plans/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                const filePath = response.data;
                const fileExtension = file.name.split('.').pop().toLowerCase();
                let mediaType = 'File';
                if (['mp4', 'mov'].includes(fileExtension)) mediaType = 'Video';
                else if (['jpg', 'jpeg', 'png'].includes(fileExtension)) mediaType = 'Picture';
                else if (['mp3', 'wav'].includes(fileExtension)) mediaType = 'Audio';
                else if (fileExtension === 'pdf') mediaType = 'PDF';
                
                const updatedTopics = [...form.topics];
                updatedTopics[topicIndex].resources[resourceIndex].filePath = filePath;
                updatedTopics[topicIndex].resources[resourceIndex].type = mediaType;
                setForm({ ...form, topics: updatedTopics });
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const addTopic = () => {
        setForm({
            ...form,
            topics: [...form.topics, { title: '', details: '', resources: [] }],
        });
    };

    const addResource = (topicIndex) => {
        const updatedTopics = [...form.topics];
        updatedTopics[topicIndex].resources.push({ title: '', type: '', content: '', filePath: '' });
        setForm({ ...form, topics: updatedTopics });
    };

    const removeTopic = (index) => {
        const updatedTopics = form.topics.filter((_, i) => i !== index);
        setForm({ ...form, topics: updatedTopics });
    };

    const removeResource = (topicIndex, resourceIndex) => {
        const updatedTopics = [...form.topics];
        updatedTopics[topicIndex].resources = updatedTopics[topicIndex].resources.filter(
            (_, i) => i !== resourceIndex
        );
        setForm({ ...form, topics: updatedTopics });
    };

    const savePlan = async () => {
        console.log('Saving plan:', form);
        try {
            const planData = { 
                title: form.title, 
                description: form.description, 
                timeline: form.timeline, 
                topics: form.topics 
            };
            if (form.id) {
                await axios.put(`http://localhost:8080/api/learning-plans/${form.id}`, planData);
            } else {
                await axios.post('http://localhost:8080/api/learning-plans', planData);
            }
            setForm({ id: '', title: '', description: '', timeline: '', topics: [] });
            fetchPlans();
        } catch (error) {
            console.error('Error saving plan:', error.response ? error.response.status : error.message);
        }
    };

    const editPlan = (plan) => {
        setForm({
            id: plan.id,
            title: plan.title,
            description: plan.description,
            timeline: plan.timeline,
            topics: plan.topics || [],
        });
    };

    const deletePlan = async (id) => {
        console.log('Deleting plan with ID:', id);
        if (!id) {
            console.error('Invalid ID for deletion');
            return;
        }
        try {
            const response = await axios.delete(`http://localhost:8080/api/learning-plans/${id}`);
            console.log('Delete response:', response.status);
            fetchPlans();
        } catch (error) {
            console.error('Error deleting plan:', error.response ? error.response.status : error.message);
        }
    };

    const toggleExpandPlan = (index) => {
        setExpandedPlan(expandedPlan === index ? null : index);
    };

    const openVideoModal = (videoUrl) => {
        setVideoModal({ isOpen: true, url: videoUrl });
    };

    const closeVideoModal = () => {
        setVideoModal({ isOpen: false, url: '' });
    };

    const downloadFile = (filePath, fileName) => {
        const link = document.createElement('a');
        link.href = `http://localhost:8080/uploads/${filePath.split('/').pop()}`;
        link.download = fileName || filePath.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container">
            {videoModal.isOpen && (
                <div className="video-modal">
                    <div className="video-modal-content">
                        <span className="close-modal" onClick={closeVideoModal}>×</span>
                        <video controls autoPlay style={{ width: '100%' }}>
                            <source src={`http://localhost:8080/uploads/${videoModal.url.split('/').pop()}`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}

            <header className="page-header">
                <h1>My Learning Plans</h1>
                <p className="intro-text">Plan your coding journey</p>
            </header>

            <div className="form-section">
                <h2>{form.id ? 'Edit Plan' : 'Create a New Learning Plan'}</h2>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        placeholder="Enter plan title"
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        placeholder="Enter plan description"
                    />
                </div>
                <div className="form-group">
                    <label>Timeline:</label>
                    <input
                        type="text"
                        name="timeline"
                        value={form.timeline}
                        onChange={handleInputChange}
                        placeholder="Enter timeline (e.g., Jan 2025)"
                    />
                </div>

                <h3>Topics</h3>
                {form.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="topic-section">
                        <div className="form-group">
                            <label>Topic Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={topic.title}
                                onChange={(e) => handleInputChange(e, topicIndex, 'topic')}
                                placeholder="Enter topic title"
                            />
                        </div>
                        <div className="form-group">
                            <label>Details:</label>
                            <textarea
                                name="details"
                                value={topic.details}
                                onChange={(e) => handleInputChange(e, topicIndex, 'topic')}
                                placeholder="Enter topic details"
                            />
                        </div>
                        <h4>Resources</h4>
                        {topic.resources.map((resource, resourceIndex) => (
                            <div key={resourceIndex} className="resource-section">
                                <div className="form-group">
                                    <label>Resource Title:</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={resource.title}
                                        onChange={(e) =>
                                            handleInputChange(e, topicIndex, 'resource', resourceIndex)
                                        }
                                        placeholder="Enter resource title"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type:</label>
                                    <select
                                        name="type"
                                        value={resource.type}
                                        onChange={(e) =>
                                            handleInputChange(e, topicIndex, 'resource', resourceIndex)
                                        }
                                    >
                                        <option value="">Select Type</option>
                                        <option value="PDF">PDF</option>
                                        <option value="Video">Video</option>
                                        <option value="Picture">Picture</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Link">Link</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Content:</label>
                                    <input
                                        type="text"
                                        name="content"
                                        value={resource.content}
                                        onChange={(e) =>
                                            handleInputChange(e, topicIndex, 'resource', resourceIndex)
                                        }
                                        placeholder="Enter resource content (URL or description)"
                                    />
                                </div>
                                {(resource.type === 'Video' || resource.type === 'Picture' || resource.type === 'Audio' || resource.type === 'PDF') && (
                                    <div className="form-group">
                                        <label>Upload {resource.type}:</label>
                                        <input
                                            type="file"
                                            accept={
                                                resource.type === 'Video' ? '.mp4,.mov' :
                                                resource.type === 'Picture' ? '.jpg,.jpeg,.png' :
                                                resource.type === 'Audio' ? '.mp3,.wav' :
                                                resource.type === 'PDF' ? '.pdf':''
                                            }
                                            onChange={(e) => handleFileChange(e, topicIndex, resourceIndex)}
                                        />
                                        {resource.filePath && (
                                        <div>
                                            <p>Uploaded: {resource.filePath.split('/').pop()}</p>
                                            {resource.type === 'Picture' && (
                                            <img
                                                src={`http://localhost:8080/uploads/${resource.filePath.split('/').pop()}`}
                                                alt="Preview"
                                                style={{ maxWidth: '100px' }}
                                                onError={(e) => { e.target.style.display = 'none'; console.error('Image load failed'); }}
                                            />
                                            )}
                                            {resource.type === 'Video' && (
                                            <div>
                                                <video 
                                                    controls 
                                                    style={{ maxWidth: '200px' }} 
                                                    onError={(e) => console.error('Video load failed')}
                                                >
                                                    <source src={`http://localhost:8080/uploads/${resource.filePath.split('/').pop()}`} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                                <button 
                                                    className="play-fullscreen-btn"
                                                    onClick={() => openVideoModal(resource.filePath)}
                                                >
                                                    Play Fullscreen
                                                </button>
                                            </div>
                                            )}
                                            {resource.type === 'Audio' && (
                                            <audio controls onError={(e) => console.error('Audio load failed')}>
                                                <source src={`http://localhost:8080/uploads/${resource.filePath.split('/').pop()}`} type="audio/mp3" />
                                                Your browser does not support the audio element.
                                            </audio>
                                            )}
                                            {resource.type === 'PDF' && (
                                            <div>
                                                <iframe
                                                    src={`http://localhost:8080/uploads/${resource.filePath.split('/').pop()}`}
                                                    title="PDF Preview"
                                                    style={{ width: '100%', height: '400px', marginTop: '10px' }}
                                                />
                                                <button 
                                                    className="download-btn"
                                                    onClick={() => downloadFile(resource.filePath, resource.title || 'document.pdf')}
                                                >
                                                    Download PDF
                                                </button>
                                            </div>
                                            )}
                                        </div>
                                        )}
                                    </div>
                                )}
                                <button
                                    className="remove-btn"
                                    onClick={() => removeResource(topicIndex, resourceIndex)}
                                >
                                    Remove Resource
                                </button>
                            </div>
                        ))}
                        <div className="button-container">
                        <button className="add-btn button-common" onClick={() => addResource(topicIndex)}>
                            Add Resource
                        </button>
                        <button className="remove-btn button-common" onClick={() => removeTopic(topicIndex)}>
                            Remove Topic
                        </button>
                    </div>
                    </div>
                ))}
                <div className="button-group">
                <button className="add-btn button-common" onClick={addTopic}>Add Topic</button>
                <button className="save-btn button-common" onClick={savePlan}>Save Plan</button>
            </div>
            </div>

            <div className="plans-section">
                <h2>Your Plans</h2>
                {plans.length === 0 ? (
                    <p>No plans yet—start by creating one!</p>
                ) : (
                    plans.map((plan, index) => (
                        <div key={plan.id} className="plan-card">
                            <div className="plan-header" onClick={() => toggleExpandPlan(index)}>
                                <h3>{plan.title}</h3>
                                <span>{expandedPlan === index ? '▼' : '▶'}</span>
                            </div>
                            {expandedPlan === index && (
                                <div className="plan-details">
                                    <p><strong>Description:</strong> {plan.description}</p>
                                    <p><strong>Timeline:</strong> {plan.timeline}</p>
                                    <h4>Topics:</h4>
                                    {plan.topics.map((topic, topicIndex) => (
                                        <div key={topicIndex} className="topic-details">
                                            <h5>{topic.title}</h5>
                                            <p>{topic.details}</p>
                                            <h6>Resources:</h6>
                                            {topic.resources.map((resource, resourceIndex) => (
                                                <div key={resourceIndex} className="resource-details">
                                                    <p>
                                                        <strong>{resource.title}</strong> ({resource.type}):{' '}
                                                        {resource.type === 'Link' ? (
                                                            <a href={resource.content} target="_blank" rel="noopener noreferrer">
                                                                {resource.content}
                                                            </a>
                                                        ) : resource.type === 'Video' && resource.filePath ? (
                                                            <div>
                                                                <button 
                                                                    className="play-btn"
                                                                    onClick={() => openVideoModal(resource.filePath)}
                                                                >
                                                                    Play Video
                                                                </button>
                                                            </div>
                                                        ) : resource.type === 'Picture' && resource.filePath ? (
                                                            <img
                                                                src={`http://localhost:8080/uploads/${resource.filePath.split('/').pop()}`}
                                                                alt={resource.title}
                                                                style={{ maxWidth: '100px' }}
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        ) : resource.type === 'Audio' && resource.filePath ? (
                                                            <audio controls>
                                                                <source src={`http://localhost:8080/uploads/${resource.filePath.split('/').pop()}`} type="audio/mp3" />
                                                                Your browser does not support the audio element.
                                                            </audio>
                                                        ) : resource.type === 'PDF' && resource.filePath ? (
                                                            <div>
                                                                <button 
                                                                    className="download-btn"
                                                                    onClick={() => downloadFile(resource.filePath, resource.title || 'document.pdf')}
                                                                >
                                                                    Download PDF
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            resource.content
                                                        )}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    <div className="plan-actions">
                                        <button className="edit-btn" onClick={() => editPlan(plan)}>
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => deletePlan(plan.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LearningPlansPage;
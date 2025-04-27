import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/user', {
        name: formData.name,
        email: formData.email,
        password: parseInt(formData.password) // Convert to number to match backend User model
      });

      setMessage(`Registration successful for ${response.data.name}!`);
      setFormData({ name: '', email: '', password: '' });
      
      // Navigate to Login page after a short delay to show success message
      setTimeout(() => {
        navigate('/login'); // Adjust the path to match your route for Login.js
      }, 1000); // 1-second delay
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>
        <button onClick={handleRegister}>Register</button>
        {message && (
          <p className={message.includes('Error') ? 'error-message' : 'success-message'}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;
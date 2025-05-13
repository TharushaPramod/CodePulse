import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form default submission behavior

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setMessage('Error: All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/users/user', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      setMessage(`Registration successful for ${response.data.user.name}!`);

      // Clear form fields
      setFormData({ name: '', email: '', password: '' });

      // Redirect after delay
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 2 seconds delay
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister} autoComplete="off">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="new-password"
            />
          </div>
          <button type="submit">Register</button>
        </form>
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

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setMessage('Error: Email and password are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('Login response:', response.data); // Debug the response

      const userName = response.data.name;
      if (!userName) {
        throw new Error('User name not found in response');
      }

      // Store userName in localStorage immediately
      localStorage.setItem('userName', userName);

      setMessage(`Login successful for ${userName}!`);
      setFormData({ email: '', password: '' });

      // Navigate to PostList page with userName in state
      setTimeout(() => {
        navigate('/view', { state: { userName } });
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h2>Login</h2>
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
        <button onClick={handleLogin}>Login</button>
        {message && (
          <p className={message.includes('Error') ? 'error-message' : 'success-message'}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
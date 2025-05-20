import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Comment from './pages/Comment';
import PostViwe from './pages/PostView';
import PostDetails from './pages/PostDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import Sidenavbar from './components/Sidenavbar';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="192993125789-6nkj7ll51f4un8hciqfhdv04epbabv18.apps.googleusercontent.com">
    <BrowserRouter>
      <Routes>
        <Route path='/app' element={<App/>} />
        <Route path='/comment' element={<Comment/>} />
        <Route path='/view' element={<PostViwe/>} />
        <Route path='/' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/navbar' element={<Sidenavbar/>} />
        <Route path="/post/:postId" element={<PostDetails />} />
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>
);

reportWebVitals();
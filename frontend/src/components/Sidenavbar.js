import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './Navbar.css';

export default function Sidenavbar() {
  return (
    <div className='side_nav_bar'>
      <div>
        <h1 className='codepulse'>CODEPULSE</h1>
        <div className='home_nav active'><HomeIcon className='home_icon' /><h1>Dashboard</h1></div>
        <div className='home_nav'><AccountCircleIcon className='home_icon' /><h1>Profile</h1></div>
        <div className='home_nav'><SchoolIcon className='home_icon' /><h1>Course</h1></div>
        <div className='home_nav'><AddCircleOutlineIcon className='home_icon' /><h1>Create Post</h1></div>
        <div className='home_nav'><NotificationsIcon className='home_icon' /><h1>Notification</h1></div>
      </div>

     
    </div>
  );
}

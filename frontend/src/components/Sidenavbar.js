import React from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './Navbar.css';

export default function Sidenavbar() {
  return (
    <div className="side_nav_bar">
      <div>
        <h1 className="codepulse">CODEPULSE</h1>
        <NavLink
          to="/view"
          className={({ isActive }) => `home_nav ${isActive ? 'active' : ''}`}
        >
          <HomeIcon className="home_icon" />
          <h1>Dashboard</h1>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `home_nav ${isActive ? 'active' : ''}`}
        >
          <AccountCircleIcon className="home_icon" />
          <h1>Profile</h1>
        </NavLink>
        <NavLink
          to="/course"
          className={({ isActive }) => `home_nav ${isActive ? 'active' : ''}`}
        >
          <SchoolIcon className="home_icon" />
          <h1>Course</h1>
        </NavLink>
        <NavLink
          to="/app"
          className={({ isActive }) => `home_nav ${isActive ? 'active' : ''}`}
        >
          <AddCircleOutlineIcon className="home_icon" />
          <h1>Create Post</h1>
        </NavLink>
        <NavLink
          to="/notification"
          className={({ isActive }) => `home_nav ${isActive ? 'active' : ''}`}
        >
          <NotificationsIcon className="home_icon" />
          <h1>Notification</h1>
        </NavLink>
      </div>
    </div>
  );
}
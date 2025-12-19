import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user = {}, onLogout }) => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(prev => !prev);
  };

  // Safely read user properties using optional chaining + fallback
  const username = user?.psa_id ?? user?.name ?? 'Guest';

  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <div className="logo">📊 Training Tracker Tool</div>

        <ul className={`nav-links ${menuActive ? 'active' : ''}`}>
          <li>
            <Link to="/dashboard" onClick={() => setMenuActive(false)}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/partner" onClick={() => setMenuActive(false)}>
              Partners
            </Link>
          </li>
          <li>
            <Link to="/training" onClick={() => setMenuActive(false)}>
              Training
            </Link>
          </li>
          <li>
            <Link to="/certification" onClick={() => setMenuActive(false)}>
              Certifications
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <div className="user-info">
          <span className="user-name">{username}</span>
          <span className="user-role">Logged In</span>
        </div>

        <img
          className="avatar"
          src="https://i.pravatar.cc/40?img=3"
          alt="Profile"
        />

        {onLogout && (
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        )}

        <button
          className="menu-toggle"
          aria-label="Toggle navigation menu"
          onClick={toggleMenu}
        >
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ currentPage = 'home', onPageChange, theme = 'light', toggleTheme, isLoggedIn = false, onLogout, userProfile = null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (page) => {
    setIsMenuOpen(false);
    onPageChange && onPageChange(page);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">LearnStyle</span>
        </div>

        {/* Mobile menu button */}
        <button 
          className={`mobile-menu-button ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <a 
            href="#home" 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </a>
          <a 
            href="#about" 
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick('about')}
          >
            About Us
          </a>
          <a
            href="#contact"
            className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
            onClick={() => handleNavClick('contact')}
          >
            Contact Us
          </a>
          <a
            href="#profile"
            className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
          >
            Profile
          </a>
          
          {isLoggedIn && userProfile && userProfile.userType === 'Admin' && (
            <a
              href="#admin-dashboard"
              className={`nav-link ${currentPage === 'admin-dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('admin-dashboard')}
            >
              Admin Dashboard
            </a>
          )}

          {isLoggedIn && (!userProfile || userProfile.userType !== 'Admin') && (
            <a
              href="#dashboard"
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              Dashboard
            </a>
          )}
          <a
            href="#blog"
            className={`nav-link ${currentPage === 'blog' ? 'active' : ''}`}
            onClick={() => handleNavClick('blog')}
          >
            Blog
          </a>
        </div>

        {/* Buttons */}
        <div className={`navbar-buttons ${isMenuOpen ? 'active' : ''}`}>
          {!isLoggedIn && (
            <button className="btn btn-user" onClick={() => handleNavClick('student')}>
              User Login
            </button>
          )}
          {isLoggedIn && (
            <button className="btn btn-admin" onClick={onLogout} style={{ marginLeft: '10px' }}>
              Logout
            </button>
          )}
          {/* Theme Toggle */}
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{ marginLeft: '12px' }}
          >
            {theme === 'light' ? '🌙' : '🌞'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
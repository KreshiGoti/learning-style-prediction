import React, { useState } from 'react';
import './ModernNavbar.css';

const ModernNavbar = ({ isLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsMenuOpen(false); // Close mobile menu when link is clicked
    
    // Handle profile page navigation
    if (page === 'profile') {
      // You can add specific logic for profile navigation here
      console.log('Navigating to profile page');
    }
  };

  return (
    <nav className="modern-navbar">
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

        {/* Navigation Links and Buttons */}
        <div className={`navbar-interactive ${isMenuOpen ? 'active' : ''}`}>
          <a 
            href="#home" 
            className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </a>
          <a 
            href="#about" 
            className={`nav-link ${activePage === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick('about')}
          >
            About Us
          </a>
          <a 
            href="#contact" 
            className={`nav-link ${activePage === 'contact' ? 'active' : ''}`}
            onClick={() => handleNavClick('contact')}
          >
            Contact Us
          </a>
          <a 
            href="#profile" 
            className={`nav-link ${activePage === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
          >
            Profile
          </a>
          <a 
            href="#quiz" 
            className={`nav-link ${activePage === 'quiz' ? 'active' : ''}`}
            onClick={() => handleNavClick('quiz')}
          >
            Quiz
          </a>
          <a 
            href="#blog" 
            className={`nav-link ${activePage === 'blog' ? 'active' : ''}`}
            onClick={() => handleNavClick('blog')}
          >
            Blog
          </a>
          {isLoggedIn ? (
            <button 
              className="btn btn-admin"
              onClick={onLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <button className="btn btn-admin">
                Admin Login
              </button>
              <button className="btn btn-user">
                User Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
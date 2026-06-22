import React, { useState } from 'react';
import './AdminLoginPage.css';

const AdminLoginPage = ({ onPageChange, theme, toggleTheme, onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsMenuOpen(false);
    if (page === 'home') {
      onPageChange('home');
    } else if (page === 'about') {
      onPageChange('about');
    } else if (page === 'contact') {
      onPageChange('contact');
    } else if (page === 'admin') {
      // already on admin, do nothing
    } else if (page === 'student') {
      onPageChange('student');
    } else if (page === 'quiz') {
      onPageChange('quiz');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle admin login logic here
    console.log('Admin login attempt:', formData);
    
    // For demo purposes, simulate successful login
    if (formData.username && formData.password) {
      // Simulate login with a delay to show loading state if needed
      setTimeout(() => {
        onLogin();
        onPageChange('home');
      }, 1000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login-page">
      {/* Admin Login Section */}
      <section className="admin-login-section">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <div className="shield-icon">
              <span className="shield-emoji">🛡️</span>
            </div>
            
            <h1 className="admin-login-title">Admin Login</h1>
            <p className="admin-login-subtitle">
              Access the admin dashboard to manage quizzes and view analytics
            </p>

            <form className="admin-login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Enter admin username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="eye-icon">
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </span>
                </button>
              </div>

              <button type="submit" className="sign-in-btn">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLoginPage;
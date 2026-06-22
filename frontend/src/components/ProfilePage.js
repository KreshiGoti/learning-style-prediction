import React, { useState, useEffect } from 'react';
import './Navbar.css';
import './AboutPage.css';
import './HomePage.css';
import './ProfilePage.css';

const ProfilePage = ({ onPageChange, theme, toggleTheme, userProfile, onProfileSave }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    userType: 'Student'
  });

  useEffect(() => {
    (async () => {
      // Initialize from prop first (optimistic UI)
      if (userProfile) {
        setFormData({
          name: userProfile.name || '',
          dateOfBirth: userProfile.dateOfBirth || '',
          email: userProfile.email || '',
          phoneNumber: userProfile.phoneNumber || '',
          userType: userProfile.userType || 'Student'
        });
      } else {
        setFormData(prev => ({ ...prev, userType: 'Student' }));
      }

      // Try to fetch profile from backend (cookie-auth)
      try {
        const res = await fetch('/auth/profile', { method: 'GET', credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            dateOfBirth: data.dateOfBirth || prev.dateOfBirth,
            email: data.email || prev.email,
            phoneNumber: data.phoneNumber || prev.phoneNumber
          }));
        }
      } catch {
        // ignore fetch errors
      }
    })();
  }, [userProfile]);

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
      onPageChange('admin');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic phone validation (10-15 digits)
    const phoneDigits = (formData.phoneNumber || '').replace(/\D/g, '');
    if (phoneDigits && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
      alert('Please enter a valid phone number (10-15 digits).');
      return;
    }
    // Ensure dateOfBirth is a YYYY-MM-DD string (type=date already ensures this in most browsers)
    try {
      const res = await fetch('/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth,
          phoneNumber: phoneDigits || formData.phoneNumber,
        })
      });
      if (!res.ok) {
        const msg = await res.text();
        alert(`Failed to save profile: ${msg}`);
        return;
      }
      const updated = await res.json();
      onProfileSave && onProfileSave({
        name: updated.name,
        email: updated.email,
        dateOfBirth: updated.dateOfBirth,
        phoneNumber: updated.phoneNumber,
        userType: formData.userType || 'Student',
      });
      alert('Profile saved successfully');
      onPageChange && onPageChange('about');
    } catch (err) {
      alert('Network error saving profile');
    }
  };

  return (
    <div className="about-page">

      {/* Profile Section */}
      <section className="about-section">
        <div className="about-container">
          <h1 className="about-heading">
            <span className="about-brand">Profile</span> Details
          </h1>
          <p className="about-description">
            Please provide your profile information to personalize your learning experience.
          </p>
          
          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="userType" className="form-label">
                User Type
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Your Full Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth" className="form-label">
                Date of Birth (dd-mm-yyyy)
              </label>
              <input
                type="text"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="dd-mm-yyyy"
                pattern="^\d{2}-\d{2}-\d{4}$"
                title="Enter date as dd-mm-yyyy (e.g., 12-05-2002)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Your Email Address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                pattern="[0-9\-\+\s\(\)]{10,20}"
                title="Enter a valid phone number (10-15 digits)"
                className="form-input"
                placeholder="Your Phone Number"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-user"
              style={{ width: '100%' }}
            >
              Save Profile
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
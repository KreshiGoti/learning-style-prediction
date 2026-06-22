import React, { useState } from 'react';
import './AboutPage.css';
import AboutCards from './AboutCards';

const AboutPage = ({ onPageChange, theme, toggleTheme, isLoggedIn, onLogin, onLogout, userProfile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('about');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsMenuOpen(false);
    if (page === 'home') {
      onPageChange('home');
    } else if (page === 'contact') {
      onPageChange('contact');
    } else if (page === 'admin') {
      onPageChange('admin');
    } else if (page === 'student') {
      onPageChange('student');
    } else if (page === 'profile') {
      onPageChange('profile');
    } else if (page === 'quiz') {
      onPageChange('quiz');
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="about-page">

      {/* About Us Section */}
      <section className="about-section">
        <div className="about-container">
          <h1 className="about-heading">
            About <span className="about-brand">LearnStyle</span>
          </h1>
          <p className="about-description">
            We're passionate about transforming education through personalized learning experiences. 
            Our mission is to empower every learner with the tools they need to succeed.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="mission-vision-section">
        <div className="mission-vision-container">
          <div className="mission-vision-cards">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3 className="mission-title">Our Mission</h3>
              <p className="mission-description">
                To revolutionize education by helping every learner discover their unique learning style and reach their full potential.
              </p>
            </div>
            
            <div className="vision-card">
              <div className="vision-icon">👁️</div>
              <h3 className="vision-title">Our Vision</h3>
              <p className="vision-description">
                A world where education is personalized for every individual, making learning more effective and enjoyable.
              </p>
            </div>
            
            <div className="values-card">
              <div className="values-icon">❤️</div>
              <h3 className="values-title">Our Values</h3>
              <p className="values-description">
                We believe in inclusive, accessible, and scientifically-backed approaches to understanding how people learn best.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 
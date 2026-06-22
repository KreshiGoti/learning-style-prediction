import React, { useEffect, useState } from 'react';
import './HomePage.css';

const HomePage = ({ onPageChange, theme, toggleTheme, isLoggedIn, onLogin, onLogout, userProfile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [hasProgress, setHasProgress] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsMenuOpen(false);
    if (page === 'about') {
      onPageChange('about');
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem('quizProgress');
      if (raw) {
        const saved = JSON.parse(raw);
        setHasProgress(Boolean(saved && saved.inProgress));
      } else {
        setHasProgress(false);
      }
    } catch {
      setHasProgress(false);
    }
  }, []);

  return (
    <div className="homepage">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-heading">
              Discover Your <span className="gradient-text">Learning Style</span>
            </h1>
            {isLoggedIn && (
              <div className="hero-welcome" style={{ margin: '0.25rem 0 0.75rem 0', color: '#6b7280' }}>
                Welcome back{userProfile?.name ? `, ${userProfile.name}` : ''}!
              </div>
            )}
            <p className="hero-description">
              Take our comprehensive learning style assessment to discover how you learn best. 
              Get personalized recommendations and strategies tailored to your unique learning preferences.
            </p>
            <div className="hero-buttons">
              <button
                className="hero-btn primary-btn"
                onClick={() => onPageChange(isLoggedIn ? 'quiz' : 'student')}
              >
                Start Learning Quiz
                <span className="arrow-icon">→</span>
              </button>
              {isLoggedIn && hasProgress && (
                <button
                  className="hero-btn secondary-btn"
                  onClick={() => onPageChange('quiz')}
                >
                  Continue Where You Left Off
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-heading">Why Choose LearnStyle?</h2>
          <p className="features-description">
            Our platform combines cutting-edge research with personalized learning strategies 
            to help you achieve your educational goals more effectively and efficiently.
          </p>
        </div>
      </section>

      {/* Features Cards Section */}
      <section className="features-cards-section">
        <div className="features-cards-container">
          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3 className="feature-title">Comprehensive Assessment</h3>
            <p className="feature-description">
              Take our detailed learning style assessment to discover your unique preferences and strengths.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👩‍🏫</div>
            <h3 className="feature-title">Expert Guidance</h3>
            <p className="feature-description">
              Get personalized recommendations from educational experts tailored to your learning style.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3 className="feature-title">Smart Strategies</h3>
            <p className="feature-description">
              Access proven learning strategies and techniques that match your individual preferences.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Track Progress</h3>
            <p className="feature-description">
              Monitor your learning journey and see how your strategies improve your educational outcomes.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
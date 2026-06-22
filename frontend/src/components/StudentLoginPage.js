import React, { useState } from 'react';
import './StudentLoginPage.css';

const StudentLoginPage = ({ onPageChange, theme, toggleTheme, onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('student');
  const [activeTab, setActiveTab] = useState('signup'); // 'signup' | 'login'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'Student',
  });
  const [signupData, setSignupData] = useState({
    userType: 'Student',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
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
      onPageChange('admin');
    } else if (page === 'student') {
      onPageChange('student');
    } else if (page === 'quiz') {
      onPageChange('quiz');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupData.agree) {
      alert('Please agree to the Terms and Privacy Policy.');
      return;
    }
    if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      alert('Please fill all the fields.');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    try {
      const res = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: signupData.fullName,
          email: signupData.email,
          password: signupData.password,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        alert(`Signup failed: ${msg}`);
        return;
      }
      // After successful signup, take user to Login tab
      setActiveTab('login');
    } catch (err) {
      console.error('Signup error', err);
      alert('Signup error, please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Treat username as email for backend auth
      const res = await fetch('/auth/login-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: formData.username, password: formData.password }),
      });
      if (res.status === 204) {
        onLogin({
          name: formData.username,
          email: formData.username,
          userType: formData.userType,
        });
        onPageChange('home');
      } else {
        const msg = await res.text();
        alert(`Login failed: ${msg}`);
      }
    } catch (err) {
      console.error('Login error', err);
      alert('Login error, please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="student-login-page">
      {/* Student Login Section */}
      <section className="student-login-section">
        <div className="student-login-container" style={{ maxWidth: '520px' }}>
          <div className="student-login-card" style={{ border: '3px solid #e2e8f0' }}>
            <div className="avatar-gradient">
              <span className="avatar-emoji">👤</span>
            </div>
            {/* Tabs Header (inline styles only, no CSS changes) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '16px'
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '12px 16px',
                  borderBottom: activeTab === 'signup' ? '3px solid #a855f7' : '3px solid transparent',
                  color: activeTab === 'signup' ? '#6d28d9' : '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '12px 16px',
                  borderBottom: activeTab === 'login' ? '3px solid #a855f7' : '3px solid transparent',
                  color: activeTab === 'login' ? '#6d28d9' : '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Log In
              </button>
            </div>

            {activeTab === 'signup' ? (
              <>
                <h1 className="student-login-title">Create Account</h1>
                <form className="student-login-form" onSubmit={handleSignupSubmit}>
                  <div className="form-group">
                    <label htmlFor="su-userType" className="form-label">User Type</label>
                    <select
                      id="su-userType"
                      name="userType"
                      value={signupData.userType}
                      onChange={handleSignupChange}
                      className="form-input"
                    >
                      <option value="Student">Student</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={signupData.fullName}
                      onChange={handleSignupChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group password-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="eye-icon">{showPassword ? '👁️' : '👁️‍🗨️'}</span>
                    </button>
                  </div>
                  <div className="form-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group" style={{textAlign:'left'}}>
                    <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', color:'#64748b', fontSize:'0.95rem' }}>
                      <input type="checkbox" name="agree" checked={signupData.agree} onChange={handleSignupChange} />
                      <span>I agree to the <strong>Terms</strong> and <strong>Privacy Policy</strong></span>
                    </label>
                  </div>
                  <button type="submit" className="login-btn">Create Account</button>
                </form>
              </>
            ) : (
              <>
                <h1 className="student-login-title">Log In</h1>
                <form className="student-login-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="userType" className="form-label">User Type</label>
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
                    <input
                      type="email"
                      name="username"
                      placeholder="Enter your email"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group password-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="eye-icon">{showPassword ? '👁️' : '👁️‍🗨️'}</span>
                    </button>
                  </div>
                  <button type="submit" className="login-btn">Start Learning Journey</button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentLoginPage;
import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import StudentLoginPage from './components/StudentLoginPage';
import ContactUs from './components/ContactUs';
import ProfilePage from './components/ProfilePage';
import QuizPage from './components/QuizPage';
import BlogPage from './components/BlogPage';
import BlogDetail2 from './components/BlogDetail2';
import BlogDetail3 from './components/BlogDetail3';
import BlogDetail4 from './components/BlogDetail4';
import BlogDetail5 from './components/BlogDetail5';
import BlogDetail6 from './components/BlogDetail6';
import BlogDetail1 from './components/BlogDetail1';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Apply theme class to body element
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // Check if user is already logged in via backend cookie when app loads
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/auth/me-cookie', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const user = await res.json();
          setIsLoggedIn(true);
          setUserProfile({
            name: user.name,
            email: user.email,
            dateOfBirth: user.dateOfBirth || '',
            phoneNumber: user.phoneNumber || '',
            userType: user.role || 'Student',
          });
        }
      } catch (e) {
        // ignore network errors here
      }
    })();
  }, []);

  const handlePageChange = (page) => {
    if (page === 'quiz') {
      // Temporarily allow direct access to Quiz (backend auth not available yet)
      setCurrentPage('quiz');
      return;
    }
    setCurrentPage(page);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Toggle CSS class on body element
    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleLogin = (user = {}) => {
    console.log('Login function called', user);
    setIsLoggedIn(true);
    // Initialize/merge a user profile when logging in
    setUserProfile({
      name: user.name || 'Default User',
      email: user.email || 'user@example.com',
      userType: user.userType || 'Student'
    });
    console.log('Login state set to true, userProfile initialized');
  };

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    setIsLoggedIn(false);
    setUserProfile(null);
    setCurrentPage('home');
  };

  const handleProfileSave = (profileData) => {
    setUserProfile(profileData);
    setCurrentPage('about');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onPageChange={handlePageChange} 
            theme={theme} 
            toggleTheme={toggleTheme}
            isLoggedIn={isLoggedIn}
            userProfile={userProfile}
          />
        );
      case 'about':
        return <AboutPage onPageChange={handlePageChange} theme={theme} toggleTheme={toggleTheme} />;
      case 'contact':
        return <ContactUs onPageChange={handlePageChange} theme={theme} toggleTheme={toggleTheme} />;
      case 'student':
        return <StudentLoginPage onPageChange={handlePageChange} onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
      case 'profile':
        return (
          <ProfilePage 
            onPageChange={handlePageChange} 
            theme={theme} 
            toggleTheme={toggleTheme} 
            userProfile={userProfile}
            onProfileSave={handleProfileSave}
          />
        );
      case 'dashboard':
        return <UserDashboard onPageChange={handlePageChange} />;
      case 'quiz':
        return <QuizPage onPageChange={handlePageChange} theme={theme} toggleTheme={toggleTheme} />;
      case 'blog':
        return <BlogPage onPageChange={handlePageChange} theme={theme} toggleTheme={toggleTheme} />;
      case 'admin-dashboard':
        return <AdminDashboard onPageChange={handlePageChange} />;
      case 'blog-detail-1':
        return <BlogDetail1 onPageChange={handlePageChange} />;
      case 'blog-detail-2':
        return <BlogDetail2 onPageChange={handlePageChange} />;
      case 'blog-detail-3':
        return <BlogDetail3 onPageChange={handlePageChange} />;
      case 'blog-detail-4':
        return <BlogDetail4 onPageChange={handlePageChange} />;
      case 'blog-detail-5':
        return <BlogDetail5 onPageChange={handlePageChange} />;
      case 'blog-detail-6':
        return <BlogDetail6 onPageChange={handlePageChange} />;
      default:
        return <HomePage onPageChange={handlePageChange} theme={theme} toggleTheme={toggleTheme} />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
        theme={theme}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        onLogout={handleLogout}
      />
      {renderPage()}
    </div>
  );
}

export default App;
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import './Header.css';
import colors from '../../constants/colors';
import logo from '../../assets/images/final logo.svg';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowProfileDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleStoriesClick = (e) => {
    e.preventDefault();
    navigate('/stories');
  };

  // Get user initials for avatar
  const handleTellYourStory = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    try {
      const completed = await profileService.isProfileCompleted(currentUser.uid);
      if (completed) {
        navigate('/create-story');
      } else {
        alert('Please complete your profile first before sharing your story!');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      navigate('/profile');
    }
  };

  const getUserInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section" onClick={handleLogoClick}>
          <div className="logo-icon">
            <img 
              src={logo} 
              alt="IdeaCide Logo" 
              className="logo-image"
            />
          </div>
          <span className="logo-text">IdeaCide</span>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <a href="/stories" className="nav-link" onClick={handleStoriesClick}>Stories</a>
          <a href="/sandbox" className="nav-link">Sandbox</a>
          <a href="/chatbot" className="nav-link">AI Chatbot</a>
          <a href="#collaboration" className="nav-link">Collaboration</a>
          {currentUser && (
            <a href="/create-story" className="nav-link create-story-link" onClick={handleTellYourStory}>
              ✍️ Tell Your Story
            </a>
          )}
        </nav>

        {/* Profile Section or Sign Up Button */}
        {currentUser ? (
          <div className="profile-section" ref={dropdownRef}>
            <button className="profile-button" onClick={toggleProfileDropdown}>
              <div className="profile-avatar">
                {getUserInitials()}
              </div>
            </button>
            
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {getUserInitials()}
                  </div>
                  <div className="dropdown-info">
                    <div className="dropdown-name">
                      {currentUser.displayName || 'User'}
                    </div>
                    <div className="dropdown-email">
                      {currentUser.email}
                    </div>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-actions">
                  <button className="dropdown-item" onClick={() => {
                    setShowProfileDropdown(false);
                    navigate('/profile');
                  }}>
                    <span className="dropdown-icon">👤</span>
                    Profile
                  </button>
                  
                  <button className="dropdown-item" onClick={() => {
                    setShowProfileDropdown(false);
                    navigate('/settings');
                  }}>
                    <span className="dropdown-icon">⚙️</span>
                    Settings
                  </button>
                  
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="signup-button" onClick={handleSignUpClick}>
            Sign Up
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import colors from '../../constants/colors';
import logo from '../../assets/images/final logo.svg';

const Header = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section">
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
          <a href="#stories" className="nav-link">Stories</a>
          <a href="/sandbox" className="nav-link">Sandbox</a>
          <a href="/chatbot" className="nav-link">AI Chatbot</a>
          <a href="#collaboration" className="nav-link">Collaboration</a>
        </nav>

        {/* Sign Up Button */}
        <button className="signup-button" onClick={handleSignUpClick}>
          Sign Up
        </button>
      </div>
    </header>
  );
};

export default Header;

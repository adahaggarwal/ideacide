import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleExploreStories = () => {
    // Scroll to stories section
    document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTryFailometer = () => {
    navigate('/sandbox');
  };

  const handleShareStory = () => {
    if (currentUser) {
      navigate('/create-story');
    } else {
      navigate('/signin');
    }
  };
  return (
    <section className="hero">
      <div className="hero-container">
        {/* Light Bulb Image */}
        <div className="hero-image">
          <div className="bulb-container">
            <div className="bulb-glow"></div>
            <div className="bulb-icon">💡</div>
            <div className="bulb-reflection"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <h1 className="hero-title">
            Where Failure Fuels the Future
          </h1>
          <p className="hero-subtitle">
            Learn from the past. Build smarter.
          </p>

          {/* Action Buttons */}
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleExploreStories}>
              Explore Stories
            </button>
            <button className="btn-secondary" onClick={handleTryFailometer}>
              Try Sandbox
            </button>
            <button className="btn-tertiary" onClick={handleShareStory}>
              📝 Share Your Story
            </button>
          </div>
        </div>

        {/* Background Effects */}
        <div className="hero-bg-effects">
          <div className="glow-effect glow-1"></div>
          <div className="glow-effect glow-2"></div>
          <div className="glow-effect glow-3"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

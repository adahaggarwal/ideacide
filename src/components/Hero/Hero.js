import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import ModernButton from '../ModernButton';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const { currentUser, profileCompleted } = useAuth();
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  const handleExploreStories = () => {
    // Scroll to stories section
    document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTryFailometer = () => {
    navigate('/sandbox');
  };

  const handleShareStory = async () => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    // Check if profile is completed
    setIsCheckingProfile(true);
    try {
      const completed = await profileService.isProfileCompleted(currentUser.uid);
      if (completed) {
        navigate('/create-story');
      } else {
        // Show alert and redirect to profile
        alert('Please complete your profile first before sharing your story!');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      // If there's an error, redirect to profile to be safe
      navigate('/profile');
    } finally {
      setIsCheckingProfile(false);
    }
  };
  // Get button text based on profile status
  const getShareStoryButtonText = () => {
    if (isCheckingProfile) {
      return '⏳ Checking...';
    }
    if (currentUser && !profileCompleted) {
      return '📝 Complete Profile First';
    }
    return '📝 Share Your Story';
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
            <ModernButton 
              variant="primary" 
              size="large"
              onClick={handleExploreStories}
            >
              ✨ Explore Stories
            </ModernButton>
            <ModernButton 
              variant="secondary" 
              size="large"
              onClick={handleTryFailometer}
            >
              🚀 Try Sandbox
            </ModernButton>
            <ModernButton 
              variant="tertiary" 
              size="large"
              onClick={handleShareStory}
              disabled={isCheckingProfile}
              loading={isCheckingProfile}
            >
              {getShareStoryButtonText()}
            </ModernButton>
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

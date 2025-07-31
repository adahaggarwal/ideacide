import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Header, Footer } from '../../components';
import { profileService } from '../../services/profileService';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, refreshProfileStatus } = useAuth();
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    user_type: '',
    has_active_startup: null,
    startup_industry: '',
    startup_details: '',
    failure_reason: '',
    platform_purpose: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }
    loadProfile();
  }, [currentUser, navigate]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await profileService.getProfile(currentUser.uid);
      
      if (profile) {
        setProfileData(profile);
        setIsEditing(false);
      } else {
        // No profile exists, create new one
        setIsEditing(true);
        setProfileData(prev => ({
          ...prev,
          full_name: currentUser.displayName || '',
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
      setIsEditing(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePurposeChange = (purpose) => {
    setProfileData(prev => {
      const purposes = prev.platform_purpose || [];
      const newPurposes = purposes.includes(purpose)
        ? purposes.filter(p => p !== purpose)
        : [...purposes, purpose];
      
      return {
        ...prev,
        platform_purpose: newPurposes
      };
    });
  };

  const validateForm = () => {
    if (!profileData.full_name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!profileData.user_type) {
      setError('Please select your role');
      return false;
    }
    if (profileData.has_active_startup === null) {
      setError('Please specify if you have an active startup');
      return false;
    }
    if (profileData.has_active_startup && !profileData.startup_industry.trim()) {
      setError('Please specify your startup industry');
      return false;
    }
    if (!profileData.has_active_startup && !profileData.failure_reason.trim()) {
      setError('Please explain why your startup failed or why you don\'t have one');
      return false;
    }
    if (profileData.platform_purpose.length === 0) {
      setError('Please select at least one platform purpose');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await profileService.createOrUpdateProfile(currentUser.uid, {
        ...profileData,
        email: currentUser.email,
        profile_completed: true
      });

      // Refresh the profile status in auth context
      await refreshProfileStatus();
      
      setIsEditing(false);
      setSuccessMessage('Profile saved successfully! You can now access all features.');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-container">
          <div className="loading">Loading profile...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header />
      
      <div className="profile-container">
        <div className="profile-header">
          <h1>Your Profile</h1>
          <p>Tell us about yourself to get a personalized experience</p>
          
          {/* Profile completion indicator */}
          {!isEditing && (
            <div className="profile-completion">
              <div className="completion-icon">
                {profileData.profile_completed ? '✅' : '⏳'}
              </div>
              <div className={`completion-text ${profileData.profile_completed ? 'completion-complete' : 'completion-incomplete'}`}>
                {profileData.profile_completed ? 'Profile Complete' : 'Profile Incomplete'}
              </div>
            </div>
          )}
        </div>

        {!isEditing ? (
          // Display Mode
          <div className="profile-display">
            <div className="profile-info">
              <div className="info-group">
                <label>Full Name</label>
                <p>{profileData.full_name}</p>
              </div>

              <div className="info-group">
                <label>Role</label>
                <p>{profileData.user_type?.replace('_', ' ')?.toUpperCase()}</p>
              </div>

              <div className="info-group">
                <label>Active Startup</label>
                <p>{profileData.has_active_startup ? 'Yes' : 'No'}</p>
              </div>

              {profileData.has_active_startup ? (
                <>
                  <div className="info-group">
                    <label>Startup Industry</label>
                    <p>{profileData.startup_industry}</p>
                  </div>
                  {profileData.startup_details && (
                    <div className="info-group">
                      <label>Startup Details</label>
                      <p>{profileData.startup_details}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="info-group">
                  <label>Why no active startup?</label>
                  <p>{profileData.failure_reason}</p>
                </div>
              )}

              <div className="info-group">
                <label>Platform Purpose</label>
                <div className="purpose-tags">
                  {profileData.platform_purpose?.map(purpose => (
                    <span key={purpose} className="purpose-tag">
                      {purpose}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          // Edit Mode
          <form className="profile-form" onSubmit={handleSubmit}>
            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="full_name">Full Name *</label>
              <input
                id="full_name"
                type="text"
                value={profileData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* User Type */}
            <div className="form-group">
              <label>What best describes you? *</label>
              <div className="radio-group">
                {[
                  { value: 'student', label: 'Student' },
                  { value: 'investor', label: 'Investor' },
                  { value: 'entrepreneur', label: 'Entrepreneur' },
                  { value: 'working_professional', label: 'Working Professional' }
                ].map(option => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      name="user_type"
                      value={option.value}
                      checked={profileData.user_type === option.value}
                      onChange={(e) => handleInputChange('user_type', e.target.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Active Startup */}
            <div className="form-group">
              <label>Do you have an active startup? *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="has_active_startup"
                    value="true"
                    checked={profileData.has_active_startup === true}
                    onChange={(e) => handleInputChange('has_active_startup', true)}
                  />
                  <span>Yes</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="has_active_startup"
                    value="false"
                    checked={profileData.has_active_startup === false}
                    onChange={(e) => handleInputChange('has_active_startup', false)}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Conditional Questions based on startup status */}
            {profileData.has_active_startup === true ? (
              <>
                <div className="form-group">
                  <label htmlFor="startup_industry">Which industry is your startup in? *</label>
                  <input
                    id="startup_industry"
                    type="text"
                    value={profileData.startup_industry}
                    onChange={(e) => handleInputChange('startup_industry', e.target.value)}
                    placeholder="e.g., FinTech, EdTech, HealthTech, E-commerce"
                    required={profileData.has_active_startup}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="startup_details">Tell us more about your startup (Optional)</label>
                  <textarea
                    id="startup_details"
                    value={profileData.startup_details}
                    onChange={(e) => handleInputChange('startup_details', e.target.value)}
                    placeholder="Brief description of what your startup does, stage, etc."
                    rows="3"
                  />
                </div>
              </>
            ) : profileData.has_active_startup === false && (
              <div className="form-group">
                <label htmlFor="failure_reason">Why did your startup fail or why don't you have one? *</label>
                <textarea
                  id="failure_reason"
                  value={profileData.failure_reason}
                  onChange={(e) => handleInputChange('failure_reason', e.target.value)}
                  placeholder="Share your experience or reasons for not having a startup"
                  rows="3"
                  required={!profileData.has_active_startup}
                />
              </div>
            )}

            {/* Platform Purpose */}
            <div className="form-group">
              <label>What are you looking for on this platform? * (Select all that apply)</label>
              <div className="checkbox-group">
                {[
                  { value: 'investment', label: 'Investment opportunities' },
                  { value: 'ideas', label: 'New business ideas' },
                  { value: 'knowledge', label: 'Learning from failures' },
                  { value: 'networking', label: 'Networking' },
                  { value: 'mentorship', label: 'Mentorship' }
                ].map(option => (
                  <label key={option.value} className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={profileData.platform_purpose?.includes(option.value)}
                      onChange={() => handlePurposeChange(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="form-actions">
              {!isEditing && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate('/')}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
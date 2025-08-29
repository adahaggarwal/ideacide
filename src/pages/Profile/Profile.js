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

  const loadProfile = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setError('');
      
      const profile = await profileService.getProfile(currentUser.uid);
      
      if (profile) {
        const sanitizedProfile = {
          full_name: profile.full_name || currentUser.displayName || '',
          user_type: profile.user_type || '',
          has_active_startup: profile.has_active_startup !== undefined ? profile.has_active_startup : null,
          startup_industry: profile.startup_industry || '',
          startup_details: profile.startup_details || '',
          failure_reason: profile.failure_reason || '',
          platform_purpose: profile.platform_purpose || [],
          profile_completed: profile.profile_completed || false
        };
        
        setProfileData(sanitizedProfile);
        setIsEditing(false);
      } else {
        setIsEditing(true);
        setProfileData(prev => ({
          ...prev,
          full_name: currentUser.displayName || '',
          user_type: '',
          has_active_startup: null,
          startup_industry: '',
          startup_details: '',
          failure_reason: '',
          platform_purpose: [],
          profile_completed: false
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      
      if (retryCount < 2 && (error.message.includes('Network') || error.message.includes('fetch'))) {
        console.log(`Retrying profile load... Attempt ${retryCount + 1}`);
        setTimeout(() => loadProfile(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      setError('Failed to load profile. Please try again.');
      setIsEditing(true);
      
      setProfileData(prev => ({
        ...prev,
        full_name: currentUser.displayName || '',
        user_type: '',
        has_active_startup: null,
        startup_industry: '',
        startup_details: '',
        failure_reason: '',
        platform_purpose: [],
        profile_completed: false
      }));
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
    setError('');
    
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
    
    if (profileData.has_active_startup === true && !profileData.startup_industry.trim()) {
      setError('Please specify your startup industry');
      return false;
    }
    
    if (profileData.has_active_startup === false && !profileData.failure_reason.trim()) {
      setError('Please explain why your startup failed or why you don\'t have one');
      return false;
    }
    
    if (!profileData.platform_purpose || profileData.platform_purpose.length === 0) {
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
    setSuccessMessage('');

    try {
      const profileToSubmit = {
        ...profileData,
        email: currentUser.email,
        profile_completed: true,
        updated_at: new Date().toISOString()
      };

      await profileService.createOrUpdateProfile(currentUser.uid, profileToSubmit);
      await refreshProfileStatus();
      
      setProfileData(prev => ({
        ...prev,
        ...profileToSubmit
      }));
      
      setIsEditing(false);
      setSuccessMessage('Profile saved successfully! You can now access all features.');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again. ' + (error.message || ''));
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
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
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
          
          {!isEditing && (
            <div className="profile-completion">
              <div className="completion-icon" role="img" aria-label={profileData.profile_completed ? 'Profile complete' : 'Profile incomplete'}>
                {profileData.profile_completed ? '✅' : '⏳'}
              </div>
              <div className={`completion-text ${profileData.profile_completed ? 'completion-complete' : 'completion-incomplete'}`}>
                {profileData.profile_completed ? 'Profile Complete' : 'Profile Incomplete'}
              </div>
            </div>
          )}
        </div>

        {error && !isEditing && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={() => loadProfile()}>
              Retry Loading Profile
            </button>
          </div>
        )}

        {!isEditing ? (
          <div className="profile-display">
            <div className="profile-info">
              <div className="info-group">
                <label>Full Name</label>
                <p>{profileData.full_name}</p>
              </div>

              <div className="info-group">
                <label>Role</label>
                <p>{profileData.user_type ? profileData.user_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not specified'}</p>
              </div>

              <div className="info-group">
                <label>Active Startup</label>
                <p>{profileData.has_active_startup === true ? 'Yes' : profileData.has_active_startup === false ? 'No' : 'Not specified'}</p>
              </div>

              {profileData.has_active_startup === true ? (
                <>
                  <div className="info-group">
                    <label>Startup Industry</label>
                    <p>{profileData.startup_industry || 'Not specified'}</p>
                  </div>
                  {profileData.startup_details && (
                    <div className="info-group">
                      <label>Startup Details</label>
                      <p>{profileData.startup_details}</p>
                    </div>
                  )}
                </>
              ) : profileData.has_active_startup === false ? (
                <div className="info-group">
                  <label>Why no active startup?</label>
                  <p>{profileData.failure_reason || 'Not specified'}</p>
                </div>
              ) : null}

              <div className="info-group">
                <label>Platform Purpose</label>
                <div className="purpose-tags">
                  {profileData.platform_purpose && profileData.platform_purpose.length > 0 ? (
                    profileData.platform_purpose.map(purpose => (
                      <span key={purpose} className="purpose-tag">
                        {purpose}
                      </span>
                    ))
                  ) : (
                    <span className="no-purpose">No purposes selected</span>
                  )}
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
              <label htmlFor="full_name">
                Full Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="full_name"
                type="text"
                value={profileData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter your full name"
                required
                aria-describedby="full_name_help"
                aria-invalid={!profileData.full_name.trim()}
              />
              <div id="full_name_help" className="field-help">
                Enter your complete name as you'd like it to appear
              </div>
            </div>

            {/* User Type */}
            <div className="form-group">
              <label>
                What best describes you? <span style={{ color: "red" }}>*</span>
              </label>
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
              <label>
                Do you have an active startup? <span style={{ color: "red" }}>*</span>
              </label>
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

            {/* Conditional Questions */}
            {profileData.has_active_startup === true ? (
              <>
                <div className="form-group">
                  <label htmlFor="startup_industry">
                    Which industry is your startup in? <span style={{ color: "red" }}>*</span>
                  </label>
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
                  <label htmlFor="startup_details">
                    Tell us more about your startup <span style={{ color: "red" }}>*</span>
                  </label>
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
                <label htmlFor="failure_reason">
                  Why did your startup fail or why don't you have one? <span style={{ color: "red" }}>*</span>
                </label>
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
              <label>
                What are you looking for on this platform? <span style={{ color: "red" }}>*</span> (Select all that apply)
              </label>
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
                {isSubmitting ? (
                  <>
                    <span className="submit-spinner"></span>
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
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
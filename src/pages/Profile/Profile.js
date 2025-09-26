import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Header, 
  Footer, 
  ModernCard, 
  ModernButton, 
  ModernInput, 
  AnimatedSection,
  ParticleBackground,
  ProgressBar,
  Toast
} from '../../components';
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
  const [toasts, setToasts] = useState([]);

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

  const showToast = (type, message) => {
    const id = Date.now();
    const newToast = { id, type, message };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getProfileCompletionPercentage = () => {
    const fields = [
      profileData.full_name,
      profileData.user_type,
      profileData.has_active_startup !== null,
      profileData.has_active_startup ? profileData.startup_industry : profileData.failure_reason,
      profileData.platform_purpose?.length > 0
    ];
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
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
      showToast('success', 'Profile saved successfully! You can now access all features.');
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
      <ParticleBackground density={15} speed={0.2} />
      <Header />
      
      <div className="profile-container">
        <AnimatedSection animation="fade-in">
          <div className="profile-hero">
            <div className="profile-header">
              <h1 className="profile-title">My Profile</h1>
              <p className="profile-subtitle">
                {isEditing ? 'Complete your profile to access all features' : 'Manage your account information'}
              </p>
            </div>
            
            <div className="profile-progress">
              <ProgressBar 
                progress={getProfileCompletionPercentage()} 
                variant="primary" 
                size="medium" 
                showLabel 
                label={`Profile ${getProfileCompletionPercentage()}% Complete`}
              />
            </div>
          </div>
        </AnimatedSection>

        {!isEditing && (
          <AnimatedSection animation="slide-up" delay={200}>
            <ModernCard variant="glass" hover>
              <div className="profile-completion">
                <div className="completion-icon" role="img" aria-label={profileData.profile_completed ? 'Profile complete' : 'Profile incomplete'}>
                  {profileData.profile_completed ? '✅' : '⏳'}
                </div>
                <div className={`completion-text ${profileData.profile_completed ? 'completion-complete' : 'completion-incomplete'}`}>
                  {profileData.profile_completed ? 'Profile Complete' : 'Profile Incomplete'}
                </div>
              </div>
            </ModernCard>
          </AnimatedSection>
        )}

        {error && !isEditing && (
          <AnimatedSection animation="slide-up" delay={300}>
            <ModernCard variant="default" className="error-container">
              <p className="error-message">{error}</p>
              <ModernButton variant="secondary" onClick={() => loadProfile()}>
                Retry Loading Profile
              </ModernButton>
            </ModernCard>
          </AnimatedSection>
        )}

        {!isEditing ? (
          <AnimatedSection animation="slide-up" delay={400}>
            <ModernCard variant="elevated" hover>
              <div className="profile-info"/>
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
              
              <div className="profile-actions">
                <ModernButton
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit Profile
                </ModernButton>
              </div>
            </ModernCard>
          </AnimatedSection>
        ) : (
          <AnimatedSection animation="fade-in" delay={200}>
            <ModernCard variant="glass" className="profile-form-card">
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
                  <ModernInput
                    label="Full Name"
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    icon="👤"
                    error={!profileData.full_name.trim() && error ? 'Full name is required' : ''}
                  />
                </div>

                {/* User Type */}
                <div className="form-group">
                  <label className="form-label">
                    What best describes you? <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="radio-group">
                    {[
                      { value: 'student', label: '🎓 Student', icon: '🎓' },
                      { value: 'investor', label: '💰 Investor', icon: '💰' },
                      { value: 'entrepreneur', label: '🚀 Entrepreneur', icon: '🚀' },
                      { value: 'working_professional', label: '💼 Working Professional', icon: '💼' }
                    ].map(option => (
                      <ModernCard 
                        key={option.value} 
                        variant="glass" 
                        className={`radio-card ${profileData.user_type === option.value ? 'radio-card--selected' : ''}`}
                        onClick={() => handleInputChange('user_type', option.value)}
                      >
                        <input
                          type="radio"
                          name="user_type"
                          value={option.value}
                          checked={profileData.user_type === option.value}
                          onChange={(e) => handleInputChange('user_type', e.target.value)}
                          className="radio-input"
                        />
                        <span className="radio-icon">{option.icon}</span>
                        <span className="radio-label">{option.label.replace(option.icon + ' ', '')}</span>
                      </ModernCard>
                    ))}
                  </div>
                </div>

                {/* Active Startup */}
                <div className="form-group">
                  <label className="form-label">
                    Do you have an active startup? <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="radio-group">
                    <ModernCard 
                      variant="glass" 
                      className={`radio-card ${profileData.has_active_startup === true ? 'radio-card--selected' : ''}`}
                      onClick={() => handleInputChange('has_active_startup', true)}
                    >
                      <input
                        type="radio"
                        name="has_active_startup"
                        value="true"
                        checked={profileData.has_active_startup === true}
                        onChange={() => handleInputChange('has_active_startup', true)}
                        className="radio-input"
                      />
                      <span className="radio-icon">✅</span>
                      <span className="radio-label">Yes</span>
                    </ModernCard>
                    <ModernCard 
                      variant="glass" 
                      className={`radio-card ${profileData.has_active_startup === false ? 'radio-card--selected' : ''}`}
                      onClick={() => handleInputChange('has_active_startup', false)}
                    >
                      <input
                        type="radio"
                        name="has_active_startup"
                        value="false"
                        checked={profileData.has_active_startup === false}
                        onChange={() => handleInputChange('has_active_startup', false)}
                        className="radio-input"
                      />
                      <span className="radio-icon">❌</span>
                      <span className="radio-label">No</span>
                    </ModernCard>
                  </div>
                </div>

                {/* Conditional Questions */}
                {profileData.has_active_startup === true ? (
                  <>
                    <div className="form-group">
                      <ModernInput
                        label="Which industry is your startup in?"
                        type="text"
                        value={profileData.startup_industry}
                        onChange={(e) => handleInputChange('startup_industry', e.target.value)}
                        placeholder="e.g., FinTech, EdTech, HealthTech, E-commerce"
                        required
                        icon="🏢"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Tell us more about your startup
                      </label>
                      <textarea
                        className="modern-textarea"
                        value={profileData.startup_details}
                        onChange={(e) => handleInputChange('startup_details', e.target.value)}
                        placeholder="Brief description of what your startup does, stage, etc."
                        rows="3"
                      />
                    </div>
                  </>
                ) : profileData.has_active_startup === false && (
                  <div className="form-group">
                    <label className="form-label">
                      Why did your startup fail or why don't you have one? <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      className="modern-textarea"
                      value={profileData.failure_reason}
                      onChange={(e) => handleInputChange('failure_reason', e.target.value)}
                      placeholder="Share your experience or reasons for not having a startup"
                      rows="3"
                      required
                    />
                  </div>
                )}

                {/* Platform Purpose */}
                <div className="form-group">
                  <label className="form-label">
                    What are you looking for on this platform? <span style={{ color: "red" }}>*</span> (Select all that apply)
                  </label>
                  <div className="checkbox-group">
                    {[
                      { value: 'investment', label: 'Investment opportunities', icon: '💰' },
                      { value: 'ideas', label: 'New business ideas', icon: '💡' },
                      { value: 'knowledge', label: 'Learning from failures', icon: '📚' },
                      { value: 'networking', label: 'Networking', icon: '🤝' },
                      { value: 'mentorship', label: 'Mentorship', icon: '👨‍🏫' }
                    ].map(option => (
                      <ModernCard 
                        key={option.value} 
                        variant="glass" 
                        className={`checkbox-card ${profileData.platform_purpose?.includes(option.value) ? 'checkbox-card--selected' : ''}`}
                        onClick={() => handlePurposeChange(option.value)}
                      >
                        <input
                          type="checkbox"
                          checked={profileData.platform_purpose?.includes(option.value)}
                          onChange={() => handlePurposeChange(option.value)}
                          className="checkbox-input"
                        />
                        <span className="checkbox-icon">{option.icon}</span>
                        <span className="checkbox-label">{option.label}</span>
                      </ModernCard>
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="form-actions">
                  <ModernButton
                    type="button"
                    variant="ghost"
                    onClick={() => navigate('/')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </ModernButton>
                  <ModernButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : '💾 Save Profile'}
                  </ModernButton>
                </div>
              </form>
            </ModernCard>
          </AnimatedSection>
        )}
      </div>

      <Footer />
      
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            position="top-right"
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
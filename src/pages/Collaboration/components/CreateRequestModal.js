import React, { useState } from 'react';
import { ModernModal, ModernInput, ModernButton, ModernCard } from '../../../components';
import { collaborationService } from '../../../services/collaborationService';
import './CreateRequestModal.css';

const CreateRequestModal = ({ isOpen, onClose, onRequestCreated, currentUser }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    collaboration_type: '',
    industry: '',
    budget_range: '',
    equity_offered: '',
    location: '',
    remote_friendly: false,
    experience_required: 'any',
    skills_required: [],
    contact_email: currentUser?.email || '',
    contact_method: 'both',
    urgency: 'medium',
    tags: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const collaborationTypes = [
    { value: 'funding', label: '💰 Seeking Funding', description: 'Looking for investors or financial backing' },
    { value: 'co_founder', label: '🤝 Co-founder', description: 'Seeking a business partner to build together' },
    { value: 'mentor', label: '👨‍🏫 Mentor', description: 'Looking for guidance and advice' },
    { value: 'advisor', label: '💡 Advisor', description: 'Seeking strategic advice and connections' },
    { value: 'partner', label: '🤝 Business Partner', description: 'Looking for strategic partnerships' },
    { value: 'developer', label: '💻 Developer', description: 'Need technical development help' },
    { value: 'designer', label: '🎨 Designer', description: 'Looking for design expertise' },
    { value: 'marketer', label: '📈 Marketer', description: 'Need marketing and growth help' },
    { value: 'other', label: '🔧 Other', description: 'Something else not listed above' }
  ];

  const experienceLevels = [
    { value: 'any', label: 'Any Level' },
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'expert', label: 'Expert Level' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - No rush' },
    { value: 'medium', label: 'Medium - Within a month' },
    { value: 'high', label: 'High - Within a week' },
    { value: 'urgent', label: 'Urgent - ASAP' }
  ];

  const contactMethods = [
    { value: 'email', label: 'Email Only' },
    { value: 'platform', label: 'Through Platform' },
    { value: 'both', label: 'Both Email & Platform' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills_required.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills_required: [...prev.skills_required, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills_required: prev.skills_required.filter(skill => skill !== skillToRemove)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        if (!formData.title.trim()) {
          setError('Title is required');
          return false;
        }
        if (!formData.description.trim()) {
          setError('Description is required');
          return false;
        }
        if (!formData.collaboration_type) {
          setError('Please select a collaboration type');
          return false;
        }
        break;
      case 2:
        // Optional fields, no validation needed
        break;
      case 3:
        if (!formData.contact_email.trim()) {
          setError('Contact email is required');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    console.log('Next button clicked, current step:', step);
    if (validateStep(step)) {
      console.log('Validation passed, moving to step:', step + 1);
      setStep(step + 1);
      setError('');
    } else {
      console.log('Validation failed for step:', step);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setError('');

    try {
      const requestData = {
        ...formData,
        user_id: currentUser.uid,
        skills_required: formData.skills_required.length > 0 ? formData.skills_required : null,
        tags: formData.tags.length > 0 ? formData.tags : null
      };

      console.log('Creating request with data:', requestData);
      console.log('Current user:', currentUser);
      console.log('User ID:', currentUser?.uid);
      console.log('User authenticated:', !!currentUser);
      
      const newRequest = await collaborationService.createRequest(requestData);
      onRequestCreated(newRequest);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        collaboration_type: '',
        industry: '',
        budget_range: '',
        equity_offered: '',
        location: '',
        remote_friendly: false,
        experience_required: 'any',
        skills_required: [],
        contact_email: currentUser?.email || '',
        contact_method: 'both',
        urgency: 'medium',
        tags: []
      });
      setStep(1);
    } catch (error) {
      console.error('Error creating request:', error);
      console.error('Error details:', error.message);
      setError(`Failed to create request: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setStep(1);
      setError('');
    }
  };

  return (
    <ModernModal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Create Collaboration Request - Step ${step} of 3`}
      size="large"
    >
      <div className="create-request-modal">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3].map(stepNum => (
              <div 
                key={stepNum}
                className={`progress-step ${step >= stepNum ? 'active' : ''}`}
              >
                <div className="step-number">{stepNum}</div>
                <div className="step-label">
                  {stepNum === 1 && 'Basic Info'}
                  {stepNum === 2 && 'Details'}
                  {stepNum === 3 && 'Contact & Publish'}
                </div>
              </div>
            ))}
          </div>
          <div 
            className="progress-fill"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="request-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="form-step">
              <h3>Basic Information</h3>
              
              <ModernInput
                label="Request Title"
                placeholder="e.g., Seeking Co-founder for FinTech Startup"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                icon="📝"
              />

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="modern-textarea"
                  placeholder="Describe what you're looking for, your project, and what you can offer..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Collaboration Type *</label>
                <div className="type-grid">
                  {collaborationTypes.map(type => (
                    <ModernCard
                      key={type.value}
                      variant="glass"
                      className={`type-card ${formData.collaboration_type === type.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('collaboration_type', type.value)}
                    >
                      <div className="type-header">{type.label}</div>
                      <div className="type-description">{type.description}</div>
                    </ModernCard>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="form-step">
              <h3>Additional Details</h3>
              
              <div className="form-row">
                <ModernInput
                  label="Industry"
                  placeholder="e.g., FinTech, EdTech, HealthTech"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  icon="🏢"
                />

                <ModernInput
                  label="Location"
                  placeholder="e.g., San Francisco, Remote"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  icon="📍"
                />
              </div>

              <div className="form-row">
                <ModernInput
                  label="Budget Range"
                  placeholder="e.g., $10k-50k, Negotiable"
                  value={formData.budget_range}
                  onChange={(e) => handleInputChange('budget_range', e.target.value)}
                  icon="💰"
                />

                <ModernInput
                  label="Equity Offered"
                  placeholder="e.g., 5-10%, To be discussed"
                  value={formData.equity_offered}
                  onChange={(e) => handleInputChange('equity_offered', e.target.value)}
                  icon="📊"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.remote_friendly}
                    onChange={(e) => handleInputChange('remote_friendly', e.target.checked)}
                  />
                  <span>Remote Friendly</span>
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Experience Required</label>
                  <select
                    value={formData.experience_required}
                    onChange={(e) => handleInputChange('experience_required', e.target.value)}
                    className="form-select"
                  >
                    {experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                    className="form-select"
                  >
                    {urgencyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div className="form-group">
                <label className="form-label">Required Skills</label>
                <div className="input-with-button">
                  <ModernInput
                    placeholder="Add a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <ModernButton
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={addSkill}
                  >
                    Add
                  </ModernButton>
                </div>
                {formData.skills_required.length > 0 && (
                  <div className="tags-list">
                    {formData.skills_required.map((skill, index) => (
                      <span key={index} className="tag">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="tag-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="form-group">
                <label className="form-label">Tags</label>
                <div className="input-with-button">
                  <ModernInput
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <ModernButton
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={addTag}
                  >
                    Add
                  </ModernButton>
                </div>
                {formData.tags.length > 0 && (
                  <div className="tags-list">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="tag-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Contact & Publish */}
          {step === 3 && (
            <div className="form-step">
              <h3>Contact Information & Publish</h3>
              
              <ModernInput
                label="Contact Email"
                type="email"
                placeholder="your@email.com"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                required
                icon="📧"
              />

              <div className="form-group">
                <label className="form-label">How should people contact you?</label>
                <div className="radio-group">
                  {contactMethods.map(method => (
                    <label key={method.value} className="radio-option">
                      <input
                        type="radio"
                        name="contact_method"
                        value={method.value}
                        checked={formData.contact_method === method.value}
                        onChange={(e) => handleInputChange('contact_method', e.target.value)}
                      />
                      <span>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <div className="info-box">
                  <h4>📋 Request Summary</h4>
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Type:</strong> {collaborationTypes.find(t => t.value === formData.collaboration_type)?.label}</p>
                  {formData.industry && <p><strong>Industry:</strong> {formData.industry}</p>}
                  {formData.location && <p><strong>Location:</strong> {formData.location}</p>}
                  <p><strong>Urgency:</strong> {urgencyLevels.find(u => u.value === formData.urgency)?.label}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {step > 1 && (
              <ModernButton
                type="button"
                variant="ghost"
                size="large"
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                ← Previous Step
              </ModernButton>
            )}
            
            <div className="nav-spacer" />
            
            {step < 3 ? (
              <ModernButton
                type="button"
                variant="primary"
                size="large"
                onClick={handleNext}
              >
                Next Step →
              </ModernButton>
            ) : (
              <ModernButton
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Publishing...' : '🚀 Publish Request'}
              </ModernButton>
            )}
          </div>
        </form>
      </div>
    </ModernModal>
  );
};

export default CreateRequestModal;
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Header, Footer } from '../../components';
import { storiesService } from '../../services/storiesService';
import { profileService } from '../../services/profileService';
import './CreateStory.css';

const CreateStory = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    links: ['']
  });
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated or profile not completed
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    // Check if profile is completed
    const checkProfile = async () => {
      try {
        const completed = await profileService.isProfileCompleted(currentUser.uid);
        if (!completed) {
          alert('Please complete your profile first before sharing your story!');
          navigate('/profile');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        navigate('/profile');
      }
    };

    checkProfile();
  }, [currentUser, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...formData.links];
    newLinks[index] = value;
    setFormData(prev => ({
      ...prev,
      links: newLinks
    }));
  };

  const addLinkField = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, '']
    }));
  };

  const removeLinkField = (index) => {
    if (formData.links.length > 1) {
      const newLinks = formData.links.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        links: newLinks
      }));
    }
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024; // 5MB limit
      if (!isValid) {
        setError('Please select valid image files under 5MB each');
      }
      return isValid;
    });
    
    setSelectedImages(prev => [...prev, ...validFiles]);
    setError('');
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove the old uploadImages function since we're not using it now

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Process images (convert to base64 for now)
      const processedImages = await storiesService.processImages(selectedImages);
      
      // Filter out empty links
      const validLinks = formData.links.filter(link => link.trim() !== '');

      // Create story document with processed images
      const storyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        images: processedImages, // Using processed images instead of uploaded URLs
        links: validLinks,
        author_id: currentUser.uid,
        author_name: currentUser.displayName || 'Anonymous',
        author_email: currentUser.email
      };

      const storyId = await storiesService.createStory(storyData);
      
      console.log('Story created with ID:', storyId);
      
      // Show success message
      alert('Story published successfully!');
      
      // Redirect to home page
      navigate('/');
      
    } catch (error) {
      console.error('Error creating story:', error);
      setError('Failed to create story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="create-story-page">
      <Header />
      
      <div className="create-story-container">
        <div className="create-story-header">
          <h1>Tell Us Your Story</h1>
          <p>Share your entrepreneurial journey, failures, and lessons learned</p>
        </div>

        <form className="create-story-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Story Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., How I Failed My First Startup and What I Learned"
              maxLength={150}
              required
            />
            <small className="char-count">{formData.title.length}/150</small>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Your Story *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Share your story in detail. What happened? What did you learn? What advice would you give to others?"
              rows="10"
              maxLength={5000}
              required
            />
            <small className="char-count">{formData.description.length}/5000</small>
          </div>

          {/* Images */}
          <div className="form-group">
            <label>Images (Optional)</label>
            <div className="image-upload-section">
              <button
                type="button"
                className="upload-button"
                onClick={() => fileInputRef.current?.click()}
              >
                📸 Add Images
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <small className="upload-info">Max 5MB per image. Supported: JPG, PNG, GIF</small>
            </div>

            {selectedImages.length > 0 && (
              <div className="selected-images">
                {selectedImages.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="form-group">
            <label>Related Links (Optional)</label>
            <div className="links-section">
              {formData.links.map((link, index) => (
                <div key={index} className="link-input-group">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    placeholder="https://example.com"
                  />
                  {formData.links.length > 1 && (
                    <button
                      type="button"
                      className="remove-link"
                      onClick={() => removeLinkField(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-link-button"
                onClick={addLinkField}
              >
                + Add Another Link
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Story'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default CreateStory;
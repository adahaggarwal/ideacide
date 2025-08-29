import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StoryDetail.css';
import { Header, Footer, Loading } from '../../components';
import { storiesService } from '../../services/storiesService';
import storyFallback from '../../assets/images/story_fallback.png';

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        setError(null);
        const storyData = await storiesService.getStoryById(id);
        setStory(storyData);
        
        // Increment view count
        await storiesService.incrementViews(id);
      } catch (error) {
        console.error('Error fetching story:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id]);

  const handleImageError = (event) => {
    event.target.src = storyFallback;
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const estimateReadTime = (text) => {
    if (!text) return '1 min';
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min`;
  };

  if (loading) {
    return (
      <div className="story-detail-page">
        <Header />
        <div className="story-detail-container">
          <Loading size="large" text="Loading story..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="story-detail-page">
        <Header />
        <div className="story-not-found">
          <h1>Story Not Found</h1>
          <p>{error || "The story you're looking for doesn't exist."}</p>
          <button onClick={() => navigate('/')} className="back-home-btn">
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="story-detail-page">
      <Header />
      
      <main className="story-detail-main">
        <div className="story-detail-container">
          {/* Back Button */}
          <button onClick={() => navigate(-1)} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>

          {/* Story Header */}
          <div className="story-header">
            {story.images && story.images.length > 0 && (
              <div className="story-image-container">
                <img 
                  src={story.images[0]} 
                  alt={story.title}
                  className="story-hero-image"
                  onError={handleImageError}
                />
                <div className="story-overlay">
                  <div className="story-status-badge">{story.status}</div>
                </div>
              </div>
            )}
            
            <div className="story-title-section">
              <h1 className="story-main-title">{story.title}</h1>
              
              <div className="story-author-info">
                <div className="author-avatar">
                  {story.author_name ? story.author_name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="author-details">
                  <span className="author-name">{story.author_name || 'Anonymous'}</span>
                  <span className="author-email">{story.author_email}</span>
                </div>
              </div>
              
              <div className="story-meta-info">
                <div className="meta-item">
                  <span className="meta-label">📅 Published:</span>
                  <span className="meta-value">{formatDate(story.created_at)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">⏱️ Read Time:</span>
                  <span className="meta-value">{estimateReadTime(story.description)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">👁️ Views:</span>
                  <span className="meta-value">{story.views || 0}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">❤️ Likes:</span>
                  <span className="meta-value">{story.likes || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="story-content-section">
            {/* Main Content */}
            <div className="story-main-content">
              <div className="story-detailed-description">
                <h2 className="content-title">The Story</h2>
                <div className="story-text">
                  {story.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="story-paragraph">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Images Gallery */}
              {story.images && story.images.length > 1 && (
                <div className="images-section">
                  <h2 className="content-title">Gallery</h2>
                  <div className="images-grid">
                    {story.images.slice(1).map((image, index) => (
                      <div key={index} className="gallery-image">
                        <img 
                          src={image} 
                          alt={`${story.title} - Image ${index + 2}`}
                          onError={handleImageError}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links Section */}
              {story.links && story.links.length > 0 && (
                <div className="links-section">
                  <h2 className="content-title">Related Links</h2>
                  <div className="links-grid">
                    {story.links.map((link, index) => (
                      <a 
                        key={index}
                        href={link.startsWith('http') ? link : `https://${link}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="story-link-card"
                      >
                        <div className="link-icon">🔗</div>
                        <div className="link-content">
                          <span className="link-text">{link}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                          </svg>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Story Sidebar */}
            <div className="story-sidebar">
              {/* Story Info */}
              <div className="info-card">
                <h3 className="info-card-title">Story Details</h3>
                <div className="info-items">
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className="info-value status-badge">{story.status}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Created:</span>
                    <span className="info-value">{formatDate(story.created_at)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Updated:</span>
                    <span className="info-value">{formatDate(story.updated_at)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Views:</span>
                    <span className="info-value">{story.views || 0}</span>
                  </div>
                </div>
              </div>

              {/* Author Card */}
              <div className="info-card">
                <h3 className="info-card-title">About the Author</h3>
                <div className="author-card">
                  <div className="author-avatar-large">
                    {story.author_name ? story.author_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="author-info">
                    <h4 className="author-name-large">{story.author_name || 'Anonymous Author'}</h4>
                    <p className="author-email-small">{story.author_email}</p>
                  </div>
                </div>
              </div>

              {/* Engagement Actions */}
              <div className="info-card">
                <h3 className="info-card-title">Engage</h3>
                <div className="engagement-actions">
                  <button className="engagement-btn like-btn">
                    <span className="btn-icon">❤️</span>
                    <span className="btn-text">Like ({story.likes || 0})</span>
                  </button>
                  <button className="engagement-btn share-btn">
                    <span className="btn-icon">📤</span>
                    <span className="btn-text">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="story-navigation">
            <button onClick={() => navigate('/')} className="nav-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Back to Home
            </button>
            <button onClick={() => navigate('/create-story')} className="nav-button primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Share Your Story
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StoryDetail;

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StoryDetail.css';
import { Header, Footer } from '../../components';
import useStories from '../../hooks/useStories';
import storyFallback from '../../assets/images/story_fallback.png';

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stories, loading } = useStories();

  const handleImageError = (event) => {
    // Set fallback image when original image fails to load
    event.target.src = storyFallback;
  };

  // Find the story by ID
  const story = stories.find(s => s.id === parseInt(id));

  if (loading) {
    return (
      <div className="story-detail-page">
        <Header />
        <div className="story-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading story...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="story-detail-page">
        <Header />
        <div className="story-not-found">
          <h1>Story Not Found</h1>
          <p>The story you're looking for doesn't exist.</p>
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
          <button onClick={() => navigate('/')} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Stories
          </button>

          {/* Story Header */}
          <div className="story-header">
            <div className="story-image-container">
              <img 
                src={story.image} 
                alt={story.title}
                className="story-hero-image"
                onError={handleImageError}
              />
              <div className="story-overlay">
                <div className="story-category-badge">{story.category}</div>
                <div className="story-location-badge">{story.locationStartup}</div>
              </div>
            </div>
            
            <div className="story-title-section">
              <h1 className="story-main-title">{story.title}</h1>
              <p className="story-main-excerpt">{story.excerpt}</p>
              
              <div className="story-meta-info">
                <div className="meta-item">
                  <span className="meta-label">Published:</span>
                  <span className="meta-value">{new Date(story.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Read Time:</span>
                  <span className="meta-value">{story.readTime}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Key Lessons:</span>
                  <span className="meta-value">{story.lessons}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="story-content-section">
            <div className="story-sidebar">
              {/* Company Info */}
              <div className="info-card">
                <h3 className="info-card-title">Company Overview</h3>
                <div className="info-items">
                  <div className="info-item">
                    <span className="info-label">Founded:</span>
                    <span className="info-value">{story.foundingYear}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Failed:</span>
                    <span className="info-value">{story.failureYear}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Duration:</span>
                    <span className="info-value">{story.failureYear - story.foundingYear} years</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location:</span>
                    <span className="info-value">{story.locationStartup}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Funding:</span>
                    <span className="info-value funding-amount">{story.fundingRaised}</span>
                  </div>
                </div>
              </div>

              {/* Founders */}
              <div className="info-card">
                <h3 className="info-card-title">Key Founders</h3>
                <div className="founders-list">
                  {story.keyFounders.map((founder, index) => (
                    <div key={index} className="founder-item">
                      <div className="founder-avatar">
                        {founder.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="founder-name">{founder}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industry Tags */}
              <div className="info-card">
                <h3 className="info-card-title">Industry Tags</h3>
                <div className="tags-container">
                  {story.industryTags.map((tag, index) => (
                    <span key={index} className="industry-tag">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Failure Reason */}
              <div className="info-card">
                <h3 className="info-card-title">Primary Failure Reason</h3>
                <div className="failure-reason">
                  <span className="reason-badge">{story.reasonForFailure}</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="story-main-content">
              <div className="story-detailed-description">
                <h2 className="content-title">The Full Story</h2>
                <div className="story-text">
                  {story.detailedDescription.split('\n').map((paragraph, index) => (
                    <p key={index} className="story-paragraph">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Key Lessons Section */}
              <div className="lessons-section">
                <h2 className="content-title">Key Lessons Learned</h2>
                <div className="lessons-grid">
                  {Array.from({ length: story.lessons }, (_, index) => (
                    <div key={index} className="lesson-card">
                      <div className="lesson-number">{index + 1}</div>
                      <div className="lesson-content">
                        <h4 className="lesson-title">Lesson {index + 1}</h4>
                        <p className="lesson-description">
                          Key insight derived from this failure case study.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Section */}
              {story.sourceUrl && (
                <div className="source-section">
                  <h2 className="content-title">Source & References</h2>
                  <div className="source-card">
                    <div className="source-icon">🔗</div>
                    <div className="source-content">
                      <p className="source-description">
                        Read more about this story from the original source:
                      </p>
                      <a 
                        href={story.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="source-link"
                      >
                        View Original Article
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StoryDetail;

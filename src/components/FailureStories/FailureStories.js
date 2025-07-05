import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FailureStories.css';
import useStories from '../../hooks/useStories';
import { Loading } from '../index';
import unsplashAPI from '../../services/unsplashAPI';
import storyFallback from '../../assets/images/story_fallback.png';

const FailureStories = () => {
  const { stories, loading, error, lastUpdated, refreshStories } = useStories();
  const navigate = useNavigate();

  const handleImageLoad = (downloadUrl) => {
    // Trigger download tracking for Unsplash API compliance
    unsplashAPI.triggerDownload(downloadUrl);
  };

  const handleImageError = (event) => {
    // Set fallback image when original image fails to load
    event.target.src = storyFallback;
  };

  const handleReadMore = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  if (loading) {
    return (
      <section className="failure-stories">
        <div className="stories-container">
          <div className="stories-header">
            <h2 className="stories-title">Latest Failure Stories</h2>
            <p className="stories-subtitle">
              Learn from the mistakes of industry giants and innovative startups
            </p>
          </div>
          <Loading size="large" text="Fetching latest failure stories..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="failure-stories">
        <div className="stories-container">
          <div className="stories-header">
            <h2 className="stories-title">Latest Failure Stories</h2>
            <p className="stories-subtitle error-text">
              Unable to fetch latest stories. Showing cached content.
            </p>
          </div>
          <div className="error-container">
            <p className="error-message">⚠️ {error}</p>
            <button className="retry-button" onClick={refreshStories}>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="failure-stories">
      <div className="stories-container">
        <div className="stories-header">
          <h2 className="stories-title">Latest Failure Stories</h2>
          <p className="stories-subtitle">
            Learn from the mistakes of industry giants and innovative startups
          </p>
          {lastUpdated && (
            <div className="last-updated">
              <span>Last updated: {lastUpdated.toLocaleString()}</span>
              <button className="refresh-button" onClick={refreshStories}>
                🔄 Refresh Stories
              </button>
            </div>
          )}
        </div>

        <div className="stories-grid">
          {stories.map((story) => (
            <article key={story.id} className="story-card">
              <div className="story-image">
                <img 
                  src={story.image} 
                  alt={story.imageData?.alt || story.title} 
                  onLoad={() => story.imageData?.downloadUrl && handleImageLoad(story.imageData.downloadUrl)}
                  onError={handleImageError}
                />
                <div className="story-category">{story.category}</div>
                <div className="story-location">{story.locationStartup}</div>
              </div>

              <div className="story-content">
                <h3 className="story-title">{story.title}</h3>
                <p className="story-excerpt">{story.excerpt}</p>

                <div className="story-details">
                  <div className="story-founders">
                    <strong>Founders:</strong> {story.keyFounders.join(', ')}
                  </div>
                  <div className="story-funding">
                    <strong>Funding:</strong> {story.fundingRaised}
                  </div>
                  <div className="story-timeline">
                    <strong>Timeline:</strong> {story.foundingYear} - {story.failureYear}
                  </div>
                  <div className="story-reason">
                    <strong>Reason:</strong> {story.reasonForFailure}
                  </div>
                </div>

                <div className="story-tags">
                  {story.industryTags.map((tag, index) => (
                    <span key={index} className="story-tag">{tag}</span>
                  ))}
                </div>

                <div className="story-meta">
                  <div className="story-stats">
                    <span className="read-time">{story.readTime}</span>
                    <span className="lessons-count">{story.lessons} lessons</span>
                  </div>
                  <span className="story-date">
                    {new Date(story.date).toLocaleDateString()}
                  </span>
                </div>

                <button 
                  className="read-more-btn"
                  onClick={() => handleReadMore(story.id)}
                >
                  Read Full Story
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="stories-footer">
          <button className="view-all-btn">
            View All Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default FailureStories;

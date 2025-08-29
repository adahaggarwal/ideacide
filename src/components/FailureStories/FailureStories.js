import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FailureStories.css';
import useStories from '../../hooks/useStories';
import { Loading } from '../index';
import pexelAPI from '../../services/pexelAPI';
import storyFallback from '../../assets/images/story_fallback.png';
import geminiAPI from '../../services/geminiAPI';

const FailureStories = () => {
  const { stories: initialStories, loading, error, lastUpdated, refreshStories } = useStories();
  const navigate = useNavigate();

  const INITIAL_COUNT = 5;
  const STORIES_PER_BATCH = 5; // Generate 5 stories per batch
  const [stories, setStories] = useState([]); // All stories to display
  const [viewAllClicked, setViewAllClicked] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [allViewed, setAllViewed] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [rateLimited, setRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState('');

  // On first render, show initial 5 stories
  React.useEffect(() => {
    setStories(initialStories.slice(0, INITIAL_COUNT));
  }, [initialStories]);

  const handleViewAllStories = async () => {
    if (rateLimited) return;
    setViewAllClicked(true);
    setFetching(true);
    try {
      // Fetch 5 stories from Gemini API
      const newStories = await geminiAPI.fetchStories(STORIES_PER_BATCH);
      if (newStories && newStories.length > 0) {
        setStories((prev) => {
          // Filter out stories with duplicate ids
          const existingIds = new Set(prev.map(s => s.id));
          const uniqueNewStories = newStories.filter(s => !existingIds.has(s.id));
          return [...prev, ...uniqueNewStories];
        });
        // If we got fewer than 5 stories, mark as all viewed
        if (newStories.length < STORIES_PER_BATCH) {
          setAllViewed(true);
        }
      } else {
        setAllViewed(true);
      }
    } catch (e) {
      if (e && e.message && e.message.includes('429')) {
        setRateLimited(true);
        setRateLimitMessage('🚦 Gemini API rate limit reached. Please wait 30 seconds before trying again.');
        setTimeout(() => {
          setRateLimited(false);
          setRateLimitMessage('');
        }, 30000); // 30 seconds cooldown
      } else if (e && e.message && e.message.includes('404')) {
        setRateLimitMessage('❌ Gemini API endpoint not found. Please check the API configuration.');
      }
      console.error('Error fetching stories:', e);
      setAllViewed(true);
    } finally {
      setFetching(false);
    }
  };

  const handleLoadMore = async () => {
    if (rateLimited) return;
    setFetching(true);
    try {
      // Fetch 5 more stories from Gemini API
      const newStories = await geminiAPI.fetchStories(STORIES_PER_BATCH);
      if (newStories && newStories.length > 0) {
        setStories((prev) => {
          // Filter out stories with duplicate ids
          const existingIds = new Set(prev.map(s => s.id));
          const uniqueNewStories = newStories.filter(s => !existingIds.has(s.id));
          return [...prev, ...uniqueNewStories];
        });
        // If we got fewer than 5 stories, mark as all viewed
        if (newStories.length < STORIES_PER_BATCH) {
          setAllViewed(true);
        }
      } else {
        setAllViewed(true);
      }
    } catch (e) {
      if (e && e.message && e.message.includes('429')) {
        setRateLimited(true);
        setRateLimitMessage('🚦 Gemini API rate limit reached. Please wait 30 seconds before trying again.');
        setTimeout(() => {
          setRateLimited(false);
          setRateLimitMessage('');
        }, 30000); // 30 seconds cooldown
      } else if (e && e.message && e.message.includes('404')) {
        setRateLimitMessage('❌ Gemini API endpoint not found. Please check the API configuration.');
      }
      console.error('Error fetching more stories:', e);
      setAllViewed(true);
    } finally {
      setFetching(false);
    }
  };

  const handleImageLoad = (downloadUrl) => {
    // Pexels API doesn't require download tracking like Unsplash
    // This function is kept for compatibility but doesn't need to do anything
  };

  const handleImageError = (event) => {
    // Set fallback image when original image fails to load
    event.target.src = storyFallback;
  };

  const handleReadMore = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  const handleRefreshStories = async () => {
    // Reset all state to show initial 5 stories again
    setViewAllClicked(false);
    setAllViewed(false);
    setFetching(true);
    
    try {
      // Try to fetch fresh stories from Gemini API first
      const freshStories = await geminiAPI.fetchStories(STORIES_PER_BATCH);
      if (freshStories && freshStories.length > 0) {
        // Show first 5 stories from the fresh batch
        setStories(freshStories.slice(0, INITIAL_COUNT));
        setRefreshMessage('✅ Fresh stories loaded from Gemini API!');
        console.log('✅ Refreshed with fresh stories from Gemini API');
        // Clear message after 3 seconds
        setTimeout(() => setRefreshMessage(''), 3000);
      } else {
        // Fallback to initial stories if API fails
        setStories(initialStories.slice(0, INITIAL_COUNT));
        setRefreshMessage('🔄 Stories refreshed with fallback data');
        console.log('🔄 Refreshed with initial stories (API fallback)');
        // Clear message after 3 seconds
        setTimeout(() => setRefreshMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error refreshing stories:', error);
      // Fallback to initial stories if there's an error
      setStories(initialStories.slice(0, INITIAL_COUNT));
      
      if (error && error.message && error.message.includes('404')) {
        setRefreshMessage('❌ Gemini API endpoint not found. Using fallback stories.');
      } else {
        setRefreshMessage('⚠️ Refreshed with fallback stories (API error)');
      }
      
      console.log('🔄 Refreshed with initial stories (error fallback)');
      // Clear message after 3 seconds
      setTimeout(() => setRefreshMessage(''), 3000);
    } finally {
      setFetching(false);
    }
  };

  if (loading) {
    return (
      <section id="stories" className="failure-stories">
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
              <button className="refresh-button" onClick={handleRefreshStories} disabled={fetching}>
                {fetching ? (
                  <>
                    <span className="spinner"></span>
                    Refreshing...
                  </>
                ) : (
                  '🔄 Refresh Stories'
                )}
              </button>
            </div>
          )}
          
          {/* Refresh message display */}
          {refreshMessage && (
            <div className="refresh-message">
              {refreshMessage}
            </div>
          )}
          
          {/* Rate limit message display */}
          {rateLimitMessage && (
            <div className="rate-limit-message" style={{ color: '#d32f2f', fontWeight: 'bold', margin: '12px 0', border: '1px solid #d32f2f', background: '#fff3f3', padding: '8px', borderRadius: '4px' }}>
              <span role="img" aria-label="rate-limit">🚦</span> {rateLimitMessage}
            </div>
          )}
          
          {/* Stories count display */}
          <div className="stories-count">
            Showing {stories.length} of {viewAllClicked ? 'many' : INITIAL_COUNT} stories
          </div>
        </div>

        <div className="stories-grid">
          {stories.map((story, idx) => (
            <article key={story.id ? `story-${story.id}` : `story-${idx}`} className="story-card">
              <div className="story-image">
                <img 
                  src={story.image} 
                  alt={story.imageData?.alt || story.title} 
                  onLoad={() => handleImageLoad()}
                  onError={(e) => {
                    // Fallback for Pexels API errors or any error
                    e.target.onerror = null;
                    e.target.src = storyFallback;
                  }}
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
          {!viewAllClicked && (
            <button className="view-all-btn" onClick={handleViewAllStories} disabled={fetching || rateLimited}>
              {fetching ? 'Loading...' : 'View All Stories'}
            </button>
          )}
          {viewAllClicked && !allViewed && (
            <button className="view-all-btn" onClick={handleLoadMore} disabled={fetching || rateLimited}>
              {fetching ? 'Loading...' : 'Load More'}
            </button>
          )}
          {allViewed && (
            <div className="all-viewed-message">All stories viewed</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FailureStories;

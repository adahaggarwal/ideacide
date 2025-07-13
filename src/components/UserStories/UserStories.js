import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserStories.css';
import useUserStories from '../../hooks/useUserStories';
import { Loading } from '../index';
import { storiesService } from '../../services/storiesService';

const UserStories = () => {
  const { stories, loading, error, lastUpdated, refreshStories } = useUserStories(6);
  const navigate = useNavigate();
  const [likedStories, setLikedStories] = useState(new Set());
  const [likingStories, setLikingStories] = useState(new Set());

  const handleReadMore = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  const handleCreateStory = () => {
    navigate('/create-story');
  };

  const handleLike = async (storyId, currentLikes) => {
    if (likingStories.has(storyId)) return; // Prevent double-clicking
    
    setLikingStories(prev => new Set([...prev, storyId]));
    
    try {
      const isLiked = likedStories.has(storyId);
      await storiesService.toggleLike(storyId, !isLiked);
      
      // Update local state
      if (isLiked) {
        setLikedStories(prev => {
          const newSet = new Set(prev);
          newSet.delete(storyId);
          return newSet;
        });
      } else {
        setLikedStories(prev => new Set([...prev, storyId]));
      }
      
      // Refresh stories to get updated like count
      refreshStories();
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLikingStories(prev => {
        const newSet = new Set(prev);
        newSet.delete(storyId);
        return newSet;
      });
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <section className="user-stories">
        <div className="user-stories-container">
          <div className="user-stories-header">
            <h2 className="user-stories-title">Community Stories</h2>
            <p className="user-stories-subtitle">
              Real experiences shared by our community
            </p>
          </div>
          <Loading size="large" text="Loading community stories..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="user-stories">
        <div className="user-stories-container">
          <div className="user-stories-header">
            <h2 className="user-stories-title">Community Stories</h2>
            <p className="user-stories-subtitle error-text">
              Unable to fetch community stories.
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
    <section className="user-stories">
      <div className="user-stories-container">
        <div className="user-stories-header">
          <h2 className="user-stories-title">Community Stories</h2>
          <p className="user-stories-subtitle">
            Real experiences shared by our community
          </p>

          <div className="user-stories-actions">
            {lastUpdated && (
              <span className="last-updated">
                Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button className="create-story-button" onClick={handleCreateStory}>
              📝 Share Your Story
            </button>
          </div>
        </div>

        {stories.length === 0 ? (
          <div className="no-stories">
            <div className="no-stories-icon">📖</div>
            <h3>No stories yet</h3>
            <p>Be the first to share your entrepreneurial journey!</p>
            <button className="create-first-story-button" onClick={handleCreateStory}>
              Tell Your Story
            </button>
          </div>
        ) : (
          <>
            <div className="user-stories-grid">
              {stories.map((story) => (
                <article key={story.id} className="user-story-card">
                  {story.images && story.images.length > 0 && (
                  <div className="user-story-image">
                  <img 
                  src={story.images[0]} 
                  alt={story.title}
                  onError={(e) => {
                  e.target.style.display = 'none';
                  }}
                    style={{
                      maxHeight: '200px',
                        objectFit: 'cover'
                        }}
                      />
                      <div className="story-badge">Community</div>
                    </div>
                  )}

                  <div className="user-story-content">
                    <h3 className="user-story-title">{story.title}</h3>
                    <p className="user-story-excerpt">
                      {truncateText(story.description)}
                    </p>

                    <div className="user-story-author">
                      <div className="author-avatar">
                        {story.author_name ? story.author_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="author-info">
                        <span className="author-name">{story.author_name || 'Anonymous'}</span>
                        <span className="story-date">{formatDate(story.created_at)}</span>
                      </div>
                    </div>

                    {story.links && story.links.length > 0 && (
                      <div className="story-links">
                        <span className="links-label">
                          🔗 {story.links.length} link{story.links.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    <div className="user-story-stats">
                      <button 
                        className={`like-button ${likedStories.has(story.id) ? 'liked' : ''}`}
                        onClick={() => handleLike(story.id, story.likes)}
                        disabled={likingStories.has(story.id)}
                      >
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill={likedStories.has(story.id) ? "currentColor" : "none"}
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span>{story.likes || 0}</span>
                      </button>
                    </div>

                    <button
                      className="read-story-btn"
                      onClick={() => handleReadMore(story.id)}
                    >
                      Read Story
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

            <div className="user-stories-footer">
              <button className="view-all-user-stories-btn" onClick={() => navigate('/stories')}>
                View All Community Stories
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default UserStories;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Loading from '../../components/Loading';
import UserStories from '../../components/UserStories';
import FailureStories from '../../components/FailureStories';
import { storiesService } from '../../services/storiesService';
import './Stories.css';

const Stories = () => {
  const navigate = useNavigate();
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'failure'

  useEffect(() => {
    loadUserStories();
  }, []);

  const loadUserStories = async () => {
    try {
      setLoading(true);
      const stories = await storiesService.getStories(100); // Load up to 100 stories
      setUserStories(stories || []);
    } catch (err) {
      console.error('Error loading stories:', err);
      setError('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="stories-page">
        <div className="stories-container">
          {/* Page Header */}
          <div className="stories-header">
            <h1 className="stories-title">All Stories</h1>
            <p className="stories-subtitle">
              Discover inspiring entrepreneurial journeys, failures, and successes from our community
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="stories-tabs">
            <button
              className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => setActiveTab('user')}
            >
              User Stories ({userStories.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'failure' ? 'active' : ''}`}
              onClick={() => setActiveTab('failure')}
            >
              Failure Stories
            </button>
          </div>

          {/* Content */}
          <div className="stories-content">
            {activeTab === 'user' && (
              <div className="user-stories-section">
                {error ? (
                  <div className="error-message">
                    <p>{error}</p>
                    <button onClick={loadUserStories} className="retry-button">
                      Try Again
                    </button>
                  </div>
                ) : (
                  <UserStories />
                )}
              </div>
            )}

            {activeTab === 'failure' && (
              <div className="failure-stories-section">
                <FailureStories />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Stories;

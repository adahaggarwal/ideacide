import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import groqAPI from '../services/groqAPI';

const StoriesContext = createContext();

export const useStoriesContext = () => {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error('useStoriesContext must be used within a StoriesProvider');
  }
  return context;
};

export const StoriesProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedStories = await groqAPI.fetchStories();

      // Add calculated read time to each story
      const storiesWithReadTime = fetchedStories.map((story) => ({
        ...story,
        readTime: groqAPI.calculateReadTime(story.detailedDescription),
      }));

      setStories(storiesWithReadTime);
      setLastUpdated(new Date());
      setInitialized(true);
    } catch (err) {
      setError(err.message);
      console.error('Error in StoriesContext:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStories = useCallback(() => {
    fetchStories();
  }, [fetchStories]);

  // Initialize stories on mount
  useEffect(() => {
    if (!initialized) {
      fetchStories();
    }
  }, [initialized, fetchStories]);

  const value = {
    stories,
    loading,
    error,
    lastUpdated,
    refreshStories,
    fetchStories,
    initialized,
  };

  return (
    <StoriesContext.Provider value={value}>
      {children}
    </StoriesContext.Provider>
  );
};

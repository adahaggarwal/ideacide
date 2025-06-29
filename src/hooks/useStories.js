import { useState, useEffect } from 'react';
import groqAPI from '../services/groqAPI';

const useStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStories = async () => {
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
    } catch (err) {
      setError(err.message);
      console.error('Error in useStories hook:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshStories = () => {
    fetchStories();
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return {
    stories,
    loading,
    error,
    lastUpdated,
    refreshStories,
  };
};

export default useStories;

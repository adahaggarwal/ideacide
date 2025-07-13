import { useState, useEffect } from 'react';
import { storiesService } from '../services/storiesService';

const useUserStories = (limit = 10, refreshTrigger = 0) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await storiesService.getStories(limit);
      setStories(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError(err.message || 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const refreshStories = () => {
    fetchStories();
  };

  useEffect(() => {
    fetchStories();
  }, [limit, refreshTrigger]);

  return {
    stories,
    loading,
    error,
    lastUpdated,
    refreshStories
  };
};

export default useUserStories;

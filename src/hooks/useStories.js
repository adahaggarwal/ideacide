import { useStoriesContext } from '../context';

const useStories = () => {
  const {
    stories,
    loading,
    error,
    lastUpdated,
    refreshStories,
  } = useStoriesContext();

  return {
    stories,
    loading,
    error,
    lastUpdated,
    refreshStories,
  };
};

export default useStories;

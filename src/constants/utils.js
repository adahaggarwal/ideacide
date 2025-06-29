// Utility functions for the IdeaCide application

// Format date to readable string
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate random placeholder image URL
export const getPlaceholderImage = (width, height, category = 'tech') => {
  const colors = {
    tech: '2D2E36/6B46C1',
    business: '2D2E36/F59E0B',
    healthcare: '2D2E36/14B8A6',
    startup: '2D2E36/3B82F6',
    default: '2D2E36/A3A3A3'
  };
  
  const color = colors[category] || colors.default;
  return `https://via.placeholder.com/${width}x${height}/${color}?text=${category.toUpperCase()}`;
};

// Debounce function for search/input delays
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Smooth scroll to element
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Check if element is in viewport
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Generate unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Theme utilities
export const theme = {
  toggleDarkMode: () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    storage.set('darkMode', isDark);
    return isDark;
  },
  
  initTheme: () => {
    const savedTheme = storage.get('darkMode', true);
    if (savedTheme) {
      document.body.classList.add('dark-mode');
    }
  }
};

export default {
  formatDate,
  truncateText,
  getPlaceholderImage,
  debounce,
  scrollToElement,
  isInViewport,
  generateId,
  isValidEmail,
  storage,
  theme
};

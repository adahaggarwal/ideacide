// Pexels API integration service
const PEXELS_API_URL = 'https://api.pexels.com/v1';
const PEXELS_ACCESS_KEY = process.env.REACT_APP_PEXEL_ACCESS_KEY;

// Category to search keyword mapping
const CATEGORY_KEYWORDS = {
  'Business Strategy': 'business meeting boardroom strategy',
  'Product Innovation': 'product development innovation technology',
  'Healthcare Tech': 'medical technology healthcare digital',
  'Fintech': 'fintech banking finance technology',
  'E-commerce': 'ecommerce online shopping retail',
  'SaaS': 'software technology saas computer',
  'Hardware': 'hardware technology electronics device',
  'AI/ML': 'artificial intelligence AI machine learning',
  'Social Media': 'social media technology smartphone',
  'Transportation': 'transportation mobility automotive'
};

// Fallback images if Pexels fails
const FALLBACK_IMAGES = {
  'Business Strategy': 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&w=400&h=300&fit=crop',
  'Product Innovation': 'https://images.pexels.com/photos/256369/pexels-photo-256369.jpeg?auto=compress&w=400&h=300&fit=crop',
  'Healthcare Tech': 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&w=400&h=300&fit=crop',
  'Fintech': 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&w=400&h=300&fit=crop',
  'E-commerce': 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&w=400&h=300&fit=crop',
  'SaaS': 'https://images.pexels.com/photos/267614/pexels-photo-267614.jpeg?auto=compress&w=400&h=300&fit=crop',
  'Hardware': 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&w=400&h=300&fit=crop',
  'AI/ML': 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=400&h=300&fit=crop',
  'Social Media': 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&w=400&h=300&fit=crop',
  'Transportation': 'https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&w=400&h=300&fit=crop'
};

class PexelsService {
  constructor() {
    this.accessKey = PEXELS_ACCESS_KEY;
    this.apiUrl = PEXELS_API_URL;
  }

  async getImageForStory(story, retryCount = 0) {
    try {
      if (!this.accessKey) {
        console.warn('Pexels API key not found. Using fallback images.');
        return this.getFallbackImage(story.category);
      }

      // Create specific search terms based on the story content
      const keywords = this.generateKeywordsFromStory(story);
      console.log(`Searching Pexels for: "${keywords}" (${story.title})`);

      const url = `${this.apiUrl}/search`;
      const params = new URLSearchParams({
        query: keywords,
        per_page: 1,
        orientation: 'landscape',
      });

      const response = await fetch(`${url}?${params}`, {
        headers: {
          Authorization: this.accessKey,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          console.warn('Pexels API access denied (403). Using fallback image.');
          return this.getFallbackImage(story.category);
        } else if (response.status === 401) {
          console.warn('Pexels API unauthorized (401). Check API key. Using fallback image.');
          return this.getFallbackImage(story.category);
        } else if (response.status === 429) {
          console.warn('Pexels API rate limit exceeded (429). Using fallback image.');
          return this.getFallbackImage(story.category);
        }
        // For other errors, try fallback if this is first attempt
        if (retryCount === 0) {
          console.warn(`Pexels API error ${response.status}, trying with category keywords...`);
          return this.getImageForCategory(story.category);
        }
        throw new Error(`Pexels API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.photos && data.photos.length > 0) {
        const photo = data.photos[0];
        return {
          url: photo.src.large || photo.src.original,
          smallUrl: photo.src.medium,
          thumbUrl: photo.src.small,
          alt: photo.alt || story.title,
          photographer: photo.photographer,
          photographerUrl: photo.photographer_url,
        };
      } else {
        console.warn(`No images found for story: ${story.title}`);
        // Try with category-based search as fallback
        if (retryCount === 0) {
          return this.getImageForCategory(story.category);
        }
        return this.getFallbackImage(story.category);
      }
    } catch (error) {
      console.error(`Error fetching image for story ${story.title}:`, error);
      // Try category-based search as last resort
      if (retryCount === 0) {
        return this.getImageForCategory(story.category);
      }
      return this.getFallbackImage(story.category);
    }
  }

  // Keep the old category-based method as fallback
  async getImageForCategory(category) {
    try {
      if (!this.accessKey) {
        return this.getFallbackImage(category);
      }

      const keywords = CATEGORY_KEYWORDS[category] || 'business startup';
      const url = `${this.apiUrl}/search`;
      const params = new URLSearchParams({
        query: keywords,
        per_page: 1,
        orientation: 'landscape',
      });

      const response = await fetch(`${url}?${params}`, {
        headers: {
          Authorization: this.accessKey,
        },
      });

      if (!response.ok) {
        console.warn(`Pexels category search failed: ${response.status}`);
        return this.getFallbackImage(category);
      }

      const data = await response.json();

      if (data.photos && data.photos.length > 0) {
        const photo = data.photos[0];
        return {
          url: photo.src.large || photo.src.original,
          smallUrl: photo.src.medium,
          thumbUrl: photo.src.small,
          alt: photo.alt || `${category} image`,
          photographer: photo.photographer,
          photographerUrl: photo.photographer_url,
        };
      } else {
        return this.getFallbackImage(category);
      }
    } catch (error) {
      console.error(`Error in category search for ${category}:`, error);
      return this.getFallbackImage(category);
    }
  }

  generateKeywordsFromStory(story) {
    // Extract key terms from title and combine with industry tags and location
    const titleWords = story.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .split(' ')
      .filter(word => word.length > 3 && !this.isStopWord(word))
      .slice(0, 3); // Take first 3 meaningful words

    // Add industry context
    const industryKeywords = story.industryTags
      .map(tag => tag.toLowerCase())
      .slice(0, 2); // Take first 2 industry tags

    // Add location context if it's a major city
    const locationKeywords = this.getLocationKeywords(story.locationStartup);

    // Add failure context
    const failureKeywords = this.getFailureKeywords(story.reasonForFailure);

    // Combine all keywords
    const allKeywords = [
      ...titleWords,
      ...industryKeywords,
      ...locationKeywords,
      ...failureKeywords
    ].filter(Boolean).slice(0, 6); // Limit to 6 keywords max

    return allKeywords.join(' ');
  }

  isStopWord(word) {
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'how', 'why', 'what', 'when', 'where'];
    return stopWords.includes(word);
  }

  getLocationKeywords(location) {
    const majorCities = {
      'san francisco': ['silicon valley', 'tech'],
      'new york': ['wall street', 'finance'],
      'london': ['financial district', 'business'],
      'tokyo': ['technology', 'innovation'],
      'berlin': ['startup', 'tech'],
      'austin': ['tech', 'startup'],
      'seattle': ['technology', 'corporate'],
      'los angeles': ['entertainment', 'media']
    };

    const cityLower = location.toLowerCase();
    for (const [city, keywords] of Object.entries(majorCities)) {
      if (cityLower.includes(city)) {
        return keywords;
      }
    }
    return ['business', 'corporate'];
  }

  getFailureKeywords(reason) {
    const reasonKeywords = {
      'Market Fit': ['market research', 'customer'],
      'Cash Flow': ['finance', 'money', 'funding'],
      'Competition': ['competitors', 'market'],
      'Product Issues': ['product', 'development'],
      'Management': ['leadership', 'team'],
      'Regulatory': ['legal', 'compliance']
    };

    return reasonKeywords[reason] || ['business', 'startup'];
  }

  async getImagesForStories(stories) {
    try {
      const imagePromises = stories.map(async (story) => {
        const imageData = await this.getImageForStory(story);
        return {
          ...story,
          image: imageData.url || imageData,
          imageData: imageData
        };
      });

      return await Promise.all(imagePromises);
    } catch (error) {
      console.error('Error fetching images for stories:', error);
      // Return stories with fallback images
      return stories.map(story => ({
        ...story,
        image: this.getFallbackImage(story.category)
      }));
    }
  }

  getFallbackImage(category) {
    return FALLBACK_IMAGES[category] || FALLBACK_IMAGES['Business Strategy'];
  }
}

export default new PexelsService(); 
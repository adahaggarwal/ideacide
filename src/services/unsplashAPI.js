// Unsplash API integration service
const UNSPLASH_API_URL = 'https://api.unsplash.com';
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

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

// Fallback images if Unsplash fails
const FALLBACK_IMAGES = {
  'Business Strategy': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  'Product Innovation': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop',
  'Healthcare Tech': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
  'Fintech': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
  'E-commerce': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
  'SaaS': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  'Hardware': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
  'AI/ML': 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=400&h=300&fit=crop',
  'Social Media': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
  'Transportation': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'
};

class UnsplashService {
  constructor() {
    this.accessKey = UNSPLASH_ACCESS_KEY;
    this.apiUrl = UNSPLASH_API_URL;
  }

  async getImageForStory(story, retryCount = 0) {
    try {
      if (!this.accessKey) {
        console.warn('Unsplash API key not found. Using fallback images.');
        return this.getFallbackImage(story.category);
      }

      // Create specific search terms based on the story content
      const keywords = this.generateKeywordsFromStory(story);
      console.log(`Searching Unsplash for: "${keywords}" (${story.title})`);
      
      const url = `${this.apiUrl}/search/photos`;
      
      const params = new URLSearchParams({
        query: keywords,
        per_page: 1,
        orientation: 'landscape',
        content_filter: 'high',
        client_id: this.accessKey
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn('Unsplash API access denied (403). Using fallback image.');
          return this.getFallbackImage(story.category);
        } else if (response.status === 401) {
          console.warn('Unsplash API unauthorized (401). Check API key. Using fallback image.');
          return this.getFallbackImage(story.category);
        } else if (response.status === 429) {
          console.warn('Unsplash API rate limit exceeded (429). Using fallback image.');
          return this.getFallbackImage(story.category);
        }
        // For other errors, try fallback if this is first attempt
        if (retryCount === 0) {
          console.warn(`Unsplash API error ${response.status}, trying with category keywords...`);
          return this.getImageForCategory(story.category);
        }
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const photo = data.results[0];
        console.log(`Found image for ${story.title}: ${photo.urls.small}`);
        return {
          url: photo.urls.regular,
          smallUrl: photo.urls.small,
          thumbUrl: photo.urls.thumb,
          alt: photo.alt_description || story.title,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
          downloadUrl: photo.links.download_location
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
      const url = `${this.apiUrl}/search/photos`;
      
      const params = new URLSearchParams({
        query: keywords,
        per_page: 1,
        orientation: 'landscape',
        content_filter: 'high',
        client_id: this.accessKey
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        console.warn(`Unsplash category search failed: ${response.status}`);
        return this.getFallbackImage(category);
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const photo = data.results[0];
        return {
          url: photo.urls.regular,
          smallUrl: photo.urls.small,
          thumbUrl: photo.urls.thumb,
          alt: photo.alt_description || `${category} image`,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
          downloadUrl: photo.links.download_location
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

  // Trigger download tracking (required by Unsplash API)
  async triggerDownload(downloadUrl) {
    if (!this.accessKey || !downloadUrl) return;
    
    try {
      await fetch(`${downloadUrl}?client_id=${this.accessKey}`);
    } catch (error) {
      console.error('Error triggering download:', error);
    }
  }

  // Get random startup/business failure related image
  async getRandomFailureImage() {
    try {
      if (!this.accessKey) {
        return this.getFallbackImage('Business Strategy');
      }

      const keywords = 'startup failure business closed empty office';
      const url = `${this.apiUrl}/photos/random`;
      
      const params = new URLSearchParams({
        query: keywords,
        orientation: 'landscape',
        content_filter: 'high',
        client_id: this.accessKey
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const photo = await response.json();
      
      return {
        url: photo.urls.regular,
        smallUrl: photo.urls.small,
        thumbUrl: photo.urls.thumb,
        alt: photo.alt_description || 'Startup failure image',
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        downloadUrl: photo.links.download_location
      };

    } catch (error) {
      console.error('Error fetching random failure image:', error);
      return this.getFallbackImage('Business Strategy');
    }
  }
}

export default new UnsplashService();

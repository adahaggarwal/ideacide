// Groq API integration service
import unsplashAPI from './unsplashAPI';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

const GROQ_PROMPT = `Generate exactly 3 startup failure stories and return ONLY a valid JSON array. Do not include any explanatory text before or after the JSON.

Return this exact format:
[
  {
    "id": 1,
    "title": "Story title here",
    "category": "Business Strategy",
    "excerpt": "Brief summary",
    "locationStartup": "City, Country",
    "detailedDescription": "200-word detailed description",
    "lessons": 5,
    "date": "YYYY-MM-DD",
    "foundingYear": 2018,
    "failureYear": 2020,
    "fundingRaised": "$50M",
    "keyFounders": ["Founder 1", "Founder 2"],
    "industryTags": ["Tag1", "Tag2"],
    "reasonForFailure": "Market Fit",
    "sourceUrl": null
  }
]

Categories: Business Strategy, Product Innovation, Healthcare Tech, Fintech, E-commerce, SaaS, Hardware, AI/ML, Social Media, Transportation

Failure reasons: Market Fit, Cash Flow, Competition, Product Issues, Management, Regulatory

IMPORTANT: Return ONLY the JSON array, no other text.`;

// Fallback data in case API fails
const FALLBACK_STORIES = [
  {
    id: 1,
    title: "Quibi: The $1.75 Billion Streaming Failure",
    category: "Business Strategy",
    excerpt: "Quibi raised massive funding for short-form mobile video content but failed to find product-market fit during the pandemic.",
    locationStartup: "Los Angeles, USA",
    detailedDescription: "Quibi was a short-form mobile video streaming platform founded by Jeffrey Katzenberg and Meg Whitman. Despite raising $1.75 billion in funding, the company struggled with user adoption and content discovery. Launched during the COVID-19 pandemic when people were staying home, the mobile-first platform missed the mark as users preferred watching content on larger screens. The company's premium pricing model and lack of social features also hindered growth. Quibi shut down just six months after launch, with its content library sold to Roku. The failure highlighted the importance of timing, market research, and understanding consumer behavior during unprecedented times.",
    lessons: 5,
    date: "2020-10-21",
    foundingYear: 2018,
    failureYear: 2020,
    fundingRaised: "$1.75B",
    keyFounders: ["Jeffrey Katzenberg", "Meg Whitman"],
    industryTags: ["Streaming", "Mobile", "Entertainment"],
    reasonForFailure: "Market Fit",
    sourceUrl: "https://www.theverge.com/2020/10/21/21526702/quibi-shutting-down-short-form-video-jeffrey-katzenberg-meg-whitman"
  },
  {
    id: 2,
    title: "Theranos: The Blood Testing Fraud That Shook Silicon Valley",
    category: "Healthcare Tech",
    excerpt: "Elizabeth Holmes built a $9 billion company on promises of revolutionary blood testing technology that never actually worked.",
    locationStartup: "Palo Alto, USA",
    detailedDescription: "Theranos claimed to revolutionize blood testing with technology that could run hundreds of tests from a single drop of blood. Founded by Elizabeth Holmes, the company reached a valuation of $9 billion and partnerships with major retailers like Walgreens. However, investigations revealed that the technology didn't work as promised, and the company was using traditional machines for most tests while diluting small blood samples. Whistleblowers exposed the fraud, leading to regulatory investigations and criminal charges. Holmes was convicted of fraud and conspiracy, highlighting the dangers of hype over substance in healthcare technology and the importance of regulatory oversight in medical devices.",
    lessons: 8,
    date: "2018-09-05",
    foundingYear: 2003,
    failureYear: 2018,
    fundingRaised: "$945M",
    keyFounders: ["Elizabeth Holmes"],
    industryTags: ["Healthcare", "Biotech", "Medical Devices"],
    reasonForFailure: "Product Issues",
    sourceUrl: "https://www.sec.gov/news/press-release/2018-41"
  },
  {
    id: 3,
    title: "Zume Pizza: Robotic Pizza Delivery Gone Wrong",
    category: "Product Innovation",
    excerpt: "Zume Pizza promised robotic pizza making and autonomous delivery but burned through $375 million without achieving sustainable operations.",
    locationStartup: "Mountain View, USA",
    detailedDescription: "Zume Pizza aimed to revolutionize food delivery using robots to make pizza and autonomous vehicles for delivery. The company raised significant funding from SoftBank and other investors, promising to reduce costs and improve efficiency through automation. However, the robotic pizza-making technology was unreliable, often producing inconsistent results. The autonomous delivery vehicles faced regulatory and technical challenges, while the business model proved unsustainable with high operational costs. Customer complaints about food quality and delivery times mounted, and the company struggled to scale beyond a few locations. Zume eventually pivoted away from pizza to focus on food packaging technology before ultimately shutting down operations.",
    lessons: 6,
    date: "2020-01-08",
    foundingYear: 2015,
    failureYear: 2020,
    fundingRaised: "$375M",
    keyFounders: ["Alex Garden", "Julia Collins"],
    industryTags: ["Food Tech", "Robotics", "Delivery"],
    reasonForFailure: "Product Issues",
    sourceUrl: null
  }
];

class GroqAPIService {
  constructor() {
    this.apiKey = GROQ_API_KEY;
    this.apiUrl = GROQ_API_URL;
  }

  async fetchStories() {
    try {
      if (!this.apiKey) {
        console.warn('Groq API key not found. Using fallback data.');
        return FALLBACK_STORIES;
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: GROQ_PROMPT
            }
          ],
          model: 'llama3-8b-8192',
          temperature: 0.7,
          max_tokens: 4000,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from Groq API');
      }

      console.log('Raw content from Groq:', content);

      // Clean the content - remove any text before/after JSON
      let cleanContent = content.trim();
      
      // Find the JSON array start and end
      const jsonStart = cleanContent.indexOf('[');
      const jsonEnd = cleanContent.lastIndexOf(']') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        console.warn('Invalid JSON format from Groq API:', content);
        throw new Error('Invalid JSON format received from API');
      }
      
      // Extract only the JSON part
      cleanContent = cleanContent.substring(jsonStart, jsonEnd);
      
      // Fix common JSON issues
      cleanContent = cleanContent
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*):/g, '$1"$2"$3:') // Add quotes to unquoted keys
        .replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*)(\s*[,}])/g, ': "$1"$2') // Add quotes to unquoted string values
        .replace(/:\s*'([^']*)'/g, ': "$1"') // Replace single quotes with double quotes
        .replace(/,\s*}/g, '}') // Remove trailing commas
        .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
      
      console.log('Cleaned content:', cleanContent);

      // Parse the JSON response
      let stories;
      try {
        stories = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.log('Failed content:', cleanContent);
        
        // Try to manually fix more JSON issues
        try {
          cleanContent = cleanContent
            .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*):/g, '"$2":') // Fix keys
            .replace(/:\s*([^"\[\{][^,}\]]*[^,}\]\s])(\s*[,}\]])/g, ': "$1"$2') // Fix values
            .replace(/"(\d+)"/g, '$1') // Fix numbers that got quoted
            .replace(/"(true|false|null)"/g, '$1'); // Fix booleans and null
          
          stories = JSON.parse(cleanContent);
          console.log('Successfully parsed after manual fixes');
        } catch (secondParseError) {
          console.error('Second parse attempt failed:', secondParseError);
          throw new Error('Unable to parse JSON response from Groq API');
        }
      }
      
      // Validate the response structure
      if (!Array.isArray(stories)) {
        throw new Error('Invalid response format from Groq API');
      }

      // Fetch images from Unsplash for each story
      console.log('Fetching images from Unsplash...');
      const storiesWithImages = await unsplashAPI.getImagesForStories(stories);
      
      console.log('Stories with images:', storiesWithImages);
      return storiesWithImages;

    } catch (error) {
      console.error('Error fetching stories from Groq:', error);
      
      // Return fallback data if API fails
      console.log('Using fallback stories due to API error');
      const fallbackWithImages = await unsplashAPI.getImagesForStories(FALLBACK_STORIES);
      return fallbackWithImages;
    }
  }

  getPlaceholderImage(category) {
    const imageMap = {
      'Business Strategy': 'https://via.placeholder.com/300x200/2D2E36/F59E0B?text=Business',
      'Product Innovation': 'https://via.placeholder.com/300x200/2D2E36/6B46C1?text=Product',
      'Healthcare Tech': 'https://via.placeholder.com/300x200/2D2E36/14B8A6?text=Healthcare',
      'Fintech': 'https://via.placeholder.com/300x200/2D2E36/3B82F6?text=Fintech',
      'E-commerce': 'https://via.placeholder.com/300x200/2D2E36/F59E0B?text=E-commerce',
      'SaaS': 'https://via.placeholder.com/300x200/2D2E36/6B46C1?text=SaaS',
      'Hardware': 'https://via.placeholder.com/300x200/2D2E36/14B8A6?text=Hardware',
      'AI/ML': 'https://via.placeholder.com/300x200/2D2E36/3B82F6?text=AI',
      'Social Media': 'https://via.placeholder.com/300x200/2D2E36/F59E0B?text=Social',
      'Transportation': 'https://via.placeholder.com/300x200/2D2E36/6B46C1?text=Transport'
    };

    return imageMap[category] || 'https://via.placeholder.com/300x200/2D2E36/A3A3A3?text=Startup';
  }

  // Calculate read time based on detailed description
  calculateReadTime(detailedDescription) {
    const wordsPerMinute = 200;
    const wordCount = detailedDescription.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  }
}

export default new GroqAPIService();

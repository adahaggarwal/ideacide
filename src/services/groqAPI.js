// Groq API integration service
import unsplashAPI from './unsplashAPI';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

// Function to generate open-ended prompt that allows web research
function generateOpenPrompt() {
  return `You are tasked with researching and generating exactly 3 REAL startup failure stories. You should find diverse, factual information about different startup failures from various industries and time periods.

IMPORTANT: Your response must be ONLY valid JSON. Do not include:
- Any explanatory text
- Chat template tokens like <|start_header_id|>
- Markdown formatting
- Comments or notes
- Any text before or after the JSON

Start immediately with "[" and end with "]".

Find 3 different startup failure stories from various sources. Look for:
- Different industries (tech, healthcare, food, retail, etc.)
- Different time periods (dot-com era, recent failures, etc.)
- Different failure reasons (market fit, fraud, competition, etc.)
- Well-documented cases with reliable information

Ensure variety and avoid repeating the same companies. Research recent failures as well as historical ones.

JSON format:
[
  {
    "id": 1,
    "title": "Company Name: Brief Description",
    "category": "Business Strategy",
    "excerpt": "Brief factual summary",
    "locationStartup": "City, Country",
    "detailedDescription": "200 word analysis of company journey, business model, challenges, and failure reasons.",
    "keyLessons": {
      "analysis": "Brief analysis of why this startup failed",
      "lessons": [
        "Lesson 1",
        "Lesson 2",
        "Lesson 3",
        "Lesson 4",
        "Lesson 5"
      ]
    },
    "date": "YYYY-MM-DD",
    "foundingYear": YEAR,
    "failureYear": YEAR,
    "fundingRaised": "$AMOUNT",
    "keyFounders": ["Founder 1", "Founder 2"],
    "industryTags": ["Tag1"],
    "reasonForFailure": "Primary Reason",
    "sourceUrl": "https://credible-source.com/article"
  }
]

Return ONLY the JSON array - nothing else. Research timestamp: ${Date.now()}`;
}

// Fallback data in case API fails
const FALLBACK_STORIES = [
  {
    id: 1,
    title: "Quibi: The $1.75 Billion Streaming Failure",
    category: "Business Strategy",
    excerpt: "Quibi raised massive funding for short-form mobile video content but failed to find product-market fit during the pandemic.",
    locationStartup: "Los Angeles, USA",
    detailedDescription: "Quibi was a short-form mobile video streaming platform founded by Jeffrey Katzenberg and Meg Whitman in 2018. The company's ambitious vision was to create premium, short-form content specifically designed for mobile viewing, targeting users during commutes and short breaks. Despite raising an unprecedented $1.75 billion in funding from major investors and Hollywood studios, Quibi faced immediate challenges upon its April 2020 launch. The timing couldn't have been worse – launching during the COVID-19 pandemic when people were staying home and had access to large screens, making mobile-only content less appealing. The platform's content, while high-quality and featuring A-list celebrities, failed to resonate with audiences who were accustomed to free, user-generated content on platforms like TikTok and Instagram. Quibi's premium pricing model of $4.99 per month (with ads) or $7.99 (ad-free) seemed excessive compared to free alternatives. The app lacked basic social features like sharing clips or commenting, which were essential for viral content distribution. Technical issues plagued the platform, including the inability to cast content to TVs and poor content discovery mechanisms. User retention rates were dismal, with most subscribers canceling after the free trial period. By October 2020, just six months after launch, Quibi announced it was shutting down, with its content library eventually sold to Roku for an undisclosed amount. The failure highlighted the critical importance of market timing, understanding consumer behavior during crisis periods, and the challenges of competing in an oversaturated streaming market.",
    keyLessons: {
      analysis: "Quibi's failure was a perfect storm of poor timing, market misunderstanding, and overconfidence in an unproven business model. The company launched a mobile-first, premium short-form video platform during a pandemic when people were staying home with large screens. Despite raising unprecedented funding and hiring Hollywood talent, they failed to understand their target market, ignored the success of free platforms like TikTok, and built a product that lacked basic social features essential for viral content distribution.",
      lessons: [
        "Market timing is crucial - launching a mobile-first platform during a pandemic when people were home with large screens showed poor market awareness and adaptability",
        "Understand your competition - competing against free platforms like TikTok with premium pricing requires exceptional value proposition and differentiation",
        "User behavior research is essential - assuming commuters would pay for premium short-form content without validating this assumption led to fundamental misalignment",
        "Social features are not optional - modern content platforms require sharing, commenting, and viral distribution mechanisms to succeed",
        "Technical execution matters - basic features like TV casting and content discovery are table stakes in the streaming industry and cannot be overlooked"
      ]
    },
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
    detailedDescription: "Theranos, founded by Elizabeth Holmes in 2003, claimed to revolutionize blood testing with proprietary technology that could run hundreds of tests from a single drop of blood using devices called 'Edison' machines. The company's narrative was compelling: faster, cheaper, and less invasive blood testing that could democratize healthcare. Holmes, a Stanford dropout, became Silicon Valley's youngest female billionaire as Theranos reached a valuation of $9 billion by 2014. The company secured high-profile partnerships with Walgreens and Safeway, planning to place testing centers in retail locations nationwide. However, the revolutionary technology was largely fictional. Internal investigations later revealed that Theranos was using traditional third-party machines for most tests, diluting tiny blood samples to dangerous levels, and producing unreliable results that could have led to misdiagnoses and patient harm. Whistleblowers, including former employees Tyler Schultz and Erika Cheung, began exposing the company's fraudulent practices in 2015. Wall Street Journal reporter John Carreyrou's investigation revealed the extent of the deception, leading to regulatory scrutiny from the FDA and CMS. The company's lab was found to be violating federal safety standards, and its technology claims were debunked by medical experts. As the truth emerged, partnerships crumbled, lawsuits mounted, and investors lost hundreds of millions. Holmes was eventually convicted of fraud and conspiracy charges in 2022, sentenced to over 11 years in prison. The scandal highlighted the dangerous intersection of Silicon Valley's 'fake it till you make it' culture with healthcare, where unproven technology can literally be a matter of life and death.",
    keyLessons: {
      analysis: "Theranos represents one of the most egregious cases of fraud in Silicon Valley history, where the 'fake it till you make it' culture met life-threatening consequences. Elizabeth Holmes built a $9 billion company on completely fictional technology claims, exploiting investor FOMO and media hype while putting patient lives at risk with unreliable blood tests. The scandal exposed fundamental flaws in venture capital due diligence, board oversight, and regulatory processes in the healthcare technology sector.",
      lessons: [
        "Healthcare technology requires rigorous scientific validation - the 'fake it till you make it' approach can be deadly when dealing with medical diagnoses and patient safety",
        "Regulatory compliance is non-negotiable - healthcare companies must work with regulators from day one, not treat them as obstacles to overcome later",
        "Transparency builds trust - secretive operations and NDAs in healthcare raise red flags and ultimately undermine credibility when scrutinized",
        "Board composition matters - stacking boards with famous names instead of relevant experts can enable fraud and poor oversight",
        "Whistleblower protection is crucial - companies that silence dissent and ignore internal warnings are often hiding fundamental problems that will eventually surface"
      ]
    },
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
    detailedDescription: "Zume Pizza, founded in 2015 by Alex Garden and Julia Collins, aimed to revolutionize food delivery by combining robotic pizza-making technology with autonomous delivery vehicles. The company's vision was ambitious: robots would prepare pizzas in mobile kitchens while en route to customers, ensuring hot, fresh delivery while reducing labor costs and delivery times. SoftBank's Vision Fund led a massive $375 million funding round in 2018, valuing the company at over $2 billion and betting big on the future of food automation. The robotic pizza-making process involved machines that spread sauce, added toppings, and managed cooking times with precision. However, the technology proved far more complex than anticipated. The robots frequently malfunctioned, producing inconsistent pizzas with uneven sauce distribution and toppings. The mobile kitchen concept faced regulatory hurdles, as cooking food in moving vehicles violated health department regulations in most jurisdictions. Autonomous delivery vehicles were still years away from commercial viability, forcing the company to rely on human drivers. Customer feedback was largely negative, with complaints about cold pizzas, wrong orders, and long delivery times becoming common. The unit economics never worked – the cost of maintaining sophisticated robotic equipment, combined with low pizza margins, made profitability impossible. As the company struggled to scale beyond a few locations in California, it began pivoting away from pizza delivery. In 2019, Zume shifted focus to food packaging technology and logistics, but the pivot came too late. The company laid off hundreds of employees and ultimately shut down operations in 2020, leaving investors with massive losses and serving as a cautionary tale about the challenges of applying complex automation to simple food service operations.",
    keyLessons: {
      analysis: "Zume Pizza's failure illustrates the dangers of over-engineering simple problems and the importance of unit economics in technology businesses. The company applied complex robotic automation and autonomous vehicle technology to pizza delivery, creating massive operational complexity and costs that could never be justified by pizza margins. Their failure demonstrates how impressive technology means nothing without a sustainable business model and customer-focused execution.",
      lessons: [
        "Technology complexity should match problem complexity - over-engineering simple processes like pizza making can create more problems than it solves",
        "Regulatory research is essential - understanding health department rules and autonomous vehicle regulations before building the business model could have saved millions",
        "Unit economics must work at scale - impressive technology means nothing if the fundamental business model cannot generate sustainable profits",
        "Customer experience trumps innovation - customers care more about hot, tasty food delivered quickly than the technology behind it",
        "Pilot thoroughly before scaling - massive fundraising and expansion without proving the technology works reliably in real-world conditions leads to spectacular failures"
      ]
    },
    date: "2020-01-08",
    foundingYear: 2015,
    failureYear: 2020,
    fundingRaised: "$375M",
    keyFounders: ["Alex Garden", "Julia Collins"],
    industryTags: ["Food Tech", "Robotics", "Delivery"],
    reasonForFailure: "Product Issues",
    sourceUrl: "https://techcrunch.com/2020/01/08/zume-pizza-reportedly-shuts-down-pizza-robot-business/"
  }
];

class GroqAPIService {
  constructor() {
    this.apiKey = GROQ_API_KEY;
    this.apiUrl = GROQ_API_URL;
  }

  // Simplified JSON parsing with better error handling
  parseJSONResponse(jsonString) {
    console.log('=== JSON PARSING DEBUG ===');
    console.log('Input length:', jsonString.length);
    console.log('First 100 chars:', jsonString.substring(0, 100));
    
    // Clean the JSON string
    let cleaned = jsonString.trim();
    
    // Remove any LLaMA chat template tokens
    cleaned = cleaned
      .replace(/<\|start_header_id\|>/g, '')
      .replace(/<\|end_header_id\|>/g, '')
      .replace(/<\|[^>]*\|>/g, '')
      .trim();
    
    // Find JSON array boundaries
    const jsonStart = cleaned.indexOf('[');
    const jsonEnd = cleaned.lastIndexOf(']');
    
    if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
      console.warn('No valid JSON array found in response');
      throw new Error('No valid JSON array found in response');
    }
    
    // Extract only the JSON portion
    const jsonOnly = cleaned.substring(jsonStart, jsonEnd + 1);
    console.log('Extracted JSON length:', jsonOnly.length);
    
    try {
      const parsed = JSON.parse(jsonOnly);
      console.log('Successfully parsed JSON with', parsed.length, 'stories');
      return parsed;
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.log('Failed JSON sample:', jsonOnly.substring(0, 200));
      
      // If parsing fails, use fallback data
      console.log('Using fallback data due to JSON parse error');
      throw new Error('JSON parsing failed - using fallback data');
    }
  }

  async fetchStories() {
    try {
      if (!this.apiKey) {
        console.warn('❌ Groq API key not found. Using fallback data.');
        const fallbackWithImages = await unsplashAPI.getImagesForStories(FALLBACK_STORIES);
        return fallbackWithImages;
      }

      console.log('🚀 Making API call to Groq for dynamic startup failure research...');
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
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
              content: generateOpenPrompt() // Generate open research prompt
            }
          ],
          model: 'llama-3.1-8b-instant',
          temperature: 0.1,
          max_tokens: 12000,
          top_p: 0.9,
          stream: false
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('❌ HTTP error! status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ API response received successfully');
      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        console.error('❌ No content received from Groq API');
        throw new Error('No content received from Groq API');
      }

      console.log('📝 Raw content from Groq received, length:', content.length);

      // Clean the content for JSON parsing
      let cleanContent = content.trim();
      console.log('Raw content sample:', cleanContent.substring(0, 200));
      
      // Remove any potential LLaMA chat template tokens
      cleanContent = cleanContent
        .replace(/<\|start_header_id\|>/g, '')
        .replace(/<\|end_header_id\|>/g, '')
        .replace(/<\|[^>]*\|>/g, '')
        .trim();
      
      console.log('Cleaned content ready for parsing:', cleanContent.substring(0, 200) + '...');

      // Parse the JSON response using simplified parsing
      let stories;
      try {
        console.log('🔍 Attempting to parse JSON response...');
        stories = this.parseJSONResponse(cleanContent);
        console.log('✅ Successfully parsed JSON with', stories.length, 'stories');
      } catch (parseError) {
        console.error('❌ JSON parsing failed:', parseError.message);
        console.log('Failed content sample:', cleanContent.substring(0, 300));
        console.log('🛠️ Falling back to hardcoded stories...');
        throw new Error(`Unable to parse JSON response from Groq API. Error: ${parseError.message}`);
      }
      
      // Validate the response structure
      if (!Array.isArray(stories)) {
        throw new Error('Invalid response format from Groq API');
      }

      // Fetch images from Unsplash for each story
      console.log('🖼️ Fetching images from Unsplash for', stories.length, 'stories...');
      const storiesWithImages = await unsplashAPI.getImagesForStories(stories);
      
      console.log('✅ SUCCESS: Returning', storiesWithImages.length, 'fresh stories from Groq API');
      return storiesWithImages;

    } catch (error) {
      console.error('❌ Error fetching stories from Groq:', error.message);
      console.log('🛠️ Error details:', error);
      
      // Return fallback data if API fails
      console.log('📚 Using fallback stories due to API error');
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

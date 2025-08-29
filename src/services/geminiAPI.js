// Gemini API integration service for failure stories
import pexelAPI from './pexelAPI';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Function to generate prompt for Gemini API
function generateGeminiPrompt() {
  const timestamp = Date.now();
  const randomSeed = Math.floor(Math.random() * 1000);
  
  return `You are tasked with researching and generating exactly 10 REAL startup failure stories. You should find diverse, factual information about different startup failures from various industries and time periods.

IMPORTANT: This is request #${timestamp} with seed ${randomSeed}. Each request should return DIFFERENT stories than previous requests.

IMPORTANT: Your response must be ONLY valid JSON. Do not include:
- Any explanatory text
- Markdown formatting
- Comments or notes
- Any text before or after the JSON

Start immediately with "[" and end with "]".

Find 10 different startup failure stories from various sources. Look for:
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

// Enhanced fallback data with 10 stories in case API fails
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
  },
  {
    id: 4,
    title: "Juicero: The $400 Million Smart Juicer Disaster",
    category: "Hardware",
    excerpt: "Juicero built a $400 juicer that required proprietary juice packs, making it one of the most expensive and unnecessary products ever created.",
    locationStartup: "San Francisco, USA",
    detailedDescription: "Juicero, founded in 2013 by Doug Evans, aimed to revolutionize home juicing with a smart juicer that used proprietary juice packs. The company raised $120 million in funding, valuing it at $400 million, and positioned itself as the 'Keurig for juice.' However, the product was fundamentally flawed. The juicer cost $400 and required users to buy expensive proprietary juice packs that cost $5-8 each. When Bloomberg journalists discovered that the juice packs could be squeezed by hand just as effectively as the machine, the company's entire value proposition collapsed. The revelation that a $400 machine was essentially unnecessary for a task that could be done manually for free became a viral embarrassment. Juicero's business model relied on recurring revenue from juice pack sales, but the high cost and limited variety made it unsustainable. The company also faced criticism for the environmental impact of single-use juice packs. Despite having high-profile investors including Google Ventures and Kleiner Perkins, Juicero shut down in 2017, just four years after launch. The failure became a cautionary tale about over-engineering simple solutions and the importance of validating that technology actually adds value.",
    keyLessons: {
      analysis: "Juicero's failure demonstrates the dangers of creating solutions in search of problems and over-engineering simple tasks. The company built an expensive, complex machine for a process that could be done manually for free, failing to provide genuine value to customers. Their business model relied on proprietary consumables that were overpriced and environmentally unfriendly.",
      lessons: [
        "Solve real problems - don't create solutions in search of problems that don't exist",
        "Validate value proposition - ensure your product actually improves upon existing solutions",
        "Avoid over-engineering - simple problems don't always need complex technological solutions",
        "Consider total cost - factor in ongoing costs like proprietary consumables when pricing products",
        "Test assumptions - validate that your technology actually provides the claimed benefits before scaling"
      ]
    },
    date: "2017-09-01",
    foundingYear: 2013,
    failureYear: 2017,
    fundingRaised: "$120M",
    keyFounders: ["Doug Evans"],
    industryTags: ["Hardware", "IoT", "Food Tech"],
    reasonForFailure: "Product Issues",
    sourceUrl: "https://www.bloomberg.com/news/articles/2017-04-19/silicon-valley-s-400-juicer-may-be-feeling-the-squeeze"
  },
  {
    id: 5,
    title: "Beepi: The $150 Million Used Car Marketplace That Crashed",
    category: "E-commerce",
    excerpt: "Beepi promised to revolutionize used car sales but burned through $150 million in funding before shutting down due to unsustainable unit economics.",
    locationStartup: "San Francisco, USA",
    detailedDescription: "Beepi, founded in 2014 by Ale Resnik and Owen Savir, aimed to disrupt the used car market by creating an online platform that handled the entire car buying and selling process. The company raised $150 million in funding and promised to eliminate the hassle of traditional car dealerships. However, Beepi's business model was fundamentally flawed. The company purchased cars from sellers, refurbished them, and then sold them to buyers, but the unit economics never worked. Each car required significant investment in inspection, refurbishment, and marketing, with slim profit margins that couldn't cover operational costs. The company also faced challenges with inventory management, as cars depreciate quickly and holding costs are high. Despite high marketing spend and aggressive expansion, Beepi couldn't achieve the scale needed to make the business profitable. The company burned through its funding rapidly and was unable to secure additional capital. In 2017, just three years after launch, Beepi shut down operations and sold its remaining assets to Fair.com. The failure highlighted the challenges of disrupting traditional industries with high capital requirements and complex logistics.",
    keyLessons: {
      analysis: "Beepi's failure illustrates the importance of understanding unit economics and the challenges of disrupting capital-intensive industries. The company's business model required significant upfront investment per transaction, making profitability difficult to achieve at scale. Their rapid expansion without proven unit economics led to unsustainable cash burn.",
      lessons: [
        "Unit economics matter - ensure each transaction is profitable before scaling",
        "Understand industry dynamics - capital-intensive businesses require careful financial planning",
        "Test before scaling - validate business model with small operations before aggressive expansion",
        "Manage inventory carefully - high-value, depreciating assets require sophisticated management",
        "Capital efficiency - ensure funding is used to build sustainable operations, not just growth"
      ]
    },
    date: "2017-02-15",
    foundingYear: 2014,
    failureYear: 2017,
    fundingRaised: "$150M",
    keyFounders: ["Ale Resnik", "Owen Savir"],
    industryTags: ["E-commerce", "Automotive", "Marketplace"],
    reasonForFailure: "Business Model",
    sourceUrl: "https://techcrunch.com/2017/02/15/beepi-shuts-down/"
  },
  {
    id: 6,
    title: "Homejoy: The $40 Million Home Cleaning Service That Couldn't Scale",
    category: "On-Demand Services",
    excerpt: "Homejoy raised $40 million for its home cleaning platform but failed to achieve sustainable unit economics and customer retention.",
    locationStartup: "San Francisco, USA",
    detailedDescription: "Homejoy, founded in 2012 by Adora Cheung and Aaron Cheung, aimed to revolutionize home cleaning by connecting customers with vetted cleaners through an online platform. The company raised $40 million in funding and expanded to 31 cities across the US and Canada. However, Homejoy faced fundamental challenges with its business model. The company struggled with high customer acquisition costs and poor customer retention rates. Many customers tried the service once but didn't return, making the business model unsustainable. Homejoy also faced challenges with cleaner quality and consistency, as the gig economy model made it difficult to maintain service standards. The company's rapid expansion without solving core retention issues led to unsustainable cash burn. Despite attempts to pivot and improve retention, Homejoy couldn't achieve the scale needed for profitability. In 2015, just three years after launch, the company shut down operations. The failure highlighted the challenges of building sustainable on-demand service businesses without strong customer retention.",
    keyLessons: {
      analysis: "Homejoy's failure demonstrates the importance of customer retention in on-demand service businesses. The company focused on rapid expansion and customer acquisition without solving fundamental retention challenges. Their business model relied on repeat customers, but poor service quality and inconsistent experiences prevented sustainable growth.",
      lessons: [
        "Customer retention is crucial - focus on keeping customers before acquiring new ones",
        "Quality over quantity - expand only after solving core service quality issues",
        "Unit economics matter - ensure each customer relationship is profitable",
        "Test retention strategies - validate that customers will return before scaling",
        "Service consistency - maintain quality standards as you scale operations"
      ]
    },
    date: "2015-07-17",
    foundingYear: 2012,
    failureYear: 2015,
    fundingRaised: "$40M",
    keyFounders: ["Adora Cheung", "Aaron Cheung"],
    industryTags: ["On-Demand", "Home Services", "Gig Economy"],
    reasonForFailure: "Customer Retention",
    sourceUrl: "https://techcrunch.com/2015/07/17/homejoy-shuts-down/"
  },
  {
    id: 7,
    title: "Secret: The Anonymous Social App That Self-Destructed",
    category: "Social Media",
    excerpt: "Secret raised $35 million for anonymous social sharing but shut down due to cyberbullying and lack of sustainable engagement.",
    locationStartup: "San Francisco, USA",
    detailedDescription: "Secret, founded in 2013 by David Byttow and Chrys Bader, was an anonymous social media app that allowed users to share secrets and thoughts without revealing their identity. The app gained rapid popularity, reaching 15 million users and raising $35 million in funding. However, the anonymous nature of the platform led to serious problems. The app became a breeding ground for cyberbullying, harassment, and harmful content. Without accountability, users posted increasingly toxic and damaging content, making the platform unsafe for many users. Secret struggled to implement effective content moderation while maintaining user anonymity, creating a fundamental conflict in their product design. The company also faced challenges with user engagement, as the novelty of anonymous sharing wore off and users moved to other platforms. Despite attempts to improve moderation and add safety features, Secret couldn't overcome the inherent challenges of anonymous social media. In 2015, just two years after launch, the company shut down operations. The failure highlighted the risks of building platforms that prioritize user privacy over safety and the challenges of moderating anonymous content.",
    keyLessons: {
      analysis: "Secret's failure illustrates the dangers of prioritizing user privacy over platform safety and the challenges of building sustainable anonymous social platforms. The company's core value proposition of anonymous sharing created fundamental moderation challenges that couldn't be solved without compromising the product's core appeal.",
      lessons: [
        "Safety over privacy - ensure platform safety even when it conflicts with core features",
        "Content moderation matters - plan for content moderation from day one",
        "Anonymous platforms are risky - understand the challenges before building them",
        "User engagement sustainability - ensure your product can maintain engagement beyond novelty",
        "Responsible product design - consider the societal impact of your platform features"
      ]
    },
    date: "2015-04-29",
    foundingYear: 2013,
    failureYear: 2015,
    fundingRaised: "$35M",
    keyFounders: ["David Byttow", "Chrys Bader"],
    industryTags: ["Social Media", "Privacy", "Anonymous"],
    reasonForFailure: "Content Moderation",
    sourceUrl: "https://techcrunch.com/2015/04/29/secret-shuts-down/"
  },
  {
    id: 8,
    title: "Sprig: The $57 Million Food Delivery Service That Couldn't Cook",
    category: "Food Tech",
    excerpt: "Sprig raised $57 million for healthy meal delivery but failed due to high operational costs and complex logistics.",
    locationStartup: "San Francisco, USA",
    detailedDescription: "Sprig, founded in 2013 by Gagan Biyani, was a healthy meal delivery service that prepared and delivered fresh, nutritious meals to customers' doors. The company raised $57 million in funding and positioned itself as a healthier alternative to traditional food delivery. However, Sprig's business model faced significant operational challenges. The company operated its own kitchens and employed full-time chefs, leading to high fixed costs that couldn't be easily scaled down during slow periods. The logistics of preparing, packaging, and delivering fresh meals within tight time windows proved extremely complex and expensive. Sprig also struggled with food waste, as predicting demand accurately was difficult, leading to either overproduction or stockouts. Despite high customer satisfaction with food quality, the company couldn't achieve sustainable unit economics. The high operational costs combined with the challenges of scaling a food service business led to unsustainable cash burn. In 2017, just four years after launch, Sprig shut down operations. The failure highlighted the challenges of building sustainable food delivery businesses with high operational complexity.",
    keyLessons: {
      analysis: "Sprig's failure demonstrates the challenges of building sustainable food delivery businesses with high operational complexity. The company's model of operating its own kitchens and employing full-time staff created high fixed costs that couldn't be easily adjusted. Their focus on food quality came at the expense of operational efficiency.",
      lessons: [
        "Operational efficiency matters - complex logistics can kill even high-quality products",
        "Fixed costs are dangerous - ensure your business model can handle cost fluctuations",
        "Food waste management - plan for the challenges of perishable inventory",
        "Scale logistics carefully - ensure operations can handle growth before expanding",
        "Quality vs. efficiency - find the right balance between product quality and operational costs"
      ]
    },
    date: "2017-05-26",
    foundingYear: 2013,
    failureYear: 2017,
    fundingRaised: "$57M",
    keyFounders: ["Gagan Biyani"],
    industryTags: ["Food Tech", "Delivery", "Healthy Food"],
    reasonForFailure: "Operational Costs",
    sourceUrl: "https://techcrunch.com/2017/05/26/sprig-shuts-down/"
  },
  {
    id: 9,
    title: "Wattpad: The $117 Million Story Platform That Lost Its Way",
    category: "Content Platform",
    excerpt: "Wattpad raised $117 million for user-generated stories but struggled with monetization and eventually sold to Naver for $600 million.",
    locationStartup: "Toronto, Canada",
    detailedDescription: "Wattpad, founded in 2006 by Allen Lau and Ivan Yuen, was a platform for user-generated stories that allowed writers to share their work and readers to discover new content. The company raised $117 million in funding and built a community of over 90 million users worldwide. However, Wattpad struggled to monetize its massive user base effectively. The company experimented with various revenue models including advertising, premium subscriptions, and content licensing, but none provided sustainable profitability. The platform's focus on user-generated content made it difficult to implement traditional publishing monetization strategies. Wattpad also faced challenges with content quality and moderation, as the open nature of the platform led to inconsistent content standards. Despite having a large and engaged user base, the company couldn't achieve sustainable profitability on its own. In 2021, after 15 years of operation, Wattpad was acquired by South Korean internet company Naver for $600 million. While not a complete failure, the acquisition highlighted the company's inability to achieve independent success and the challenges of monetizing user-generated content platforms.",
    keyLessons: {
      analysis: "Wattpad's story illustrates the challenges of monetizing user-generated content platforms and the importance of having a clear path to profitability. The company built a large and engaged community but struggled to convert that engagement into sustainable revenue. Their acquisition by Naver represented a strategic exit rather than independent success.",
      lessons: [
        "Monetization strategy matters - build revenue models from day one",
        "User engagement isn't enough - ensure your platform can generate sustainable revenue",
        "Content quality control - balance openness with quality standards",
        "Multiple revenue streams - don't rely on a single monetization method",
        "Strategic partnerships - consider acquisition as a viable exit strategy"
      ]
    },
    date: "2021-01-19",
    foundingYear: 2006,
    failureYear: 2021,
    fundingRaised: "$117M",
    keyFounders: ["Allen Lau", "Ivan Yuen"],
    industryTags: ["Content Platform", "User-Generated", "Stories"],
    reasonForFailure: "Monetization",
    sourceUrl: "https://techcrunch.com/2021/01/19/naver-acquires-wattpad-for-600m/"
  },
  {
    id: 10,
    title: "Fab.com: The $336 Million Flash Sale Site That Burned Out",
    category: "E-commerce",
    excerpt: "Fab.com raised $336 million for flash sales but failed due to unsustainable growth and poor unit economics.",
    locationStartup: "New York, USA",
    detailedDescription: "Fab.com, founded in 2010 by Jason Goldberg and Bradford Shellhammer, was a flash sale site that offered limited-time deals on designer goods and home decor. The company raised $336 million in funding and achieved rapid growth, reaching 14 million users at its peak. However, Fab.com's business model was fundamentally flawed. The company focused on aggressive growth and customer acquisition without ensuring sustainable unit economics. Each sale required significant marketing spend and inventory costs, but the flash sale model made it difficult to predict demand and manage inventory efficiently. Fab.com also faced challenges with customer retention, as the novelty of flash sales wore off and users became less engaged. The company's rapid expansion into multiple product categories and international markets further complicated operations and increased costs. Despite high revenue growth, Fab.com couldn't achieve profitability and burned through its funding rapidly. The company attempted multiple pivots including becoming a marketplace and focusing on private label products, but none could save the business. In 2015, after five years of operation, Fab.com was sold to PCH International for an undisclosed amount, representing a significant loss for investors. The failure highlighted the dangers of prioritizing growth over profitability in e-commerce.",
    keyLessons: {
      analysis: "Fab.com's failure demonstrates the dangers of prioritizing growth over profitability and the challenges of building sustainable flash sale businesses. The company's aggressive expansion and focus on customer acquisition came at the expense of unit economics and operational efficiency. Their rapid growth masked fundamental business model flaws that eventually led to collapse.",
      lessons: [
        "Profitability over growth - ensure sustainable unit economics before scaling",
        "Flash sales are risky - understand the operational challenges before building the business",
        "Inventory management matters - plan for the complexities of limited-time sales",
        "Customer retention - focus on keeping customers engaged beyond novelty",
        "Sustainable scaling - ensure operations can handle growth before expanding aggressively"
      ]
    },
    date: "2015-11-20",
    foundingYear: 2010,
    failureYear: 2015,
    fundingRaised: "$336M",
    keyFounders: ["Jason Goldberg", "Bradford Shellhammer"],
    industryTags: ["E-commerce", "Flash Sales", "Design"],
    reasonForFailure: "Business Model",
    sourceUrl: "https://techcrunch.com/2015/11/20/fab-com-acquired-by-pch-international/"
  }
];

class GeminiAPIService {
  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.apiUrl = GEMINI_API_URL;
    this.storyCounter = 1000; // Start with high ID to avoid conflicts
  }

  // Generate unique IDs for new stories
  generateUniqueId() {
    return this.storyCounter++;
  }

  // Shuffle array to show different stories each time
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Simplified JSON parsing with better error handling
  parseJSONResponse(jsonString) {
    console.log('=== GEMINI JSON PARSING DEBUG ===');
    console.log('Input length:', jsonString.length);
    console.log('First 100 chars:', jsonString.substring(0, 100));
    
    // Clean the JSON string
    let cleaned = jsonString.trim();
    
    // Find JSON array boundaries
    const jsonStart = cleaned.indexOf('[');
    const jsonEnd = cleaned.lastIndexOf(']');
    
    if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
      console.warn('No valid JSON array found in Gemini response');
      throw new Error('No valid JSON array found in Gemini response');
    }
    
    // Extract only the JSON portion
    const jsonOnly = cleaned.substring(jsonStart, jsonEnd + 1);
    console.log('Extracted JSON length:', jsonOnly.length);
    
    try {
      const parsed = JSON.parse(jsonOnly);
      console.log('Successfully parsed Gemini JSON with', parsed.length, 'stories');
      
      // Ensure each story has a unique ID
      const storiesWithUniqueIds = parsed.map(story => ({
        ...story,
        id: this.generateUniqueId()
      }));
      
      return storiesWithUniqueIds;
    } catch (parseError) {
      console.error('Gemini JSON parse error:', parseError.message);
      console.log('Failed JSON sample:', jsonOnly.substring(0, 200));
      
      // If parsing fails, use fallback data
      console.log('Using fallback data due to Gemini JSON parse error');
      throw new Error('Gemini JSON parsing failed - using fallback data');
    }
  }

  async fetchStories(count = 10) {
    try {
      if (!this.apiKey) {
        console.warn('❌ Gemini API key not found. Using fallback data.');
        // Shuffle fallback stories to show different ones each time
        const shuffledFallback = this.shuffleArray([...FALLBACK_STORIES]);
        const fallbackWithImages = await pexelAPI.getImagesForStories(shuffledFallback);
        return fallbackWithImages;
      }

      console.log('🚀 Making API call to Gemini for dynamic startup failure research...');
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: generateGeminiPrompt()
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 12000,
            topP: 0.9,
            topK: 40
          }
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('❌ HTTP error! status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Gemini API response received successfully');
      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        console.error('❌ No content received from Gemini API');
        throw new Error('No content received from Gemini API');
      }

      console.log('📝 Raw content from Gemini received, length:', content.length);

      // Clean the content for JSON parsing
      let cleanContent = content.trim();
      console.log('Raw content sample:', cleanContent.substring(0, 200));
      
      console.log('Cleaned content ready for parsing:', cleanContent.substring(0, 200) + '...');

      // Parse the JSON response using simplified parsing
      let stories;
      try {
        console.log('🔍 Attempting to parse Gemini JSON response...');
        stories = this.parseJSONResponse(cleanContent);
        console.log('✅ Successfully parsed Gemini JSON with', stories.length, 'stories');
      } catch (parseError) {
        console.error('❌ Gemini JSON parsing failed:', parseError.message);
        console.log('Failed content sample:', cleanContent.substring(0, 300));
        console.log('🛠️ Falling back to hardcoded stories...');
        throw new Error(`Unable to parse JSON response from Gemini API. Error: ${parseError.message}`);
      }
      
      // Validate the response structure
      if (!Array.isArray(stories)) {
        throw new Error('Invalid response format from Gemini API');
      }

      // Fetch images from Pexels for each story
      console.log('🖼️ Fetching images from Pexels for', stories.length, 'stories...');
      const storiesWithImages = await pexelAPI.getImagesForStories(stories);
      
      console.log('✅ SUCCESS: Returning', storiesWithImages.length, 'fresh stories from Gemini API');
      return storiesWithImages;

    } catch (error) {
      console.error('❌ Error fetching stories from Gemini:', error.message);
      console.log('🛠️ Error details:', error);
      
      // Return fallback data if API fails
      console.log('📚 Using fallback stories due to Gemini API error');
      // Shuffle fallback stories to show different ones each time
      const shuffledFallback = this.shuffleArray([...FALLBACK_STORIES]);
      const fallbackWithImages = await pexelAPI.getImagesForStories(shuffledFallback);
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

export default new GeminiAPIService(); 
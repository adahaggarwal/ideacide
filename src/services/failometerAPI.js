// Failometer API service for startup idea validation
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

// Question categories and their weights for risk scoring
const QUESTION_CATEGORIES = {
  MARKET_VALIDATION: { weight: 0.25, name: 'Market Validation' },
  BUSINESS_MODEL: { weight: 0.20, name: 'Business Model' },
  COMPETITION: { weight: 0.15, name: 'Competition Analysis' },
  EXECUTION: { weight: 0.15, name: 'Execution Capability' },
  FINANCIAL: { weight: 0.15, name: 'Financial Planning' },
  TEAM: { weight: 0.10, name: 'Team & Leadership' }
};

// Base questions for startup validation
const BASE_QUESTIONS = [
  {
    id: 'startup_idea',
    category: 'MARKET_VALIDATION',
    question: 'What is your startup idea in one sentence?',
    type: 'text',
    required: true,
    placeholder: 'e.g., A mobile app that helps people find parking spots in real-time'
  },
  {
    id: 'target_market',
    category: 'MARKET_VALIDATION',
    question: 'Who is your target market?',
    type: 'text',
    required: true,
    placeholder: 'e.g., Urban drivers aged 25-45 who commute daily'
  },
  {
    id: 'problem_validation',
    category: 'MARKET_VALIDATION',
    question: 'How do you know this problem exists?',
    type: 'multiple_choice',
    required: true,
    options: [
      { value: 'personal_experience', text: 'Personal experience', risk: 0.3 },
      { value: 'market_research', text: 'Conducted market research', risk: 0.1 },
      { value: 'customer_interviews', text: 'Interviewed potential customers', risk: 0.05 },
      { value: 'assumption', text: 'It seems like a common problem', risk: 0.8 }
    ]
  },
  {
    id: 'revenue_model',
    category: 'BUSINESS_MODEL',
    question: 'How will you make money?',
    type: 'multiple_choice',
    required: true,
    options: [
      { value: 'subscription', text: 'Subscription fees', risk: 0.2 },
      { value: 'transaction', text: 'Transaction fees', risk: 0.3 },
      { value: 'advertising', text: 'Advertising revenue', risk: 0.5 },
      { value: 'freemium', text: 'Freemium model', risk: 0.4 },
      { value: 'unsure', text: 'Not sure yet', risk: 0.9 }
    ]
  },
  {
    id: 'mvp_status',
    category: 'EXECUTION',
    question: 'What is your current development stage?',
    type: 'multiple_choice',
    required: true,
    options: [
      { value: 'launched', text: 'Already launched with customers', risk: 0.1 },
      { value: 'mvp_ready', text: 'MVP ready for testing', risk: 0.2 },
      { value: 'development', text: 'In development', risk: 0.4 },
      { value: 'planning', text: 'Still planning', risk: 0.7 },
      { value: 'idea_only', text: 'Just an idea', risk: 0.9 }
    ]
  }
];

class FailometerAPIService {
  constructor() {
    this.apiKey = GROQ_API_KEY;
    this.apiUrl = GROQ_API_URL;
  }

  // Generate dynamic follow-up questions based on previous answers
  async generateFollowUpQuestions(answers, questionHistory = []) {
    if (!this.apiKey) {
      console.warn('Groq API key not found. Using fallback questions.');
      return this.getFallbackQuestions(answers);
    }

    const prompt = this.buildFollowUpPrompt(answers, questionHistory);
    
    try {
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
              content: prompt
            }
          ],
          model: 'llama-3.1-8b-instant',
          temperature: 0.3,
          max_tokens: 2000,
          top_p: 0.9,
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

      return this.parseQuestionResponse(content);
    } catch (error) {
      console.error('Error generating follow-up questions:', error);
      return this.getFallbackQuestions(answers);
    }
  }

  // Build prompt for generating follow-up questions
  buildFollowUpPrompt(answers, questionHistory) {
    const answersText = Object.entries(answers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    return `You are a startup advisor helping validate a business idea. Based on the following answers, generate 2-3 critical follow-up questions that will help assess the startup's risk of failure.

Previous answers:
${answersText}

Generate questions that:
1. Challenge assumptions in their answers
2. Probe for evidence and validation
3. Identify potential blind spots or risks
4. Are specific to their business model and market

Return ONLY valid JSON in this format:
[
  {
    "id": "unique_question_id",
    "category": "MARKET_VALIDATION|BUSINESS_MODEL|COMPETITION|EXECUTION|FINANCIAL|TEAM",
    "question": "Your challenging question here?",
    "type": "text|multiple_choice|scale",
    "required": true,
    "options": [
      {"value": "option1", "text": "Option text", "risk": 0.1}
    ],
    "followUpLogic": "Why this question matters based on their previous answers"
  }
]

Focus on the biggest risks based on their answers. Be direct and challenging.`;
  }

  // Parse AI response for questions
  parseQuestionResponse(content) {
    try {
      // Clean the content
      let cleanContent = content.trim();
      
      // Remove any markdown or explanatory text
      const jsonStart = cleanContent.indexOf('[');
      const jsonEnd = cleanContent.lastIndexOf(']');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);
      }
      
      const questions = JSON.parse(cleanContent);
      
      // Validate and add IDs if missing
      return questions.map((q, index) => ({
        ...q,
        id: q.id || `follow_up_${Date.now()}_${index}`,
        required: q.required !== false
      }));
    } catch (error) {
      console.error('Error parsing question response:', error);
      return [];
    }
  }

  // Generate final risk assessment
  async generateRiskAssessment(allAnswers) {
    const prompt = this.buildRiskAssessmentPrompt(allAnswers);
    
    try {
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
              content: prompt
            }
          ],
          model: 'llama-3.1-8b-instant',
          temperature: 0.2,
          max_tokens: 3000,
          top_p: 0.8,
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

      return this.parseRiskAssessment(content);
    } catch (error) {
      console.error('Error generating risk assessment:', error);
      return this.getFallbackRiskAssessment(allAnswers);
    }
  }

  // Build risk assessment prompt
  buildRiskAssessmentPrompt(allAnswers) {
    const answersText = Object.entries(allAnswers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    return `You are a startup advisor providing a comprehensive risk assessment. Based on all the answers provided, analyze the startup's chances of failure and provide actionable recommendations.

All answers:
${answersText}

Analyze the startup across these dimensions:
1. Market Validation (25% weight)
2. Business Model (20% weight)
3. Competition Analysis (15% weight)
4. Execution Capability (15% weight)
5. Financial Planning (15% weight)
6. Team & Leadership (10% weight)

Return ONLY valid JSON in this format:
{
  "overallRiskScore": 0.65,
  "riskLevel": "High|Medium|Low",
  "categoryScores": {
    "marketValidation": 0.7,
    "businessModel": 0.5,
    "competition": 0.8,
    "execution": 0.6,
    "financial": 0.7,
    "team": 0.4
  },
  "keyRisks": [
    "Specific risk identified from answers",
    "Another major risk factor",
    "Third critical risk"
  ],
  "recommendations": [
    "Specific actionable recommendation",
    "Another concrete step to take",
    "Third recommendation for improvement"
  ],
  "strengthAreas": [
    "What they're doing well",
    "Another strength identified"
  ],
  "criticalNextSteps": [
    "Most important immediate action",
    "Second priority action",
    "Third priority action"
  ],
  "similarFailurePatterns": [
    "Company that failed for similar reasons",
    "Another relevant failure case"
  ]
}

Be honest and direct. Risk score should be between 0 (no risk) and 1 (certain failure).`;
  }

  // Parse risk assessment response
  parseRiskAssessment(content) {
    try {
      let cleanContent = content.trim();
      
      // Extract JSON
      const jsonStart = cleanContent.indexOf('{');
      const jsonEnd = cleanContent.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);
      }
      
      const assessment = JSON.parse(cleanContent);
      
      // Validate and set defaults
      return {
        overallRiskScore: Math.min(1, Math.max(0, assessment.overallRiskScore || 0.5)),
        riskLevel: assessment.riskLevel || 'Medium',
        categoryScores: assessment.categoryScores || {},
        keyRisks: assessment.keyRisks || [],
        recommendations: assessment.recommendations || [],
        strengthAreas: assessment.strengthAreas || [],
        criticalNextSteps: assessment.criticalNextSteps || [],
        similarFailurePatterns: assessment.similarFailurePatterns || []
      };
    } catch (error) {
      console.error('Error parsing risk assessment:', error);
      return this.getFallbackRiskAssessment();
    }
  }

  // Get base questions for starting the assessment
  getBaseQuestions() {
    return BASE_QUESTIONS;
  }

  // Calculate basic risk score from answers
  calculateBasicRiskScore(answers) {
    let totalRisk = 0;
    let totalWeight = 0;

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = BASE_QUESTIONS.find(q => q.id === questionId);
      if (question && question.options) {
        const selectedOption = question.options.find(opt => opt.value === answer);
        if (selectedOption) {
          const categoryWeight = QUESTION_CATEGORIES[question.category]?.weight || 0.1;
          totalRisk += selectedOption.risk * categoryWeight;
          totalWeight += categoryWeight;
        }
      }
    });

    return totalWeight > 0 ? totalRisk / totalWeight : 0.5;
  }

  // Fallback questions when API fails
  getFallbackQuestions(answers) {
    const fallbackQuestions = [
      {
        id: 'customer_validation',
        category: 'MARKET_VALIDATION',
        question: 'Have you spoken to at least 10 potential customers about this problem?',
        type: 'multiple_choice',
        required: true,
        options: [
          { value: 'yes_validated', text: 'Yes, and they confirmed it\'s a real problem', risk: 0.1 },
          { value: 'yes_mixed', text: 'Yes, but got mixed feedback', risk: 0.4 },
          { value: 'few_people', text: 'Only a few people', risk: 0.7 },
          { value: 'no', text: 'No, not yet', risk: 0.9 }
        ]
      },
      {
        id: 'competitive_advantage',
        category: 'COMPETITION',
        question: 'What makes your solution different from existing alternatives?',
        type: 'text',
        required: true,
        placeholder: 'Explain your unique value proposition'
      }
    ];

    return fallbackQuestions;
  }

  // Fallback risk assessment
  getFallbackRiskAssessment(answers = {}) {
    const basicScore = this.calculateBasicRiskScore(answers);
    
    return {
      overallRiskScore: basicScore,
      riskLevel: basicScore > 0.7 ? 'High' : basicScore > 0.4 ? 'Medium' : 'Low',
      categoryScores: {
        marketValidation: basicScore,
        businessModel: basicScore,
        competition: basicScore,
        execution: basicScore,
        financial: basicScore,
        team: basicScore
      },
      keyRisks: [
        'Limited market validation',
        'Unclear business model',
        'Strong competition risk'
      ],
      recommendations: [
        'Conduct more customer interviews',
        'Validate your business model',
        'Research your competition thoroughly'
      ],
      strengthAreas: [
        'Clear problem identification',
        'Willingness to validate idea'
      ],
      criticalNextSteps: [
        'Talk to 20 potential customers',
        'Build a simple MVP',
        'Research competitors deeply'
      ],
      similarFailurePatterns: [
        'Many startups fail due to lack of market validation',
        'Unclear business models lead to startup failure'
      ]
    };
  }
}

export default new FailometerAPIService();

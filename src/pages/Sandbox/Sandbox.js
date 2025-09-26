import React, { useState } from 'react';
import { Header, Footer } from '../../components';
import './Sandbox.css';
import { GoogleGenAI } from "@google/genai";

/**
 * Generates fallback insights when AI API fails or returns insufficient results
 * Uses the same scoring logic as the main simulation for consistency
 */
const generateFallbackInsights = (idea, scores) => {
  const fallbackInsights = [];
  const { viabilityScore, marketScore, riskScore, timeToMarket, breakEvenPoint, revenueRatio } = scores;

  console.log("Generating fallback insights with scores:", scores);

  // Always add a viability-based insight
  if (viabilityScore >= 80) {
    fallbackInsights.push("Strong overall viability detected - consider accelerating development and securing additional funding to capitalize on this opportunity");
  } else if (viabilityScore >= 60) {
    fallbackInsights.push("Solid foundation with improvement potential - focus on strengthening the weakest components of your business model");
  } else {
    fallbackInsights.push("Significant viability challenges identified - consider pivoting key aspects of your business model before major investment");
  }

  // Always evaluate market insights (separate from viability)
  if (marketScore >= 75) {
    fallbackInsights.push("Excellent market opportunity identified - prioritize customer acquisition and early market penetration strategies");
  } else if (marketScore < 50) {
    fallbackInsights.push("Market potential concerns detected - conduct deeper market research and customer validation before proceeding");
  } else {
    fallbackInsights.push("Moderate market potential - focus on clear value proposition and targeted customer segments");
  }

  // Always evaluate risk insights
  if (riskScore >= 70) {
    fallbackInsights.push("High risk profile requires comprehensive mitigation strategies and contingency planning across all business areas");
  } else if (riskScore <= 30) {
    fallbackInsights.push("Low risk assessment provides good foundation for steady, sustainable growth approach");
  } else {
    fallbackInsights.push("Moderate risk level - develop contingency plans for key business challenges");
  }

  // Financial insights based on ratios and projections
  if (revenueRatio && revenueRatio > 2) {
    fallbackInsights.push("Excellent revenue-to-cost ratio provides strong foundation - focus on efficient scaling and operational optimization");
  } else if (revenueRatio && revenueRatio < 1.1) {
    fallbackInsights.push("Tight profit margins require immediate focus on cost reduction or revenue optimization strategies");
  } else if (revenueRatio) {
    fallbackInsights.push("Balanced revenue-to-cost ratio - monitor margins closely as you scale operations");
  }

  // Timeline-based insights
  if (timeToMarket <= 6) {
    fallbackInsights.push("Aggressive timeline requires adequate resource allocation - consider MVP approach to validate core assumptions quickly");
  } else if (timeToMarket > 15) {
    fallbackInsights.push("Extended timeline needs milestone-based approach with regular assumption validation to maintain market relevance");
  }

  // Break-even insights
  if (breakEvenPoint > 24) {
    fallbackInsights.push("Extended path to profitability requires focus on accelerating revenue generation or reducing initial operational costs");
  } else if (breakEvenPoint < 12) {
    fallbackInsights.push("Quick path to profitability provides excellent foundation for sustainable growth and reinvestment");
  }

  console.log("Generated fallback insights:", fallbackInsights);

  // Ensure we have at least 3 insights, add generic ones if needed
  if (fallbackInsights.length < 3) {
    fallbackInsights.push("Consider building an MVP to validate core assumptions with real users before full development");
    fallbackInsights.push("Focus on building strong customer relationships and gathering feedback early in the process");
  }

  // Return 3-5 insights maximum
  return fallbackInsights.slice(0, 5);
};

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY_SANDBOX });

/**
 * Generates AI-powered business insights using Google Gemini
 * @param {Object} idea - Business idea object with all form fields
 * @param {Object} scores - Calculated scores and metrics from simulation
 * @returns {Promise<Array>} - Array of actionable insights
 */
export const generateAIInsights = async (idea, scores) => {
  try {
    // Validate required environment variables
    const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY_SANDBOX;
    console.log("Gemini API key:", geminiApiKey ? "FOUND" : "MISSING");
    
    if (!geminiApiKey) {
      console.warn('Gemini API key not found. Using fallback insights.');
      console.warn('To enable AI insights:');
      console.warn('1. Create a .env file in your project root');
      console.warn('2. Add: REACT_APP_GEMINI_API_KEY_SANDBOX=your_api_key_here');
      console.warn('3. Get your API key from: https://aistudio.google.com/app/apikey');
      console.warn('4. Restart your development server');
      return generateFallbackInsights(idea, scores);
    }

    // Construct comprehensive prompt that uses both idea fields and calculated scores
    const prompt = `
You are a seasoned business advisor analyzing a startup idea. Provide 3-5 clear, actionable insights based on the following business idea and calculated metrics.

BUSINESS IDEA:
- Title: ${idea.title || "Not specified"}
- Description: ${idea.description || "Not specified"}
- Target Market: ${idea.targetMarket || "Not specified"}
- Business Model: ${idea.businessModel || "Not specified"}
- Expected Revenue: ${idea.revenue || "Not specified"}
- Estimated Costs: ${idea.costs || "Not specified"}
- Timeline: ${idea.timeline || "Not specified"}
- Resources Needed: ${idea.resources || "Not specified"}
- Potential Risks: ${idea.risks || "Not specified"}
- Success Metrics: ${idea.successMetrics || "Not specified"}

CALCULATED SCORES:
- Viability Score: ${scores.viabilityScore}%
- Market Score: ${scores.marketScore}%
- Risk Score: ${scores.riskScore}%
- Time to Market: ${scores.timeToMarket} months
- Estimated Year 1 Revenue: $${scores.estimatedRevenue?.toLocaleString() || "0"}
- Break-even Point: ${scores.breakEvenPoint} months
- Revenue-to-Cost Ratio: ${scores.revenueRatio?.toFixed(2) || "N/A"}

Provide exactly 3-5 bullet points starting with "•". Each should be concise, actionable, and reference the scores and business details.
`;

    console.log("Calling Gemini API with prompt:", prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      max_output_tokens: 400,
      temperature: 0.7,
    });

    const aiText = response.text || "";
    console.log("Gemini Raw Response:", aiText);

    // Parse bullets
    let insightLines = aiText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("•") || line.startsWith("-") || line.startsWith("*"))
      .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
      .filter((line) => line.length > 10);

    // Fallback parsing
    if (insightLines.length === 0) {
      console.log("No bullet points found, parsing as sentences");
      insightLines = aiText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 20)
        .slice(0, 5);
    }

    console.log("Parsed insights:", insightLines);

    // Ensure 3-5 insights
    if (insightLines.length < 3) {
      console.log("Adding fallback insights");
      const fallbackInsights = generateFallbackInsights(idea, scores);
      insightLines.push(...fallbackInsights.slice(0, 5 - insightLines.length));
    }

    // Limit to maximum 5 insights and ensure minimum quality
    const finalInsights = insightLines
      .slice(0, 5)
      .filter(insight => insight.length > 15) // Remove very short insights
      .map(insight => {
        // Clean up formatting: remove markdown bold markers and extra formatting
        let cleaned = insight
          .replace(/\*\*/g, '') // Remove ** bold markers
          .replace(/\*/g, '') // Remove single * markers
          .replace(/\n/g, ' ') // Replace newlines with spaces
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim();
        
        // Capitalize first letter
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      });

    return finalInsights.length > 0 ? finalInsights : generateFallbackInsights(idea, scores);

  } catch (error) {
    console.error('Error generating AI insights:', error);
    
    // Return fallback insights if API fails
    return generateFallbackInsights(idea, scores);
  }
};

const Sandbox = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [idea, setIdea] = useState({
    title: '',
    description: '',
    targetMarket: '',
    businessModel: '',
    revenue: '',
    costs: '',
    timeline: '',
    resources: '',
    risks: '',
    successMetrics: ''
  });

  const [simulations, setSimulations] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleInputChange = (field, value) => {
    setIdea(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to extract numeric value from text input
  const extractNumericValue = (text) => {
    if (!text) return 0;
    const match = text.toString().replace(/[$,]/g, '').match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // Helper function to extract timeline in months
  const extractTimelineMonths = (timeline) => {
    if (!timeline) return 12; // Default 12 months
    const text = timeline.toLowerCase();
    const match = text.match(/(\d+)/);
    const number = match ? parseInt(match[0]) : 12;
    
    if (text.includes('week')) return Math.max(1, Math.round(number / 4));
    if (text.includes('year')) return number * 12;
    return number; // Assume months by default
  };

  // Helper function to calculate field completeness score (0-100)
  const calculateCompletenessScore = (idea) => {
    const fields = ['title', 'description', 'targetMarket', 'businessModel', 'revenue', 'costs', 'timeline', 'resources', 'risks', 'successMetrics'];
    const filledFields = fields.filter(field => idea[field] && idea[field].trim().length > 0);
    return Math.round((filledFields.length / fields.length) * 100);
  };

  // Helper function to assess business model strength
  const assessBusinessModel = (businessModel, revenue, costs) => {
    if (!businessModel) return 30;
    
    const model = businessModel.toLowerCase();
    let score = 50;
    
    // Proven business models get higher scores
    if (model.includes('subscription') || model.includes('saas')) score += 25;
    else if (model.includes('marketplace') || model.includes('platform')) score += 20;
    else if (model.includes('freemium')) score += 15;
    else if (model.includes('advertising') || model.includes('ads')) score += 10;
    else if (model.includes('one-time') || model.includes('product sale')) score += 5;
    
    // Factor in revenue/cost ratio if available
    const revenueNum = extractNumericValue(revenue);
    const costsNum = extractNumericValue(costs);
    
    if (revenueNum > 0 && costsNum > 0) {
      const ratio = revenueNum / costsNum;
      if (ratio > 2) score += 15;
      else if (ratio > 1.5) score += 10;
      else if (ratio > 1.1) score += 5;
      else if (ratio < 0.8) score -= 15;
    }
    
    return Math.min(100, score);
  };

  // Helper function to assess market potential
  const assessMarketPotential = (targetMarket, description, businessModel) => {
    let score = 50;
    
    if (!targetMarket) return 40;
    
    const market = targetMarket.toLowerCase();
    const desc = description.toLowerCase();
    
    // Market size indicators
    if (market.includes('enterprise') || market.includes('b2b')) score += 15;
    if (market.includes('global') || market.includes('worldwide')) score += 10;
    if (market.includes('niche') && !market.includes('large')) score -= 10;
    
    // Age demographics (some are more lucrative)
    if (market.includes('25-35') || market.includes('professional')) score += 10;
    if (market.includes('millennials') || market.includes('gen z')) score += 5;
    
    // Technology adoption indicators
    if (desc.includes('ai') || desc.includes('machine learning')) score += 10;
    if (desc.includes('mobile') || desc.includes('app')) score += 5;
    if (desc.includes('blockchain') || desc.includes('crypto')) score -= 5; // Higher risk
    
    return Math.min(100, Math.max(20, score));
  };

  // Helper function to assess risk level
  const assessRiskLevel = (risks, timeline, resources, costs) => {
    let riskScore = 30; // Base risk level
    
    if (!risks) return 50; // Medium risk if not specified
    
    const riskText = risks.toLowerCase();
    const timelineMonths = extractTimelineMonths(timeline);
    const costsNum = extractNumericValue(costs);
    
    // Risk factors that increase risk score
    if (riskText.includes('competition') || riskText.includes('competitor')) riskScore += 15;
    if (riskText.includes('funding') || riskText.includes('capital')) riskScore += 20;
    if (riskText.includes('regulation') || riskText.includes('legal')) riskScore += 15;
    if (riskText.includes('technology') || riskText.includes('technical')) riskScore += 10;
    if (riskText.includes('market') || riskText.includes('demand')) riskScore += 10;
    if (riskText.includes('team') || riskText.includes('hiring')) riskScore += 15;
    
    // Timeline risk factors
    if (timelineMonths < 3) riskScore += 20; // Too aggressive
    if (timelineMonths > 18) riskScore += 10; // Too long, market may change
    
    // Resource adequacy risk
    if (!resources || resources.trim().length < 20) riskScore += 15;
    
    // High cost projects have higher risk
    if (costsNum > 100000) riskScore += 10;
    
    return Math.min(100, Math.max(10, riskScore));
  };


  // Main simulation function
  const runSimulation = async () => {
    if (!idea.title || !idea.description) {
      alert('Please provide at least a title and description for your idea.');
      return;
    }

    setIsSimulating(true);
    
    try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
      // Extract numeric values for calculations
      const revenueNum = extractNumericValue(idea.revenue) || 50000; // Default $50k monthly
      const costsNum = extractNumericValue(idea.costs) || 30000; // Default $30k monthly
      const timelineMonths = extractTimelineMonths(idea.timeline);
      
      // Calculate completeness score (affects all other scores)
      const completenessScore = calculateCompletenessScore(idea);
      const completenessMultiplier = Math.max(0.6, completenessScore / 100);
      
      // Calculate individual component scores
      const businessModelScore = assessBusinessModel(idea.businessModel, idea.revenue, idea.costs);
      const marketScore = assessMarketPotential(idea.targetMarket, idea.description, idea.businessModel);
      const riskScore = assessRiskLevel(idea.risks, idea.timeline, idea.resources, idea.costs);
      
      // Calculate viability score with weighted factors
      let viabilityScore = 0;
      viabilityScore += businessModelScore * 0.3; // 30% weight
      viabilityScore += marketScore * 0.25; // 25% weight
      viabilityScore += (100 - riskScore) * 0.2; // 20% weight (inverted risk)
      viabilityScore += completenessScore * 0.15; // 15% weight
      
      // Revenue/cost ratio impact (10% weight)
      const revenueRatio = revenueNum / costsNum;
      let ratioScore = 50;
      if (revenueRatio > 2) ratioScore = 90;
      else if (revenueRatio > 1.5) ratioScore = 75;
      else if (revenueRatio > 1.1) ratioScore = 65;
      else if (revenueRatio < 0.8) ratioScore = 25;
      viabilityScore += ratioScore * 0.1;
      
      // Apply completeness multiplier and clamp
      viabilityScore = Math.round(viabilityScore * completenessMultiplier);
      viabilityScore = Math.min(100, Math.max(20, viabilityScore));
      
      // Apply completeness multiplier to market score and clamp
      const finalMarketScore = Math.round(marketScore * completenessMultiplier);
      const clampedMarketScore = Math.min(100, Math.max(15, finalMarketScore));
      
      // Calculate additional metrics
      const timeToMarket = Math.max(1, Math.round(timelineMonths * (100 - viabilityScore + 50) / 100));
      const estimatedRevenue = Math.max(50000, Math.round(revenueNum * 12 * (viabilityScore / 100)));
      const breakEvenPoint = Math.max(6, Math.round((costsNum * 6) / revenueNum * (riskScore / 50)));
      
      // Generate AI insights based on calculated scores and input data
      const insights = await generateAIInsights(idea, {
        viabilityScore,
        marketScore: clampedMarketScore,
        riskScore,
        timeToMarket,
        estimatedRevenue,
        breakEvenPoint,
        revenueRatio
      });
      
      // Create simulation result
    const simulation = {
      id: Date.now(),
      idea: { ...idea },
      results: {
          viabilityScore,
          marketScore: clampedMarketScore,
          riskScore,
          timeToMarket,
          estimatedRevenue,
          breakEvenPoint,
          insights
      },
      timestamp: new Date().toISOString()
    };

    setSimulations(prev => [simulation, ...prev]);
    } catch (error) {
      console.error('Simulation failed:', error);
      alert('Simulation failed. Please try again.');
    } finally {
    setIsSimulating(false);
    }
  };

  const clearForm = () => {
    setIdea({
      title: '',
      description: '',
      targetMarket: '',
      businessModel: '',
      revenue: '',
      costs: '',
      timeline: '',
      resources: '',
      risks: '',
      successMetrics: ''
    });
  };

  const renderOverview = () => (
    <div className="sandbox-overview">
      <div className="overview-header">
        <h2>Business Idea Sandbox</h2>
        <p>Test your business ideas in a risk-free environment. Get insights on viability, market potential, and potential challenges before investing real resources.</p>
      </div>
      
      <div className="overview-features">
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Market Analysis</h3>
          <p>Evaluate market potential and competitive landscape</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Financial Modeling</h3>
          <p>Project revenues, costs, and break-even scenarios</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Risk Assessment</h3>
          <p>Identify potential risks and mitigation strategies</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Viability Score</h3>
          <p>Get an overall score for your business idea</p>
        </div>
      </div>
    </div>
  );

  const renderIdeaForm = () => (
    <div className="idea-form">
      <div className="form-header">
        <h2>Describe Your Business Idea</h2>
        <p>The more details you provide, the better insights you'll receive</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Idea Title *</label>
          <input
            type="text"
            value={idea.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., AI-powered fitness app"
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Description *</label>
          <textarea
            value={idea.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your idea in detail..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Target Market</label>
          <input
            type="text"
            value={idea.targetMarket}
            onChange={(e) => handleInputChange('targetMarket', e.target.value)}
            placeholder="e.g., Young professionals aged 25-35"
          />
        </div>

        <div className="form-group">
          <label>Business Model</label>
          <input
            type="text"
            value={idea.businessModel}
            onChange={(e) => handleInputChange('businessModel', e.target.value)}
            placeholder="e.g., Subscription-based, Freemium"
          />
        </div>

        <div className="form-group">
          <label>Expected Revenue (Monthly)</label>
          <input
            type="text"
            value={idea.revenue}
            onChange={(e) => handleInputChange('revenue', e.target.value)}
            placeholder="e.g., $50,000"
          />
        </div>

        <div className="form-group">
          <label>Estimated Costs (Monthly)</label>
          <input
            type="text"
            value={idea.costs}
            onChange={(e) => handleInputChange('costs', e.target.value)}
            placeholder="e.g., $30,000"
          />
        </div>

        <div className="form-group">
          <label>Timeline to Launch</label>
          <input
            type="text"
            value={idea.timeline}
            onChange={(e) => handleInputChange('timeline', e.target.value)}
            placeholder="e.g., 6 months"
          />
        </div>

        <div className="form-group">
          <label>Required Resources</label>
          <input
            type="text"
            value={idea.resources}
            onChange={(e) => handleInputChange('resources', e.target.value)}
            placeholder="e.g., Development team, Marketing budget"
          />
        </div>

        <div className="form-group full-width">
          <label>Potential Risks</label>
          <textarea
            value={idea.risks}
            onChange={(e) => handleInputChange('risks', e.target.value)}
            placeholder="What challenges do you anticipate?"
            rows="3"
          />
        </div>

        <div className="form-group full-width">
          <label>Success Metrics</label>
          <textarea
            value={idea.successMetrics}
            onChange={(e) => handleInputChange('successMetrics', e.target.value)}
            placeholder="How will you measure success?"
            rows="3"
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-secondary" onClick={clearForm}>
          Clear Form
        </button>
        <button 
          className="btn-primary" 
          onClick={runSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? 'Running Simulation...' : 'Run Simulation'}
        </button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="simulation-results">
      <div className="results-header">
        <h2>Simulation Results</h2>
        <p>View your business idea simulations and insights</p>
      </div>

      {simulations.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">📊</div>
          <h3>No simulations yet</h3>
          <p>Run your first simulation to see results here</p>
        </div>
      ) : (
        <div className="results-list">
          {simulations.map((simulation) => (
            <div key={simulation.id} className="result-card">
              <div className="result-header">
                <h3>{simulation.idea.title}</h3>
                <span className="result-date">
                  {new Date(simulation.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <div className="result-scores">
                <div className="score-item">
                  <span className="score-label">Viability</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill viability"
                      style={{ width: `${simulation.results.viabilityScore}%` }}
                    />
                  </div>
                  <span className="score-value">{simulation.results.viabilityScore}%</span>
                </div>
                
                <div className="score-item">
                  <span className="score-label">Market Potential</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill market"
                      style={{ width: `${simulation.results.marketScore}%` }}
                    />
                  </div>
                  <span className="score-value">{simulation.results.marketScore}%</span>
                </div>
                
                <div className="score-item">
                  <span className="score-label">Risk Level</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill risk"
                      style={{ width: `${simulation.results.riskScore}%` }}
                    />
                  </div>
                  <span className="score-value">{simulation.results.riskScore}%</span>
                </div>
              </div>
              
              <div className="result-metrics">
                <div className="metric">
                  <span className="metric-label">Time to Market</span>
                  <span className="metric-value">{simulation.results.timeToMarket} months</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Est. Revenue (Year 1)</span>
                  <span className="metric-value">${simulation.results.estimatedRevenue.toLocaleString()}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Break Even</span>
                  <span className="metric-value">{simulation.results.breakEvenPoint} months</span>
                </div>
              </div>
              
              <div className="result-insights">
                <h4>Key Insights</h4>
                <ul>
                  {simulation.results.insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="sandbox-page">
      <Header />
      
      <div className="sandbox-container">
        <div className="sandbox-header">
          <h1>Business Idea Sandbox</h1>
          <p>Test your business ideas without real-world risks</p>
        </div>

        <div className="sandbox-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'simulate' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulate')}
          >
            Simulate Idea
          </button>
          <button
            className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Results ({simulations.length})
          </button>
        </div>

        <div className="sandbox-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'simulate' && renderIdeaForm()}
          {activeTab === 'results' && renderResults()}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Sandbox;


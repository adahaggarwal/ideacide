import React, { useState } from 'react';
import { Header, Footer } from '../../components';
import './Sandbox.css';

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

  const runSimulation = async () => {
    if (!idea.title || !idea.description) {
      alert('Please provide at least a title and description for your idea.');
      return;
    }

    setIsSimulating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock simulation results
    const simulation = {
      id: Date.now(),
      idea: { ...idea },
      results: {
        viabilityScore: Math.floor(Math.random() * 40) + 60, // 60-100
        marketScore: Math.floor(Math.random() * 30) + 70, // 70-100
        riskScore: Math.floor(Math.random() * 50) + 20, // 20-70
        timeToMarket: Math.floor(Math.random() * 12) + 6, // 6-18 months
        estimatedRevenue: Math.floor(Math.random() * 500000) + 100000, // $100k-$600k
        breakEvenPoint: Math.floor(Math.random() * 18) + 12, // 12-30 months
        insights: [
          'Market timing appears favorable',
          'Consider strengthening competitive advantages',
          'Revenue model shows potential',
          'Risk mitigation strategies recommended'
        ]
      },
      timestamp: new Date().toISOString()
    };

    setSimulations(prev => [simulation, ...prev]);
    setIsSimulating(false);
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

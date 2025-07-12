import React, { useState } from 'react';
import './RiskAssessment.css';

const RiskAssessment = ({ assessment, answers, onRestart }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!assessment) return null;

  const getRiskLevelColor = (score) => {
    if (score <= 0.3) return '#10b981'; // Green
    if (score <= 0.6) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getRiskLevelText = (score) => {
    if (score <= 0.3) return 'Low Risk';
    if (score <= 0.6) return 'Medium Risk';
    return 'High Risk';
  };

  const getRiskIcon = (score) => {
    if (score <= 0.3) return '✅';
    if (score <= 0.6) return '⚠️';
    return '🚨';
  };

  const categoryNames = {
    marketValidation: 'Market Validation',
    businessModel: 'Business Model',
    competition: 'Competition Analysis',
    execution: 'Execution Capability',
    financial: 'Financial Planning',
    team: 'Team & Leadership'
  };

  return (
    <div className="risk-assessment">
      <div className="assessment-header">
        <div className="risk-score-main">
          <div className="risk-score-circle">
            <div className="risk-score-value" style={{ color: getRiskLevelColor(assessment.overallRiskScore) }}>
              {Math.round((1 - assessment.overallRiskScore) * 100)}
            </div>
            <div className="risk-score-label">Success Score</div>
          </div>
          <div className="risk-level-indicator">
            <span className="risk-icon">{getRiskIcon(assessment.overallRiskScore)}</span>
            <span className="risk-level-text" style={{ color: getRiskLevelColor(assessment.overallRiskScore) }}>
              {getRiskLevelText(assessment.overallRiskScore)}
            </span>
          </div>
        </div>
        
        <div className="assessment-summary">
          <h2>Your Startup Risk Assessment</h2>
          <p>Based on your answers, we've analyzed your startup across 6 key dimensions.</p>
        </div>
      </div>

      <div className="assessment-tabs">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'risks' ? 'active' : ''}`}
            onClick={() => setActiveTab('risks')}
          >
            Key Risks
          </button>
          <button 
            className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
          <button 
            className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            Similar Failures
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="category-scores">
                <h3>Risk Breakdown by Category</h3>
                <div className="category-grid">
                  {Object.entries(assessment.categoryScores).map(([category, score]) => (
                    <div key={category} className="category-item">
                      <div className="category-header">
                        <span className="category-name">{categoryNames[category]}</span>
                        <span className="category-score">{Math.round((1 - score) * 100)}%</span>
                      </div>
                      <div className="category-bar">
                        <div 
                          className="category-fill"
                          style={{ 
                            width: `${(1 - score) * 100}%`,
                            backgroundColor: getRiskLevelColor(score)
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {assessment.strengthAreas.length > 0 && (
                <div className="strength-areas">
                  <h3>🌟 Your Strengths</h3>
                  <ul>
                    {assessment.strengthAreas.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="risks-tab">
              <h3>🚨 Key Risk Factors</h3>
              <div className="risk-list">
                {assessment.keyRisks.map((risk, index) => (
                  <div key={index} className="risk-item">
                    <span className="risk-number">{index + 1}</span>
                    <span className="risk-text">{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="recommendations-tab">
              <div className="critical-steps">
                <h3>🎯 Critical Next Steps</h3>
                <div className="steps-list">
                  {assessment.criticalNextSteps.map((step, index) => (
                    <div key={index} className="step-item">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">
                        <span className="step-text">{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="general-recommendations">
                <h3>💡 General Recommendations</h3>
                <ul>
                  {assessment.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="comparison-tab">
              <h3>⚠️ Similar Failure Patterns</h3>
              <div className="failure-patterns">
                {assessment.similarFailurePatterns.map((pattern, index) => (
                  <div key={index} className="pattern-item">
                    <span className="pattern-icon">📊</span>
                    <span className="pattern-text">{pattern}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="assessment-actions">
        <button className="restart-btn" onClick={onRestart}>
          <span className="btn-icon">🔄</span>
          Assess Another Idea
        </button>
        <button className="share-btn" onClick={() => {
          const text = `I just assessed my startup idea and got a ${Math.round((1 - assessment.overallRiskScore) * 100)}% success score! Check out IdeaCide's Failometer to validate your startup ideas.`;
          navigator.share ? navigator.share({ text }) : navigator.clipboard.writeText(text);
        }}>
          <span className="btn-icon">📤</span>
          Share Results
        </button>
      </div>
    </div>
  );
};

export default RiskAssessment;

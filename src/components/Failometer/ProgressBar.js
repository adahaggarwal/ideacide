import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress, currentStep, totalSteps }) => {
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-text">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="progress-percentage">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        >
          <div className="progress-glow"></div>
        </div>
      </div>
      
      <div className="progress-milestones">
        <div className="milestone-list">
          <div className={`milestone ${currentStep >= 2 ? 'completed' : currentStep >= 1 ? 'active' : ''}`}>
            <div className="milestone-dot"></div>
            <span className="milestone-label">Basic Info</span>
          </div>
          <div className={`milestone ${currentStep >= 5 ? 'completed' : currentStep >= 3 ? 'active' : ''}`}>
            <div className="milestone-dot"></div>
            <span className="milestone-label">Market Validation</span>
          </div>
          <div className={`milestone ${currentStep >= 8 ? 'completed' : currentStep >= 6 ? 'active' : ''}`}>
            <div className="milestone-dot"></div>
            <span className="milestone-label">Deep Dive</span>
          </div>
          <div className={`milestone ${currentStep >= totalSteps ? 'completed' : currentStep >= 9 ? 'active' : ''}`}>
            <div className="milestone-dot"></div>
            <span className="milestone-label">Assessment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

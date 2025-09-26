import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ 
  progress = 0, 
  variant = 'primary',
  size = 'medium',
  animated = true,
  showLabel = false,
  label,
  className = ''
}) => {
  const progressClass = [
    'progress-bar',
    `progress-bar--${variant}`,
    `progress-bar--${size}`,
    animated && 'progress-bar--animated',
    className
  ].filter(Boolean).join(' ');

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={progressClass}>
      {(showLabel || label) && (
        <div className="progress-bar__label">
          <span>{label || `${Math.round(clampedProgress)}%`}</span>
        </div>
      )}
      
      <div className="progress-bar__track">
        <div 
          className="progress-bar__fill"
          style={{ width: `${clampedProgress}%` }}
        >
          <div className="progress-bar__shine"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
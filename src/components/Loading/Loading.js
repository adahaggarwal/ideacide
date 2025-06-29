import React from 'react';
import './Loading.css';

const Loading = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClass = `loading-${size}`;
  
  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner-bulb">💡</div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;

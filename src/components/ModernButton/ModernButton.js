import React, { useState } from 'react';
import './ModernButton.css';

const ModernButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (event) => {
    if (!disabled && !loading) {
      createRipple(event);
      onClick?.(event);
    }
  };

  const buttonClass = [
    'modern-button',
    `modern-button--${variant}`,
    `modern-button--${size}`,
    disabled && 'modern-button--disabled',
    loading && 'modern-button--loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={buttonClass}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      <span className="modern-button__content">
        {loading && <span className="modern-button__spinner">⏳</span>}
        {children}
      </span>
      
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="modern-button__ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </button>
  );
};

export default ModernButton;
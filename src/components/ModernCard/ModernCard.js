import React from 'react';
import './ModernCard.css';

const ModernCard = ({ 
  children, 
  variant = 'default',
  hover = true,
  glow = false,
  className = '',
  onClick,
  ...props 
}) => {
  const cardClass = [
    'modern-card',
    `modern-card--${variant}`,
    hover && 'modern-card--hover',
    glow && 'modern-card--glow',
    onClick && 'modern-card--clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClass}
      onClick={onClick}
      {...props}
    >
      <div className="modern-card__content">
        {children}
      </div>
      {glow && <div className="modern-card__glow"></div>}
    </div>
  );
};

export default ModernCard;
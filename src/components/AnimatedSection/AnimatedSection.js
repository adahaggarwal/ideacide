import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './AnimatedSection.css';

const AnimatedSection = ({ 
  children, 
  animation = 'fade-in',
  delay = 0,
  className = '',
  ...props 
}) => {
  const [ref, isVisible] = useScrollAnimation(0.1, '0px 0px -100px 0px');

  const sectionClass = [
    'animated-section',
    isVisible && `animated-section--${animation}`,
    className
  ].filter(Boolean).join(' ');

  const style = {
    animationDelay: `${delay}ms`,
    ...props.style
  };

  return (
    <div 
      ref={ref}
      className={sectionClass}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
import React, { useState, useRef } from 'react';
import './ModernInput.css';

const ModernInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  icon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const hasValue = value && value.length > 0;
  const isActive = isFocused || hasValue;

  const inputClass = [
    'modern-input',
    isActive && 'modern-input--active',
    error && 'modern-input--error',
    disabled && 'modern-input--disabled',
    icon && 'modern-input--with-icon',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={inputClass}>
      {icon && <div className="modern-input__icon">{icon}</div>}
      
      <div className="modern-input__field">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={!label ? placeholder : ''}
          className="modern-input__control"
          {...props}
        />
        
        {label && (
          <label 
            className={`modern-input__label ${isActive ? 'modern-input__label--active' : ''}`}
            onClick={() => inputRef.current?.focus()}
          >
            {label}
            {required && <span className="modern-input__required">*</span>}
          </label>
        )}
        
        <div className="modern-input__border"></div>
      </div>
      
      {error && (
        <div className="modern-input__error">
          <span className="modern-input__error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default ModernInput;
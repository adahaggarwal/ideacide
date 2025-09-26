import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './ModernModal.css';

const ModernModal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'medium',
  closeOnOverlay = true,
  closeOnEscape = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
      setIsExiting(true);
      setTimeout(() => {
        document.body.style.overflow = 'unset';
        setIsExiting(false);
      }, 300);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose();
    }
  };

  if (!isOpen && !isExiting) return null;

  const modalClass = [
    'modern-modal',
    `modern-modal--${size}`,
    isVisible && 'modern-modal--visible',
    isExiting && 'modern-modal--exiting',
    className
  ].filter(Boolean).join(' ');

  const modalContent = (
    <div className="modern-modal-overlay" onClick={handleOverlayClick}>
      <div className={modalClass}>
        <div className="modern-modal__header">
          {title && <h2 className="modern-modal__title">{title}</h2>}
          <button 
            className="modern-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        
        <div className="modern-modal__content">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ModernModal;
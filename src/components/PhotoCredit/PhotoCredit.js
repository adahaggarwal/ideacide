import React from 'react';
import './PhotoCredit.css';

const PhotoCredit = ({ imageData, onImageLoad }) => {
  if (!imageData || typeof imageData === 'string') {
    return null;
  }

  const handleImageLoad = () => {
    // Trigger download tracking as required by Unsplash API
    if (imageData.downloadUrl && onImageLoad) {
      onImageLoad(imageData.downloadUrl);
    }
  };

  return (
    <div className="photo-credit">
      <span className="credit-text">
        Photo by{' '}
        <a 
          href={imageData.photographerUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="photographer-link"
        >
          {imageData.photographer}
        </a>
        {' '}on{' '}
        <a 
          href="https://unsplash.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="unsplash-link"
        >
          Unsplash
        </a>
      </span>
      {imageData.downloadUrl && (
        <img 
          src={imageData.url} 
          alt={imageData.alt}
          onLoad={handleImageLoad}
          style={{ display: 'none' }} // Hidden image for tracking
        />
      )}
    </div>
  );
};

export default PhotoCredit;

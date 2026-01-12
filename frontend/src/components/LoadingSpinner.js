import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
      {message.includes('Analyzing') || message.includes('Searching') ? (
        <p className="loading-tip">Server may take 30-60 seconds to wake up on first request</p>
      ) : null}
    </div>
  );
};

export default LoadingSpinner;
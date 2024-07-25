import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Results.css';

const Results = () => {
  const location = useLocation();
  const { processedImagePath } = location.state || {};
  console.log('Processed Image Path:', processedImagePath); // Debug log

  const handleImageError = () => {
    console.error('Failed to load the processed image from:', processedImagePath);
  };

  return (
    <div className="results-container">
      <h2>Prediction Results</h2>
      {processedImagePath ? (
        <img 
          src={`http://localhost:8000${processedImagePath}`} 
          alt="Processed Image" 
          className="processed-image" 
          onError={handleImageError}
        />
      ) : (
        <p>No image available.</p>
      )}
      <Link to="/dashboard" className="back-button">Back</Link>
    </div>
  );
};

export default Results;

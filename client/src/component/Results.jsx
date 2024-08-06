import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import downloadIcon from '../assets/images/download-file-icon.png'; // Make sure the path is correct
import '../styles/Results.css';

const Results = () => {
  const location = useLocation();
  const { processedImagePath } = location.state || {};
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error('Failed to load the processed image from:', processedImagePath);
  };

  const downloadPDF = () => {
    if (!imageLoaded) return;

    const input = document.getElementById('pdf-content');
    html2canvas(input, {
      useCORS: true,
      scale: 2,
      backgroundColor: '#ffffff',
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 160); // Adjust the size and position as needed
      pdf.save(`prediction_result.pdf`);
    });
  };

  return (
    <div className="results-container">
      <h2>Prediction Results</h2>
      <div id="pdf-content">
        {processedImagePath ? (
          <img 
            src={`http://localhost:8000${processedImagePath}`} 
            alt="Processed Image" 
            className="processed-image" 
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <p>No image available.</p>
        )}
      </div>
      <img 
        src={downloadIcon} 
        alt="Download as PDF" 
        onClick={downloadPDF} 
        style={{ cursor: 'pointer', width: '60px', margin: '0 auto', marginTop: '30px' }}
      />
      <Link to="/dashboard" className="back-button">Back</Link>
    </div>
  );
};

export default Results;

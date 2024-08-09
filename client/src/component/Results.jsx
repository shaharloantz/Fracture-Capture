import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPDF } from '../utils/pdfUtils';
import downloadIcon from '../assets/images/download-file-icon.png'; // Make sure the path is correct
import '../styles/Results.css';
import axios from 'axios';

const Results = () => {
  const location = useLocation();
  const { processedImagePath, selectedUpload, patient, userName } = location.state || {};
  const [imageLoaded, setImageLoaded] = useState(false);
  const [patientDetails, setPatientDetails] = useState(patient);
  useEffect(() => {
    if (!patient && selectedUpload?.id) {
      axios.get(`/patients/${selectedUpload.id}`)
        .then(response => {
          setPatientDetails(response.data);
        })
        .catch(error => {
          console.error('Error fetching patient details:', error);
        });
    }
  }, [patient, selectedUpload]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error('Failed to load the processed image from:', processedImagePath);
  };

  const downloadPDF = async () => {
    if (!imageLoaded) return;

    const pdf = await createPDF(selectedUpload, patientDetails, userName, imageLoaded);
    if (pdf) {
      pdf.save(`prediction_result.pdf`);
    }
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
          <p>No processed image available.</p>
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
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPDF, sendEmail } from '../utils/pdfUtils';  // Import sendEmail from pdfUtils
import downloadIcon from '../assets/images/download-file-icon.png'; 
import sendEmailIcon from '../assets/images/send-email-icon.png'; // Add the send email icon
import '../styles/Results.css';
import axios from 'axios';

const Results = () => {
  const location = useLocation();
  const { processedImagePath, selectedUpload, patient, userName, processingTime } = location.state || {};
  const [imageLoaded, setImageLoaded] = useState(false);
  const [patientDetails, setPatientDetails] = useState(patient);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isSending, setIsSending] = useState(false);

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
    const pdf = await createPDF(selectedUpload, patientDetails, userName, imageLoaded);
    if (pdf) {
        const patientName = patientDetails?.name || selectedUpload.patientName || 'unknown';
        pdf.save(`upload_details_${patientName}.pdf`);
    }
};

  const handleSendEmail = async () => {
    if (!email) {
      alert('Please enter a valid email address.');
      return;
    }
    await sendEmail(selectedUpload, email, imageLoaded, setIsSending, setShowEmailInput, setEmail, patientDetails, userName);
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px',marginBottom:'30px', gap:'20vh'}}>
      <img 
        src={downloadIcon} 
        alt="Download as PDF" 
        onClick={downloadPDF}
        style={{ cursor: 'pointer', width: '60px', marginRight: '20px' }}
      />
      <img 
        src={sendEmailIcon}
        alt="Send as Email" 
        onClick={() => setShowEmailInput(!showEmailInput)}
        style={{ cursor: 'pointer', width: '60px' }}

      />
      </div>
      {showEmailInput && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient email"
            style={{ padding: '10px', width: '120%', marginBottom: '10px', color: 'black' }}
            disabled={isSending}
          />
          <button 
            onClick={handleSendEmail} 
            style={{ padding: '10px 20px', cursor: 'pointer' }} 
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      )}
      <Link to="/dashboard" className="back-button">Back</Link>
    </div>
  );
};

export default Results;

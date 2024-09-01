/**
 * Results Page
 * This React component is responsible for displaying the results of a medical image processing task.
 * It allows the user to view the processed image, download the results as a PDF, and send the results via email.
 * 
 * Key functionalities:
 * - Displays a processed medical image along with relevant patient details.
 * - Provides options to download the result as a PDF or send it via email.
 * - Dynamically fetches and displays patient details if they are not already provided.
 * - Handles the loading and error states for the image and network requests.
 * 
 * Hooks:
 * - useLocation: Used to retrieve state passed via navigation (e.g., processed image path, patient data).
 * - useState: Manages local state for image loading, patient details, email input, and sending status.
 * - useEffect: Fetches patient details from the server if they are not available in the initial state.
 * 
 * External dependencies:
 * - axios: For making HTTP requests to fetch patient data.
 * - react-hot-toast: For displaying notifications to the user.
 * - jsPDF (via createPDF): For generating PDF files.
 * - react-router-dom: For navigation and retrieving location state.
 */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { createPDF, sendEmail } from '../utils/pdfUtils';  
import downloadIcon from '../assets/images/download-file-icon.png'; 
import sendEmailIcon from '../assets/images/send-email-icon.png'; 
import '../styles/Results.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Results = () => {
  const location = useLocation();
  const { processedImagePath, selectedUpload, patient, userName, profileEmail } = location.state || {};
  const [imageLoaded, setImageLoaded] = useState(false);
  const [patientDetails, setPatientDetails] = useState(patient);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [createdByUser, setCreatedByUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    try {
      fetchCreatedByUser(selectedUpload.createdByUser);
    } catch (error) {
      navigate('/pagenotfound');
    }

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

  const fetchCreatedByUser = async (userId) => {
    try {
      const response = await axios.get(`/user/${userId}`, { withCredentials: true });
      setCreatedByUser(response.data);
    } catch (error) {
      console.error('Error fetching created by user:', error.response ? error.response.data : error.message);
    }
  };

  const downloadPDF = async () => {
    const pdf = await createPDF(selectedUpload, patientDetails, createdByUser, imageLoaded);
    if (pdf) {
      const patientName = patientDetails?.name || selectedUpload.patientName || 'unknown';
      pdf.save(`upload_details_${patientName}.pdf`);
    }
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    await sendEmail(selectedUpload, email, imageLoaded, setIsSending, setShowEmailInput, setEmail, patientDetails, createdByUser);
  };

  return (
    <div className="results-container">
      <h1>Prediction Results</h1>
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
      {selectedUpload?.prediction?.confidences && (
        <div className="prediction-details">
          {selectedUpload.prediction.confidences.map((confidence, index) => (
            <p className='prediction' key={index}> <strong>Prediction: </strong> {(confidence * 100).toFixed(2)}%</p>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px', marginBottom:'30px', gap:'20vh'}}>
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

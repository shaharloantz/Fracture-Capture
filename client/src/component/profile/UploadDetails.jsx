import React, { useState, useRef, useEffect } from 'react';
import downloadIcon from '../../assets/images/download-file-icon.png';
import sendEmailIcon from '../../assets/images/send-email-icon.png';
import axios from 'axios';
import { createPDF, sendEmail } from '../../utils/pdfUtils';

const UploadDetails = ({ selectedUpload, handleBackClick, patient, userName }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [email, setEmail] = useState('');
    const [shareEmail, setShareEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const pdfRef = useRef(null);

    useEffect(() => {
        console.log('selectedUpload:', selectedUpload);
        console.log('patient:', patient);
        console.log('userName:', userName);
    }, [selectedUpload, patient, userName]);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleShareEmailChange = (e) => {
        setShareEmail(e.target.value);
    };

    const downloadPDF = async () => {
        const pdf = await createPDF(selectedUpload, patient, userName, imageLoaded);
        if (pdf) {
            pdf.save(`upload_details_${selectedUpload.patientName || 'unknown'}.pdf`);
        }
    };

    const handleShareSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/uploads/share', {
                uploadId: selectedUpload._id,
                email: shareEmail,
            });
            setMessage(response.data.message);
            setShareEmail('');
        } catch (error) {
            console.error('Error sharing upload:', error);
            console.error('Error details:', error.response ? error.response.data : error.message);
            setMessage('Error sharing upload');
        }
    };

    if (!selectedUpload || !selectedUpload.processedImgUrl) {
        return <p>No upload selected or missing image URL.</p>;
    }

    return (
        <div className="upload-details">
            <img 
                src="/src/assets/images/undo.png" 
                alt="Back to Patients" 
                className="back-button-icon" 
                onClick={handleBackClick} 
                style={{ margin: '0 auto', marginBottom: '20px' }}
            />
            <div id="pdf-content">
                <p><strong>Patient Name:</strong> <span>{selectedUpload.patientName || 'N/A'}</span></p>
                <p><strong>Patient ID:</strong> <span>{patient?.idNumber || selectedUpload.patient?.idNumber || 'N/A'}</span></p>
                <p><strong>Gender:</strong> <span>{patient?.gender || selectedUpload.patient?.gender || 'N/A'}</span></p>
                <p><strong>Date of Birth:</strong> <span>{new Date(patient?.dateOfBirth).toLocaleString().substring(0,9) || 'N/A'}</span></p>
                <p><strong>Associated doctor:</strong> <span>{userName}</span></p>
                <p><strong>Body Part:</strong> <span>{selectedUpload ? selectedUpload.bodyPart : 'N/A'}</span></p>
                <p><strong>Description:</strong> <span>{selectedUpload ? selectedUpload.description : 'N/A'}</span></p>
                <p><strong>Date Uploaded:</strong> <span>{selectedUpload ? new Date(selectedUpload.dateUploaded).toLocaleString() : 'N/A'}</span></p>
                <p><strong>Prediction:</strong> <span>{selectedUpload && selectedUpload.prediction.confidences.length > 0 
                    ? selectedUpload.prediction.confidences.map(conf => `${(conf * 100).toFixed(2)}%`).join(', ')
                    : 'No fracture detected'}
                </span></p>
                <img 
                    src={`http://localhost:8000${selectedUpload.processedImgUrl}`} 
                    alt="Processed Upload" 
                    onLoad={handleImageLoad} 
                    crossOrigin="anonymous"
                    style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto', marginTop: '15px' }}
                />
            </div>
            <img 
                src={downloadIcon} 
                alt="Download as PDF" 
                onClick={downloadPDF} 
                style={{ cursor: 'pointer', width: '60px', margin: '0 auto', marginTop: '30px' }}
            />
            <img 
                src={sendEmailIcon}
                alt="Send as Email" 
                onClick={() => setShowEmailInput(!showEmailInput)}
                style={{ cursor: 'pointer', width: '60px', margin: '0 auto', marginTop: '30px' }}
            />
            {showEmailInput && (
                <form onSubmit={(e) => { 
                    e.preventDefault(); 
                    if (!email) {
                        alert('Please enter a valid email address.');
                        return;
                    }
                    sendEmail(selectedUpload, email, imageLoaded, setIsSending, setShowEmailInput, setEmail, patient, userName); 
                }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter recipient email"
                        style={{ padding: '10px', width: '40%', marginBottom: '10px', color: 'black' }}
                        disabled={isSending}
                    />
                    <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }} disabled={isSending}>
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                </form>
            )}
            <form onSubmit={handleShareSubmit} style={{ marginTop: '20px' }}>
                <label>
                    <p>Share with another doctor:</p>
                    <input
                        type="email"
                        value={shareEmail}
                        placeholder="Enter doctor's email"
                        onChange={handleShareEmailChange}
                        required
                        style={{ padding: '10px 20px', width: '40%' }}
                    />
                </label>
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Share</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadDetails;
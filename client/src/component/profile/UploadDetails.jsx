/**
 * UploadDetails Component
 
 * This component is responsible for displaying the details of a selected upload, including patient information,
 * the associated doctor, the processed image, and predictions made by the system. The user can download the details 
 * as a PDF or share them via email. The component also provides functionality for sharing the upload with another 
 * doctor via email.
 *
 * Key Features:
 * - Displays detailed information about the upload and the patient.
 * - Allows downloading the details as a PDF.
 * - Enables sending the details via email.
 * - Provides the ability to share the upload with another doctor.
 *
 * Props:
 * - selectedUpload: The upload object containing details of the selected upload.
 * - handleBackClick: A function to handle the event when the user clicks the "Back" button.
 * - patient: The patient object containing the patient's information.
 *
 * State:
 * - imageLoaded: Tracks whether the processed image has been loaded.
 * - createdByUser: Stores details of the user who created the upload.
 * - email: Stores the email address for sending the upload details.
 * - shareEmail: Stores the email address for sharing the upload with another doctor.
 * - message: Stores messages to display to the user (e.g., success or error messages).
 * - showEmailInput: Toggles the visibility of the email input field for sending details.
 * - isSending: Tracks whether the email is being sent.
 *
 * The component uses Axios for API calls and includes various functions to handle fetching user data, 
 * downloading PDFs, sending emails, and sharing uploads.
 */
import React, { useState, useEffect } from 'react';
import downloadIcon from '../../assets/images/download-file-icon.png';
import sendEmailIcon from '../../assets/images/send-email-icon.png';
import axios from 'axios';
import { createPDF, sendEmail } from '../../utils/pdfUtils';
import { toast } from 'react-hot-toast';

const UploadDetails = ({ selectedUpload, handleBackClick, patient }) => {
    console.log(selectedUpload);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [createdByUser, setCreatedByUser] = useState({});
    const [email, setEmail] = useState('');
    const [shareEmail, setShareEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (selectedUpload?.createdByUser) {
            fetchCreatedByUser(selectedUpload.createdByUser);
        }
    }, [selectedUpload]);

    const fetchCreatedByUser = async (userId) => {
        try {
            const response = await axios.get(`/user/${userId}`, { withCredentials: true });
            setCreatedByUser(response.data);
        } catch (error) {
            console.error('Error fetching created by user:', error.response ? error.response.data : error.message);
        }
    };

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
        console.log('created by user:' , createdByUser);
        const pdf = await createPDF(selectedUpload, patient,createdByUser , imageLoaded);
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
        <>
            <img 
                src="/src/assets/images/undo.png" 
                alt="Back to Patients" 
                className="back-button-icon" 
                onClick={handleBackClick} 
                style={{ margin: '0 auto', marginBottom: '20px' }}
            />
            <div className="upload-details">
                <div id="pdf-content">
                    <p><strong>Patient Name:</strong> <span>{selectedUpload.patientName || 'N/A'}</span></p>
                    <p><strong>Patient ID:</strong> <span>{patient?.idNumber || selectedUpload.patient?.idNumber || 'N/A'}</span></p>
                    <p><strong>Gender:</strong> <span>{patient?.gender || selectedUpload.patient?.gender || 'N/A'}</span></p>
                    <p><strong>Date of Birth:</strong> <span>{new Date(patient?.dateOfBirth || selectedUpload.patient?.dateOfBirth).toLocaleDateString() || 'N/A'}</span></p>
                    <p><strong>Associated doctor:</strong> <span>{createdByUser.name} ({createdByUser.email})</span></p>
                    <p><strong>Body Part:</strong> <span>{selectedUpload.bodyPart}</span></p>
                    <p><strong>Description:</strong> <span>{selectedUpload.description}</span></p>
                    <p><strong>Date Uploaded:</strong> <span>{new Date(selectedUpload.dateUploaded).toLocaleString()}</span></p>
                    <p><strong>Prediction:</strong> <span>{selectedUpload.prediction.confidences.length > 0 
                        ? selectedUpload.prediction.confidences.map(conf => `${(conf * 100).toFixed(2)}%`).join(', ')
                        : 'No fracture detected'}
                    </span></p>
                    <img 
                        src={`http://localhost:8000${selectedUpload.processedImgUrl}`} 
                        alt="Processed Upload" 
                        onLoad={handleImageLoad} 
                        className="processed-image" 
                        style={{ marginTop: '15px' }} 
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', gap:'20vh' }}>
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
                    <form onSubmit={(e) => { 
                        e.preventDefault(); 
                        if (!email) {
                            toast.error('Please enter a valid email address.');
                            return;
                        }
                        sendEmail(selectedUpload, email, imageLoaded, setIsSending, setShowEmailInput, setEmail, patient, createdByUser); 
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
        </>
    );
};

export default UploadDetails;

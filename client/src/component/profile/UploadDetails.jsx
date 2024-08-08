import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import downloadIcon from '../../assets/images/download-file-icon.png';
import sendEmailIcon from '../../assets/images/send-email-icon.png';
import axios from 'axios';

const UploadDetails = ({ selectedUpload, handleBackClick, patient, userName }) => { // Receive patient and user details as props
    const [imageLoaded, setImageLoaded] = useState(false);
    const [email, setEmail] = useState('');
    const [shareEmail, setShareEmail] = useState(''); // Separate state for sharing email
    const [message, setMessage] = useState('');
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const pdfRef = useRef(null); // Use ref to store the created PDF

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleShareEmailChange = (e) => {
        setShareEmail(e.target.value);
    };

    const createPDF = async () => {
        if (!imageLoaded) return null;

        const input = document.getElementById('pdf-content');
        const canvas = await html2canvas(input, {
            useCORS: true,
            scale: 2,
            backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 10, 0, 190, 160);

        const yOffset = 190;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Patient Name:`, 10, yOffset);
        pdf.setFont('helvetica', 'normal');
        pdf.text(` ${patient ? patient.name : ''}`, 45, yOffset); // Use the updated patient details
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Patient ID:`, 10, yOffset + 10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(` ${patient ? patient.idNumber : ''}`, 45, yOffset + 10); // Add patient ID
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Gender:`, 10, yOffset + 20);
        pdf.setFont('helvetica', 'normal');
        pdf.text(` ${patient ? patient.gender : ''}`, 45, yOffset + 20); // Add patient gender
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Associated doctor:`, 10, yOffset + 30);
        pdf.setFont('helvetica', 'normal');
        pdf.text(` ${userName}`, 45, yOffset + 30); // Add the user's name who created the upload
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Body Part:`, 10, yOffset + 40);
        pdf.setFont('helvetica', 'normal');
        pdf.text(` ${selectedUpload.bodyPart}`, 45, yOffset + 40);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Description:`, 10, yOffset + 50);
        pdf.setFont('helvetica', 'normal');
        pdf.text(` ${selectedUpload.description}`, 45, yOffset + 50);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Date Uploaded:`, 10, yOffset + 60);
        pdf.setFont('helvetica', 'normal');
        pdf.text(` ${new Date(selectedUpload.dateUploaded).toLocaleString()}`, 45, yOffset + 60);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Prediction:`, 10, yOffset + 70);
        pdf.setFont('helvetica', 'normal');

        const confidenceText = selectedUpload.prediction.confidences.length > 0 
            ? selectedUpload.prediction.confidences.map(conf => `${(conf * 100).toFixed(2)}%`).join(', ')
            : 'No fracture detected';
        pdf.text(` ${confidenceText}`, 45, yOffset + 70);

        return pdf;
    };

    const downloadPDF = async () => {
        const pdf = await createPDF();
        if (pdf) {
            pdf.save(`upload_details_${patient ? patient.name : 'unknown'}.pdf`);
        }
    };

    const sendEmail = async () => {
        if (!imageLoaded) return;

        setIsSending(true); // Set loading state to true

        const pdf = await createPDF(); // Ensure PDF is created
        if (pdf) {
            const pdfBlob = pdf.output('blob');
            const formData = new FormData();
            formData.append('pdf', pdfBlob, `upload_details_${patient ? patient.name : 'unknown'}.pdf`);
            formData.append('patientName', patient ? patient.name : 'unknown');
            formData.append('email', email);

            fetch('http://localhost:8000/uploads/send-email', {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    alert('Email sent successfully');
                    setShowEmailInput(false); // Hide the email input box after sending the email
                    setEmail(''); // Clear the email input field
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Error sending email');
                })
                .finally(() => {
                    setIsSending(false); // Set loading state to false
                });
        }
    };

    const handleShareSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/uploads/share', {
                uploadId: selectedUpload._id,
                email: shareEmail // Use separate state for sharing email
            });
            setMessage(response.data.message);
            setShareEmail(''); // Clear the share email input field
        } catch (error) {
            console.error('Error sharing upload:', error);
            console.error('Error details:', error.response ? error.response.data : error.message);
            setMessage('Error sharing upload');
        }
    };

    return (
        <div className="upload-details">
            <img 
                src="/src/assets/images/undo.png" 
                alt="Back to Patients" 
                className="back-button-icon" 
                onClick={handleBackClick} 
                style={{margin: '0 auto', marginBottom: '20px'}}
            />            
            <div id="pdf-content">
                <p><strong>Patient Name:</strong> <span>{patient ? patient.name : 'N/A'}</span></p> {/* Use the updated patient details */}
                <p><strong>Patient ID:</strong> <span>{patient ? patient.idNumber : 'N/A'}</span></p> {/* Add patient ID */}
                <p><strong>Gender:</strong> <span>{patient ? patient.gender : 'N/A'}</span></p> {/* Add patient gender */}
                <p><strong>Associated doctor:</strong> <span>{userName}</span></p> {/* Add the user's name who created the upload */}
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
                    crossOrigin="anonymous"
                    style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto', marginTop: '15px' }}
                />
            </div>
            <img 
                src={downloadIcon} 
                alt="Download as PDF" 
                onClick={downloadPDF} 
                style={{ cursor: 'pointer', width: '60px',margin: '0 auto', marginTop: '30px' }}
            />
            <img 
                src={sendEmailIcon}
                alt="Send as Email" 
                onClick={() => setShowEmailInput(!showEmailInput)} // Toggle visibility
                style={{margin: '0 auto', cursor: 'pointer', width: '60px', marginTop: '30px' }}
            />
            {showEmailInput && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter recipient email"
                        style={{ padding: '10px', width: '40%', marginBottom: '10px', color: 'black' }}
                        disabled={isSending} // Disable input while sending
                    />
                    <button onClick={sendEmail} style={{ padding: '10px 20px', cursor: 'pointer' }} disabled={isSending}>
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                </div>
            )}
            <form onSubmit={handleShareSubmit} style={{ marginTop: '20px' }}>
                <label>
                    <p>Share with another doctor:</p>
                    <input
                        type="email"
                        value={shareEmail} // Use separate state for sharing email
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

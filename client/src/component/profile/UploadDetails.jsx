import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import downloadIcon from '../../assets/images/download-file-icon.png';
import sendEmailIcon from '../../assets/images/send-email-icon.png';

const UploadDetails = ({ selectedUpload, handleBackClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
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
            pdf.addImage(imgData, 'PNG', 10, 0, 190, 160);

            const yOffset = 190;
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Patient Name:`, 10, yOffset);
            pdf.setFont('helvetica', 'normal');
            pdf.text(` ${selectedUpload.patientName}`, 45, yOffset);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Description:`, 10, yOffset + 10);
            pdf.setFont('helvetica', 'normal');
            pdf.text(` ${selectedUpload.description}`, 45, yOffset + 10);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Body Part:`, 10, yOffset + 20);
            pdf.setFont('helvetica', 'normal');
            pdf.text(` ${selectedUpload.bodyPart}`, 45, yOffset + 20);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Date Uploaded:`, 10, yOffset + 30);
            pdf.setFont('helvetica', 'normal');
            pdf.text(` ${new Date(selectedUpload.dateUploaded).toLocaleString()}`, 45, yOffset + 30);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Prediction:`, 10, yOffset + 40);
            pdf.setFont('helvetica', 'normal');
            const predictionText = selectedUpload.prediction.confidences.length > 0 ? "Fracture detected" : "No fracture detected";
            pdf.text(` ${predictionText}`, 45, yOffset + 40);

            pdf.save(`upload_details_${selectedUpload.patientName}.pdf`);
        });
    };

    const sendEmail = () => {
        if (!imageLoaded) return;

        const input = document.getElementById('pdf-content');
        html2canvas(input, {
            useCORS: true,
            scale: 2,
            backgroundColor: '#ffffff',
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'PNG', 10, 0, 190, 160);

            const yOffset = 190;
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Patient Name:`, 10, yOffset);
            pdf.setFont('helvetica', 'normal');
            pdf.text(` ${selectedUpload.patientName}`, 45, yOffset);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Description:`, 10, yOffset + 10);
            pdf.setFont('helvetica', 'normal');
            pdf.text(` ${selectedUpload.description}`, 45, yOffset + 10);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Body Part:`, 10, yOffset + 20);
            pdf.setFont('helvetica', 'normal');
            pdf.text(` ${selectedUpload.bodyPart}`, 45, yOffset + 20);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Date Uploaded:`, 10, yOffset + 30);
            pdf.setFont('helvetica', 'normal');
            pdf.text(` ${new Date(selectedUpload.dateUploaded).toLocaleString()}`, 45, yOffset + 30);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Prediction:`, 10, yOffset + 40);
            pdf.setFont('helvetica', 'normal');
            const predictionText = selectedUpload.prediction.confidences.length > 0 ? "Fracture detected" : "No fracture detected";
            pdf.text(` ${predictionText}`, 45, yOffset + 40);

            const pdfBlob = pdf.output('blob');

            const formData = new FormData();
            formData.append('pdf', pdfBlob, `upload_details_${selectedUpload.patientName}.pdf`);
            formData.append('patientName', selectedUpload.patientName);

            fetch('http://localhost:8000/uploads/send-email', {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    alert('Email sent successfully');
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Error sending email');
                });
        });
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
                <p><strong>Patient Name:</strong> {selectedUpload.patientName}</p>
                <p><strong>Description:</strong> {selectedUpload.description}</p>
                <p><strong>Body Part:</strong> {selectedUpload.bodyPart}</p>
                <p><strong>Date Uploaded:</strong> {new Date(selectedUpload.dateUploaded).toLocaleString()}</p>
                <p><strong>Prediction:</strong> {selectedUpload.prediction.confidences.length > 0 ? "Fracture detected" : "No fracture detected"}</p>
                <img 
                    src={`http://localhost:8000${selectedUpload.processedImgUrl}`} 
                    alt="Processed Upload" 
                    onLoad={handleImageLoad} 
                    crossOrigin="anonymous"
                    style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto', marginTop:'15px' }}
                />
            </div>
            <img 
                src={downloadIcon} 
                alt="Download as PDF" 
                onClick={downloadPDF} 
                style={{margin: '0 auto', cursor: 'pointer', width: '60px', marginTop: '30px' }}
            />
            <img 
                src={sendEmailIcon}
                alt="Send as Email" 
                onClick={sendEmail}
                style={{margin: '0 auto', cursor: 'pointer', width: '60px', marginTop: '30px' }}
            />
        </div>
    );
};

export default UploadDetails;

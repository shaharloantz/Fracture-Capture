import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import downloadIcon from '../../assets/images/download-file-icon.png';  // Adjust the path based on your file structure

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
            pdf.addImage(imgData, 'PNG', 10, 20, 190, 160);

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
            pdf.text(` ${selectedUpload.prediction ? `${selectedUpload.prediction}%` : 'N/A'}`, 45, yOffset + 40);

            pdf.save(`upload_details_${selectedUpload.patientName}.pdf`);
        });
    };

    return (
        <div className="upload-details">
            <button onClick={handleBackClick}>Back</button>
            <h2>Upload Details</h2>
            <div id="pdf-content">
                <p><strong>Patient Name:</strong> {selectedUpload.patientName}</p>
                <p><strong>Description:</strong> {selectedUpload.description}</p>
                <p><strong>Body Part:</strong> {selectedUpload.bodyPart}</p>
                <p><strong>Date Uploaded:</strong> {new Date(selectedUpload.dateUploaded).toLocaleString()}</p>
                <p><strong>Prediction:</strong> {selectedUpload.prediction ? `${selectedUpload.prediction}%` : 'N/A'}</p>
                <img 
                    src={`http://localhost:8000${selectedUpload.processedImgUrl}`} 
                    alt="Processed Upload" 
                    onLoad={handleImageLoad} 
                    crossOrigin="anonymous"
                    style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}
                />
            </div>
            <img 
                src={downloadIcon} 
                alt="Download as PDF" 
                onClick={downloadPDF} 
                style={{margin: '0 auto', cursor: 'pointer', width: '60px', marginTop: '30px' }}
            />
        </div>
    );
};

export default UploadDetails;

import React from 'react';

const UploadDetails = ({ selectedUpload, handleBackClick }) => (
    <div className="upload-details">
        <button onClick={handleBackClick}>Back</button>
        <h2>Upload Details</h2>
        <p><strong>Patient Name:</strong> {selectedUpload.patientName}</p>
        <p><strong>Description:</strong> {selectedUpload.description}</p>
        <p><strong>Body Part:</strong> {selectedUpload.bodyPart}</p>
        <p><strong>Date Uploaded:</strong> {new Date(selectedUpload.dateUploaded).toLocaleString()}</p>
        <p><strong>Prediction:</strong> {selectedUpload.prediction ? `${selectedUpload.prediction}%` : 'N/A'}</p>
        <img src={`http://localhost:8000${selectedUpload.processedImgUrl}`} alt="Upload" />
    </div>
);

export default UploadDetails;

import React from 'react';

const PatientUploads = ({ patientUploads, handleUploadClick, handleDeleteUploadClick, formatDate, handleBackClick }) => (
    <div className="patient-uploads">
        <button className="back-button" onClick={handleBackClick}>Back to Patients</button>
        <h2>Uploads for Patient</h2>
        <div className="upload-folders">
            {patientUploads.length > 0 ? patientUploads.map(upload => (
                <div key={upload._id} className="upload-folder">
                    <div onClick={() => handleUploadClick(upload)}>
                        <p><strong>Date Uploaded:</strong> {formatDate(upload.dateUploaded)}</p>
                        <p><strong>Body Part:</strong> {upload.bodyPart}</p>
                    </div>
                    <img 
                        src="src/assets/images/bin.png" 
                        alt="Delete" 
                        className="delete-icon" 
                        onClick={(e) => handleDeleteUploadClick(upload._id, e)}
                    />
                </div>
            )) : (
                <p>No uploads found for this patient.</p>
            )}
        </div>
    </div>
);

export default PatientUploads;

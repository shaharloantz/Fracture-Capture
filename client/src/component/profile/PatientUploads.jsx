import React from 'react';

const PatientUploads = ({ patientUploads, handleUploadClick, handleDeleteUploadClick, formatDate, handleBackClick }) => (
    <>
        <img 
            src="/src/assets/images/undo.png" 
            alt="Back to Patients" 
            className="back-button-icon" 
            onClick={handleBackClick} 
        />
        <div className="upload-folders">
            {patientUploads.length > 0 ? patientUploads.map(upload => (
                <div key={upload._id} className="upload-folder">
                    <img src="/src/assets/images/folderNEW.png" alt="Upload Folder" className="folder-icon" onClick={() => handleUploadClick(upload)} />
                    <div className="upload-info">
                        <p><strong>Date Uploaded:</strong> {formatDate(upload.dateUploaded)}</p>
                        <p><strong>Body Part:</strong> {upload.bodyPart}</p>
                    </div>
                    <div className="icon-container">
                        <img 
                            src="src/assets/images/bin.png" 
                            alt="Delete" 
                            className="delete-icon" 
                            onClick={(e) => handleDeleteUploadClick(upload._id, e)}
                        />
                    </div>
                </div>
            )) : (
                <p>No uploads found for this patient.</p>
            )}
        </div>
    </>
);

export default PatientUploads;

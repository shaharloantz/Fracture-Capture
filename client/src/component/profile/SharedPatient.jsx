import React from 'react';

const SharedPatient = ({ sharedPatients, handleUploadClick, handleDeleteUploadClick, formatDate }) => (
    <div className="shared-patient-uploads">
        {sharedPatients.length > 0 ? sharedPatients.map(patient => (
            <div key={patient._id} className="shared-patient-folder">
                <div className="folder-info">
                    <img 
                        src="/src/assets/images/folderNEW.png" 
                        alt="Shared Patient Folder" 
                        className="folder-icon"
                        onClick={() => handleUploadClick(patient.uploads[0])} // Handle folder click to view patient uploads
                    />
                    <p><strong>Patient Name:</strong> {patient.name}</p>
                </div>
                <div className="uploads-list">
                    {patient.uploads.map(upload => (
                        <div key={upload._id} className="upload-item" onClick={() => handleUploadClick(upload)}>
                            <p><strong>Date Uploaded:</strong> {formatDate(upload.dateUploaded)}</p>
                            <p><strong>Body Part:</strong> {upload.bodyPart}</p>
                        </div>
                    ))}
                </div>
            </div>
        )) : (
            <p>No shared patients found.</p>
        )}
    </div>
);

export default SharedPatient;

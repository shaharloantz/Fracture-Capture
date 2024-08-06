import React from 'react';

const GroupedSharedPatientUploads = ({ sharedUploads, handleUploadClick, handleDeleteUploadClick, formatDate }) => {
    const groupedUploads = sharedUploads.reduce((groups, upload) => {
        const { patientName, patient } = upload;
        if (!groups[patient]) {
            groups[patient] = { patientName, uploads: [] };
        }
        groups[patient].uploads.push(upload);
        return groups;
    }, {});

    return (
        <div className="shared-patient-uploads">
            <h2 className="sharedUploadsHeader">Shared Uploads</h2>
            {Object.keys(groupedUploads).length > 0 ? (
                Object.keys(groupedUploads).map(patientId => (
                    <div key={patientId} className="shared-patient-folder">
                        <div className="folder-info">
                            <img src="/src/assets/images/folder-icon.png" alt="Shared Folder" className="folder-icon" />
                            <p><strong>Patient Name:</strong> {groupedUploads[patientId].patientName}</p>
                        </div>
                        <div className="uploads-list">
                            {groupedUploads[patientId].uploads.map(upload => (
                                <div key={upload._id} className="upload-item">
                                    <div className="upload-info" onClick={() => handleUploadClick(upload)}>
                                        <p><strong>Date Uploaded:</strong> {formatDate(upload.dateUploaded)}</p>
                                        <p><strong>Body Part:</strong> {upload.bodyPart}</p>
                                    </div>
                                    <div className="icon-container">
                                        <img 
                                            src="/src/assets/images/bin.png" 
                                            alt="Delete" 
                                            className="delete-icon" 
                                            onClick={(e) => handleDeleteUploadClick(upload._id, e)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No shared uploads found.</p>
            )}
        </div>
    );
};

export default GroupedSharedPatientUploads;

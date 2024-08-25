import React from 'react';

const SharedUpload = ({ sharedUploads, handleUploadClick, handleDeleteUploadClick, formatDate }) => (
    <div className="shared-upload-list">
        {sharedUploads.length > 0 ? sharedUploads.map(upload => (
            <div key={upload._id} className="shared-upload-folder">
                <img 
                    src="/src/assets/images/folderNEW.png" 
                    alt="Upload Folder" 
                    className="folder-icon"
                    onClick={() => handleUploadClick(upload)}
                />
                <div className="upload-info">
                    <p><strong>Patient Name:</strong> {upload.patientName}</p>
                    <p><strong>Date Uploaded:</strong> {formatDate(upload.dateUploaded)}</p>
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
        )) : (
            <p>No individual shared uploads found.</p>
        )}
    </div>
);

export default SharedUpload;

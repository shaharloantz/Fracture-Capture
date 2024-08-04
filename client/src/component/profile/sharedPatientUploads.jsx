import React from 'react';

const SharedPatientUploads = ({ sharedUploads, handleUploadClick, handleDeleteUploadClick, formatDate }) => (
    <>
    <h2 className='sharedUploadsHeader'>Shared Uploads</h2>
        <div className="upload-folders">
            {sharedUploads.length > 0 ? sharedUploads.map(upload => (
                <div key={upload._id} className="upload-folder">
                    <img src="/src/assets/images/folder-icon.png" alt="Upload Folder" className="folder-icon" onClick={() => handleUploadClick(upload)} />
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
                <p>No shared uploads found for this patient.</p>
            )}
        </div>
    </>
);

export default SharedPatientUploads;

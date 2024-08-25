import React from 'react';

const SharedPatient = ({ patient, handlePatientClick, handleDeletePatientClick }) => (
    <div className="shared-patient-folder">
        <img 
            src="/src/assets/images/folderNEW.png" 
            alt="Patient Folder" 
            className="folder-icon" 
            onClick={handlePatientClick} 
        />
        <div className="folder-info">
            <p><strong>Patient Name:</strong> {patient.name}</p>
        </div>
        <div className="icon-container">
            <img 
                src="/src/assets/images/bin.png" 
                alt="Delete" 
                className="delete-icon" 
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering handlePatientClick
                    handleDeletePatientClick(patient._id);
                }}
                style={{     width: '18px',
                    height: '18px',
                    pointerEvents: 'auto', /* Enable click on icons */
                    marginRight: '10px', /* Adds some margin to the right of the icon */
                    cursor: 'pointer', /* Shows the cursor as a pointer */ }}
            />
        </div>
    </div>
);

export default SharedPatient;

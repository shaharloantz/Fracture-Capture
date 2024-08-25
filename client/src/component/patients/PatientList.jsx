import React from 'react';

const PatientList = ({ patients, fetchPatientUploads, handleEditPatientClick, handleDeletePatientClick, handleSelectSharePatient }) => (    <div className="patient-history">
        <div className="patient-folders">
            {patients.length > 0 ? patients.map(patient => (
                <div key={patient._id} className="patient-folder">
                    <img src="/src/assets/images/folderNEW.png" alt="Patient Folder" className="folder-icon" onClick={() => fetchPatientUploads(patient._id)} />
                    <p><strong>ID:</strong> {patient.idNumber}</p>
                    <div className="icon-container">
                    <p><strong><span className="patient-name">{patient.name}</span></strong> </p>
                        <img 
                            src="src/assets/images/edit-text.png" 
                            alt="Edit" 
                            className="edit-icon" 
                            onClick={(e) => handleEditPatientClick(patient, e)}
                        />
                        <img 
                            src="/src/assets/images/share.png" 
                            alt="Share" 
                            className="share-icon" 
                            onClick={() => handleSelectSharePatient(patient._id)}
                        />
                        <img 
                            src="src/assets/images/bin.png" 
                            alt="Delete" 
                            className="delete-icon" 
                            onClick={(e) => handleDeletePatientClick(patient._id, e)}
                        />
                        
                    </div>
                    
                </div>
            )) : (
                <p>No patients found.</p>
            )}
        </div>
    </div>
);

export default PatientList;

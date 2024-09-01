/**
 * SharedUploads Page
 * 
 * This component is responsible for managing and displaying shared patient data and uploads that have been 
 * shared with the current user. It allows the user to view, manage, and interact with patients and their 
 * respective uploads that have been shared by other users.
 * 
 * Key Functionalities:
 * 
 * 1. **Display Shared Patients and Uploads**:
 *    - The component initially displays a list of patients and uploads that have been shared with the user.
 *    - Users can click on a patient to view all uploads associated with that patient.
 *    - Users can click on an upload to view detailed information about that upload.
 * 
 * 2. **Fetch Data from Server**:
 *    - The component uses `axios` to make HTTP requests to fetch shared patients and uploads data from the server 
 *      when it mounts.
 *    - It dynamically fetches patient details and uploads for a selected patient when the user clicks on a patient.
 * 
 * 3. **Handle Interactions**:
 *    - Users can remove shared patients or uploads. When an item is removed, it is also deleted from the server.
 *    - Provides a back button to navigate between different views (shared patients list, patient uploads, and upload details).
 * 
 * 4. **Error Handling and Feedback**:
 *    - Uses `react-hot-toast` to display notifications for success and error states, providing feedback on 
 *      operations like deleting shared uploads or patients.
 *    - Logs errors to the console for debugging purposes.
 * 
 * Hooks Used:
 * - `useState`: Manages local states such as shared patients, uploads, selected patient uploads, and selected upload.
 * - `useEffect`: Fetches the initial data for shared patients and uploads when the component mounts.
 * 
 * Component Structure:
 * - Initially shows a list of shared patients and uploads.
 * - When a patient is selected, displays all uploads related to that patient.
 * - When an upload is selected, displays detailed information about the upload.
 * 
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import SharedPatient from '../component/patients-shared/SharedPatient';
import SharedUpload from '../component/patients-shared/SharedUpload';
import PatientUploads from '../component/patients/PatientUploads';
import UploadDetails from '../component/patients/UploadDetails';
import '../styles/SharedUploads.css';

export default function SharedUploads() {
    const [sharedPatients, setSharedPatients] = useState([]);
    const [sharedUploads, setSharedUploads] = useState([]);
    const [selectedPatientUploads, setSelectedPatientUploads] = useState([]);
    const [selectedUpload, setSelectedUpload] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedPatientDetails, setSelectedPatientDetails] = useState(null); // New state for patient details

    useEffect(() => {
        axios.get('/user/shared-uploads', { withCredentials: true })
            .then(response => {
                setSharedPatients(response.data.sharedPatients || []);
                setSharedUploads(response.data.sharedUploads || []);
            })
            .catch(error => console.error('Error fetching shared uploads:', error.response ? error.response.data : error.message));
    }, []);

    const handlePatientClick = (patientId) => {
        // Fetch patient details first
        axios.get(`/patients/${patientId}`, { withCredentials: true })
            .then(patientResponse => {
                setSelectedPatientDetails(patientResponse.data); // Store the complete patient details

                // Then fetch all uploads for the selected patient
                axios.get(`/uploads/${patientId}`, { withCredentials: true })
                    .then(uploadResponse => {
                        setSelectedPatientUploads(uploadResponse.data);
                        setSelectedPatient(patientId);
                    })
                    .catch(error => console.error('Error fetching patient uploads:', error.response ? error.response.data : error.message));
            })
            .catch(error => console.error('Error fetching patient details:', error.response ? error.response.data : error.message));
    };

    const handleUploadClick = (upload) => {
        setSelectedUpload(upload);
    };

    const handleDeleteUploadClick = (uploadId, e) => {
        e.stopPropagation();
        axios.delete(`/user/shared-upload/${uploadId}`, { withCredentials: true })
            .then(() => {
                setSharedUploads(uploads => uploads.filter(upload => upload._id !== uploadId));
                toast.success('Shared upload removed successfully.');
            })
            .catch(error => {
                console.error('Error removing shared upload:', error.response ? error.response.data : error.message);
                toast.error('Failed to remove shared upload.');
            });
    };

    const handleDeletePatientClick = (patientId) => {
        axios.delete(`/user/shared-patient/${patientId}`, { withCredentials: true })
            .then(() => {
                setSharedPatients(patients => patients.filter(patient => patient._id !== patientId));
                toast.success('Shared patient removed successfully.');
            })
            .catch(error => {
                console.error('Error removing shared patient:', error.response ? error.response.data : error.message);
                toast.error('Failed to remove shared patient.');
            });
    };

    const handleBackClick = () => {
        if (selectedUpload) {
            setSelectedUpload(null);
        } else if (selectedPatient) {
            setSelectedPatientUploads([]);
            setSelectedPatient(null);
            setSelectedPatientDetails(null); // Reset patient details
        }
    };

    return (
        <div className="shared-uploads-container">
            <h1>Shared Patients</h1>
            <img 
                src="/src/assets/images/undo.png" 
                alt="Back" 
                className="back-button-icon" 
                onClick={handleBackClick} 
            />
            {!selectedPatient && !selectedUpload && (
                <div className="shared-section">
                    {sharedPatients.length > 0 ? (
                        sharedPatients.map(patient => (
                            <SharedPatient
                                key={patient._id}
                                patient={patient}
                                handlePatientClick={() => handlePatientClick(patient._id)}
                                handleDeletePatientClick={handleDeletePatientClick}
                            />
                        ))
                    ) : (
                        <p>No shared patients found.</p>
                    )}
                </div>
            )}

            {selectedPatient && !selectedUpload && (
                <div className="patient-uploads-section">
                    <PatientUploads
                        patientUploads={selectedPatientUploads}
                        handleUploadClick={handleUploadClick}
                        handleDeleteUploadClick={handleDeleteUploadClick}
                        formatDate={(dateString) => new Date(dateString).toLocaleString()}
                        handleBackClick={handleBackClick}
                    />
                </div>
            )}

            {!selectedPatient && !selectedUpload && (
                <>
                    <h1>Shared Uploads</h1>
                    <div className="shared-section">
                        {sharedUploads.length > 0 ? (
                            sharedUploads.map(upload => (
                                <SharedUpload
                                    key={upload._id}
                                    upload={upload}
                                    handleUploadClick={handleUploadClick}
                                    handleDeleteUploadClick={handleDeleteUploadClick}
                                    formatDate={(dateString) => new Date(dateString).toLocaleString()}
                                />
                            ))
                        ) : (
                            <p>No shared uploads found.</p>
                        )}
                    </div>
                </>
            )}

            {selectedUpload && (
                <UploadDetails
                    selectedUpload={selectedUpload}
                    handleBackClick={handleBackClick}
                    patient={selectedPatientDetails} // Pass full patient details
                />
            )}
        </div>
    );
}

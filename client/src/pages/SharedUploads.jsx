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

            {/* Conditionally render shared uploads section */}
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

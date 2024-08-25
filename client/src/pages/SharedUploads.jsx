import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import SharedPatient from '../component/profile/SharedPatient';
import SharedUpload from '../component/profile/SharedUpload';
import PatientUploads from '../component/profile/PatientUploads';
import UploadDetails from '../component/profile/UploadDetails';
import '../styles/SharedUploads.css';

export default function SharedUploads() {
    const [sharedPatients, setSharedPatients] = useState([]);
    const [sharedUploads, setSharedUploads] = useState([]);
    const [selectedPatientUploads, setSelectedPatientUploads] = useState([]);
    const [selectedUpload, setSelectedUpload] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        axios.get('/user/shared-uploads', { withCredentials: true })
            .then(response => {
                setSharedPatients(response.data.sharedPatients || []);
                setSharedUploads(response.data.sharedUploads || []);
            })
            .catch(error => console.error('Error fetching shared uploads:', error.response ? error.response.data : error.message));
    }, []);

    const handlePatientClick = (patientId) => {
        // Fetch all uploads for the selected patient
        axios.get(`/uploads/${patientId}`, { withCredentials: true })
            .then(response => {
                setSelectedPatientUploads(response.data);
                setSelectedPatient(patientId);
            })
            .catch(error => console.error('Error fetching patient uploads:', error.response ? error.response.data : error.message));
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
        }
    };

    return (
        <div className="shared-uploads-container">
            <h1>Shared Uploads</h1>
            
            {/* Display shared patients */}
            {!selectedPatient && !selectedUpload && (
                <div className="shared-section">
                    <h2>Shared Patients</h2>
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

            {/* Display uploads for the selected patient */}
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

            {/* Display shared uploads */}
            {!selectedPatient && !selectedUpload && (
                <div className="shared-section">
                    <h2>Shared Uploads</h2>
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
            )}

            {/* Display upload details */}
            {selectedUpload && (
                <UploadDetails
                    selectedUpload={selectedUpload}
                    handleBackClick={handleBackClick}
                    patient={selectedUpload.patient} // Assuming upload has a patient field populated
                />
            )}
        </div>
    );
}

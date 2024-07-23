import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css'; // Import the CSS file

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientUploads, setPatientUploads] = useState([]);
    const [selectedUpload, setSelectedUpload] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/user/profile', { withCredentials: true })
            .then(response => {
                setProfile(response.data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error.response ? error.response.data : error.message);
                navigate('/login');
            });
    }, [navigate]);

    const fetchPatientUploads = (patientId) => {
        axios.get(`/uploads/${patientId}`, { withCredentials: true })
            .then(response => {
                setPatientUploads(response.data);
                setSelectedPatient(patientId);
                setSelectedUpload(null); // Reset selected upload
            })
            .catch(error => {
                console.error('Error fetching patient uploads:', error.response ? error.response.data : error.message);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const handleUploadClick = (upload) => {
        setSelectedUpload(upload);
    };

    const handleBackClick = () => {
        if (selectedUpload) {
            setSelectedUpload(null);
        } else if (selectedPatient) {
            setSelectedPatient(null);
            setPatientUploads([]);
        }
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="user-details">
                <p><strong>Hi, {profile.name}</strong></p>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
            </div>
            {selectedUpload ? (
                <div className="upload-details">
                    <button onClick={handleBackClick}>Back</button>
                    <h2>Upload Details</h2>
                    <p><strong>Patient Name:</strong> {selectedUpload.patientName}</p>
                    <p><strong>Description:</strong> {selectedUpload.description}</p>
                    <p><strong>Body Part:</strong> {selectedUpload.bodyPart}</p>
                    <p><strong>Date Uploaded:</strong> {new Date(selectedUpload.dateUploaded).toLocaleString()}</p>
                    <p><strong>Prediction:</strong> {selectedUpload.prediction ? `${selectedUpload.prediction}%` : 'N/A'}</p>
                    <img src={`http://localhost:8000${selectedUpload.imgUrl}`} alt="Upload" />
                </div>
            ) : selectedPatient ? (
                <div className="patient-uploads">
                    <button onClick={handleBackClick}>Back to Patients</button>
                    <h2>Uploads for Patient</h2>
                    <div className="upload-folders">
                        {patientUploads.length > 0 ? (
                            patientUploads.map(upload => (
                                <div key={upload._id} className="upload-folder" onClick={() => handleUploadClick(upload)}>
                                    <p><strong>Date Uploaded:</strong> {formatDate(upload.dateUploaded)}</p>
                                    <p><strong>Body Part:</strong> {upload.bodyPart}</p>
                                </div>
                            ))
                        ) : (
                            <p>No uploads found for this patient.</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="patient-history">
                    <h2>History</h2>
                    <div className="patient-folders">
                        {profile.patients && profile.patients.length > 0 ? (
                            profile.patients.map(patient => (
                                <div key={patient._id} className="patient-folder" onClick={() => fetchPatientUploads(patient._id)}>
                                    <p><strong>Patient Name:</strong> {patient.name}</p>
                                    <p><strong>ID:</strong> {patient.idNumber}</p>
                                </div>
                            ))
                        ) : (
                            <p>No patients found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

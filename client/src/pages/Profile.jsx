import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css'; // Import the CSS file

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientUploads, setPatientUploads] = useState([]);
    const [selectedUpload, setSelectedUpload] = useState(null);
    const [editingPatient, setEditingPatient] = useState(null); // New state for editing patient
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

    const handleDeleteUploadClick = (uploadId, e) => {
        e.stopPropagation(); // Prevent the click event from propagating
        const confirmed = window.confirm("Are you sure you want to delete this upload?");
        if (confirmed) {
            axios.delete(`/uploads/${uploadId}`, { withCredentials: true })
                .then(response => {
                    setPatientUploads(uploads => uploads.filter(upload => upload._id !== uploadId));
                })
                .catch(error => {
                    console.error('Error deleting upload:', error.response ? error.response.data : error.message);
                });
        }
    };

    const handleDeletePatientClick = (patientId, e) => {
        e.stopPropagation(); // Prevent the click event from propagating
        const confirmed = window.confirm("Are you sure you want to delete this patient and all of its uploads?");
        if (confirmed) {
            axios.delete(`/patients/${patientId}`, { withCredentials: true })
                .then(response => {
                    setProfile(profile => ({
                        ...profile,
                        patients: profile.patients.filter(patient => patient._id !== patientId)
                    }));
                    if (selectedPatient === patientId) {
                        setSelectedPatient(null);
                        setPatientUploads([]);
                    }
                })
                .catch(error => {
                    console.error('Error deleting patient:', error.response ? error.response.data : error.message);
                });
        }
    };

    const handleEditPatientClick = (patient, e) => {
        e.stopPropagation(); // Prevent the click event from propagating
        setEditingPatient(patient);
    };

    const handleEditPatientChange = (e) => {
        const { name, value } = e.target;
        setEditingPatient({ ...editingPatient, [name]: value });
    };

    const handleEditPatientSubmit = (e) => {
        e.preventDefault();
        axios.put(`/patients/${editingPatient._id}`, editingPatient, { withCredentials: true })
            .then(response => {
                setProfile(profile => ({
                    ...profile,
                    patients: profile.patients.map(patient => 
                        patient._id === editingPatient._id ? editingPatient : patient
                    )
                }));
                setEditingPatient(null);
            })
            .catch(error => {
                console.error('Error updating patient:', error.response ? error.response.data : error.message);
            });
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
            {editingPatient ? (
                <form className="patient-form" onSubmit={handleEditPatientSubmit}>
                    <h2>Edit Patient</h2>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={editingPatient.name}
                            onChange={handleEditPatientChange}
                            required
                        />
                    </label>
                    <label>
                        Age:
                        <input
                            type="number"
                            name="age"
                            value={editingPatient.age}
                            onChange={handleEditPatientChange}
                            min="0"
                            required
                        />
                    </label>
                    <label>
                        Gender:
                        <select
                            name="gender"
                            value={editingPatient.gender}
                            onChange={handleEditPatientChange}
                            required
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </label>
                    <label>
                        ID Number:
                        <input
                            type="text"
                            name="idNumber"
                            value={editingPatient.idNumber}
                            onChange={handleEditPatientChange}
                            required
                        />
                    </label>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditingPatient(null)}>Cancel</button>
                </form>
            ) : selectedUpload ? (
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
                                <div key={upload._id} className="upload-folder">
                                    <div onClick={() => handleUploadClick(upload)}>
                                        <p><strong>Date Uploaded:</strong> {formatDate(upload.dateUploaded)}</p>
                                        <p><strong>Body Part:</strong> {upload.bodyPart}</p>
                                    </div>
                                    <img 
                                        src="src/assets/images/bin.png" 
                                        alt="Delete" 
                                        className="delete-icon" 
                                        onClick={(e) => handleDeleteUploadClick(upload._id, e)}
                                    />
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
                                <div key={patient._id} className="patient-folder">
                                    <div onClick={() => fetchPatientUploads(patient._id)}>
                                        <p><strong>Patient Name:</strong> {patient.name}</p>
                                        <p><strong>ID:</strong> {patient.idNumber}</p>
                                    </div>
                                    <img 
                                        src="src/assets/images/edit-text.png" 
                                        alt="Edit" 
                                        className="edit-icon" 
                                        onClick={(e) => handleEditPatientClick(patient, e)}
                                    />
                                    <img 
                                        src="src/assets/images/bin.png" 
                                        alt="Delete" 
                                        className="delete-icon" 
                                        onClick={(e) => handleDeletePatientClick(patient._id, e)}
                                    />
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserDetails from '../component/profile/UserDetails';
import PatientList from '../component/profile/PatientList';
import PatientUploads from '../component/profile/PatientUploads';
import UploadDetails from '../component/profile/UploadDetails';
import ChangePasswordForm from '../component/profile/ChangePasswordForm';
import EditPatientForm from '../component/profile/EditPatientForm';
import SharedPatientUploads from '../component/profile/sharedPatientUploads';
import '../styles/Profile.css';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientUploads, setPatientUploads] = useState([]);
    const [sharedUploads, setSharedUploads] = useState([]);
    const [selectedUpload, setSelectedUpload] = useState(null);
    const [editingPatient, setEditingPatient] = useState(null);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/user/profile', { withCredentials: true })
            .then(response => setProfile(response.data))
            .catch(error => {
                console.error('Error fetching profile:', error.response ? error.response.data : error.message);
                navigate('/login');
            });
    }, [navigate]);

    useEffect(() => {
        axios.get('/user/shared-uploads', { withCredentials: true })
            .then(response => setSharedUploads(response.data))
            .catch(error => console.error('Error fetching shared uploads:', error.response ? error.response.data : error.message));
    }, []);

    const fetchPatientUploads = (patientId) => {
        axios.get(`/uploads/${patientId}`, { withCredentials: true })
            .then(response => {
                setPatientUploads(response.data);
                setSelectedPatient(patientId);
                setSelectedUpload(null);
            })
            .catch(error => {
                console.error('Error fetching patient uploads:', error.response ? error.response.data : error.message);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const handleUploadClick = (upload) => setSelectedUpload(upload);
    const handleBackClick = () => {
        if (selectedUpload) {
            setSelectedUpload(null);
        } else if (selectedPatient) {
            setSelectedPatient(null);
            setPatientUploads([]);
        }
    };

    const handleDeleteUploadClick = (uploadId, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this upload?")) {
            axios.delete(`/uploads/${uploadId}`, { withCredentials: true })
                .then(response => {
                    // Update patientUploads if it's a patient upload
                    setPatientUploads(uploads => uploads.filter(upload => upload._id !== uploadId));
                    // Update sharedUploads if it's a shared upload
                    setSharedUploads(uploads => uploads.filter(upload => upload._id !== uploadId));
                })
                .catch(error => {
                    console.error('Error deleting upload:', error.response ? error.response.data : error.message);
                });
        }
    };

    const handleDeletePatientClick = (patientId, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this patient and all of its uploads?")) {
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
        e.stopPropagation();
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

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New password and confirm password do not match");
            return;
        }
        axios.post('/user/change-password', passwordData, { withCredentials: true })
            .then(response => {
                alert(response.data.message);
                setChangingPassword(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            })
            .catch(error => {
                console.error('Error changing password:', error.response ? error.response.data : error.message);
                alert('Error changing password');
            });
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <UserDetails profile={profile} toggleChangingPassword={() => setChangingPassword(!changingPassword)} />
            {changingPassword && (
                <ChangePasswordForm
                    passwordData={passwordData}
                    handlePasswordChange={handlePasswordChange}
                    handlePasswordSubmit={handlePasswordSubmit}
                    setChangingPassword={setChangingPassword}
                />
            )}
            {editingPatient ? (
                <EditPatientForm
                    editingPatient={editingPatient}
                    handleEditPatientChange={handleEditPatientChange}
                    handleEditPatientSubmit={handleEditPatientSubmit}
                    setEditingPatient={setEditingPatient}
                />
            ) : selectedUpload ? (
                <UploadDetails 
                    selectedUpload={selectedUpload} 
                    handleBackClick={handleBackClick} 
                    profileEmail={profile.email}
                />
            ) : selectedPatient ? (
                <PatientUploads
                    patientUploads={patientUploads}
                    handleUploadClick={handleUploadClick}
                    handleDeleteUploadClick={handleDeleteUploadClick}
                    formatDate={formatDate}
                    handleBackClick={handleBackClick}
                />
            ) : (
                <>
                    <PatientList
                        patients={profile.patients}
                        fetchPatientUploads={fetchPatientUploads}
                        handleEditPatientClick={handleEditPatientClick}
                        handleDeletePatientClick={handleDeletePatientClick}
                    />
                    <SharedPatientUploads 
                        sharedUploads={sharedUploads}
                        handleUploadClick={handleUploadClick}
                        handleDeleteUploadClick={handleDeleteUploadClick}
                        formatDate={formatDate}
                    />
                </>
            )}
        </div>
    );
}

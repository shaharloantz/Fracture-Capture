import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast'; // Ensure Toaster is imported
import { useNavigate } from 'react-router-dom';
import '../cssFiles/Dashboard.css'; // Import the CSS file

const Dashboard = () => {
    const initialPatientState = { name: '', age: '', gender: '', idNumber: '' };
    const initialUploadState = { patientId: '', description: '', bodyPart: '', image: null };

    const [profile, setProfile] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newPatient, setNewPatient] = useState(initialPatientState);
    const [uploadData, setUploadData] = useState(initialUploadState);
    const [patients, setPatients] = useState([]);
    const [isAddingToExisting, setIsAddingToExisting] = useState(false);
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

    const handleAddPatientClick = () => {
        if (profile && profile.numberOfPatients === 0) {
            toast.error("You don't have any patients yet!");
        } else {
            setIsAddingToExisting(true);
            fetchPatients();
            setUploadData(initialUploadState); // Reset form state
            setShowForm(true);
        }
    };

    const fetchPatients = () => {
        axios.get('/user/profile', { withCredentials: true })
            .then(response => {
                setPatients(response.data.patients);
            })
            .catch(error => {
                console.error('Error fetching patients:', error.response ? error.response.data : error.message);
                toast.error('Error fetching patients. Please try again.');
            });
    };

    const handleCreatePatientClick = () => {
        setNewPatient(initialPatientState); // Reset form state
        setIsAddingToExisting(false);
        setShowForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (isAddingToExisting) {
            setUploadData({ ...uploadData, [name]: value });
        } else {
            setNewPatient({ ...newPatient, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUploadData({ ...uploadData, image: file });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isAddingToExisting) {
            const formData = new FormData();
            formData.append('patientId', uploadData.patientId);
            formData.append('description', uploadData.description);
            formData.append('bodyPart', uploadData.bodyPart);
            formData.append('image', uploadData.image);

            axios.post('/uploads', formData, { withCredentials: true })
                .then(response => {
                    toast.success("Upload successful!");
                    setShowForm(false);
                })
                .catch(error => {
                    console.error('Error uploading:', error.response ? error.response.data : error.message);
                    toast.error(error.response?.data?.error || 'Error uploading. Please try again.');
                });
        } else {
            axios.post('/patients', newPatient, { withCredentials: true })
                .then(response => {
                    toast.success("Patient created successfully!");
                    setProfile({ ...profile, numberOfPatients: profile.numberOfPatients + 1 });
                    setShowForm(false);
                })
                .catch(error => {
                    console.error('Error creating patient:', error.response ? error.response.data : error.message);
                    toast.error(error.response?.data?.error || 'Error creating patient. Please try again.');
                });
        }
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <Toaster /> {/* Ensure Toaster is included */}
            {!showForm ? (
                <>
                    <div className="box" onClick={handleCreatePatientClick}>Create a new Patient</div>
                    <div className="box" onClick={handleAddPatientClick}>Add to an existing Patient</div>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="patient-form">
                    {isAddingToExisting ? (
                        <>
                            <h2>Add to an Existing Patient</h2>
                            <label>
                                Patient:
                                <select name="patientId" value={uploadData.patientId} onChange={handleInputChange} required>
                                    <option value="">Select a patient</option>
                                    {patients.map(patient => (
                                        <option key={patient._id} value={patient._id}>
                                            {patient.name} - {patient.idNumber}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Description:
                                <textarea name="description" value={uploadData.description} onChange={handleInputChange} required />
                            </label>
                            <label>
                                Body Part:
                                <input type="text" name="bodyPart" value={uploadData.bodyPart} onChange={handleInputChange} required />
                            </label>
                            <label>
                                Upload Image:
                                <input type="file" name="image" onChange={handleFileChange} required />
                            </label>
                        </>
                    ) : (
                        <>
                            <h2>Create a New Patient</h2>
                            <label>
                                Name:
                                <input type="text" name="name" value={newPatient.name} onChange={handleInputChange} required />
                            </label>
                            <label>
                                Age:
                                <input type="number" name="age" value={newPatient.age} onChange={handleInputChange} required />
                            </label>
                            <label>
                                Gender:
                                <select name="gender" value={newPatient.gender} onChange={handleInputChange} required>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </label>
                            <label>
                                ID Number:
                                <input type="text" name="idNumber" value={newPatient.idNumber} onChange={handleInputChange} required />
                            </label>
                        </>
                    )}
                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast'; // Ensure Toaster is imported
import { useNavigate } from 'react-router-dom';
import '../cssFiles/Dashboard.css'; // Import the CSS file

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '', idNumber: '' });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/user/profile', { withCredentials: true })
            .then(response => {
                console.log('Profile data fetched:', response.data); // Add logging
                setProfile(response.data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error.response ? error.response.data : error.message);
                navigate('/login');
            });
    }, [navigate]);

    const handleAddPatientClick = () => {
        console.log('Profile on Add Patient Click:', profile); // Add logging
        if (profile && profile.numberOfPatients === 0) {
            toast.error("You don't have any patients yet!");
        } else {
            toast.success("Navigating to existing patients page"); // Temporary logging
        }
    };

    const handleCreatePatientClick = () => {
        setShowForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatient({ ...newPatient, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default Dashboard;

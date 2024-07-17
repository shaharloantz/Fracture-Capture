import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../cssFiles/Profile.css'; // Import the CSS file

export default function Profile() {
    const [profile, setProfile] = useState(null);
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

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="user-details">
                <h1><strong>Hi, {profile.name}</strong></h1>
                <p><strong>Email:</strong> {profile.email}</p>
            </div>
            <div className="patient-history">
                <h2>History</h2>
                <div className="patient-folders">
                    {profile.patients && profile.patients.length > 0 ? (
                        profile.patients.map(patient => (
                            <div key={patient.idNumber} className="patient-folder">
                                <p><strong>Patient:</strong> {patient.name}</p>
                                <p><strong>ID:</strong> {patient.idNumber}</p>
                            </div>
                        ))
                    ) : (
                        <p>No patients found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../cssFiles/Dashboard.css'; // Import the CSS file

const Dashboard = () => {
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
        <div className="dashboard-container">
            <div className="box">Create a new Patient</div>
            <div className="box">Add to an existing Patient</div>
        </div>
    );
}

export default Dashboard;

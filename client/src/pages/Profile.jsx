import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/user/profile', { withCredentials: true })
            .then(response => {
                setProfile(response.data);
                toast.success('Profile loaded successfully!');
            })
            .catch(error => {
                console.error('Error fetching profile:', error.response ? error.response.data : error.message);
                toast.error('Error fetching profile. Please log in.');
                navigate('/login');
            });
    }, [navigate]);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <p><strong>{profile.message}</strong> </p>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
        </div>
    );
}

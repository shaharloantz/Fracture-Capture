// src/pages/ProfileDetails.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import UserDetails from '../component/profile/UserDetails';
import ChangePasswordForm from '../component/profile/ChangePasswordForm';
import '../styles/MyProfile.css';

const MyProfile = () => {
    const [profile, setProfile] = useState(null);
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

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }
        axios.post('/user/change-password', passwordData, { withCredentials: true })
            .then(response => {
                toast.success(response.data.message);
                setChangingPassword(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            })
            .catch(error => {
                console.error('Error changing password:', error.response ? error.response.data : error.message);
                toast.error('Error changing password');
            });
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="my-profile-container">
            <UserDetails profile={profile} toggleChangingPassword={() => setChangingPassword(!changingPassword)} />
            {changingPassword && (
                <ChangePasswordForm
                    passwordData={passwordData}
                    handlePasswordChange={handlePasswordChange}
                    handlePasswordSubmit={handlePasswordSubmit}
                    setChangingPassword={setChangingPassword}
                />
            )}
        </div>
    );
};

export default MyProfile;

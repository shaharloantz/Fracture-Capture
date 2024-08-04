import React from 'react';

const UserDetails = ({ profile, toggleChangingPassword }) => (
    <div className="user-details">
        <p><strong>Hi, {profile.name}</strong></p>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <button onClick={toggleChangingPassword}>Change Password</button>
    </div>
);

export default UserDetails;

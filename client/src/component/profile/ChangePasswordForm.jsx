import React from 'react';

const ChangePasswordForm = ({ passwordData, handlePasswordChange, handlePasswordSubmit, setChangingPassword }) => (
    <form className="password-form" onSubmit={handlePasswordSubmit}>
        <label>
            Current Password:
            <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
            />
        </label>
        <label>
            New Password:
            <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
            />
        </label>
        <label>
            Confirm New Password:
            <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
            />
        </label>
        <div style={{textAlign:'center',justifyContent:'space-between'}}>
        <button type="submit">Submit</button>
        <button type="button" onClick={() => setChangingPassword(false)}>Cancel</button>
        </div>
    </form>
);

export default ChangePasswordForm;

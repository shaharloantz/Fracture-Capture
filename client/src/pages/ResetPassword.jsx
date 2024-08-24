import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        resetToken: '',
        newPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('/reset-password', data);
            setLoading(false);
            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                toast.success('Password reset successfully!');
                navigate('/login');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error resetting password:', error.response ? error.response.data : error.message);
            toast.error('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center">
                <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">Reset Password</h2>
                    <div>
                        <label htmlFor="resetToken" className="block text-gray-300">Reset Token</label>
                        <input 
                            type="text" 
                            name="resetToken"
                            placeholder="Enter the token you received" 
                            value={data.resetToken} 
                            onChange={handleChange} 
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-300"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-gray-300">New Password</label>
                        <input 
                            type="password" 
                            name="newPassword"
                            placeholder="Enter new password" 
                            value={data.newPassword} 
                            onChange={handleChange} 
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-300"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="flex items-center justify-center w-full bg-blue-500 p-2 rounded-md hover:bg-blue-600 text-white transition duration-200">
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

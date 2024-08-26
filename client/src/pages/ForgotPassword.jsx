import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('/forgot-password', { email });
            setLoading(false);
            toast.success('Password reset email sent!');
            navigate('/reset-password');
        } catch (error) {
            setLoading(false);
            console.error('Error sending password reset email:', error.response ? error.response.data : error.message);
            console.log('Full error object:', error);
            toast.error('Failed to send password reset email. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center">
                <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">Forgot Password</h2>
                    <div>
                        <label htmlFor="email" className="block text-gray-300">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Enter your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-300"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="flex items-center justify-center w-full bg-blue-500 p-2 rounded-md hover:bg-blue-600 text-white transition duration-200">
                        {loading ? 'Sending...' : 'Send Reset Email'}
                    </button>
                </form>
            </div>
        </div>
    );
}

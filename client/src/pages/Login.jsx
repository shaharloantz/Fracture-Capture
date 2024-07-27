import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from "react-router-dom";
import '../styles/toasterCSS.css';
import '../styles/Login.css'; // If you have specific styles for login page

export default function Login({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('/login', data);
            setLoading(false);
            console.log('Login successful:', response.data);
            toast.success('Login successful!');
            setIsAuthenticated(true);  // Update the authentication state
            navigate('/');
        } catch (error) {
            setLoading(false);
            console.error('Login error:', error.response ? error.response.data : error.message);
            toast.error(error.response ? error.response.data.error : 'Login failed. Please try again.');
        }
    };

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center">
                <img src="src/assets/images/user.png" alt="Above" className="mb-4 w-32 h-32 mt-[-15rem]" /> {/* Adjust the path and size as needed */}
                <form onSubmit={loginUser} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">Login</h2>
                    <div>
                        <label htmlFor="email" className="block text-gray-300">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Enter Email.." 
                            value={data.email} 
                            onChange={handleChange} 
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-300"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-300">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Enter Password.." 
                            value={data.password} 
                            onChange={handleChange} 
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-300"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="flex items-center justify-center w-full bg-blue-500 p-2 rounded-md hover:bg-blue-600 transition duration-200">
                        <img src="src/assets/images/login-icon.png" alt="Login" className="h-6" /> {/* Adjust the path and size as needed */}
                    </button>
                    <p className="text-white text-center mt-4">
                        Not a member yet? <Link to="/register" className="text-blue-500 hover:underline">Click to register</Link>.
                    </p>
                    <p className="text-white text-center mt-4">
                        Forgot your password? <Link to="/forgot-password" className="text-blue-500 hover:underline">Click to reset</Link>.
                    </p>
                </form>
            </div>
        </div>
    );
}

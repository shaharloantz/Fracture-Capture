import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../cssFiles/toasterCSS.css';
import './Register.css';


export default function Register() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const registerUser = async (e) => {
        e.preventDefault();
        const { name, email, password } = data;

        // Basic client-side validation
        if (!name || !email || !password) {
            toast.error("All fields are required!");
            return;
        }
        if (password.length < 6) {
            toast.error("Password should be at least 6 characters!");
            return;
        }

        try {
            setLoading(true);
            const { data: responseData } = await axios.post('/register', { name, email, password });
            setLoading(false);

            if (responseData.error) {
                toast.error(responseData.error);
            } else {
                setData({ name: '', email: '', password: '' });
                toast.success('Registration Successful!');
                navigate('/login');
            }
        } catch (error) {
            setLoading(false);
            console.log('Error at register page: ', error);
            toast.error('Registration failed. Please try again.');
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
            <img src="src/assets/images/user.png" alt="Above" className="mb-4 w-32 h-32 mt-[-10rem]" /> 
                {/* Adjust the path and size as needed */}
                <form onSubmit={registerUser} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md mt-[-0rem]"> {/* Adjusted margin-top */}
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">Register</h2>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-300">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name"
                            placeholder="Enter Name.." 
                            value={data.name} 
                            onChange={handleChange} 
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-300">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            placeholder="Enter Email.." 
                            value={data.email} 
                            onChange={handleChange} 
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-300">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            placeholder="Enter Password.." 
                            value={data.password} 
                            onChange={handleChange} 
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-300"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200">
                        {loading ? 'Registering...' : 'Submit'}
                    </button>
                </form>         
            </div>
        </div>
    );
}

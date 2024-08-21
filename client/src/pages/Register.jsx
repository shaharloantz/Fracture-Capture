import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import '../styles/toasterCSS.css';
import '../styles/Register.css';

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

        // Check for at least one capital letter and one number
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (!hasUpperCase) {
            toast.error("Password should contain at least one capital letter!");
            return;
        }

        if (!hasNumber) {
            toast.error("Password should contain at least one number!");
            return;
        }

         // Email validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const emailParts = email.split('@');
        if (
            !emailRegex.test(email) ||
            emailParts.length !== 2 ||
            emailParts[1].includes('..') || // no double dots in the domain
            emailParts[1].split('.').length > 3 || // limit to a maximum of 3 parts in the domain
            emailParts[0].length > 30 || // local part length should be less than or equal to 30 characters
            emailParts[1].length > 20 // domain part length should be less than or equal to 20 characters
        ) {
            toast.error("Please enter a valid email address!");
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
            console.log('Error at register page: ', error.response ? error.response.data : error.message);
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
                <form onSubmit={registerUser} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md mt-[-0rem]">
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">Register</h2>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-300">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name"
                            placeholder="Enter Name.." 
                            value={data.name} 
                            maxLength={30}
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
                            maxLength={50}
                            onChange={handleChange} 
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-300">Password</label>
                        <div className="relative group">
                            <input 
                                type="password" 
                                id="password" 
                                name="password"
                                placeholder="Enter Password.." 
                                value={data.password} 
                                onChange={handleChange} 
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-300"
                            />
                            <span className="tooltip group-hover:opacity-100">
                                Password must be at least 6 characters, contain one capital letter, and one number.
                            </span>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200">
                        {loading ? 'Registering...' : 'Submit'}
                    </button>
                    <p className="text-white text-center mt-4">
                        Already a member? <Link to="/login" className="text-blue-500">Click to log in</Link>.
                    </p>
                </form>         
            </div>
        </div>
    );
}

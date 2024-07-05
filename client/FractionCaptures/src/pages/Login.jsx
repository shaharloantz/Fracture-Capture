import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

export default function Login() {
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
            // Redirect to the home page or dashboard
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
        <div className="login-container">
            <form onSubmit={loginUser} className="login-form">
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Enter Email.." 
                        value={data.email} 
                        onChange={handleChange} 
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Enter Password.." 
                        value={data.password} 
                        onChange={handleChange} 
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

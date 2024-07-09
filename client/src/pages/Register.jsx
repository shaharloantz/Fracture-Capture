import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../cssFiles/toasterCSS.css'; 

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

    return (
        <div className="register-container">
            <form onSubmit={registerUser} className="register-form">
                <h2>Register</h2>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        placeholder="Enter Name.." 
                        value={data.name} 
                        onChange={(e) => setData({ ...data, name: e.target.value })} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="Enter Email.." 
                        value={data.email} 
                        onChange={(e) => setData({ ...data, email: e.target.value })} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Enter Password.." 
                        value={data.password} 
                        onChange={(e) => setData({ ...data, password: e.target.value })} 
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

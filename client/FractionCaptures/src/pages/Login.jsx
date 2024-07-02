import React, { useState } from "react";
import axios from 'axios';

export default function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', data);
            console.log('Login successful:', response.data);
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
        }
    };

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <form onSubmit={loginUser}>
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    name="email"
                    placeholder="Enter Email.." 
                    value={data.email} 
                    onChange={handleChange} 
                />
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    name="password"
                    placeholder="Enter Password.." 
                    value={data.password} 
                    onChange={handleChange} 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

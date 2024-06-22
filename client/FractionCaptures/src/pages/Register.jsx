import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Register() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });
    
    const registerUser = async (e) => {
        e.preventDefault();
        const { name, email, password } = data;
        try {
            const { data: responseData } = await axios.post('/register', { name, email, password });
            if (responseData.error) {
                toast.error(responseData.error); // the error we returned from controller
            } else {
                setData({ name: '', email: '', password: '' });
                toast.success('Registration Successful!');
                navigate('/login'); // send them to login page
            }
        } catch (error) {
            console.log('error at register page ', error);
        }
    };

    return (
        <div>
            <form onSubmit={registerUser}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Enter Name.." value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter Email.." value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter Password.." value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

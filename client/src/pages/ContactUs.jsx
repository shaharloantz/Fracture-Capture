import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import '../styles/ContactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:8000/send-email', {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
                reply_to: formData.email,
            });
            console.log('Email sent successfully:', response.data);
            toast.success('Email sent successfully!');
            setFormData({
                name: '',
                email: '',
                message: '',
            });
        } catch (error) {
            console.error('Error sending email:', error.response ? error.response.data : error.message);
            toast.error(error.response ? error.response.data.error : 'Failed to send email. Please try again.');
        }
    };

    return (
        <div className="contact-us">
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Enter Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ContactUs;

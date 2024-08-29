import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const scrollingTop = () => {
        scroll.scrollToTop();
        toggleSidebar();
    };

    useEffect(() => {
        axios.get('/user/profile', { withCredentials: true })
            .then(response => {
                if (response.data.isAdmin) {
                    setIsAdmin(true);
                }
            })
            .catch(error => {
                console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
            });
    }, []);

    return (
        <>
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 flex items-center p-2 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white z-50"
            >
                <img src="/src/assets/images/navbar-icon.png" alt="Menu" className="h-7 w-7 mr-1" />
                <span>Menu</span>
            </button>
                        <div className={`fixed inset-y-0 left-0 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40 w-64`}>
                <div className="py-4 mt-16">
                    <Link to="/about" className="sidebar-link" onClick={scrollingTop}>
                        <img src="/src/assets/images/info-icon.png" alt="About" className="sidebar-icon" />
                        <span>About</span>
                    </Link>
                    <Link to="/dashboard" className="sidebar-link" onClick={toggleSidebar}>
                        <img src="/src/assets/images/dashboard-icon.png" alt="Dashboard" className="sidebar-icon" />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/patientsresults" className="sidebar-link" onClick={toggleSidebar}>
                        <img src="/src/assets/images/patients_results-icon.png" alt="Patient Results" className="sidebar-icon" />
                        <span>Patients Results</span>
                    </Link>
                    <Link to="/shareduploads" className="sidebar-link" onClick={toggleSidebar}>
                        <img src="/src/assets/images/folders.png" alt="Shared Uploads" className="sidebar-icon" />
                        <span>Shared Uploads</span>
                    </Link>
                    <Link to="/myprofile" className="sidebar-link" onClick={toggleSidebar}>
                        <img src="/src/assets/images/myprofile-icon.png" alt="My Profile" className="sidebar-icon" />
                        <span>My Profile</span>
                    </Link>
                    <Link to="/qa" className="sidebar-link" onClick={scrollingTop}>
                        <img src="/src/assets/images/qa-icon.png" alt="Q&A" className="sidebar-icon" />
                        <span>Q&A</span>
                    </Link>
                    {isAdmin && (
                        <Link to="/admin" className="sidebar-link" onClick={toggleSidebar}>
                            <img src="/src/assets/images/admin-icon.png" alt="Admin Panel" className="sidebar-icon" />
                            <span>Admin Panel</span>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}

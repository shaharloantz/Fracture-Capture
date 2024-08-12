// src/component/Sidebar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 flex items-center p-2 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white z-50"
            >
                <img src="/src/assets/images/navbar-icon.png" alt="Menu" className="h-6 w-6 mr-2" />
                <span>Menu</span>
            </button>
            <div className={`fixed inset-y-0 left-0 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40 w-64`}>
                <div className="py-4 mt-16">
                    <Link to="/about" className="block px-4 py-2 text-gray-200 hover:bg-gray-700" onClick={toggleSidebar}>
                        <img src="/src/assets/images/info-icon.png" alt="About" className="inline-block w-5 h-5 mr-2" />
                        About
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-200 hover:bg-gray-700" onClick={toggleSidebar}>
                        <img src="/src/assets/images/dashboard-icon.png" alt="Dashboard" className="inline-block w-5 h-5 mr-2" />
                        Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-gray-200 hover:bg-gray-700" onClick={toggleSidebar}>
                        <img src="/src/assets/images/results-icon.png" alt="Results" className="inline-block w-5 h-5 mr-2" />
                        Patients Results
                    </Link>
                    <Link to="/my-profile" className="block px-4 py-2 text-gray-200 hover:bg-gray-700" onClick={toggleSidebar}>
                        <img src="/src/assets/images/myprofile-icon.png" alt="My Profile" className="inline-block w-5 h-5 mr-2" />
                        My Profile
                    </Link>
                    <Link to="/qa" className="block px-4 py-2 text-gray-200 hover:bg-gray-700" onClick={toggleSidebar}>
                        <img src="/src/assets/images/qa-icon.png" alt="Q&A" className="inline-block w-5 h-5 mr-2" />
                        Q&A
                    </Link>
                </div>
            </div>
        </>
    );
}

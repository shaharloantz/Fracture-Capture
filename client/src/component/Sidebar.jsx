import React, { useState } from "react";
import { Link } from "react-router-dom";
export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <button onClick={toggleSidebar} className="sidebar-toggle">
            <img src="/src/assets/images/navbar-icon.png"></img>
                Menu
            </button>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <Link to="/about" onClick={toggleSidebar} className="sidebar-link">
                    <img src="/src/assets/images/info-icon.png" alt="About" className="sidebar-icon"/>
                    <span>About</span>
                </Link>
                <Link to="/dashboard" onClick={toggleSidebar} className="sidebar-link">
                    <img src="/src/assets/images/dashboard-icon.png" alt="Dashboard" className="sidebar-icon"/>
                    <span>Dashboard</span>
                </Link>
                <Link to="/profile" onClick={toggleSidebar} className="sidebar-link">
                    <img src="/src/assets/images/myprofile-icon.png" alt="My Profile" className="sidebar-icon"/>
                    <span>My Profile</span>
                </Link>
                <Link to="/qa" onClick={toggleSidebar} className="sidebar-link">
                    <img src="src/assets/images/qa-icon.png" alt="Q&A" className="sidebar-icon"/>
                    <span>Q&A</span>
                </Link>
            </div>
        </>
    );
}

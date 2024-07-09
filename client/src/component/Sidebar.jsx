import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <button onClick={toggleSidebar} className="sidebar-toggle">
            <img src="/public/app-images/navbar-icon.png"></img>
                Menu
            </button>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <Link to="/profile" onClick={toggleSidebar} className="sidebar-link">
                    <img src="/app-images/myprofile-icon.png" alt="My Profile" className="sidebar-icon"/>
                    <span>My Profile</span>
                </Link>
                <Link to="/qa" onClick={toggleSidebar} className="sidebar-link">
                    <img src="/app-images/qa-icon.png" alt="Q&A" className="sidebar-icon"/>
                    <span>Q&A</span>
                </Link>
                <Link to="/about" onClick={toggleSidebar} className="sidebar-link">
                    <img src="/app-images/info-icon.png" alt="About" className="sidebar-icon"/>
                    <span>About</span>
                </Link>
            </div>
        </>
    );
}

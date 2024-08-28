import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import '../styles/Home.css'; 

export default function Home() {
    const navigate = useNavigate();

    const handlePlayClick = () => {
        navigate('/dashboard'); 
    };

    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <h1 className="app-name">FractureCapture</h1>
                <img src="src/assets/images/fracture.png" alt="Fracture Icon" className="fracture-icon" /> {/* Adjust size as needed */}
                <button onClick={handlePlayClick} className="play-button">
                    <img src="src/assets/images/start-icon.png" alt="Start" className="start-icon" /> {/* Adjust size as needed */}
                </button>
            </div>
        </div>
    );
}

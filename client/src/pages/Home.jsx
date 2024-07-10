import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";

export default function Home() {
    const navigate = useNavigate();

    const handlePlayClick = () => {
        navigate('/upload'); // Navigate to upload page
    };

    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <h1>FractureCapture</h1>
                <img src="public/app-images/fracture-icon.png" alt="Fracture Icon" className="fracture-icon"/>
                <button onClick={handlePlayClick} className="play-button">
                    <img src="public/app-images/start-icon.png" alt="Start" className="start-icon"/>
                </button>
            </div>
        </div>
    );
}

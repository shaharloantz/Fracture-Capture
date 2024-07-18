import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";

export default function Home() {
    const navigate = useNavigate();

    const handlePlayClick = () => {
        navigate('/dashboard'); // Navigate to upload page
    };

    return (
        <div className="home-container flex flex-col items-center justify-center min-h-screen">
            <Sidebar />
            <div className="main-content flex flex-col items-center">
                <h1 className="text-4xl font-bold text-white mb-8">FractureCapture</h1>
                <img src="src/assets/images/fracture.png" alt="Fracture Icon" className="w-64 h-64 mb-8" /> {/* Adjust size as needed */}
                <button onClick={handlePlayClick} className="play-button">
                    <img src="src/assets/images/start-icon.png" alt="Start" className="w-16 h-16" /> {/* Adjust size as needed */}
                </button>
            </div>
        </div>
    );}

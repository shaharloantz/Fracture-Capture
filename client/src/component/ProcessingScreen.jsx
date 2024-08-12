import React, { useState, useEffect } from 'react';
import '../styles/ProcessingScreen.css';

const ProcessingScreen = ({ processingTime, onAbort }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!processingTime || processingTime <= 0) {
            console.error("Invalid processing time:", processingTime);
            return;
        }

        const totalTime = Math.max(processingTime, 1); // Ensure a minimum of 1 second
        const increment = 100 / totalTime; // Calculate progress increment per second

        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + increment;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return newProgress;
            });
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [processingTime]);

    return (
        <div className="processing-screen">
            <div className="spinner"></div>
            <p>In Process</p>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <button className="abort-button" onClick={onAbort}>
                Abort
            </button>
        </div>
    );
};

export default ProcessingScreen;

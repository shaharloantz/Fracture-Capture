import React, { useState, useEffect } from 'react';
import '../styles/ProcessingScreen.css';

const ProcessingScreen = ({ estimatedTime }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + (100 / estimatedTime);
                if (newProgress >= 100) {
                    clearInterval(interval);
                }
                return newProgress;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [estimatedTime]);

    return (
        <div className="processing-screen">
            <div className="spinner"></div>
            <p>In Process</p>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default ProcessingScreen;

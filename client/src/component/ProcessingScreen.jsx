/**
  ProcessingScreen Component

 * This component is responsible for displaying a processing screen during image processing or any other 
 * long-running task. It includes a visual progress bar and a spinner to indicate that a process is 
 * ongoing. The progress bar is animated to fill up over the time specified by the `processingTime` prop.
 
 */
import React, { useState, useEffect } from 'react';
import '../styles/ProcessingScreen.css';

const ProcessingScreen = ({ processingTime, onAbort }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!processingTime || processingTime <= 0) {
            console.error("Invalid processing time:", processingTime);
            return;
        }

        const totalTime = Math.max(processingTime, 1); 
        const increment = 100 / totalTime; 

        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + increment;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return newProgress;
            });
        }, 1000); 

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

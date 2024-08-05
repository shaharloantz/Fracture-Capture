import React from 'react';
import '../styles/ProcessingScreen.css'; // Create this CSS file for styling

const ProcessingScreen = () => {
    return (
        <div className="processing-screen">
            <div className="spinner"></div>
            <p>In Process</p>
        </div>
    );
};

export default ProcessingScreen;

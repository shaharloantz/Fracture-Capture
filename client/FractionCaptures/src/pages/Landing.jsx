import React from 'react';
import './Landing.css'; // Create a separate CSS file for styling
import icon from '../app-images/fracture-icon.png'; // Replace this with the path to your icon image

const Landing = () => {
  return (
    <div className="container">
      <div className="header">Fracturebusters / Fractures Captures</div>
      <div className="icon-container">
        <img src={icon} alt="Fracture Icon" className="icon" />
      </div>
      <button className="play-button">
        <span>▶</span>
      </button>
    </div>
  );
};

export default Landing;
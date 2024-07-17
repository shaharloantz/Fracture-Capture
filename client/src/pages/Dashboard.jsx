import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../cssFiles/Dashboard.css';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/user/profile', { withCredentials: true })
      .then(response => {
        setProfile(response.data);
        //toast.success('Profile loaded successfully!');
      })
      .catch(error => {
        console.error('Error fetching profile:', error.response ? error.response.data : error.message);
        navigate('/login');
      });
  }, [navigate]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const items = [
    { title: 'Elbow', image: 'src/assets/images/elbow-icon.png' },
    { title: 'Arm', image: 'src/assets/images/arm-icon.png' },
    { title: 'Hand', image: 'src/assets/images/hand-icon.png' },
    { title: 'Foot', image: 'src/assets/images/foot-icon.png' },
    { title: 'Ankle', image: 'src/assets/images/ankle-icon.png' },
    { title: 'Leg', image: 'src/assets/images/leg-icon.png' },
    { title: 'Results', image: 'src/assets/images/results-icon.png' },
    { title: 'Knee', image: 'src/assets/images/knee-icon.png' },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo"></div>
        <h1>Fracture Capture</h1>
      </header>
      <div className="welcome-text">
        <h2>Welcome back, {profile.name}!</h2>
        <ol>
          <li> 1) Choose the relevant to start</li>
          <li> 2) Upload an image</li>
          <li> 3) Receive a prediction of fractures</li>
        </ol>
      </div>
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.title} className="item">
            <img src={item.image} alt={item.title} />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
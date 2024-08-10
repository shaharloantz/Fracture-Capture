import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../component/PatientForm';
import ProcessingScreen from '../component/ProcessingScreen';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const initialPatientState = { name: '', dateOfBirth: '', gender: '', idNumber: '' };
  const initialUploadState = { id: '', description: '', bodyPart: '', image: null };
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showBodyParts, setShowBodyParts] = useState(false);
  const [newPatient, setNewPatient] = useState(initialPatientState);
  const [uploadData, setUploadData] = useState(initialUploadState);
  const [patients, setPatients] = useState([]);
  const [isAddingToExisting, setIsAddingToExisting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [showProcessing, setShowProcessing] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(10); // Default estimated time
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = () => {
    axios.get('/user/profile', { withCredentials: true })
      .then(response => {
        setProfile(response.data);
        setPatients(response.data.patients);
      })
      .catch(error => {
        console.error('Error fetching profile:', error.response ? error.response.data : error.message);
        navigate('/login');
      });
  };

  const handleItemClick = (item) => {
    setSelectedBodyPart(item.title);
    setShowForm(true);
    setShowBodyParts(false);
  };

  const handleAddPatientClick = () => {
    setIsAddingToExisting(true);
    fetchPatients();
    setUploadData(initialUploadState);
    setShowBodyParts(true);
  };

  const fetchPatients = () => {
    axios.get('/user/profile', { withCredentials: true })
      .then(response => {
        setPatients(response.data.patients);
      })
      .catch(error => {
        console.error('Error fetching patients:', error.response ? error.response.data : error.message);
        toast.error('Error fetching patients. Please try again.');
      });
  };

  const handleCreatePatientClick = () => {
    setNewPatient(initialPatientState);
    setIsAddingToExisting(false);
    setShowForm(true);
    setShowBodyParts(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isAddingToExisting) {
      setUploadData({ ...uploadData, [name]: value });
    } else {
      setNewPatient({ ...newPatient, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadData({ ...uploadData, image: file });
  };

  const handleBackClick = () => {
    setShowForm(false);
    setShowBodyParts(false);
    setShowProcessing(false);
  };

  const handleUploadResponse = (response, processingTime) => {
    const { processedImagePath } = response.data;
    const selectedPatient = patients.find(p => p._id === uploadData.id); // Ensure you get the correct patient
  
    navigate('/results', { 
      state: { 
        processedImagePath, 
        selectedUpload: uploadData, 
        patient: selectedPatient, 
        userName: profile.name,
        processingTime  // Pass it correctly
      } 
   });
};



const handleSubmit = async (e) => {
  e.preventDefault();
  const startTime = Date.now(); // Initialize startTime here

  if (isAddingToExisting) {
    setShowProcessing(true); // Set processing screen for image uploads only
    try {
      const formData = new FormData();
      formData.append('id', uploadData.id);
      formData.append('description', uploadData.description);
      formData.append('bodyPart', selectedBodyPart);
      formData.append('image', uploadData.image);

      const response = await axios.post('/uploads', formData, { withCredentials: true });
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      setEstimatedTime(duration); // Update estimated time based on actual processing time

      handleUploadResponse(response, duration); // Pass duration to the response handler
    } catch (error) {
      console.error('Error uploading:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.error || 'Error uploading. Please try again.');
      setShowProcessing(false);
    }
  } else {
    // Handle new patient creation
    try {
      await axios.post('/patients', newPatient, { withCredentials: true });
      toast.success('Patient created successfully!');
      setNewPatient(initialPatientState);
      setShowForm(false);
      setShowBodyParts(true); // Go back to body parts selection after patient creation
      setIsAddingToExisting(true); // Prepare for image upload
      fetchPatients(); // Refresh the patients list
    } catch (error) {
      console.error('Error creating patient:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.error || 'Error creating patient. Please try again.');
    }
  }
};


  if (showProcessing) {
    return <ProcessingScreen processingTime={estimatedTime} />;
  }

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
    { title: 'Knee', image: 'src/assets/images/knee-icon.png' },
    { title: 'Shoulder', image: 'src/assets/images/Shoulder-icon.png' },
  ];

  return (
    <div className="dashboard-container">
      <Toaster />
      <div className="welcome-text">
        <h2>Welcome back, {profile.name}!</h2>
        <ol>
          <li>1) Choose the relevant part to start</li>
          <li>2) Upload an image</li>
          <li>3) Receive a prediction of fractures</li>
        </ol>
      </div>
      {!showForm && !showBodyParts ? (
        <div className="action-buttons">
          <div className="box" onClick={handleCreatePatientClick}>Create a new Patient</div>
          <div className="box" onClick={handleAddPatientClick}>Add to an existing Patient</div>
        </div>
      ) : showBodyParts ? (
        <>
          <img 
            src="./src/assets/images/undo.png" 
            alt="Back" 
            className="back-button-icon" 
            onClick={handleBackClick} 
          />
          <div className="items-grid">
            {items.map((item) => (
              <div
                key={item.title}
                className="item"
                onClick={() => handleItemClick(item)}
              >
                <img src={item.image} alt={item.title} />
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <PatientForm 
          isAddingToExisting={isAddingToExisting}
          uploadData={uploadData}
          newPatient={newPatient}
          patients={patients}
          selectedBodyPart={selectedBodyPart}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          handleBackClick={handleBackClick}
        />
      )}
    </div>
  );
};

export default Dashboard;

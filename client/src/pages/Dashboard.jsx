import React, { useEffect,useRef, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../component/PatientForm';
import ProcessingScreen from '../component/ProcessingScreen';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const initialPatientState = { name: '', dateOfBirth: '', gender: '', idNumber: '' };
  const initialUploadState = { id: '', description: '', bodyPart: '', image: [] };
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
  const controllerRef = useRef(null);

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

  const handleFileChange = (files) => {
    setUploadData({ ...uploadData, images: files });
  };

  const handleBackClick = () => {
    setShowForm(false);
    setShowBodyParts(false);
    setShowProcessing(false);
  };

  const handleUploadResponse = (response, processingTime) => {
    const { newUpload } = response.data;
    console.log("newUpload")
    
    // Update the upload data with the bodyPart and any other necessary information
    const updatedUploadData = {
      ...newUpload,
      bodyPart: newUpload.bodyPart || selectedBodyPart,
    };
    console.log(updatedUploadData)
    // Find the selected patient
    const selectedPatient = patients.find(p => p._id === newUpload.patient);
  
    // Handle multiple images
    const processedImages = Array.isArray(newUpload.processedImgUrls)
      ? newUpload.processedImgUrls
      : [newUpload.processedImgUrl]; // Support for single or multiple images
  
    // Navigate to the results page, passing the necessary state
    console.log(processedImages)
    navigate('/results', {
      state: {
        processedImages, // Pass the array of processed image URLs
        selectedUpload: updatedUploadData,
        patient: selectedPatient,
        userName: profile.name,
        profileEmail: profile.email,
        processingTime,
      },
    });
  };
  
  const handleAbort = () => {
    if (controllerRef.current) {
      controllerRef.current.abort(); // Abort the ongoing request
    }
    setShowProcessing(false); // Stop showing the processing screen
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime = Date.now();
  
    if (isAddingToExisting) {
      setShowProcessing(true); 
      controllerRef.current = new AbortController(); // Initialize the AbortController
      const { signal } = controllerRef.current;
  
      try {
        console.log("Here")
        const formData = new FormData();
        formData.append('id', uploadData.id);
        formData.append('description', uploadData.description);
        formData.append('bodyPart', selectedBodyPart); // Ensure bodyPart is included
        console.log("Here1")
        // Append all selected files to formData
        uploadData.images.forEach((file) => {
          formData.append('images', file);
        });
        console.log("Here3")
        const response = await axios.post('/uploads', formData, { withCredentials: true, signal });
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        setEstimatedTime(duration);
        console.log("Here4")
        handleUploadResponse(response, duration); 
        console.log("Here5")
      } catch (error) {
        console.log("Errorrrr")
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
        setShowBodyParts(true); 
        setIsAddingToExisting(true);
        fetchPatients(); 
      } catch (error) {
        console.error('Error creating patient:', error.response ? error.response.data : error.message);
        toast.error(error.response?.data?.error || 'Error creating patient. Please try again.');
      }
    }
  };
  
  


  if (showProcessing) {
    return <ProcessingScreen processingTime={estimatedTime} onAbort={handleAbort} />;
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
        <p>Welcome back, {profile.name}!</p>
        <ol>
          <li>1) Choose the relevant part to start.</li>
          <li>2) Upload an image.</li>
          <li>3) Receive a prediction of fractures.</li>
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
  selectedBodyPart={selectedBodyPart}  // Ensure it's passed here
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

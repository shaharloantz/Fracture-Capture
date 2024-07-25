import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../component/PatientForm';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const initialPatientState = { name: '', age: '', gender: '', idNumber: '' };
  const initialUploadState = { patientId: '', description: '', bodyPart: '', image: null };
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showBodyParts, setShowBodyParts] = useState(false);
  const [newPatient, setNewPatient] = useState(initialPatientState);
  const [uploadData, setUploadData] = useState(initialUploadState);
  const [patients, setPatients] = useState([]);
  const [isAddingToExisting, setIsAddingToExisting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const navigate = useNavigate();
  const [predictionResult, setPredictionResult] = useState(null);

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAddingToExisting) {
      const formData = new FormData();
      formData.append('patientId', uploadData.patientId);
      formData.append('description', uploadData.description);
      formData.append('bodyPart', selectedBodyPart);
      formData.append('image', uploadData.image);

      axios.post('/uploads', formData, { withCredentials: true })
        .then(response => {
          toast.success("Upload successful!");
          setPredictionResult(response.data.prediction);
          setSelectedPatient(uploadData.patientId);
          setShowForm(false);
          setShowBodyParts(true);
        })
        .catch(error => {
          console.error('Error uploading:', error.response ? error.response.data : error.message);
          toast.error(error.response?.data?.error || 'Error uploading. Please try again.');
        });
    } else {
      if (newPatient.age < 0) {
        toast.error("Age must be 0 or greater.");
        return;
      }

      const patientData = {
        ...newPatient,
        createdByUser: profile._id,
      };

      axios.post('/patients', patientData, { withCredentials: true })
        .then(response => {
          toast.success("Patient created successfully!");
          setProfile({ ...profile, numberOfPatients: profile.numberOfPatients + 1 });
          setSelectedPatient(response.data._id);
          setIsAddingToExisting(true);
          setShowBodyParts(true);
          setShowForm(false);
          fetchPatients();
        })
        .catch(error => {
          console.error('Error creating patient:', error.response ? error.response.data : error.message);
          toast.error(error.response?.data?.error || 'Error creating patient. Please try again.');
        });
    }
  };

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
            src="src/assets/images/undo.png" 
            alt="Back" 
            className="back-button" 
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
      ) : showForm ? (
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
      ) : null}
            {predictionResult && (
        <div className="prediction-result">
          <h3>Prediction Result:</h3>
          <pre>{JSON.stringify(predictionResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

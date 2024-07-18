import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../cssFiles/Dashboard.css'; // Import the CSS file

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

  useEffect(() => {
    axios.get('/user/profile', { withCredentials: true })
      .then(response => {
        setProfile(response.data);
      })
      .catch(error => {
        console.error('Error fetching profile:', error.response ? error.response.data : error.message);
        navigate('/login');
      });
  }, [navigate]);

  const handleItemClick = (item) => {
    setSelectedBodyPart(item.title); // Set the selected body part
    setShowForm(true); // Show the form
    setShowBodyParts(false); // Hide the body parts selection
  };

  const handleAddPatientClick = () => {
    setIsAddingToExisting(true);
    fetchPatients();
    setUploadData(initialUploadState); // Reset form state
    setShowBodyParts(true); // Show the body parts selection
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
    setNewPatient(initialPatientState); // Reset form state
    setIsAddingToExisting(false);
    setShowForm(true); // Show the form
    setShowBodyParts(false); // Hide the body parts selection
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
      formData.append('bodyPart', selectedBodyPart); // Use the selected body part
      formData.append('image', uploadData.image);

      axios.post('/uploads', formData, { withCredentials: true })
        .then(response => {
          toast.success("Upload successful!");
          setSelectedPatient(uploadData.patientId);
          setShowForm(false);
          setShowBodyParts(true);
        })
        .catch(error => {
          console.error('Error uploading:', error.response ? error.response.data : error.message);
          toast.error(error.response?.data?.error || 'Error uploading. Please try again.');
        });
    } else {
      // Age validation
      if (newPatient.age < 0) {
        toast.error("Age must be 0 or greater.");
        return;
      }

      const patientData = {
        ...newPatient,
        createdByUser: profile._id, // Ensure profile contains the logged-in user's data
      };

      axios.post('/patients', patientData, { withCredentials: true })
        .then(response => {
          toast.success("Patient created successfully!");
          setProfile({ ...profile, numberOfPatients: profile.numberOfPatients + 1 });
          setSelectedPatient(response.data._id);
          setIsAddingToExisting(true); // Set to adding to existing patient
          setShowBodyParts(true); // Show body parts selection
          setShowForm(false); // Hide form
          fetchPatients(); // Fetch updated list of patients
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
    { title: 'Results', image: 'src/assets/images/results-icon.png' },
    { title: 'Knee', image: 'src/assets/images/knee-icon.png' },
  ];

  return (
    <div className="dashboard-container">
      <Toaster /> {/* Ensure Toaster is included */}
      <header className="dashboard-header">
        <div className="logo"></div>
        <h1>Fracture Capture</h1>
      </header>
      <div className="welcome-text">
        <h2>Welcome back, {profile.name}!</h2>
        <ol>
          <li>1) Choose the relevant part to start</li>
          <li>2) Upload an image</li>
          <li>3) Receive a prediction of fractures</li>
        </ol>
      </div>
      {!showForm && !showBodyParts ? (
        <>
          <div className="box" onClick={handleCreatePatientClick}>Create a new Patient</div>
          <div className="box" onClick={handleAddPatientClick}>Add to an existing Patient</div>
        </>
      ) : showBodyParts ? (
        <>
          <button className="back-button" onClick={handleBackClick}>Back</button>
          <div className="items-grid">
            {items.map((item) => (
              <div
                key={item.title}
                className={`item ${!profile ? 'item-disabled' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                <img src={item.image} alt={item.title} />
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </>
      ) : showForm ? (
        <>
          <button className="back-button" onClick={handleBackClick}>Back</button>
          <form onSubmit={handleSubmit} className="patient-form">
            {isAddingToExisting ? (
              <>
                <h2>Add to an Existing Patient</h2>
                <label>
                  Patient:
                  <select name="patientId" value={uploadData.patientId} onChange={handleInputChange} required>
                    <option value="">Select a patient</option>
                    {patients.map(patient => (
                      <option key={patient._id} value={patient._id}>
                        {patient.name} - {patient.idNumber}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Description:
                  <textarea name="description" value={uploadData.description} onChange={handleInputChange} required />
                </label>
                <label>
                  Body Part:
                  <input type="text" name="bodyPart" value={selectedBodyPart} readOnly required />
                </label>
                <label>
                  Upload Image:
                  <input type="file" name="image" onChange={handleFileChange} required />
                </label>
              </>
            ) : (
              <>
                <h2>Create a New Patient</h2>
                <label>
                  Name:
                  <input type="text" name="name" value={newPatient.name} onChange={handleInputChange} required />
                </label>
                <label>
                  Age:
                  <input type="number" name="age" value={newPatient.age} onChange={handleInputChange} min="0" required />
                </label>
                <label>
                  Gender:
                  <select name="gender" value={newPatient.gender} onChange={handleInputChange} required>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </label>
                <label>
                  ID Number:
                  <input type="text" name="idNumber" value={newPatient.idNumber} onChange={handleInputChange} required />
                </label>
              </>
            )}
            <button type="submit">Submit</button>
            <button type="button" onClick={handleBackClick}>Cancel</button>
          </form>
        </>
      ) : null}
    </div>
  );
};

export default Dashboard;

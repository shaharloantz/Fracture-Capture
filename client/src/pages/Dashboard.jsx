import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../component/PatientForm';
import FileUpload from '../component/FileUpload';
import ProcessingScreen from '../component/ProcessingScreen';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const initialPatientState = { name: '', dateOfBirth: '', gender: '', idNumber: '' };
    const initialUploadState = { id: '', description: '', bodyPart: '', image: null };
    const [profile, setProfile] = useState(null);
    const [showForm, setShowForm] = useState(false); // For showing form
    const [showBodyParts, setShowBodyParts] = useState(false);
    const [newPatient, setNewPatient] = useState(initialPatientState);
    const [uploadData, setUploadData] = useState(initialUploadState);
    const [patients, setPatients] = useState([]);
    const [isAddingToExisting, setIsAddingToExisting] = useState(false); // To determine if adding to existing patient
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedBodyPart, setSelectedBodyPart] = useState('');
    const [showProcessing, setShowProcessing] = useState(false);
    const [processingComplete, setProcessingComplete] = useState(false);
    const [estimatedTime, setEstimatedTime] = useState(10); 
    const navigate = useNavigate();
    const controllerRef = useRef(null);
    const [responseData, setResponseData] = useState(null);

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
        setShowForm(true);  // Show form to add the upload after selecting body part
        setShowBodyParts(false);
    };

    const handleAddPatientClick = () => {
        if (patients.length === 0) {
            toast.error('You have not created any patients yet. Please create a new patient first.');
            return;
        }

        setIsAddingToExisting(true);  // Set to true since we're adding to an existing patient
        setShowForm(false);  // Hide form initially
        setShowBodyParts(true);  // Show body parts selection
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
        setIsAddingToExisting(false);  // Set to false since we're creating a new patient
        setShowForm(true);  // Show patient form
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
        const { newUpload } = response.data;
        const updatedUploadData = {
            ...newUpload,
            bodyPart: newUpload.bodyPart || selectedBodyPart,
        };
        const selectedPatient = patients.find(p => p._id === newUpload.patient);

        setResponseData({
            processedImagePath: newUpload.processedImgUrl,
            selectedUpload: updatedUploadData,
            patient: selectedPatient,
            userName: profile.name,
            profileEmail: profile.email,
            processingTime,
        });

        if (processingComplete) {
            navigate('/results', { 
                state: {
                    ...responseData,
                } 
            });
        }
    };

    const handleAbort = () => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        setShowProcessing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const startTime = Date.now();

        if (isAddingToExisting) {
            setShowProcessing(true); 
            controllerRef.current = new AbortController();
            const { signal } = controllerRef.current;

            try {
                if (!selectedPatient) {
                    toast.error('No patient selected. Please select a patient.');
                    setShowProcessing(false);
                    return;
                }

                const formData = new FormData();
                formData.append('id', selectedPatient);
                formData.append('description', uploadData.description);
                formData.append('bodyPart', selectedBodyPart);
                formData.append('image', uploadData.image);

                const response = await axios.post('/uploads', formData, { withCredentials: true, signal });
                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000;
                setEstimatedTime(duration);

                handleUploadResponse(response, duration); 
            } catch (error) {
                console.error('Error uploading:', error.response ? error.response.data : error.message);
                toast.error(error.response?.data?.error || 'Error uploading. Please try again.');
                setShowProcessing(false);
            }
        } else {
            try {
                const response = await axios.post('/patients', newPatient, { withCredentials: true });
                const createdPatient = response.data;

                toast.success('Patient created successfully!');
                setPatients([...patients, createdPatient]);
                setNewPatient(initialPatientState);
                setSelectedPatient(createdPatient._id);
                setIsAddingToExisting(true);
                setShowForm(false);
                setShowBodyParts(true);
                fetchPatients(); 
            } catch (error) {
                console.error('Error creating patient:', error.response ? error.response.data : error.message);
                toast.error(error.response?.data?.error || 'Error creating patient. Please try again.');
            }
        }
    };

    const handleProcessingComplete = () => {
        setProcessingComplete(true);
        if (responseData) {
            navigate('/results', { 
                state: {
                    ...responseData,
                } 
            });
        }
    };

    if (showProcessing) {
        return <ProcessingScreen 
                  processingTime={estimatedTime} 
                  onAbort={handleAbort} 
                  onComplete={handleProcessingComplete} 
               />;
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
            ) : isAddingToExisting ? (
                <FileUpload 
                    uploadData={uploadData}
                    patients={patients}
                    selectedPatient={selectedPatient}
                    setSelectedPatient={setSelectedPatient}
                    selectedBodyPart={selectedBodyPart}
                    handleInputChange={handleInputChange}
                    handleFileChange={handleFileChange}
                    handleSubmit={handleSubmit}
                    handleBackClick={handleBackClick}
                />
            ) : (
                <PatientForm 
                    newPatient={newPatient}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    handleBackClick={handleBackClick}
                />
            )}
        </div>
    );
};

export default Dashboard;

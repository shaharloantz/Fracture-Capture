/**
 * Dashboard Page
 * 
 * This component serves as the central interface for managing patient data and uploading medical images for fracture detection. 
 * It provides functionality for creating new patients, selecting existing patients, and uploading images for processing. 
 * The user workflow is structured to guide the user through selecting or creating a patient, choosing a body part, and uploading an image 
 * for analysis, followed by displaying the processing screen and results.
 * 
 * Key Functionalities:
 * 
 * 1. **Patient Management**:
 *    - Allows users to create a new patient profile or select an existing patient to add new image uploads.
 *    - Validates patient information, such as name, date of birth, gender, and ID number, ensuring all required fields are filled correctly.
 *    - Displays patient information in a form when creating or editing patient profiles.
 * 
 * 2. **Body Part Selection**:
 *    - Provides a selection interface for users to choose the body part that is relevant to the image they want to upload.
 *    - Displays different icons representing various body parts (e.g., Elbow, Arm, Hand, Foot).
 *    - Transitions to the file upload process after a body part is selected.
 * 
 * 3. **File Upload and Image Processing**:
 *    - Manages the file upload process for adding images to patient profiles.
 *    - Validates image file types and sizes before submission.
 *    - Initiates the image processing workflow upon submission, displaying a processing screen with a progress bar and estimated time.
 *    - Handles the abort functionality to cancel ongoing processing if needed.
 * 
 * 4. **Data Fetching and Navigation**:
 *    - Fetches user profile data and patients list upon component mount to display existing patients and manage uploads.
 *    - Uses React Router's `useNavigate` to redirect users as needed, such as navigating to results pages after processing is complete.
 *    - Maintains session and authentication states through server requests, ensuring secure access to patient data.
 * 
 * 5. **Dynamic State Management**:
 *    - Uses various state variables to manage the visibility of forms, body parts selection, processing screens, and patient/upload data.
 *    - Manages the state transitions based on user actions, such as toggling between patient creation and upload modes.
 *    - Updates patient and upload states dynamically as new data is created or modified.
 * 
 * Hooks Used:
 * - `useState`: Manages local state for patient data, uploads, form visibility, processing states, etc.
 * - `useEffect`: Fetches the initial profile and patient data from the server when the component mounts.
 * - `useRef`: Maintains a reference to the AbortController for handling upload and processing cancellations.
 * - `useNavigate`: Redirects users to different pages based on actions and state, ensuring smooth transitions within the application.
 * 
 * Component Structure:
 * - Initial view presents options to create a new patient or add to an existing patient.
 * - Upon selecting an action, the user is guided through forms and selections relevant to their choice (patient creation, body part selection, file upload).
 * - Shows a processing screen when an upload is being processed and navigates to the results page upon completion.
 * 
 * External Dependencies:
 * - `axios`: Used for making HTTP requests to fetch and manipulate patient data and handle file uploads.
 * - `react-hot-toast`: Provides user notifications for success, error, and informational feedback.
 * - `react-router-dom`: Facilitates navigation and state management within the application.
 *
 */

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
    const [showForm, setShowForm] = useState(false);
    const [showBodyParts, setShowBodyParts] = useState(false);
    const [newPatient, setNewPatient] = useState(initialPatientState);
    const [uploadData, setUploadData] = useState(initialUploadState);
    const [patients, setPatients] = useState([]);
    const [isAddingToExisting, setIsAddingToExisting] = useState(false);
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
        if (isAddingToExisting || selectedPatient) {
            setShowForm(true); // Only show file upload form if a patient is selected or being added to
            setShowBodyParts(false);
        }
    };

    const handleAddPatientClick = () => {
        if (patients.length === 0) {
            toast.error('You have not created any patients yet. Please create a new patient first.');
            return;
        }

        setIsAddingToExisting(true);
        setUploadData(initialUploadState);
        setShowBodyParts(true);  // Show body parts selection
        setShowForm(false);  // Ensure the patient form is not shown
    };

    const handleCreatePatientClick = () => {
        setNewPatient(initialPatientState);
        setIsAddingToExisting(false);
        setShowForm(true);  // Show patient form for creating a new patient
        setShowBodyParts(false);
        setSelectedPatient(null);  // Ensure no patient is selected
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
                setSelectedPatient(createdPatient._id); // Set the newly created patient as selected
                setIsAddingToExisting(true);  // Transition to adding uploads
                setShowForm(false);
                setShowBodyParts(true); // Move to body parts selection
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
            ) : (isAddingToExisting) ? (
                <FileUpload
                    uploadData={uploadData}
                    patients={patients}
                    selectedPatient={selectedPatient} // Ensure the dropdown selects the new patient
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

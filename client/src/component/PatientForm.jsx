/*
 * PatientForm Component
 *
 * This component is responsible for handling both the creation of a new patient and the addition of an upload to an existing patient.
 * It includes form validation, file selection, and manages the state of patient details and uploads. The form adapts based on whether 
 * the user is adding an upload to an existing patient or creating a new patient profile.
 *
 * Key Features:
 * 1. Validation of patient details and file types.
 * 2. Handles form submission and input changes.
 * 3. Manages file selection, ensuring only valid image types (PNG, JPG, JPEG) are uploaded.
 * 4. Displays appropriate input fields depending on whether a new patient is being created or an existing patient's upload is being added.
 * 5. Provides feedback for form errors and displays the selected file name.
 */

import React, { useState } from 'react';
import '../styles/PatientForm.css';
import { toast } from 'react-hot-toast';

const PatientForm = ({
    isAddingToExisting,
    uploadData,
    newPatient,
    patients,
    selectedBodyPart,
    selectedPatient,
    setSelectedPatient,  
    handleInputChange,
    handleFileChange,
    handleSubmit,
    handleBackClick
}) => {
    const [selectedFileName, setSelectedFileName] = useState('');
    const [fileError, setFileError] = useState('');

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type;
            const fileSize = file.size;
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            const maxSize = 5 * 1024 * 1024; // 5 MB

            if (!validTypes.includes(fileType)) {
                setFileError('Please upload a valid image file (PNG, JPG, or JPEG)');
                setSelectedFileName('');
                return;
            }

            if (fileSize > maxSize) {
                setFileError('File size should not exceed 5MB');
                setSelectedFileName('');
                return;
            }

            handleFileChange(e);
            setSelectedFileName(file.name);
            setFileError('');
        } else {
            setSelectedFileName('');
            setFileError('');
        }
    };

    const validateDateOfBirth = (dateOfBirth) => {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(dateOfBirth)) {
            toast.error('Date of Birth must be in the format YYYY-MM-DD.');
            return false;
        }
        const date = new Date(dateOfBirth);
        if (isNaN(date.getTime())) {
            toast.error('Invalid Date of Birth.');
            return false;
        }

        const currentDate = new Date();
        const minYear = 1900;
        const year = date.getFullYear();

        if (date > currentDate) {
            toast.error('Date of Birth cannot be in the future.');
            return false;
        }

        if (year < minYear || year > currentDate.getFullYear()) {
            toast.error(`Year must be between ${minYear} and ${currentDate.getFullYear()}.`);
            return false;
        }

        return true;
    };

    const validateID = (id) => {
        if (id.length !== 9) {
            toast.error('ID must be 9 digits long.');
            return false;
        }

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            let num = Number(id[i]) * ((i % 2) + 1);
            if (num > 9) {
                num -= 9;
            }
            sum += num;
        }

        if (sum % 10 !== 0) {
            toast.error('Invalid ID.');
            return false;
        }

        return true;
    };

    const validateForm = () => {
        if (isAddingToExisting && !selectedBodyPart) {
            toast.error('Please select a body part.');
            return false;
        }
        if (!isAddingToExisting) {
            if (!newPatient.name || !newPatient.dateOfBirth || !newPatient.gender || !newPatient.idNumber) {
                toast.error('Please fill in all the patient details.');
                return false;
            }
            if (!validateDateOfBirth(newPatient.dateOfBirth)) {
                return false;
            }
            if (!validateID(newPatient.idNumber)) {
                return false;
            }
        }
        if (isAddingToExisting && !uploadData.description) {
            toast.error('Please provide a description.');
            return false;
        }
        if (isAddingToExisting && !uploadData.image) {
            toast.error('Please upload an image.');
            return false;
        }
        return true;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (isAddingToExisting) {
                handleInputChange({ target: { name: 'bodyPart', value: selectedBodyPart } });
            }
            handleSubmit(e);
        }
    };

    return (
        <>
            <img
                src="src/assets/images/undo.png"
                alt="Back"
                className="back-button-icon"
                onClick={handleBackClick}
            />
            <form onSubmit={onSubmit} className="patient-form">
                {isAddingToExisting ? (
                    <>
                        <label>
                            Patient:
                            <select 
                                name="id" 
                                value={uploadData.id || selectedPatient || ''} 
                                onChange={(e) => {
                                    handleInputChange(e); 
                                    setSelectedPatient(e.target.value);  // Update the selected patient
                                }} 
                                required
                            >
                                <option value="" disabled>Select a patient</option>
                                {patients.map(patient => (
                                    <option key={patient._id} value={patient._id}>
                                        {patient.name} - {patient.idNumber}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Description:
                            <textarea
                                name="description"
                                value={uploadData.description || ''}
                                onChange={handleInputChange}
                                maxLength={255}
                                required
                            />
                        </label>
                        <label>
                            Body Part:
                            <input 
                                type="text" 
                                name="bodyPart" 
                                value={selectedBodyPart || ''} 
                                readOnly 
                                required 
                            />
                        </label>
                        <label>
                            Upload Image (PNG, JPG, JPEG):
                            <input 
                                type="file" 
                                name="image" 
                                onChange={onFileChange} 
                                id="file-upload" 
                                style={{ display: 'none' }} 
                                required 
                            />
                            <label htmlFor="file-upload" className="upload-image-label">
                                <img src="src/assets/images/upload-file.png" alt="Upload" className="upload-button-icon" />
                            </label>
                            {selectedFileName && <p className="file-name">File selected: {selectedFileName}</p>}
                            {fileError && <p className="error-message">{fileError}</p>}
                        </label>
                    </>
                ) : (
                    <>
                        <h2>Create a New Patient</h2>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={newPatient.name || ''}
                                onChange={handleInputChange}
                                maxLength={21}
                                required
                            />
                        </label>
                        <label>
                            Date of Birth:
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={newPatient.dateOfBirth || ''}
                                onChange={handleInputChange}
                                max={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </label>
    
                        <label>
                            Gender:
                            <select name="gender" value={newPatient.gender || ''} onChange={handleInputChange} required>
                                <option value="" disabled>Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </label>
                        <label>
                            ID Number:
                            <input
                                type="text"
                                name="idNumber"
                                value={newPatient.idNumber || ''}
                                onChange={handleInputChange}
                                maxLength={9}
                                required
                            />
                        </label>
                    </>
                )}
                <div className="button-container">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={handleBackClick}>Cancel</button>
                </div>
            </form>
        </>
    );
};
    

export default PatientForm;

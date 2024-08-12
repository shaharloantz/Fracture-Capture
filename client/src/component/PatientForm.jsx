import React, { useState } from 'react';
import '../styles/PatientForm.css'
import {toast} from 'react-hot-toast';
const PatientForm = ({ 
    isAddingToExisting, 
    uploadData, 
    newPatient, 
    patients, 
    selectedBodyPart, 
    handleInputChange, 
    handleFileChange, 
    handleSubmit, 
    handleBackClick 
}) => {
    const [selectedFileName, setSelectedFileName] = useState('');
    const [fileError, setFileError] = useState('');  // For storing file format error messages

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type;
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];

            if (validTypes.includes(fileType)) {
                handleFileChange(e);
                setSelectedFileName(file.name);
                setFileError('');  // Clear any previous errors
            } else {
                setSelectedFileName('');
                setFileError('Please upload a valid image file (PNG, JPG, or JPEG)');
            }
        } else {
            setSelectedFileName('');
            setFileError('');
        }
    };

    const validateDateOfBirth = (dateOfBirth) => {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Match YYYY-MM-DD format
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
        const minYear = 1900; // Adjust this year as needed
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
    
    const validateForm = () => {
        if (isAddingToExisting && !selectedBodyPart) {
            alert('Please select a body part.');
            console.log('Validation failed: No body part selected');
            return false;
        }
        if (!isAddingToExisting) { // Only check these fields if creating a new patient
            if (!newPatient.name || !newPatient.dateOfBirth || !newPatient.gender || !newPatient.idNumber) {
                alert('Please fill in all the patient details.');
                return false;
            }
        }
        if (isAddingToExisting && !uploadData.description) {
            alert('Please provide a description.');
            return false;
        }
        if (isAddingToExisting && !uploadData.image) {
            alert('Please upload an image.');
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
        <div className="dashboard-container">
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
                            <select name="id" value={uploadData.id} onChange={handleInputChange} required>
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
                            Upload Image (PNG, JPG, JPEG):
                            <input type="file" name="image" onChange={onFileChange} id="file-upload" style={{ display: 'none' }} required />
                            <label htmlFor="file-upload" className="upload-image-label">
                                <img src="src/assets/images/upload-file.png" alt="Upload" className="upload-button-icon" />
                            </label>
                            {selectedFileName && <p className="file-name">File selected: {selectedFileName}</p>}
                            {fileError && <p className="error-message">{fileError}</p>} {/* Display error message */}
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
                        Date of Birth:
                        <input 
                            type="date" 
                            name="dateOfBirth" 
                            value={newPatient.dateOfBirth} 
                            onChange={handleInputChange} 
                            max={new Date().toISOString().split("T")[0]}  // Restrict to today's date or earlier
                            required 
                        />
                         </label>

                        <label>
                            Gender:
                            <select name="gender" value={newPatient.gender} onChange={handleInputChange} required>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </label>
                        <label>
                            ID Number:
                            <input type="number" name="idNumber" value={newPatient.idNumber} onChange={handleInputChange} required />
                        </label>
                    </>
                )}
                <div className="button-container">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={handleBackClick}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default PatientForm;

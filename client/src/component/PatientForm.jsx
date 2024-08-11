import React, { useState } from 'react';
import '../styles/PatientForm.css'

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

    const onFileChange = (e) => {
        handleFileChange(e);
        const file = e.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
        } else {
            setSelectedFileName('');
        }
    };

    const validateForm = () => {
        if (isAddingToExisting && !selectedBodyPart) {
            alert('Please select a body part.');
            console.log('Validation failed: No body part selected');
            return false;
        }
        if (!isAddingToExisting && (!newPatient.name || !newPatient.dateOfBirth || !newPatient.gender || !newPatient.idNumber)) {
            alert('Please fill in all the patient details.');
            return false;
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
                            Upload Image:
                            <input type="file" name="image" onChange={onFileChange} id="file-upload" style={{ display: 'none' }} required />
                            <label htmlFor="file-upload" className="upload-image-label">
                                <img src="src/assets/images/upload-file.png" alt="Upload" className="upload-button-icon" />
                            </label>
                            {selectedFileName && <p className="file-name">File selected: {selectedFileName}</p>}
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
                            <input type="date" name="dateOfBirth" value={newPatient.dateOfBirth} onChange={handleInputChange} required />
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
                            <input type="text" name="idNumber" value={newPatient.idNumber} onChange={handleInputChange} required />
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

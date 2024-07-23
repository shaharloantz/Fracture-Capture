import React from 'react';

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
}) => (
    <div className="dashboard-container">
        <img 
            src="src/assets/images/undo.png" 
            alt="Back" 
            className="back-button-icon" 
            onClick={handleBackClick} 
        />
        <form onSubmit={handleSubmit} className="patient-form">
            {isAddingToExisting ? (
                <>
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
    </div>
);

export default PatientForm;

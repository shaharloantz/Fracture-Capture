import React, { useState } from 'react';
import '../styles/PatientForm.css';  // Import the same CSS file as PatientForm
import { toast } from 'react-hot-toast';

const FileUpload = ({
    selectedPatient,
    uploadData,
    setSelectedPatient,
    patients,
    selectedBodyPart,
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
            const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
            const maxSize = 5 * 1024 * 1024; // 5 MB

            if (!validTypes.includes(fileType)) {
                setFileError('Please upload a valid image (PNG, JPG, JPEG).');
                setSelectedFileName('');
                return;
            }

            if (fileSize > maxSize) {
                setFileError('File size should not exceed 5 MB.');
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

    return (
        <>
            <img
                src="src/assets/images/undo.png"
                alt="Back"
                className="back-button-icon"
                onClick={handleBackClick}  // Change the function to an empty function
            />
            <form onSubmit={handleSubmit} className="patient-form"> {/* Use the same class name */}
                <label>
                    Patient:
                    <select 
                        name="id" 
                        value={uploadData.id} 
                        onChange={(e) => {
                            handleInputChange(e);
                            setSelectedPatient(e.target.value);
                        }} 
                        required
                    >
                        <option value="" disabled>Select a patient</option>
                        {patients.map(patient => (
                            <option key={patient._id} value={patient._id}>
                                {patient.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Description:
                    <textarea
                        name="description"
                        value={uploadData.description}
                        onChange={handleInputChange}
                        maxLength={255}
                        rows={4}
                        required
                    />
                </label>
                <label>
                    Body Part:
                    <input 
                        type="text" 
                        name="bodyPart" 
                        value={selectedBodyPart}
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
                    {selectedFileName && <p className="file-name">{selectedFileName}</p>}
                    {fileError && <p className="error">{fileError}</p>}
                </label>
                <div className="button-container">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={handleBackClick}>Cancel</button>
                </div>
            </form>
        </>
    );
};

export default FileUpload;

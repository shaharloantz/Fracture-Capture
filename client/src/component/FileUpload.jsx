import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import '../styles/PatientForm.css';

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

    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        const lineCount = value.split('\n').length;

        if (lineCount > 6) {
            return;
        }

        handleInputChange(e);
    };

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

    const onSubmit = (e) => {
        e.preventDefault();

        // Manually check if an image is selected
        if (!uploadData.image) {
            toast.error('Please select an image to upload.');
            return;
        }

        // Proceed with the original submit handler if validation passes
        handleSubmit(e);
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
                <label>
                    Patient:
                    <select 
                        name="id" 
                        value={selectedPatient || ''} 
                        onChange={(e) => {
                            handleInputChange(e);
                            setSelectedPatient(e.target.value);
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
                        onChange={handleDescriptionChange}
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

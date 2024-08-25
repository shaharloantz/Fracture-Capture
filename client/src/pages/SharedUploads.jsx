import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import SharedPatient from '../component/profile/SharedPatient';
import SharedUpload from '../component/profile/SharedUpload';
import UploadDetails from '../component/profile/UploadDetails';
import '../styles/SharedUploads.css';

export default function SharedUploads() {
    const [sharedPatients, setSharedPatients] = useState([]);
    const [sharedUploads, setSharedUploads] = useState([]);
    const [selectedUpload, setSelectedUpload] = useState(null);

    useEffect(() => {
        axios.get('/user/shared-uploads', { withCredentials: true })
            .then(response => {
                const { sharedPatients, sharedUploads } = response.data;
                setSharedPatients(sharedPatients);
                setSharedUploads(sharedUploads);
            })
            .catch(error => console.error('Error fetching shared uploads:', error.response ? error.response.data : error.message));
    }, []);

    const handleUploadClick = (upload) => {
        setSelectedUpload(upload);
    };

    const handleDeleteUploadClick = (uploadId, e) => {
        e.stopPropagation();
        axios.delete(`/user/shared-upload/${uploadId}`, { withCredentials: true })
            .then(() => {
                setSharedUploads(uploads => uploads.filter(upload => upload._id !== uploadId));
                toast.success('Shared upload removed successfully.');
            })
            .catch(error => {
                console.error('Error removing shared upload:', error.response ? error.response.data : error.message);
                toast.error('Failed to remove shared upload.');
            });
    };

    const handleBackClick = () => {
        setSelectedUpload(null);
    };

    return (
        <div className="shared-uploads-container">
            <h1>Shared Uploads</h1>
            {selectedUpload ? (
                <UploadDetails 
                    selectedUpload={selectedUpload}
                    handleBackClick={handleBackClick}
                />
            ) : (
                <>
                    <div className="shared-patient-section">
                        <h2>Shared Patients</h2>
                        <SharedPatient
                            sharedPatients={sharedPatients}
                            handleUploadClick={handleUploadClick}
                            handleDeleteUploadClick={handleDeleteUploadClick}
                            formatDate={(dateString) => new Date(dateString).toLocaleString()}
                        />
                    </div>
                    <div className="shared-upload-section">
                        <h2>Shared Uploads</h2>
                        <SharedUpload
                            sharedUploads={sharedUploads}
                            handleUploadClick={handleUploadClick}
                            handleDeleteUploadClick={handleDeleteUploadClick}
                            formatDate={(dateString) => new Date(dateString).toLocaleString()}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

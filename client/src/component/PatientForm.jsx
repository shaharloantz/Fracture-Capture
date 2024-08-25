import React, { useEffect } from 'react';
import '../styles/PatientForm.css';
import { toast } from 'react-hot-toast';

const PatientForm = ({
    newPatient,
    handleInputChange,
    handleSubmit,
    handleBackClick,
    isEditing = false, // new prop to check if editing
}) => {

    useEffect(() => {
        if (isEditing) {
            // You can add any effect you need here when the form is in edit mode
        }
    }, [isEditing]);

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
        return true;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
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
                <h2>{isEditing ? 'Edit Patient' : 'Create a New Patient'}</h2> {/* Dynamic title */}
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={newPatient.name}
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
                        value={newPatient.dateOfBirth}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        required
                    />
                </label>

                <label>Gender:</label>
                <div className="gender-options">
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={newPatient.gender === 'Male'}
                            onChange={handleInputChange}
                            required
                        />
                        Male
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={newPatient.gender === 'Female'}
                            onChange={handleInputChange}
                            required
                        />
                        Female
                    </label>
                </div>

                <label>
                    ID Number:
                    <input
                        type="text"
                        name="idNumber"
                        value={newPatient.idNumber}
                        onChange={handleInputChange}
                        maxLength={9}
                        required
                    />
                </label>
                <div className="button-container">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={handleBackClick}>Cancel</button>
                </div>
            </form>
        </>
    );
};

export default PatientForm;

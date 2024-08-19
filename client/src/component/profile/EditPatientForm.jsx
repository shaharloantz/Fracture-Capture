import React from 'react';

const EditPatientForm = ({ editingPatient, handleEditPatientChange, handleEditPatientSubmit, setEditingPatient }) => (
    <form className="patient-form" onSubmit={handleEditPatientSubmit}>
        <h2>Edit Patient</h2>
        <label>
            Name:
            <input
                type="text"
                name="name"
                value={editingPatient.name}
                onChange={handleEditPatientChange}
                required
            />
        </label>
        <label>
            Date of Birth:
            <input
                type="date"
                name="dateOfBirth"
                value={editingPatient.dateOfBirth}
                onChange={handleEditPatientChange}
                required
            />
        </label>
        <label>
            Gender:
            <select
                name="gender"
                value={editingPatient.gender}
                onChange={handleEditPatientChange}
                required
            >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </label>
        <label>
            ID Number:
            <input
                type="text"
                name="idNumber"
                value={editingPatient.idNumber}
                onChange={handleEditPatientChange}
                required
            />
        </label>
        <button type="submit">Submit</button>
        <button type="button" onClick={() => setEditingPatient(null)}>Cancel</button>
    </form>
);

export default EditPatientForm;

const express = require('express');
const Patient = require('../models/Patient');
const Upload = require('../models/Upload');
const User = require('../models/User');
const requireAuth = require('../middleware/authMiddleware');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Endpoint to create a new patient
router.post('/', requireAuth, async (req, res) => {
    const { name, gender, age, idNumber } = req.body;

    try {
        const patient = new Patient({
            patientId: req.user.id,
            createdByUser: req.user.id,
            idNumber,
            gender,
            name,
            age
        });
        await patient.save();

        const user = await User.findById(req.user.id);
        user.numberOfPatients += 1;
        await user.save();

        res.status(201).json(patient);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Duplicate key error: A patient with this ID number already exists for this user' });
        }
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to delete a patient and all of its uploads
router.delete('/:patientId', requireAuth, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Find and delete all uploads associated with the patient
        const uploads = await Upload.find({ patient: req.params.patientId });

        for (const upload of uploads) {
            const filePath = path.join(__dirname, '../uploads', upload.imgId);
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    // File exists, proceed with deletion
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error deleting file:', unlinkErr);
                        }
                    });
                } else {
                    console.warn('File does not exist, skipping file deletion:', err);
                }
            });
        }

        await Upload.deleteMany({ patient: req.params.patientId });
        await Patient.findByIdAndDelete(req.params.patientId);

        const user = await User.findById(req.user.id);
        user.numberOfPatients -= 1;
        await user.save();

        res.json({ message: 'Patient and all related uploads deleted successfully' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

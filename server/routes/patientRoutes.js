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
    const { name, gender, dateOfBirth, idNumber } = req.body;

    try {
        const patient = new Patient({
            createdByUser: req.user.id,
            idNumber,
            gender,
            name,
            dateOfBirth
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
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Find and delete all uploads associated with the patient
        const uploads = await Upload.find({ patient: req.params.id });

        for (const upload of uploads) {
            const filePaths = [
                path.join(__dirname, '../uploads', upload.imgId),
                path.join(__dirname, '../uploads', upload.processedImgId)
            ];

            for (const filePath of filePaths) {
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
        }

        // Delete all uploads associated with the patient
        await Upload.deleteMany({ patient: req.params.id });
        // Delete the patient
        await Patient.findByIdAndDelete(req.params.id);

        // Decrease the user's patient count
        const user = await User.findById(req.user.id);
        user.numberOfPatients -= 1;
        await user.save();

        res.json({ message: 'Patient and all related uploads deleted successfully' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to update a patient's details
router.put('/:id', requireAuth, async (req, res) => {
    const { name, gender, dateOfBirth, idNumber } = req.body;

    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        patient.name = name;
        patient.gender = gender;
        patient.dateOfBirth = dateOfBirth;
        patient.idNumber = idNumber;

        await patient.save();

        res.json(patient);
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;

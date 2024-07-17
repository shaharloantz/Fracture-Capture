const express = require('express');
const Patient = require('../models/Patient');
const User = require('../models/User');
const requireAuth = require('../middleware/authMiddleware');

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

module.exports = router;

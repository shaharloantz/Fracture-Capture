const express = require('express');
const Patient = require('../models/Patient');

const router = express.Router();

// Endpoint to create a new patient
router.post('/', async (req, res) => {
    const { patientId, gender, name, age } = req.body;

    try {
        const patient = new Patient({ patientId, gender, name, age });
        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

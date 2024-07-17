const express = require('express');
const multer = require('multer');
const Patient = require('../models/Patient');
const Upload = require('../models/Upload');
const checkPatient = require('../middleware/checkPatient');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded images

// Endpoint to create a new upload
router.post('/', checkPatient, upload.single('image'), async (req, res) => {
    const { patientName, description, bodyPart, imgId, prediction } = req.body;

    try {
        const upload = new Upload({
            patientName,
            description,
            bodyPart,
            imgId,
            prediction,
            patient: req.patient._id // Use the patient from the middleware
        });
        await upload.save();
        res.status(201).json(upload);
    } catch (error) {
        console.error('Error creating upload:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const Patient = require('../models/Patient');
const Upload = require('../models/Upload');
const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded images

// Endpoint to create a new upload
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
    const { patientId, description, bodyPart } = req.body;
    const imgUrl = `/uploads/${req.file.filename}`;

    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const newUpload = new Upload({
            patient: patientId,
            patientName: patient.name,
            description,
            bodyPart,
            imgId: req.file.filename,
            imgUrl: imgUrl,
            dateUploaded: new Date(),
            prediction: null, // Assuming prediction will be added later
            createdByUser: req.user.id
        });

        await newUpload.save();

        res.status(201).json(newUpload);
    } catch (error) {
        console.error('Error creating upload:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

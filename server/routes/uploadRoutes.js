const express = require('express');
const multer = require('multer');
const path = require('path');
const Patient = require('../models/Patient');
const Upload = require('../models/Upload');
const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

const upload = multer({ storage: storage }); // Use the new storage configuration

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

// Endpoint to fetch uploads for a specific patient
router.get('/:patientId', requireAuth, async (req, res) => {
    try {
        const uploads = await Upload.find({ patient: req.params.patientId });
        res.json(uploads);
    } catch (error) {
        console.error('Error fetching uploads:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

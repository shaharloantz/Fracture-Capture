const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Patient = require('../models/Patient');
const Upload = require('../models/Upload');
const requireAuth = require('../middleware/authMiddleware');

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

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

const upload = multer({ storage: storage });

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
    const { patientId, description, bodyPart } = req.body;
    const imgUrl = `/uploads/${req.file.filename}`;
    const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);

    try {
        // Run prediction
        const { stdout, stderr } = await execPromise(`python predict.py "${imagePath}"`);
        console.log('Raw stdout:', stdout); // Log full stdout
        console.log('Raw stderr:', stderr);

        if (stderr) {
            console.error('Python script error:', stderr);
            return res.status(500).json({ error: 'Error running prediction script' });
        }

        let prediction;
        try {
            // Attempt to find the JSON part within the stdout
            const jsonString = stdout.match(/\{.*\}/);
            if (jsonString) {
                prediction = JSON.parse(jsonString[0]);
            } else {
                throw new Error("No JSON found in stdout");
            }
        } catch (parseError) {
            console.error('Error parsing prediction output:', parseError);
            return res.status(500).json({ error: 'Error parsing prediction output' });
        }

        const processedImgPath = prediction.image_path;
        const processedImgId = path.basename(processedImgPath);

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
            processedImgId: processedImgId,
            processedImgUrl: processedImgPath,
            dateUploaded: new Date(),
            prediction: { boxes: prediction.boxes, confidences: prediction.confidences },
            createdByUser: req.user.id
        });

        await newUpload.save();

        res.status(201).json({ newUpload, processedImagePath: processedImgPath });
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

// Endpoint to delete an upload
router.delete('/:uploadId', requireAuth, async (req, res) => {
    try {
        const upload = await Upload.findById(req.params.uploadId);
        if (!upload) {
            return res.status(404).json({ error: 'Upload not found' });
        }

        const filePath = path.join(__dirname, '../uploads', upload.imgId);
        fs.access(filePath, fs.constants.F_OK, async (err) => {
            if (!err) {
                // File exists, proceed with deletion
                fs.unlink(filePath, async (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting file:', unlinkErr);
                        return res.status(500).json({ error: 'Error deleting file' });
                    }

                    await Upload.findByIdAndDelete(req.params.uploadId);
                    res.json({ message: 'Upload deleted successfully' });
                });
            } else {
                // File does not exist, log the error and proceed with upload deletion
                console.warn('File does not exist, skipping file deletion:', err);

                await Upload.findByIdAndDelete(req.params.uploadId);
                res.json({ message: 'Upload deleted successfully' });
            }
        });
    } catch (error) {
        console.error('Error deleting upload:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

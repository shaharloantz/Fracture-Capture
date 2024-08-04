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
        const { stdout, stderr } = await execPromise(`python predict.py "${imagePath}"`);
        console.log('Raw stdout:', stdout);
        console.log('Raw stderr:', stderr);

        if (stderr) {
            console.error('Python script error:', stderr);
            return res.status(500).json({ error: 'Error running prediction script' });
        }

        let prediction;
        try {
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

        const filePaths = [
            path.join(__dirname, '../uploads', upload.imgId),
            path.join(__dirname, '../uploads', upload.processedImgId)
        ];

        // Function to delete a file and return a promise
        const deleteFile = (filePath) => new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    // If error is not "file not found"
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        // Delete image and processed image files
        await Promise.all(filePaths.map(deleteFile));

        // Delete the upload document
        await Upload.findByIdAndDelete(req.params.uploadId);
        res.json({ message: 'Upload deleted successfully' });
    } catch (error) {
        console.error('Error deleting upload:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

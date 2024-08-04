const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const Patient = require('../models/Patient');
const Upload = require('../models/Upload');
const requireAuth = require('../middleware/authMiddleware');

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const router = express.Router();

const storage = multer.memoryStorage(); // Use memory storage

const upload = multer({ storage: storage })

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
    const { patientId, description, bodyPart } = req.body;
    const imgUrl = `/uploads/${req.file.filename}`;
    const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);

    try {
        const { stdout, stderr } = await execPromise(`python predict.py "${imagePath}"`);
        if (stderr) {
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

router.post('/send-email', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { patientName } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mailfractions@gmail.com',
            pass: 'ekhe ympf novh vdns'
        }
    });

    try {
        let info = await transporter.sendMail({
            from: '"Your Name" <mailfractions@gmail.com>',
            to: "mailfractions@gmail.com",
            subject: `Medical Report for ${patientName}`,
            text: `Please find attached the medical report for ${patientName}.`,
            attachments: [
                {
                    filename: req.file.originalname,
                    content: req.file.buffer,
                    contentType: 'application/pdf' // Ensure the content type is set to PDF
                }
            ]
        });

        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending email' });
    }
});


module.exports = router;

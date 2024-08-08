const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const Patient = require('../models/Patient');
const Upload = require('../models/Upload');
const User = require('../models/User');
const requireAuth = require('../middleware/authMiddleware');
const dotenv = require('dotenv').config();

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const router = express.Router();

// Storage for file processing
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Storage for sending emails
const memoryStorage = multer.memoryStorage();

const uploadToDisk = multer({ storage: diskStorage });
const uploadToMemory = multer({ storage: memoryStorage });

router.post('/', requireAuth, uploadToDisk.single('image'), async (req, res) => {
    const { patientId, description, bodyPart } = req.body;
    const imagePath = req.file.path;

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

        const processedImgPath = path.join('uploads', path.basename(prediction.image_path));
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
            imgUrl: `/uploads/${req.file.filename}`,
            processedImgId: processedImgId,
            processedImgUrl: `/uploads/${processedImgId}`,
            dateUploaded: new Date(),
            prediction: { boxes: prediction.boxes, confidences: prediction.confidences },
            createdByUser: req.user.id
        });

        await newUpload.save();
        res.status(201).json({ newUpload, processedImagePath: newUpload.processedImgUrl });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Endpoint to fetch uploads for a specific patient
router.get('/:patientId', requireAuth, async (req, res) => {
    try {
        const uploads = await Upload.find({ patient: req.params.patientId }).exec();
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

router.post('/send-email', uploadToMemory.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { patientName, email } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    try {
        let info = await transporter.sendMail({
            from: '"Your Name" <mailfractions@gmail.com>',
            to: email,
            subject: `Medical Report for ${patientName}`,
            text: `Please find attached the medical report for ${patientName}.`,
            attachments: [
                {
                    filename: req.file.originalname,
                    content: req.file.buffer,
                    contentType: 'application/pdf'
                }
            ]
        });

        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending email' });
    }
});

router.post('/share', requireAuth, async (req, res) => {
    const { uploadId, email } = req.body;

    try {
        // Ensure upload exists
        const upload = await Upload.findById(uploadId).populate('patient createdByUser');
        if (!upload) {
            console.error('Upload not found');
            return res.status(404).json({ error: 'Upload not found' });
        }

        // Ensure recipient doctor exists
        const recipientDoctor = await User.findOne({ email });
        if (!recipientDoctor) {
            console.error('Recipient doctor not found');
            return res.status(404).json({ error: 'Recipient doctor not found' });
        }

        // Add shared upload to recipient's profile
        recipientDoctor.sharedUploads = recipientDoctor.sharedUploads || [];
        recipientDoctor.sharedUploads.push(uploadId);
        await recipientDoctor.save();

        res.status(200).json({ message: 'Upload details shared successfully' });
    } catch (error) {
        console.error('Error sharing upload details:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
router.post('/share/patient/:patientId', requireAuth, async (req, res) => {
    const { patientId } = req.params;
    const { email } = req.body;

    console.log('Received request to share uploads for patient:', patientId);

    try {
        const uploads = await Upload.find({ patient: patientId }).exec();

        if (!uploads.length) {
            console.log('No uploads found for this patient');
            return res.status(404).json({ error: 'No uploads found for this patient' });
        }

        console.log('Uploads found:', uploads);

        const recipientDoctor = await User.findOne({ email });
        if (!recipientDoctor) {
            console.log('Recipient doctor not found');
            return res.status(404).json({ error: 'Recipient doctor not found' });
        }

        console.log('Recipient doctor found:', recipientDoctor);

        recipientDoctor.sharedUploads = recipientDoctor.sharedUploads || [];
        uploads.forEach(upload => {
            if (!recipientDoctor.sharedUploads.includes(upload._id)) {
                recipientDoctor.sharedUploads.push(upload._id);
            }
        });
        await recipientDoctor.save();

        res.status(200).json({ message: 'Patient uploads shared successfully' });
    } catch (error) {
        console.error('Error sharing patient uploads:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
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

const uploadToDisk = multer({ storage: diskStorage });

router.post('/', requireAuth, uploadToDisk.array('images'), async (req, res) => {
    const { id, description, bodyPart } = req.body;
    
    // req.files is an array of files
    const imagePaths = req.files.map(file => file.path);

    try {
        const startTime = Date.now(); // Start time

        // Process each image individually
        const predictions = await Promise.all(imagePaths.map(async (imagePath) => {
            const { stdout, stderr } = await execPromise(`python predict.py "${imagePath}"`);
            if (stderr) {
                throw new Error('Error running prediction script');
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
                throw new Error('Error parsing prediction output');
            }

            const processedImgPath = path.join('uploads', path.basename(prediction.image_path));
            const processedImgId = path.basename(processedImgPath);

            return { imagePath, processedImgId, processedImgPath, prediction };
        }));

        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Save each upload to the database
        const uploads = await Promise.all(predictions.map(async ({ imagePath, processedImgId, processedImgPath, prediction }) => {
            const newUpload = new Upload({
                patient: id,
                patientName: patient.name,
                description,
                bodyPart,
                imgId: path.basename(imagePath),
                imgUrl: `/${imagePath}`,
                processedImgId: processedImgId,
                processedImgUrl: `/${processedImgPath}`,
                dateUploaded: new Date(),
                prediction: { boxes: prediction.boxes, confidences: prediction.confidences },
                createdByUser: req.user.id
            });

            return newUpload.save();
        }));

        const endTime = Date.now(); // End time
        const processingTime = (endTime - startTime) / 1000; // Processing time in seconds

        res.status(201).json({ 
            uploads, 
            processingTime  // Send processing time to frontend
        });
    } catch (error) {
        console.error('Error during upload processing:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});


// Endpoint to fetch uploads for a specific patient
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const uploads = await Upload.find({ patient: req.params.id }).exec();
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


// router.post('/send-email', uploads.single('pdf'), async (req, res) => {
//     const { patientName, email } = req.body;
//     const pdfBuffer = req.file.buffer;

//     const transporter = req.app.locals.emailTransporter;

//     const mailOptions = {
//         from: process.env.EMAIL,
//         to: email,
//         subject: 'Prediction Results',
//         text: `Please find attached the upload details for patient: ${patientName}`,
//         attachments: [
//             {
//                 filename: `upload_details_${patientName}.pdf`,
//                 content: pdfBuffer,
//             },
//         ],
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.json({ message: 'Email sent successfully' });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).json({ error: 'Error sending email. Please try again later.' });
//     }
// });

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

router.post('/share/patient/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    try {
        const uploads = await Upload.find({ patient: id }).exec();

        if (!uploads.length) {
            console.log('No uploads found for this patient');
            return res.status(404).json({ error: 'No uploads found for this patient' });
        }

        const recipientDoctor = await User.findOne({ email });
        if (!recipientDoctor) {
            console.log('Recipient doctor not found');
            return res.status(404).json({ error: 'Recipient doctor not found' });
        }

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

const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const Patient = require('./models/Patient');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

mongoose.connect(process.env.MONGO_URI, {})
    .then(async () => {
        console.log('Database is connected... :)');
        await Patient.init();
    })
    .catch((err) => console.log('Database not connected... :(', err));

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // convert string to boolean
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify the transporter configuration
transporter.verify(function(error, success) {
    if (error) {
         console.log(error);
    } else {
         console.log("Server is ready to take our messages");
    }
});

// Make the transporter available to your route handlers
app.locals.emailTransporter = transporter;

// Routes
app.use('/', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/uploads', require('./routes/uploadRoutes'));
app.use('/patients', require('./routes/patientRoutes'));


// Email
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
    const { from_name, from_email, message, reply_to } = req.body;

    // Check that the recipient email is defined
    if (!process.env.RECEIVER_EMAIL) {
        return res.status(500).json({ success: false, error: 'Receiver email is not defined' });
    }

    const mailOptions = {
        from: from_email, // Sender's email
        to: process.env.RECEIVER_EMAIL, // Recipient's email address
        subject: `Message from ${from_name} (${from_email})`, // Subject with sender's name and email
        text: `You have a new message from ${from_name} (${from_email}):

        ${message}`, // Body with sender's name and email
        replyTo: reply_to,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        res.json({ success: true, result: info.response });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
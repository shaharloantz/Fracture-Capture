const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const Patient = require('./models/Patient');
const nodemailer = require('nodemailer');

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

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
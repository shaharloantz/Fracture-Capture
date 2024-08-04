const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const Patient = require('./models/Patient'); // Ensure the path is correct

mongoose.connect(process.env.MONGO_URI, {})
    .then(async () => {
        console.log('Database is connected... :)');
        await Patient.init(); // Ensure indexes are created
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

// Ensure the path to uploadRoutes is correct
app.use('/uploads', require('./routes/uploadRoutes'));

app.use('/', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes')); 

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

const express = require('express');
const router = express.Router();
const cors = require('cors');
const { registerUser, loginUser } = require('../controllers/authCtrl');
const patientRoutes = require('./patientRoutes');
const uploadRoutes = require('./uploadRoutes');

// Middleware
router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

router.get('/', (req, res) => {
    res.send('Welcome to the API server');
});

router.post('/register', registerUser); // Registration route
router.post('/login', loginUser); // Login route
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});
router.use('/patients', patientRoutes);
router.use('/uploads', uploadRoutes);

module.exports = router;

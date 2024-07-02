const express = require('express');
const router = express.Router();
const cors = require('cors');
const { registerUser, loginUser } = require('../controllers/authCtrl');

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

module.exports = router;

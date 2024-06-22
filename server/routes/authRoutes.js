const express = require('express');
const router = express.Router();
const cors = require('cors');
const {registerUser } = require('../controllers/authCtrl');

// Middleware
router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

router.get('/', (req, res) => {
    
    res.send('Welcome to the API server'); // Adjust as per your application's needs
    
});

router.post('/register', registerUser); // Registration route

module.exports = router;

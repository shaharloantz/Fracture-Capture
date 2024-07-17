const express = require('express');
const requireAuth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Patient = require('../models/Patient');

const router = express.Router();

router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const patients = await Patient.find({ createdByUser: req.user.id }).populate('createdByUser', 'name');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            name: user.name,
            email: user.email,
            message: `Welcome, ${user.name}!`,
            patients
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

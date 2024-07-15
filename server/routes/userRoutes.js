const express = require('express');
const requireAuth = require('../middleware/authMiddleware');
const User = require('../models/user');

const router = express.Router();

router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

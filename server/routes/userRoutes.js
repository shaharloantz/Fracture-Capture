const express = require('express');
const bcrypt = require('bcryptjs');
const requireAuth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Patient = require('../models/Patient');

const router = express.Router();

router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').lean();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const patients = await Patient.find({ createdByUser: req.user.id });
        res.json({ ...user, patients });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/change-password', requireAuth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if current password matches
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash the new password and update the user
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get shared uploads
router.get('/shared-uploads', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'sharedUploads',
            populate: {
                path: 'patient'
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.sharedUploads);
    } catch (error) {
        console.error('Error fetching shared uploads:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;

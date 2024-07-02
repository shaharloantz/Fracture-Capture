const User = require('../models/user');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT tokens

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if name was entered
        if (!name) {
            return res.status(400).json({ error: 'Name is required!' });
        }
        // Check if password was entered and valid
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password is required and should be at least 6 characters!' });
        }
        // Check if email is unique
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ error: 'Email is already taken!' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json(user);

    } catch (error) {
        console.log('Error when creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required!' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password!' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password!' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });

    } catch (error) {
        console.log('Error when logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    registerUser,
    loginUser
};

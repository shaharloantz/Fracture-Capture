const User = require('../models/User');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // our cookies, only after Login
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure your SMTP settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password
    },
    
});


// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        // Check if password length is at least 6 characters
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password should be at least 6 characters!' });
        }

        // Check if email is unique
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ error: 'Email is already taken!' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({ name, email, password: hashedPassword });
        return res.status(201).json(user);
    } catch (error) {
        console.log('Error when creating user: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });
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

        // Sign JWT and set cookie
        jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json(user);
        });
    } catch (error) {
        console.log('Error when logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User with this email does not exist.' });
        }

        // Generate a reset token
        const resetToken = generateNumericToken()

        // Send email
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset',
            text: `Your password reset token is: ${resetToken}`,
    
        };
       
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("The error is :",error)
                return res.status(500).json({ error: 'Error sending email. Please try again later.' });
            } else {
                res.json({ message: 'Password reset token sent to email.' });
            }
            
        });

        // Save the reset token to the user (optional)
        user.resetToken = resetToken;
        await user.save();

    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;

    try {
        // Find the user by the resetToken
        const user = await User.findOne({ resetToken });

        // Check if the user exists and token is valid
        if (!user) {
            return res.status(400).json({ error: 'Invalid token or user does not exist.' });
        }

        // Verify the token (using the same secret used to sign the token)
        try {
            if (resetToken != user.resetToken) {
                return res.status(400).json({ error: 'Invalid token.' });
            }
        } catch (err) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetToken = undefined; // Clear the reset token
        await user.save();

        res.json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('Server error:', error); // Log the error for debugging
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};



function generateNumericToken(length = 5) {
    let token = '';
    const characters = '0123456789';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }
    return token;
}


module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
};
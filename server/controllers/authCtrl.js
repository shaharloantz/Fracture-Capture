const User = require('../models/user');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // our cookies, only after Login

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
        else{
            jwt.sign({email:user.email, id:user._id, name:user.name},process.env.JWT_SECRET, {},(err,token) => {
                if(err) throw err;
                res.cookie('token',token).json(user)            
            }) // this the info for the cookie
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log('Error when logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    registerUser,
    loginUser
};

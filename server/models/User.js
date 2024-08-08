const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String, required: false }, 
    numberOfPatients: { type: Number, default: 0 } ,
    sharedUploads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Upload' }]
}, { timestamps: true });

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;

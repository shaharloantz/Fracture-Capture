const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String, required: false }, 
    numberOfPatients: { type: Number, default: 0 },
    sharedUploads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Upload' }],
    sharedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],  // Add this line
    isAdmin: { type: Boolean, default: false } 
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

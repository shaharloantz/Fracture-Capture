const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    numberOfPatients: { type: Number, default: 0 },
    sharedUploads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Upload' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

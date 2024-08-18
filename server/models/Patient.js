const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    createdByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    idNumber: { type: Number, required: true },
    gender: { type: String, required: true },
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Adding a unique index on user and idNumber combination
patientSchema.index({ createdByUser: 1, idNumber: 1 }, { unique: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
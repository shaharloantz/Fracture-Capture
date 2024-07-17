const mongoose = require('mongoose');


const patientSchema = new mongoose.Schema({
    patientId: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now,
    },
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;

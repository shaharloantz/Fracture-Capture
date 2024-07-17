const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    description: { type: String, required: true },
    bodyPart: { type: String, required: true },
    imgId: { type: String, required: true },
    dateUploaded: { type: Date, default: Date.now },
    prediction: { type: Number, required: true }, // Assuming prediction is a percentage
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true } // Reference to the Patient model
}, { timestamps: true });

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;

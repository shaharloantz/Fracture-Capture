const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    patientName: { type: String, required: true },
    description: { type: String, required: true },
    bodyPart: { type: String, required: true },
    imgId: { type: String, required: true },
    imgUrl: { type: String, required: true },
    dateUploaded: { type: Date, default: Date.now },
    prediction: { type: Number, default: null }, // Assuming prediction can be null initially
    createdByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;

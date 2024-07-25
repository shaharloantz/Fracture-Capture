const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    description: { type: String, required: true },
    bodyPart: { type: String, required: true },
    imgId: { type: String, required: true },
    imgUrl: { type: String, required: true },
    processedImgId: { type: String, default: null }, // New field for processed image ID
    processedImgUrl: { type: String, default: null }, // New field for processed image URL
    dateUploaded: { type: Date, default: Date.now },
    prediction: { type: mongoose.Schema.Types.Mixed, default: null },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    createdByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;

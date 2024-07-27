const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    description: { type: String, required: true },
    bodyPart: { type: String, required: true },
    imgId: { type: String, required: true },
    imgUrl: { type: String, required: true },
    processedImgId: { type: String, default: null },
    processedImgUrl: { type: String, default: null },
    dateUploaded: { type: Date, default: Date.now },
    prediction: {
        boxes: [{ type: [Number], required: true }],  // Array of box coordinates
        confidences: [{ type: Number, required: true }]  // Array of confidence scores
    },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    createdByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });


const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;

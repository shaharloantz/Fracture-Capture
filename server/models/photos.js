const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the images collection
const photsSchema = new Schema({
    bodyPart: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    imageID: {
        type: String,
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a model based on the schema
const BodyPartImage = mongoose.model('BodyPartImage', photsSchema);

module.exports = BodyPartImage;

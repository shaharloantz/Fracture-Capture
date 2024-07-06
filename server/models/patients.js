const { Int32 } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the images collection
const patients = new Schema({
    bodyPart: {
        type: String,
        required: true,
    },
    imageID: { // Primary key to its related image
        type: String,
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    patientID: {
        type: String,
        required: true,
    },
    patientAge: {
        type: Int32,
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
const BodyPartImage = mongoose.model('BodyPartImage', bodyPartSchema);

module.exports = BodyPartImage;

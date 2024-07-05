const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the images collection
const bodyPartSchema = new Schema({
    bodyPart: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    isFraction: {
        type: Boolean,
        required: true,
        
    },
    description: {
        type: String,
    },
    tags: [{
        type: String,
    }],
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to a User model if you have user authentication
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a model based on the schema
const BodyPartImage = mongoose.model('BodyPartImage', bodyPartSchema);

module.exports = BodyPartImage;

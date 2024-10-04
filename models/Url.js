const mongoose = require('mongoose');
const shortid = require('shortid');  // To generate unique short URLs

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true,
        trim: true
    },
    shortCode: {
        type: String,
        required: true,
        default: shortid.generate, // Automatically generates a short code
        unique: true
    },
    clicks: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    expiresAt: {
        type: Date,
        default: Date.now() + 1 * 24 * 60 * 60 * 1000
    }
});

module.exports = mongoose.model('Url', urlSchema);

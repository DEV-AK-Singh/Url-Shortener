const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    shortCode: {
        type: String,
        required: true,
        ref: 'Url' // Reference to the Url model
    },
    referrer: String,     // e.g., the site where the link was clicked
    ip: String,           // User's IP address for geolocation tracking
    browser: String,      // Browser user agent info
    platform: String,     // Platform like mobile or desktop
    clickedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Analytics', analyticsSchema);

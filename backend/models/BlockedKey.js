const mongoose = require('mongoose');

const blockedKeySchema = new mongoose.Schema({
    accessCode: {
        type: String,
        required: true,
        unique: true
    },
    reason: {
        type: String,
        default: 'Security Timeout'
    },
    blockedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BlockedKey', blockedKeySchema);

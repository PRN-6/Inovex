const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    accessCode: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    action: {
        type: String,
        default: 'LOGIN'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AdminLog', adminLogSchema);

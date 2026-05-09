const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true,
        trim: true
    },
    type: { 
        type: String, 
        required: true,
        enum: ['feedback', 'bug', 'idea', 'other']
    },
    message: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);

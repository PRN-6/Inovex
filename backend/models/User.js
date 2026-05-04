const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    college: {
        type: String,
        required: [true, 'College name is required'],
        trim: true
    },
    usn: {
        type: String,
        required: [true, 'USN is required'],
        trim: true,
        uppercase: true
    },
    year: {
        type: String,
        required: [true, 'Year of study is required']
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    registrations: [{
        eventName: String,
        teammates: [{
            name: String,
            usn: String,
            email: String
        }]
    }],

    registrationDate: {
        type: Date,
        default: Date.now
    },
    lastEmailSentAt: {
        type: Date
    },
    participantId: {
        type: String,
        unique: true,
        sparse: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    }
});

// Auto-generate Participant ID before saving
userSchema.pre('save', async function() {
    if (!this.participantId) {
        try {
            const { generateParticipantId } = require('../utils/idGenerator');
            this.participantId = await generateParticipantId();
        } catch (error) {
            console.error("Error generating Participant ID in hook:", error);
        }
    }
});

// Optimization: Add indexes for speed (removed unique constraints to allow multiple registrations)
userSchema.index({ email: 1 });
userSchema.index({ usn: 1 });
userSchema.index({ registrationDate: -1 });

const User = mongoose.model('User', userSchema);

module.exports = User;

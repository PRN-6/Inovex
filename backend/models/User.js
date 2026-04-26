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
    amount: Number,
    transactionId: String,
    paymentStatus: {
        type: String,
        default: 'pending',
        enum: ['pending', 'verified', 'failed']
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

// Optimization: Add indexes for faster lookups
userSchema.index({ email: 1 });
userSchema.index({ usn: 1 });
userSchema.index({ registrationDate: -1 });

const User = mongoose.model('User', userSchema);

module.exports = User;

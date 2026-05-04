const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { registerLimiter } = require('../middlewares/rateLimiter');
const { sendConfirmationEmail } = require('../utils/emailService');
const { upload } = require('../config/cloudinaryConfig');




// @route   POST /api/register
// @desc    Register participant
router.post('/register', registerLimiter, async (req, res) => {
    console.log("!!! HITTING THE NEW REGISTRATION ROUTE - NO PAYMENT LOGIC !!!");
    if (process.env.MAINTENANCE_MODE === 'true') {
        return res.status(503).json({ 
            success: false, 
            message: "EXPEDITION HALTED: The registration system is currently undergoing maintenance." 
        });
    }

    try {
        let { 
            name, email, phone, college, usn, year, department, registrations,
            hp_field 
        } = req.body;

        if (hp_field) {
            return res.status(400).json({ success: false, message: "UNAUTHORIZED: Automated access detected." });
        }

        // Create a new registration entry every time (Duplicates allowed as per request)
        const user = new User({
            name, email, phone, college, usn: usn.toUpperCase(), year, department, registrations,
            registrationDate: new Date()
        });

        await user.save();
        console.log(`✅ New Registration: ${name}`);
        sendConfirmationEmail(user).catch(err => console.error("Email Error:", err));

        res.status(201).json({
            success: true,
            message: "Registration successful! Welcome to the expedition.",
            participantId: user.participantId
        });

    } catch (error) {
        console.error('Registration Error:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                success: false, 
                message: `DUPLICATE ASSET: This ${field.toUpperCase()} is already in use.` 
            });
        }
        res.status(500).json({ success: false, message: "Server Error. Please try again later." });
    }
});

// @route   GET /api/check-registration/:usn
router.get('/check-registration/:usn', async (req, res) => {
    try {
        const { usn } = req.params;
        const user = await User.findOne({ usn: usn.toUpperCase() });
        res.json({ success: true, registeredEvents: user ? user.registrations.map(r => r.eventName) : [] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Verification failed" });
    }
});

module.exports = router;

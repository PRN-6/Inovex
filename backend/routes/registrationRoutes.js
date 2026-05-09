const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { registerLimiter } = require('../middlewares/rateLimiter');
const { sendConfirmationEmail } = require('../utils/emailService');
const { upload } = require('../config/cloudinaryConfig');




// @route   POST /api/register
// @desc    Register participant
router.post('/register', (req, res, next) => {
    // Wrap multer to catch its errors specifically
    upload.single('screenshot')(req, res, (err) => {
        if (err) {
            console.error("❌ PAYMENT UPLOAD ERROR:", err);
            return res.status(400).json({ 
                success: false, 
                message: `UPLOAD FAILED: ${err.message || 'Check your internet or file type.'}` 
            });
        }
        next();
    });
}, async (req, res) => {
    console.log("🛠️ PROCESSING EXPEDITION REGISTRATION...");
    
    if (process.env.MAINTENANCE_MODE === 'true') {
        return res.status(503).json({ 
            success: false, 
            message: "EXPEDITION HALTED: System maintenance in progress." 
        });
    }

    try {
        let data = req.body;
        
        // Handle parsing if sent as a single field
        if (data.data && typeof data.data === 'string') {
            try {
                data = JSON.parse(data.data);
            } catch (e) {
                console.error("❌ JSON PARSE ERROR:", e);
                return res.status(400).json({ success: false, message: "INVALID DATA FORMAT: Could not parse registration info." });
            }
        }

        const { 
            name, email, phone, college, year, department, registrations,
            category, hp_field 
        } = data;

        if (hp_field) {
            return res.status(400).json({ success: false, message: "SECURITY ALERT: Automated access detected." });
        }

        // Basic validation
        if (!name || !email || !registrations) {
            return res.status(400).json({ success: false, message: "INTEL INCOMPLETE: Missing required fields." });
        }

        const screenshotUrl = req.file ? req.file.path : '';

        // Create a new registration entry
        const user = new User({
            name, email, phone, college, year, department, registrations,
            category,
            screenshotUrl,
            registrationDate: new Date()
        });

        await user.save();
        console.log(`✅ EXPEDITION JOINED: ${name} [ID: ${user.participantId}]`);
        
        // Async email dispatch
        sendConfirmationEmail(user).catch(err => console.error("📧 EMAIL DISPATCH FAILED:", err.message));

        res.status(201).json({
            success: true,
            message: "REGISTRATION SECURED: Welcome to the expedition.",
            participantId: user.participantId
        });

    } catch (error) {
        console.error('❌ REGISTRATION CRITICAL ERROR:', error);
        res.status(500).json({ 
            success: false, 
            message: "EXPEDITION ERROR: Database sync failed. Please try again." 
        });
    }
});

// @route   GET /api/check-registration/:email
router.get('/check-registration/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email: email.toLowerCase() });
        res.json({ success: true, registeredEvents: user ? user.registrations.map(r => r.eventName) : [] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Verification failed" });
    }
});

module.exports = router;

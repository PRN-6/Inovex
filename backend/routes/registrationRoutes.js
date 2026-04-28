const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { registerLimiter } = require('../middlewares/rateLimiter');
const { sendConfirmationEmail } = require('../utils/emailService');

// @route   POST /api/register
// @desc    Register participant
router.post('/register', registerLimiter, async (req, res) => {
    if (process.env.MAINTENANCE_MODE === 'true') {
        return res.status(503).json({ 
            success: false, 
            message: "EXPEDITION HALTED: The registration system is currently undergoing maintenance." 
        });
    }

    try {
        const { 
            name, email, phone, college, usn, year, department, registrations, amount,
            transactionId, hp_field 
        } = req.body;

        if (hp_field) {
            return res.status(400).json({ success: false, message: "UNAUTHORIZED: Automated access detected." });
        }

        let user = await User.findOne({ usn: usn.toUpperCase() });

        // 1. Global Conflict Check: Ensure no teammate is already in these events
        for (const reg of registrations) {
            const allConflictUSNs = [usn.toUpperCase(), ...reg.teammates.map(t => t.usn.toUpperCase())];
            
            for (const checkUSN of allConflictUSNs) {
                // Check if this USN is a primary registrant for this event
                const primaryConflict = await User.findOne({ 
                    usn: checkUSN, 
                    "registrations.eventName": reg.eventName 
                });

                // Check if this USN is a teammate in any other team for this event
                const teammateConflict = await User.findOne({ 
                    "registrations": { 
                        $elemMatch: { 
                            "eventName": reg.eventName, 
                            "teammates.usn": checkUSN 
                        } 
                    } 
                });

                if (primaryConflict || teammateConflict) {
                    // Ignore if the conflict is actually with the user's OWN existing registration (handled by update logic later)
                    if (primaryConflict && primaryConflict.usn === usn.toUpperCase()) continue;

                    return res.status(400).json({ 
                        success: false, 
                        message: `CONFLICT DETECTED: Participant ${checkUSN} is already registered for ${reg.eventName}. Duplicate entries are not permitted.` 
                    });
                }
            }
        }

        // 2. Check if transactionId is already used by someone else
        if (transactionId && !transactionId.startsWith('DIR_')) {
            const existingPayment = await User.findOne({ 
                transactionId, 
                usn: { $ne: usn.toUpperCase() } 
            });
            if (existingPayment) {
                return res.status(400).json({ 
                    success: false, 
                    message: "PAYMENT ALREADY CLAIMED: This Transaction ID has already been submitted by another participant." 
                });
            }
        }

        if (user) {
            const existingEvents = user.registrations.map(r => r.eventName);
            const duplicateEvents = registrations.filter(r => existingEvents.includes(r.eventName));

            if (duplicateEvents.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: `ALREADY REGISTERED: You are already part of: ${duplicateEvents.map(e => e.eventName).join(', ')}.` 
                });
            }

            user.registrations.push(...registrations);
            user.amount = (user.amount || 0) + amount;
            user.transactionId = transactionId;
            user.paymentStatus = 'pending';
            user.phone = phone;
            user.email = email;

            await user.save();
            console.log(`✅ Registration Updated: ${name}`);
        } else {
            user = new User({
                name, email, phone, college, usn, year, department, registrations,
                amount,
                transactionId: transactionId || `DIR_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                paymentStatus: 'pending',
                registrationDate: new Date()
            });

            await user.save();
            console.log(`✅ New Registration: ${name}`);
        }

        res.status(201).json({
            success: true,
            message: "Registration received! Your quest logs will be updated once verified."
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

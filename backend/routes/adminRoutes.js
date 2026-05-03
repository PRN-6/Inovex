const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendConfirmationEmail } = require('../utils/emailService');

const EVENT_HEAD_CODES = {
    [process.env.KEY_TECH]: "Techsaurus",
    [process.env.KEY_SPY]: "Spy vs Spy – QR Treasure Hunt",
    [process.env.KEY_REXR]: "Rex Rampage",
    [process.env.KEY_CINE]: "Cinesaur: Reel Making",
    [process.env.KEY_DINOX]: "Dinox: From Design to Reality",
    [process.env.KEY_HACK]: "RexHack: Survival of the Smartest",
    [process.env.KEY_BATTLE]: "INOVEX: BATTLE NEXUS",
    [process.env.KEY_GENESIS]: "Genesis Reborn: Product Launch",
    [process.env.KEY_MUSIC]: "Music Battle",
    [process.env.KEY_QUIZ]: "Quiz Master",
    [process.env.KEY_DANCE]: "Dance Showdown",
    [process.env.KEY_ART]: "Art Exhibition"
};

// @route   GET /api/registrations
router.get('/registrations', async (req, res) => {
    try {
        const adminKey = req.headers['x-admin-key'];
        const secretKey = process.env.ADMIN_SECRET_KEY || 'INOVEX2026_ADMIN';
        const superSecretKey = process.env.SUPER_ADMIN_SECRET_KEY || 'INOVEX2026_SUPER';

        let query = {};
        let roleInfo = { clearance: 1, restrictedEvent: null };

        if (adminKey === superSecretKey) {
            roleInfo.clearance = 2;
        } else if (adminKey === secretKey) {
            roleInfo.clearance = 1;
        } else if (EVENT_HEAD_CODES[adminKey]) {
            roleInfo.clearance = 0.5;
            roleInfo.restrictedEvent = EVENT_HEAD_CODES[adminKey];
            query = { "registrations.eventName": roleInfo.restrictedEvent };
        } else {
            return res.status(401).json({ success: false, message: "Invalid Clearance Key" });
        }

        const registrations = await User.find(query).sort({ registrationDate: -1 });
        res.json({ success: true, count: registrations.length, data: registrations, role: roleInfo });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching data" });
    }
});

// @route   PATCH /api/registrations/:id/status
router.patch('/registrations/:id/status', async (req, res) => {
    try {
        const adminKey = req.headers['x-admin-key'];
        const secretKey = process.env.ADMIN_SECRET_KEY || 'INOVEX2026_ADMIN';
        const superSecretKey = process.env.SUPER_ADMIN_SECRET_KEY || 'INOVEX2026_SUPER';

        if (adminKey !== secretKey && adminKey !== superSecretKey) {
            return res.status(403).json({ success: false, message: "ADMIN clearance required" });
        }

        const { status } = req.body;
        
        // Find user first to check current status
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "Not found" });

        // If status is already verified and we are trying to set it to verified again, stop
        if (status === 'verified' && user.paymentStatus === 'verified') {
            return res.status(400).json({ success: false, message: "Participant is already verified. Use 'Resend Email' if needed." });
        }

        user.paymentStatus = status;
        
        let emailSent = false;
        if (status === 'verified') {
            console.log(`[DEBUG] Attempting to send verification email to: ${user.email}`);
            const emailResult = await sendConfirmationEmail(user);
            if (emailResult.success) {
                console.log(`[DEBUG] Email sent successfully to ${user.email}`);
                emailSent = true;
                user.lastEmailSentAt = new Date();
            } else {
                console.error("[DEBUG] Email dispatch failed:", emailResult.error);
            }
        } else {
            console.log(`[DEBUG] Status updated to ${status}, no email sent.`);
        }

        await user.save();

        res.json({ 
            success: true, 
            message: `Status updated to ${status}${emailSent ? ' and confirmation email sent' : ''}`, 
            emailSuccess: emailSent,
            data: user 
        });
    } catch (error) {
        console.error("STATUS UPDATE ERROR:", error);
        res.status(500).json({ success: false, message: "Update failed", error: error.message });
    }
});

// @route   POST /api/registrations/:id/resend-email
router.post('/registrations/:id/resend-email', async (req, res) => {
    try {
        const adminKey = req.headers['x-admin-key'];
        const secretKey = process.env.ADMIN_SECRET_KEY || 'INOVEX2026_ADMIN';
        const superSecretKey = process.env.SUPER_ADMIN_SECRET_KEY || 'INOVEX2026_SUPER';

        if (adminKey !== secretKey && adminKey !== superSecretKey) {
            return res.status(403).json({ success: false, message: "ADMIN clearance required" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "Asset not found" });

        // Cooldown logic: 2 minutes (120,000 ms)
        const COOLDOWN_TIME = 2 * 60 * 1000;
        const lastSent = user.lastEmailSentAt ? new Date(user.lastEmailSentAt).getTime() : 0;
        
        if (lastSent > 0 && (Date.now() - lastSent < COOLDOWN_TIME)) {
            const remaining = Math.ceil((COOLDOWN_TIME - (Date.now() - lastSent)) / 1000);
            return res.status(429).json({ 
                success: false, 
                message: `COOLDOWN ACTIVE: Please wait ${remaining} seconds before resending.` 
            });
        }

        const emailResult = await sendConfirmationEmail(user);
        if (emailResult.success) {
            user.lastEmailSentAt = new Date();
            await user.save();
            res.json({ success: true, message: "Confirmation email dispatched successfully" });
        } else {
            res.status(500).json({ success: false, message: "Email dispatch failed", error: emailResult.error });
        }
    } catch (error) {
        console.error("RESEND EMAIL ERROR:", error);
        res.status(500).json({ success: false, message: "Server error during resend", error: error.message });
    }
});

// @route   DELETE /api/registrations/:id
router.delete('/registrations/:id', async (req, res) => {
    try {
        const adminKey = req.headers['x-admin-key'];
        const superSecretKey = process.env.SUPER_ADMIN_SECRET_KEY || 'INOVEX2026_SUPER';

        if (adminKey !== superSecretKey) {
            return res.status(403).json({ success: false, message: "SUPER ADMIN clearance required" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Asset purged" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Purge failed" });
    }
});

module.exports = router;

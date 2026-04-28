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
        const user = await User.findByIdAndUpdate(req.params.id, { paymentStatus: status }, { new: true });

        if (!user) return res.status(404).json({ success: false, message: "Not found" });

        if (status === 'verified') {
            sendConfirmationEmail(user).catch(err => console.error("Email Error:", err));
        }

        res.json({ success: true, message: `Status updated to ${status}`, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
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

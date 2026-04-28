const express = require('express');
const router = express.Router();
const { sendFeedbackEmail } = require('../utils/emailService');

// @route   GET /api/status
router.get('/status', (req, res) => {
    res.json({ 
        maintenance: process.env.MAINTENANCE_MODE === 'true', 
        maintenanceUntil: process.env.MAINTENANCE_UNTIL 
    });
});

// @route   POST /api/feedback
router.post('/feedback', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        await sendFeedbackEmail({ name, email, message });
        res.status(200).json({ success: true, message: "Feedback transmitted." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Transmission failed." });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

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
        const { name, email, type, message } = req.body;
        
        // Persist to Database
        const feedback = new Feedback({
            name,
            email,
            type,
            message
        });
        await feedback.save();

        // Dispatch Email
        await sendFeedbackEmail({ name, email, type, message });
        
        res.status(200).json({ success: true, message: "Transmission logged and dispatched." });
    } catch (error) {
        console.error("FEEDBACK ERROR:", error);
        res.status(500).json({ success: false, message: "Transmission failed." });
    }
});

module.exports = router;

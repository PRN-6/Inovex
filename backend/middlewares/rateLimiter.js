const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Increased for testing and high-traffic events
    message: { 
        success: false, 
        message: "TOO MANY ATTEMPTS: Your access has been temporarily throttled to prevent spam. Please try again in 15 minutes." 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { registerLimiter };

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const User = require('./models/User');
const { sendConfirmationEmail } = require('./utils/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Request logging
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Body limit for security

// Rate Limiter for Registrations (Spam Protection)
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 registration attempts per window
    message: { 
        success: false, 
        message: "TOO MANY ATTEMPTS: Your access has been temporarily throttled to prevent spam. Please try again in 15 minutes." 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// API Routes

// @route   POST /api/create-order
// @desc    Create a Razorpay order
app.post('/api/create-order', async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('Order Creation Error:', error);
        res.status(500).json({ success: false, message: "Could not initiate payment" });
    }
});

// @route   POST /api/register
// @desc    Register participant directly
app.post('/api/register', registerLimiter, async (req, res) => {
    // Maintenance Mode Check
    if (process.env.MAINTENANCE_MODE === 'true') {
        return res.status(503).json({ 
            success: false, 
            message: "EXPEDITION HALTED: The registration system is currently undergoing maintenance. Please try again later." 
        });
    }

    try {
        const { 
            name, email, phone, college, usn, year, department, registrations, amount,
            transactionId, 
            hp_field // Honeypot field
        } = req.body;

        // BOT CHECK: If honeypot field is filled, reject immediately
        if (hp_field) {
            console.warn(`🚨 BOT DETECTED: Automated submission attempt blocked.`);
            return res.status(400).json({ success: false, message: "UNAUTHORIZED: Automated access detected." });
        }

        // 1. Check if user already exists in the system
        let user = await User.findOne({ usn: usn.toUpperCase() });

        if (user) {
            // 2. Check if they are trying to register for an event they are already in
            const existingEvents = user.registrations.map(r => r.eventName);
            const duplicateEvents = registrations.filter(r => existingEvents.includes(r.eventName));

            if (duplicateEvents.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: `ALREADY REGISTERED: You are already part of: ${duplicateEvents.map(e => e.eventName).join(', ')}.` 
                });
            }

            // 3. Append new registrations to existing user
            user.registrations.push(...registrations);
            user.amount = (user.amount || 0) + amount;
            
            // Optionally update contact info if it changed
            user.phone = phone;
            user.email = email;

            await user.save();
            console.log(`✅ Registration Updated: ${name} added ${registrations.length} new event(s)`);

        } else {
            // 4. Create new user record
            user = new User({
                name, email, phone, college, usn, year, department, registrations,
                amount,
                transactionId: transactionId || `DIR_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                paymentStatus: 'verified',
                registrationDate: new Date()
            });

            await user.save();
            console.log(`✅ New Registration: ${name} (Amount: ${amount})`);
        }

        // Send email in background (non-blocking)
        sendConfirmationEmail(user)
            .catch(err => console.error("Background Email Error:", err));

        res.status(201).json({
            success: true,
            message: "Registration successful! Your quest logs have been updated."
        });

    } catch (error) {
        console.error('Registration Error:', error);
        
        // Handle MongoDB Duplicate Key Error (Code 11000)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                success: false, 
                message: `DUPLICATE ASSET: A participant with this ${field.toUpperCase()} is already in the database.` 
            });
        }

        res.status(500).json({ success: false, message: "Server Error. Please try again later." });
    }
});

// @route   GET /api/status
// @desc    Check system status
app.get('/api/status', (req, res) => {
    res.json({ 
        maintenance: process.env.MAINTENANCE_MODE === 'true',
        maintenanceUntil: process.env.MAINTENANCE_UNTIL || null
    });
});

// @route   GET /api/registrations
// @desc    Get all registrations (Protected)
app.get('/api/registrations', async (req, res) => {
    try {
        const adminKey = req.headers['x-admin-key'];
        const secretKey = process.env.ADMIN_SECRET_KEY || 'INOVEX2026_ADMIN';
        const superSecretKey = process.env.SUPER_ADMIN_SECRET_KEY || 'INOVEX2026_SUPER';

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

        let query = {};

        // Check if the key matches Super Admin or Admin
        if (adminKey === secretKey || adminKey === superSecretKey) {
            // Full database access
            query = {};
        } else if (EVENT_HEAD_CODES[adminKey]) {
            // Restricted access: Only find users who registered for their specific event
            const eventName = EVENT_HEAD_CODES[adminKey];
            query = { "registrations.eventName": eventName };
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized access: Invalid Clearance Key" });
        }

        const registrations = await User.find(query).sort({ registrationDate: -1 });
        
        // Determine role info for the frontend
        let roleInfo = {
            clearance: 1,
            restrictedEvent: null
        };

        if (adminKey === superSecretKey) {
            roleInfo.clearance = 2;
        } else if (EVENT_HEAD_CODES[adminKey]) {
            roleInfo.clearance = 0.5;
            roleInfo.restrictedEvent = EVENT_HEAD_CODES[adminKey];
        }

        res.json({ 
            success: true, 
            count: registrations.length, 
            data: registrations,
            role: roleInfo 
        });
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ success: false, message: "Error fetching synchronization data" });
    }
});

// @route   DELETE /api/registrations/:id
// @desc    Delete a registration (Super Admin Only)
app.delete('/api/registrations/:id', async (req, res) => {
    try {
        const adminKey = req.headers['x-admin-key'];
        const superSecretKey = process.env.SUPER_ADMIN_SECRET_KEY || 'INOVEX2026_SUPER';

        if (adminKey !== superSecretKey) {
            return res.status(403).json({ success: false, message: "SUPER ADMIN clearance required for deletion" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Asset purged from system" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Purge failed" });
    }
});

app.get('/', (req, res) => {
    res.send('INOVEX Backend is Running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server launched on port ${PORT}`);
});

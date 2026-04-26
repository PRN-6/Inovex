require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const Razorpay = require('razorpay');
const crypto = require('crypto');
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
app.post('/api/register', async (req, res) => {
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
            transactionId 
        } = req.body;

        const newUser = new User({
            name, email, phone, college, usn, year, department, registrations,
            amount,
            transactionId: transactionId || `DIR_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            paymentStatus: 'verified',
            registrationDate: new Date()
        });

        await newUser.save();

        // Send email in background (non-blocking)
        sendConfirmationEmail(newUser)
            .catch(err => console.error("Background Email Error:", err));

        console.log(`✅ New Registration: ${name} (Amount: ${amount})`);

        res.status(201).json({
            success: true,
            message: "Registration successful! Good luck, Legend."
        });

    } catch (error) {
        console.error('Registration Error:', error);
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

        // Check if the key matches either level
        if (adminKey !== secretKey && adminKey !== superSecretKey) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const registrations = await User.find().sort({ registrationDate: -1 });
        res.json({ success: true, count: registrations.length, data: registrations });
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ success: false, message: "Error fetching data" });
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

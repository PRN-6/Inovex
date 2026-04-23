require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
app.use(cors());
app.use(express.json());

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
// @desc    Verify payment and register participant
app.post('/api/register', async (req, res) => {
    try {
        const { 
            name, email, phone, college, usn, year, department, registrations, amount,
            razorpay_order_id, razorpay_payment_id, razorpay_signature 
        } = req.body;

        // Verify Razorpay Signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        const newUser = new User({
            name, email, phone, college, usn, year, department, registrations,
            amount,
            transactionId: razorpay_payment_id,
            paymentStatus: 'verified'
        });

        await newUser.save();
        await sendConfirmationEmail(newUser);

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

// @route   GET /api/registrations
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await User.find().sort({ registrationDate: -1 });
        res.json({ success: true, count: registrations.length, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching data" });
    }
});

app.get('/', (req, res) => {
    res.send('INOVEX Backend is Running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server launched on port ${PORT}`);
});

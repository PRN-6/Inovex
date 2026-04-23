require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const { sendConfirmationEmail } = require('./utils/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

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

// @route   POST /api/register
// @desc    Register a new participant
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, phone, college, usn, year, department, event } = req.body;

        // Basic validation check
        if (!name || !email || !phone || !usn || !event) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide all required fields" 
            });
        }

        const newUser = new User({
            name,
            email,
            phone,
            college,
            usn,
            year,
            department,
            event
        });

        await newUser.save();
        
        // Trigger Email Dispatch
        await sendConfirmationEmail(newUser);
        
        console.log(`New Registration: ${name} for ${event}`);
        
        res.status(201).json({ 
            success: true, 
            message: "Registration successful! Good luck, Legend." 
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error. Please try again later." 
        });
    }
});

// @route   GET /api/registrations
// @desc    Get all registrations (Admin use)
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await User.find().sort({ registrationDate: -1 });
        res.json({ success: true, count: registrations.length, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching data" });
    }
});

// Basic Health Check
app.get('/', (req, res) => {
    res.send('INOVEX Backend is Running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server launched on port ${PORT}`);
});

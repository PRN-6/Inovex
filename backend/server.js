require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Route Imports
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const miscRoutes = require('./routes/miscRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Health Check
app.get('/health', (req, res) => res.status(200).send('System Operational'));

// Routes
app.use('/api', registrationRoutes);
app.use('/api', adminRoutes);
app.use('/api', miscRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: "INTERNAL SYSTEM ERROR: Expedition data corrupted." 
    });
});

app.listen(PORT, () => {
    console.log(`
🚀 ==========================================
   INOVEX 2026 - CLEAN VERSION (NO PAYMENT)
   PORT: ${PORT}
   MODE: ${process.env.NODE_ENV}
   DB:   CONNECTED
==========================================
    `);
});

require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const { sendConfirmationEmail } = require('./utils/emailService');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne().sort({ registrationDate: -1 });
    console.log("Sending email to:", user.email);
    
    try {
        const result = await sendConfirmationEmail(user);
        console.log("Email result:", result);
    } catch(err) {
        console.error("Email dispatch ERROR:", err);
    }
    
    process.exit(0);
}

check();

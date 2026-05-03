const nodemailer = require('nodemailer');
const dns = require('dns');

// Force Node.js to prefer IPv4 over IPv6 globally to fix ENETUNREACH errors
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

// Email Transporter Configuration (STARTTLS on Port 587)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS (Port 587)
    family: 4,     // Force IPv4
    pool: true,
    maxConnections: 5,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ EMAIL SERVER CONNECTION ERROR:', error.message);
    } else {
        console.log('✅ EMAIL SERVER READY: Secure SSL Uplink Stable (Port 465)');
    }
});

/**
 * Sends a thematic confirmation email to the participant
 */
const sendConfirmationEmail = async (userData) => {
    const isVerified = userData.paymentStatus === 'verified';
    const eventList = Array.isArray(userData.registrations)
        ? userData.registrations.map(r => r.eventName).join(', ').toUpperCase()
        : 'YOUR QUESTS';

    const mailOptions = {
        from: `"INOVEX 2026" <${process.env.EMAIL_USER}>`,
        to: userData.email,
        subject: isVerified ? `QUESTS CONFIRMED: ${eventList}` : `REGISTRATION RECEIVED: PENDING VERIFICATION`,
        html: `
            <div style="background-color: #000; color: #fff; padding: 40px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; border: 2px solid #f59e0b; border-radius: 15px; max-width: 600px; margin: auto;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #f59e0b; text-transform: uppercase; letter-spacing: 8px; margin: 0; font-size: 32px;">INOVEX 2026</h1>
                    <p style="color: #b45309; letter-spacing: 3px; font-weight: bold; margin-top: 5px;">BORN FROM FIRE</p>
                </div>
                
                <p style="font-size: 18px; color: #e5e7eb; line-height: 1.6;">Greetings, <strong style="color: #f59e0b;">${userData.name}</strong>!</p>
                
                ${isVerified ? `
                    <p style="color: #10b981; font-weight: bold; font-size: 20px; text-align: center; margin-bottom: 20px;">✓ PAYMENT VERIFIED</p>
                    <p style="color: #9ca3af; line-height: 1.6;">Your identity has been verified. Your path is forged for the following expeditions:</p>
                ` : `
                    <p style="color: #f59e0b; font-weight: bold; font-size: 20px; text-align: center; margin-bottom: 20px;">⏱ PENDING VERIFICATION</p>
                    <p style="color: #9ca3af; line-height: 1.6;">We have received your registration and transaction ID (<strong style="color: #fff;">${userData.transactionId}</strong>). Our wardens are currently verifying the tribute. This typically takes 12-24 hours.</p>
                `}
                
                <div style="background-color: #0c0a09; padding: 20px; border-radius: 8px; border: 1px solid #292524; margin-top: 30px;">
                    <p style="margin: 5px 0; color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Primary Participant Details:</p>
                    <p style="margin: 5px 0; color: #d1d5db; font-size: 14px;"><strong>ID CODE (USN):</strong> ${userData.usn}</p>
                    <p style="margin: 5px 0; color: #d1d5db; font-size: 14px;"><strong>GUILD (COLLEGE):</strong> ${userData.college}</p>
                </div>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #292524; text-align: center;">
                    <p style="color: #444; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">© 2026 INOVEX TECH FEST • SYSTEM GENERATED NOTIFICATION</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Confirmation email dispatched to: ${userData.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Email dispatch failed:', error.message);
        return { success: false, error: error.message };
    }
};

const sendFeedbackEmail = async (feedbackData) => {
    const mailOptions = {
        from: `"INOVEX FEEDBACK" <${process.env.EMAIL_USER}>`,
        to: "prinsonroyal11@gmail.com",
        subject: `NEW FEEDBACK from ${feedbackData.name}`,
        html: `<p><strong>Name:</strong> ${feedbackData.name}</p><p><strong>Message:</strong> ${feedbackData.message}</p>`
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('❌ Feedback email failed:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendConfirmationEmail, sendFeedbackEmail };

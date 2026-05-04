const nodemailer = require('nodemailer');

// Brevo SMTP Configuration (using your xsmtpsib key)
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // TLS
    auth: {
        user: process.env.EMAIL_USER, // Your prinsonroyal11@gmail.com
        pass: process.env.BREVO_API_KEY // Your xsmtpsib key
    }
});

const sendConfirmationEmail = async (userData) => {
    if (userData.transactionId && userData.transactionId.startsWith('K6_TEST')) {
        return { success: true, message: "K6 Test suppressed" };
    }

    const eventList = Array.isArray(userData.registrations) 
        ? [...new Set(userData.registrations.map(r => r.eventName))].join(', ').toUpperCase() 
        : 'YOUR QUESTS';
    
    const totalAmount = (userData.registrations?.length || 0) * 100;
    
    const htmlContent = `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 2px solid #f59e0b; border-radius: 15px; max-width: 600px; margin: auto;">
            <h1 style="color: #f59e0b; text-align: center;">INOVEX 2026</h1>
            <p style="font-size: 18px;">Greetings, <strong>${userData.name}</strong>!</p>
            <p style="color: #10b981; font-weight: bold; font-size: 20px;">✓ REGISTRATION CONFIRMED</p>
            <div style="background-color: #0c0a09; padding: 20px; border-radius: 8px; border: 1px solid #292524; margin-top: 20px;">
                <p><strong>PID: ${userData.participantId || 'PENDING'}</strong></p>
                <p><strong>USN:</strong> ${userData.usn}</p>
                <p style="color: #10b981; font-size: 16px; font-weight: bold;">TOTAL AMOUNT DUE: ₹${totalAmount}</p>
                <p style="color: #f59e0b; font-size: 12px; font-style: italic;">* Present this PID at the college entrance for payment.</p>
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"INOVEX 2026" <${process.env.EMAIL_USER}>`,
            to: userData.email,
            subject: `QUESTS CONFIRMED: ${eventList}`,
            html: htmlContent
        });
        console.log(`📧 Success: Email sent via Brevo SMTP to: ${userData.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Brevo SMTP Error:', error.message);
        return { success: false, error: error.message };
    }
};

const sendFeedbackEmail = async (feedbackData) => {
    try {
        await transporter.sendMail({
            from: `"INOVEX FEEDBACK" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `NEW FEEDBACK from ${feedbackData.name}`,
            html: `<p><strong>Name:</strong> ${feedbackData.name}</p><p><strong>Message:</strong> ${feedbackData.message}</p>`
        });
        return { success: true };
    } catch (error) {
        console.error('❌ Feedback Email Error:', error.message);
        return { success: false, error: error.message };
    }
};

const sendPaymentConfirmationEmail = async (userData) => {
    const htmlContent = `<div style="background-color: #000; color: #fff; padding: 40px; border: 2px solid #10b981; border-radius: 15px; max-width: 600px; margin: auto; text-align: center;">
        <h1 style="color: #10b981;">PAYMENT VERIFIED</h1>
        <p>Your Participant ID: <strong>${userData.participantId}</strong> is now officially cleared.</p>
    </div>`;

    try {
        await transporter.sendMail({
            from: `"INOVEX 2026" <${process.env.EMAIL_USER}>`,
            to: userData.email,
            subject: `PAYMENT VERIFIED: INOVEX 2026`,
            html: htmlContent
        });
        return { success: true };
    } catch (error) {
        console.error('❌ Payment Email Error:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendConfirmationEmail, sendFeedbackEmail, sendPaymentConfirmationEmail };

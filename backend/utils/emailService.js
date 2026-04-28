const nodemailer = require('nodemailer');

// Email Transporter Configuration with Pooling
const transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true, // Use pooling to handle multiple emails
    maxConnections: 5,
    maxMessages: 100,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends a thematic confirmation email to the participant
 * @param {Object} userData - The user document from MongoDB
 */
const sendConfirmationEmail = async (userData) => {
    // K6 TEST GUARD: Skip email if it's a load test
    if (userData.transactionId && userData.transactionId.startsWith('K6_TEST')) {
        return { success: true, message: "K6 Test detected: Email suppressed" };
    }

    const mailOptions = {
        from: `"INOVEX 2026" <${process.env.EMAIL_USER}>`,
        to: userData.email,
        subject: `QUESTS CONFIRMED: ${userData.registrations.map(r => r.eventName).join(', ').toUpperCase()}`,
        html: `
            <div style="background-color: #000; color: #fff; padding: 40px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; border: 2px solid #b45309; border-radius: 15px; max-width: 600px; margin: auto;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #f59e0b; text-transform: uppercase; letter-spacing: 8px; margin: 0; font-size: 32px;">INOVEX 2026</h1>
                    <p style="color: #b45309; letter-spacing: 3px; font-weight: bold; margin-top: 5px;">BORN FROM FIRE</p>
                </div>
                
                <p style="font-size: 18px; color: #e5e7eb; line-height: 1.6;">Greetings, <strong style="color: #f59e0b;">${userData.name}</strong>!</p>
                
                <p style="color: #9ca3af; line-height: 1.6;">Your identity has been verified. Your path is forged for the following expeditions:</p>
                
                ${userData.registrations.map(reg => `
                    <div style="background-color: #1c1917; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                        <h2 style="margin: 0; color: #f59e0b; font-size: 18px; text-transform: uppercase; letter-spacing: 2px;">${reg.eventName}</h2>
                        ${reg.teammates.length > 0 ? `
                            <p style="margin: 10px 0 5px; color: #78716c; font-size: 10px; text-transform: uppercase;">Squad Members:</p>
                            <ul style="margin: 0; padding-left: 15px; color: #d1d5db; font-size: 13px;">
                                ${reg.teammates.map(t => `<li>${t.name} (${t.usn})</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
                
                <div style="background-color: #0c0a09; padding: 20px; border-radius: 8px; border: 1px solid #292524; margin-top: 30px;">
                    <p style="margin: 5px 0; color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Primary Participant Details:</p>
                    <p style="margin: 5px 0; color: #d1d5db; font-size: 14px;"><strong>ID CODE (USN):</strong> ${userData.usn}</p>
                    <p style="margin: 5px 0; color: #d1d5db; font-size: 14px;"><strong>GUILD (COLLEGE):</strong> ${userData.college}</p>
                </div>
                
                <p style="color: #f59e0b; font-weight: bold; text-align: center; margin-top: 40px; font-style: italic; letter-spacing: 1px;">"Your path is forged. Prepare for the expedition."</p>
                
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

/**
 * Sends feedback data to the administrator
 * @param {Object} feedbackData - The feedback data from the frontend
 */
const sendFeedbackEmail = async (feedbackData) => {
    const mailOptions = {
        from: `"INOVEX FEEDBACK" <${process.env.EMAIL_USER}>`,
        to: "prinsonroyal11@gmail.com",
        subject: `NEW FEEDBACK: ${feedbackData.type.toUpperCase()} from ${feedbackData.name}`,
        html: `
            <div style="background-color: #000; color: #fff; padding: 30px; font-family: sans-serif; border: 1px solid #dc2626; border-radius: 8px;">
                <h2 style="color: #dc2626; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 10px;">New Feedback Received</h2>
                <p><strong>Name:</strong> ${feedbackData.name}</p>
                <p><strong>Email:</strong> ${feedbackData.email}</p>
                <p><strong>Type:</strong> ${feedbackData.type}</p>
                <div style="background-color: #111; padding: 15px; border-radius: 4px; border-left: 4px solid #dc2626; margin-top: 20px;">
                    <p style="margin: 0; color: #ccc;">${feedbackData.message}</p>
                </div>
                <p style="font-size: 10px; color: #555; margin-top: 30px;">Sent via INOVEX Terminal Feedback Channel</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Feedback email sent to admin`);
        return { success: true };
    } catch (error) {
        console.error('❌ Feedback email failed:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendConfirmationEmail, sendFeedbackEmail };

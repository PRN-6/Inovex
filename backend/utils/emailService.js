const nodemailer = require('nodemailer');

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
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
    const mailOptions = {
        from: `"INOVEX 2026" <${process.env.EMAIL_USER}>`,
        to: userData.email,
        subject: `QUEST CONFIRMED: ${userData.event.toUpperCase()}`,
        html: `
            <div style="background-color: #000; color: #fff; padding: 40px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; border: 2px solid #b45309; border-radius: 15px; max-width: 600px; margin: auto;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #f59e0b; text-transform: uppercase; letter-spacing: 8px; margin: 0; font-size: 32px;">INOVEX 2026</h1>
                    <p style="color: #b45309; letter-spacing: 3px; font-weight: bold; margin-top: 5px;">BORN FROM FIRE</p>
                </div>
                
                <p style="font-size: 18px; color: #e5e7eb; line-height: 1.6;">Greetings, <strong style="color: #f59e0b;">${userData.name}</strong>!</p>
                
                <p style="color: #9ca3af; line-height: 1.6;">Your identity has been verified in the system. Your quest is now forged, and your participation is officially recorded for the following expedition:</p>
                
                <div style="background-color: #1c1917; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #f59e0b; text-align: center;">
                    <h2 style="margin: 0; color: #f59e0b; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">${userData.event}</h2>
                </div>
                
                <div style="background-color: #0c0a09; padding: 20px; border-radius: 8px; border: 1px solid #292524;">
                    <p style="margin: 5px 0; color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Participant Details:</p>
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

module.exports = { sendConfirmationEmail };

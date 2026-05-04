// Nodemailer Email Service
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendConfirmationEmail = async (userData) => {
    // K6 TEST GUARD
    if (userData.transactionId && userData.transactionId.startsWith('K6_TEST')) {
        return { success: true, message: "K6 Test detected: Email suppressed" };
    }

    const eventList = Array.isArray(userData.registrations) 
        ? [...new Set(userData.registrations.map(r => r.eventName))].join(', ').toUpperCase() 
        : 'YOUR QUESTS';
    
    const subject = `QUESTS CONFIRMED: ${eventList}`;
    
    const totalAmount = (userData.registrations?.length || 0) * 100;
    
    const htmlContent = `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; border: 2px solid #f59e0b; border-radius: 15px; max-width: 600px; margin: auto;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #f59e0b; text-transform: uppercase; letter-spacing: 8px; margin: 0; font-size: 32px;">INOVEX 2026</h1>
                <p style="color: #b45309; letter-spacing: 3px; font-weight: bold; margin-top: 5px;">BORN FROM FIRE</p>
            </div>
            
            <p style="font-size: 18px; color: #e5e7eb; line-height: 1.6;">Greetings, <strong style="color: #f59e0b;">${userData.name}</strong>!</p>
            
            <p style="color: #10b981; font-weight: bold; font-size: 20px; text-align: center; margin-bottom: 20px;">✓ REGISTRATION CONFIRMED</p>
            <p style="color: #9ca3af; line-height: 1.6;">Your registration has been processed successfully. Your path is forged for the following expeditions:</p>
            
            <div style="background-color: #0c0a09; padding: 20px; border-radius: 8px; border: 1px solid #292524; margin-top: 30px;">
                <p style="margin: 5px 0; color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Primary Participant Details:</p>
                <p style="margin: 5px 0; color: #f59e0b; font-size: 18px; font-weight: 900; letter-spacing: 1px;"><strong>PID: ${userData.participantId || 'PENDING'}</strong></p>
                <p style="margin: 5px 0; color: #d1d5db; font-size: 14px;"><strong>USN:</strong> ${userData.usn}</p>
                <p style="margin: 5px 0; color: #d1d5db; font-size: 14px;"><strong>GUILD:</strong> ${userData.college}</p>
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #292524;">
                    <p style="margin: 5px 0; color: #10b981; font-size: 16px; font-weight: 900; letter-spacing: 1px;"><strong>TOTAL AMOUNT DUE: ₹${totalAmount}</strong></p>
                    <p style="margin: 8px 0 0 0; color: #f59e0b; font-size: 12px; font-style: italic;">* Important: Please present your PID at the college entrance desk to complete your payment via QR code and verify your registration.</p>
                </div>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #292524; text-align: center;">
                <p style="color: #444; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">© 2026 INOVEX TECH FEST • SYSTEM GENERATED NOTIFICATION</p>
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"INOVEX 2026" <${process.env.EMAIL_USER}>`,
            to: userData.email,
            subject: subject,
            html: htmlContent
        });

        console.log(`📧 Nodemailer Email dispatched successfully to: ${userData.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Nodemailer Email dispatch failed:', error.message);
        return { success: false, error: error.message };
    }
};

const sendFeedbackEmail = async (feedbackData) => {
    try {
        await transporter.sendMail({
            from: `"INOVEX FEEDBACK" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Sending to admin
            subject: `NEW FEEDBACK from ${feedbackData.name}`,
            html: `<p><strong>Name:</strong> ${feedbackData.name}</p><p><strong>Message:</strong> ${feedbackData.message}</p>`
        });

        return { success: true };
    } catch (error) {
        console.error('❌ Nodemailer Feedback email failed:', error.message);
        return { success: false, error: error.message };
    }
};

const sendPaymentConfirmationEmail = async (userData) => {
    const subject = `PAYMENT VERIFIED: INOVEX 2026`;
    
    const htmlContent = `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; border: 2px solid #10b981; border-radius: 15px; max-width: 600px; margin: auto;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; text-transform: uppercase; letter-spacing: 8px; margin: 0; font-size: 32px;">INOVEX 2026</h1>
                <p style="color: #059669; letter-spacing: 3px; font-weight: bold; margin-top: 5px;">ACCESS GRANTED</p>
            </div>
            
            <p style="font-size: 18px; color: #e5e7eb; line-height: 1.6;">Greetings, <strong style="color: #10b981;">${userData.name}</strong>!</p>
            
            <p style="color: #10b981; font-weight: bold; font-size: 20px; text-align: center; margin-bottom: 20px;">✓ PAYMENT SUCCESSFULLY VERIFIED</p>
            <p style="color: #9ca3af; line-height: 1.6; text-align: center;">Your payment has been successfully verified by our team. You are now officially cleared for the expedition.</p>
            
            <div style="background-color: #0c0a09; padding: 20px; border-radius: 8px; border: 1px solid #292524; margin-top: 30px; text-align: center;">
                <p style="margin: 5px 0; color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Participant ID:</p>
                <p style="margin: 5px 0; color: #10b981; font-size: 24px; font-weight: 900; letter-spacing: 2px;"><strong>${userData.participantId || 'PENDING'}</strong></p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #292524; text-align: center;">
                <p style="color: #444; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">© 2026 INOVEX TECH FEST • SYSTEM GENERATED NOTIFICATION</p>
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"INOVEX 2026" <${process.env.EMAIL_USER}>`,
            to: userData.email,
            subject: subject,
            html: htmlContent
        });
        console.log(`📧 Nodemailer Payment Email dispatched successfully to: ${userData.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Nodemailer Payment Email dispatch failed:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendConfirmationEmail, sendFeedbackEmail, sendPaymentConfirmationEmail };

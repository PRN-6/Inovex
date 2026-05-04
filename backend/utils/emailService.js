// Brevo (Sendinblue) HTTP API Email Service
// This version uses HTTP fetch to bypass Render/Vercel SMTP blocks.

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
            <div style="background-color: #0c0a09; padding: 20px; border-radius: 8px; border: 1px solid #292524; margin-top: 30px;">
                <p style="margin: 5px 0; color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Primary Participant Details:</p>
                <p style="margin: 5px 0; color: #f59e0b; font-size: 18px; font-weight: 900; letter-spacing: 1px;"><strong>PID: ${userData.participantId || 'PENDING'}</strong></p>
                <p style="margin: 5px 0; color: #d1d5db; font-size: 14px;"><strong>USN:</strong> ${userData.usn}</p>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #292524;">
                    <p style="margin: 5px 0; color: #10b981; font-size: 16px; font-weight: 900; letter-spacing: 1px;"><strong>TOTAL AMOUNT DUE: ₹${totalAmount}</strong></p>
                    <p style="margin: 8px 0 0 0; color: #f59e0b; font-size: 12px; font-style: italic;">* Important: Show this PID at the entrance desk for payment.</p>
                </div>
            </div>
        </div>
    `;

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "INOVEX 2026", email: process.env.EMAIL_USER },
                to: [{ email: userData.email, name: userData.name }],
                subject: subject,
                htmlContent: htmlContent
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Brevo API Error');
        }

        console.log(`📧 Brevo Email dispatched successfully to: ${userData.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Brevo Email dispatch failed:', error.message);
        return { success: false, error: error.message };
    }
};

const sendFeedbackEmail = async (feedbackData) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "INOVEX FEEDBACK", email: process.env.EMAIL_USER },
                to: [{ email: process.env.EMAIL_USER, name: "Admin" }],
                subject: `NEW FEEDBACK from ${feedbackData.name}`,
                htmlContent: `<p><strong>Name:</strong> ${feedbackData.name}</p><p><strong>Message:</strong> ${feedbackData.message}</p>`
            })
        });

        if (!response.ok) throw new Error('Brevo API Error');
        return { success: true };
    } catch (error) {
        console.error('❌ Brevo Feedback email failed:', error.message);
        return { success: false, error: error.message };
    }
};

const sendPaymentConfirmationEmail = async (userData) => {
    const subject = `PAYMENT VERIFIED: INOVEX 2026`;
    const htmlContent = `<div style="background-color: #000; color: #fff; padding: 40px; border: 2px solid #10b981; border-radius: 15px; max-width: 600px; margin: auto; text-align: center;">
        <h1 style="color: #10b981;">PAYMENT VERIFIED</h1>
        <p>Your Participant ID: <strong>${userData.participantId}</strong> is now officially cleared.</p>
    </div>`;

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "INOVEX 2026", email: process.env.EMAIL_USER },
                to: [{ email: userData.email, name: userData.name }],
                subject: subject,
                htmlContent: htmlContent
            })
        });
        if (!response.ok) throw new Error('Brevo API Error');
        console.log(`📧 Brevo Payment Email dispatched successfully to: ${userData.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Brevo Payment Email dispatch failed:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendConfirmationEmail, sendFeedbackEmail, sendPaymentConfirmationEmail };

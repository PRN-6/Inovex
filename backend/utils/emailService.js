const nodemailer = require('nodemailer');

// Gmail SMTP Configuration (port 587 = STARTTLS, works on IPv4 networks)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,      // false = STARTTLS (upgrades after connect)
    requireTLS: true,   // force TLS upgrade
    auth: {
        user: process.env.EMAIL_USER,  // prinsonroyal11@gmail.com
        pass: process.env.EMAIL_PASS   // Gmail App Password (16-char)
    },
    connectionTimeout: 15000,
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
                <p><strong>STREAM:</strong> ${userData.category || 'GENERAL'}</p>
                <p style="color: #10b981; font-size: 16px; font-weight: bold;">TOTAL AMOUNT DUE: ₹${totalAmount}</p>
                <p style="color: #f59e0b; font-size: 12px; font-style: italic;">* Present this PID at the college entrance for payment.</p>
            </div>
        </div>
    `;

    console.log(`📡 Attempting to send confirmation email to: ${userData.email}...`);

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
    const eventList = Array.isArray(userData.registrations)
        ? [...new Set(userData.registrations.map(r => r.eventName))].join(', ').toUpperCase()
        : 'YOUR EVENTS';

    const totalAmount = Array.isArray(userData.registrations)
        ? userData.registrations.length * 100
        : 0;

    const eventRows = Array.isArray(userData.registrations)
        ? userData.registrations.map(r => `
            <tr>
                <td style="padding: 10px 14px; font-size: 13px; color: #e5e7eb; border-bottom: 1px solid #1f2937;">
                    &#9632; ${r.eventName?.toUpperCase() || 'EVENT'}
                </td>
                <td style="padding: 10px 14px; font-size: 13px; color: #10b981; text-align: right; border-bottom: 1px solid #1f2937;">CONFIRMED</td>
            </tr>`).join('')
        : '';

    const htmlContent = `
        <div style="background-color: #050505; font-family: 'Segoe UI', Arial, sans-serif; padding: 0; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #10b981; border-radius: 16px; overflow: hidden;">

                <!-- Header Banner -->
                <div style="background: linear-gradient(135deg, #052e16 0%, #064e3b 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #10b981;">
                    <p style="font-size: 11px; letter-spacing: 6px; color: #6ee7b7; margin: 0 0 10px 0; text-transform: uppercase;">A.J. ASTRIX PRESENTS</p>
                    <h1 style="font-size: 36px; color: #ffffff; margin: 0 0 6px 0; font-weight: 900; letter-spacing: -1px;">INOVEX 2026</h1>
                    <p style="font-size: 11px; letter-spacing: 5px; color: #34d399; margin: 0; text-transform: uppercase;">PAYMENT AUTHORIZED</p>
                </div>

                <!-- Success Badge -->
                <div style="text-align: center; padding: 30px 30px 0 30px;">
                    <div style="display: inline-block; background: #052e16; border: 2px solid #10b981; border-radius: 50px; padding: 12px 30px;">
                        <span style="color: #10b981; font-size: 13px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase;">&#10003; PAYMENT VERIFIED</span>
                    </div>
                </div>

                <!-- Body -->
                <div style="padding: 30px;">
                    <p style="color: #d1d5db; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                        Greetings, <strong style="color: #ffffff;">${userData.name?.toUpperCase() || 'PARTICIPANT'}</strong>!<br><br>
                        Your payment has been <strong style="color: #10b981;">officially verified</strong> by the INOVEX team. You are now fully cleared to participate in the fest. Get ready for an epic experience!
                    </p>

                    <!-- Info Card -->
                    <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                            <span style="color: #6b7280; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Participant ID</span>
                            <span style="color: #f59e0b; font-size: 14px; font-weight: 900; letter-spacing: 2px;">${userData.participantId || 'PENDING'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                            <span style="color: #6b7280; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Stream</span>
                            <span style="color: #e5e7eb; font-size: 13px; font-weight: 700;">${userData.category?.toUpperCase() || 'GENERAL'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-top: 1px solid #1f2937; padding-top: 12px; margin-top: 12px;">
                            <span style="color: #6b7280; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Total Paid</span>
                            <span style="color: #10b981; font-size: 20px; font-weight: 900;">&#8377;${totalAmount}</span>
                        </div>
                    </div>

                    <!-- Events Table -->
                    <p style="color: #9ca3af; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px;">Confirmed Events</p>
                    <table style="width: 100%; border-collapse: collapse; background: #111827; border-radius: 10px; overflow: hidden; margin-bottom: 28px;">
                        <thead>
                            <tr style="background: #1f2937;">
                                <th style="padding: 10px 14px; font-size: 10px; letter-spacing: 2px; color: #6b7280; text-align: left; text-transform: uppercase;">Event</th>
                                <th style="padding: 10px 14px; font-size: 10px; letter-spacing: 2px; color: #6b7280; text-align: right; text-transform: uppercase;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${eventRows}
                        </tbody>
                    </table>

                    <!-- Important Notice -->
                    <div style="background: #1c1917; border-left: 3px solid #f59e0b; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 28px;">
                        <p style="color: #fbbf24; font-size: 11px; font-weight: 900; letter-spacing: 2px; margin: 0 0 8px 0; text-transform: uppercase;">IMPORTANT</p>
                        <p style="color: #d1d5db; font-size: 12px; margin: 0; line-height: 1.6;">
                            Please carry your college ID card and quote your <strong style="color: #f59e0b;">Participant ID (${userData.participantId || 'see above'})</strong> at the registration desk on the day of the event.
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #0a0a0a; border-top: 1px solid #1f2937; padding: 24px 30px; text-align: center;">
                    <p style="color: #4b5563; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px 0;">INOVEX 2026 &mdash; A.J. ASTRIX COLLEGE FEST</p>
                    <p style="color: #374151; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">This is an automated message. Do not reply to this email.</p>
                </div>
            </div>
        </div>
    `;

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

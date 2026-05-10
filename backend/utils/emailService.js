const nodemailer = require('nodemailer');

// Gmail SMTP Configuration
// Port 587 is the most compatible for cloud servers like Render
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS  // Your 16-character App Password
    }
});

// Accurate Fee Mapping for INOVEX 2026
const EVENT_FEES = {
    "TECHSAURUS: IT MANAGER": 150,
    "HIDDEN HORIZON - TREASURE HUNT": 300,
    "CINESAUR: REEL MAKING": 300,
    "DINOX: WEB DESIGN": 300,
    "CODEREX: BLIND CODING": 300,
    "DNA ARCHITECTS (HR TEAM)": 300,
    "MARKETING TEAM – ROAR & REACH": 300,
    "T-REX COMMAND (BEST MANAGER)": 150,
    "GOLDEN FOSSILS (FINANCE TEAM)": 300,
    "ALPHA ERA: CORPORATE WALK": 500,
    "JURASSIC JAMS: GROUP SONG": 400,
    "REXORA: GROUP DANCE": 400,
    "BEAT FUSION: SOLO DANCE": 150,
    "CLASH OF AURAS: FACE OFF": 150,
    "BATTLE NEXUS: GAMING - FREE FIRE": 400
};

const calculateTotal = (registrations) => {
    if (!Array.isArray(registrations)) return 0;
    return registrations.reduce((sum, reg) => {
        const name = reg.eventName?.toUpperCase() || "";
        return sum + (EVENT_FEES[name] || 100); // Default to 100 if event not in list
    }, 0);
};

const sendConfirmationEmail = async (userData) => {
    if (userData.transactionId && userData.transactionId.startsWith('K6_TEST')) {
        return { success: true, message: "K6 Test suppressed" };
    }

    const eventList = Array.isArray(userData.registrations)
        ? [...new Set(userData.registrations.map(r => r.eventName))].join(', ').toUpperCase()
        : 'YOUR QUESTS';

    const totalAmount = calculateTotal(userData.registrations);

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

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "INOVEX 2026", email: "prinsonroyal11@gmail.com" },
                to: [{ email: userData.email, name: userData.name }],
                subject: `QUESTS CONFIRMED: ${eventList}`,
                htmlContent: htmlContent
            })
        });

        if (response.ok) {
            console.log(`📧 Success: Confirmation email sent to: ${userData.email}`);
            return { success: true };
        } else {
            const error = await response.json();
            console.error('❌ Brevo API Error:', error);
            return { success: false, error: error.message };
        }
    } catch (error) {
        console.error('❌ Email Fetch Error:', error.message);
        return { success: false, error: error.message };
    }
};

const sendFeedbackEmail = async (feedbackData) => {
    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "INOVEX FEEDBACK", email: "prinsonroyal11@gmail.com" },
                to: [{ email: "prinsonroyal11@gmail.com" }],
                subject: `NEW FEEDBACK from ${feedbackData.name}`,
                htmlContent: `<p><strong>Name:</strong> ${feedbackData.name}</p><p><strong>Message:</strong> ${feedbackData.message}</p>`
            })
        });
        return { success: response.ok };
    } catch (error) {
        console.error('❌ Feedback Email Error:', error.message);
        return { success: false, error: error.message };
    }
};

const sendPaymentConfirmationEmail = async (userData) => {
    const totalAmount = calculateTotal(userData.registrations);

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
                <div style="background: linear-gradient(135deg, #052e16 0%, #064e3b 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #10b981;">
                    <p style="font-size: 11px; letter-spacing: 6px; color: #6ee7b7; margin: 0 0 10px 0; text-transform: uppercase;">A.J. ASTRIX PRESENTS</p>
                    <h1 style="font-size: 36px; color: #ffffff; margin: 0 0 6px 0; font-weight: 900; letter-spacing: -1px;">INOVEX 2026</h1>
                    <p style="font-size: 11px; letter-spacing: 5px; color: #34d399; margin: 0; text-transform: uppercase;">PAYMENT AUTHORIZED</p>
                </div>
                <div style="padding: 30px;">
                    <p style="color: #d1d5db; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                        Greetings, <strong style="color: #ffffff;">${userData.name?.toUpperCase() || 'PARTICIPANT'}</strong>!<br><br>
                        Your payment has been <strong style="color: #10b981;">officially verified</strong>.
                    </p>
                    <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                            <span style="color: #6b7280; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Participant ID</span>
                            <span style="color: #f59e0b; font-size: 14px; font-weight: 900; letter-spacing: 2px;">${userData.participantId || 'PENDING'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-top: 1px solid #1f2937; padding-top: 12px; margin-top: 12px;">
                            <span style="color: #6b7280; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Total Paid</span>
                            <span style="color: #10b981; font-size: 20px; font-weight: 900;">&#8377;${totalAmount}</span>
                        </div>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; background: #111827; border-radius: 10px; overflow: hidden; margin-bottom: 28px;">
                        <tbody>${eventRows}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "INOVEX 2026", email: "prinsonroyal11@gmail.com" },
                to: [{ email: userData.email, name: userData.name }],
                subject: `PAYMENT VERIFIED: INOVEX 2026`,
                htmlContent: htmlContent
            })
        });

        if (response.ok) {
            console.log(`📧 Success: Payment verified email sent to: ${userData.email}`);
            return { success: true };
        } else {
            const error = await response.json();
            console.error('❌ Brevo API Error:', error);
            return { success: false, error: error.message };
        }
    } catch (error) {
        console.error('❌ Email Fetch Error:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendConfirmationEmail, sendFeedbackEmail, sendPaymentConfirmationEmail };

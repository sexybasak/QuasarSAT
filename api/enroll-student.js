// api/enroll-student.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, targetScore, currentScore, painPoints, preferredPlan, submittedAt } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required' });
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db('quasarprep');
    const enrollments = db.collection('enrollments');

    // Check for duplicate email
    const existing = await enrollments.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'This email is already enrolled. Contact support to update.' });
    }

    // Insert enrollment
    const result = await enrollments.insertOne({
      name,
      email,
      phone,
      targetScore: targetScore || '',
      currentScore: currentScore || '',
      painPoints: painPoints || '',
      preferredPlan: preferredPlan || '',
      submittedAt: submittedAt || new Date().toISOString(),
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date()
    });

    // Send welcome email (using SendGrid, Resend, or Nodemailer)
    await sendWelcomeEmail({ name, email, targetScore, preferredPlan });

    // Send WhatsApp notification (using Twilio or WhatsApp Business API)
    await sendWhatsAppNotification({ name, phone });

    res.status(200).json({ 
      success: true, 
      enrollmentId: result.insertedId,
      message: 'Enrollment successful. Check your email and WhatsApp.'
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}

// Email sender (using Resend - free tier: 100 emails/day)
async function sendWelcomeEmail({ name, email, targetScore, preferredPlan }) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'QuasarPrep <onboarding@quasarprep.online>',
        to: email,
        subject: 'Neural Link Established - Welcome to QuasarPrep',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #2563eb; color: white; padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 900;">QUASARPREP</h1>
              <p style="margin: 10px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Neural Strategic Laboratory</p>
            </div>
            <div style="padding: 40px; background: #f8fafc;">
              <h2 style="color: #1e293b; font-size: 22px; font-weight: 800;">Welcome, ${name}.</h2>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                Your enrollment request has been received and logged in our neural database.
              </p>
              <div style="background: white; border-radius: 16px; padding: 24px; margin: 24px 0; border: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Target Score:</strong> ${targetScore || 'Not specified'}</p>
                <p style="margin: 8px 0 0; color: #475569; font-size: 14px;"><strong>Preferred Plan:</strong> ${preferredPlan || 'Not selected'}</p>
              </div>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                A Success Specialist (SSM) will contact you within 24 hours via WhatsApp to schedule your DNA Profiler diagnostic.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://wa.me/917061014213" style="background: #25D366; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block;">
                  Message SSM on WhatsApp
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                SAT® is a registered trademark of the College Board. QuasarPrep is an independent educational laboratory.
              </p>
            </div>
          </div>
        `
      })
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
}

// WhatsApp notification (using Twilio)
async function sendWhatsAppNotification({ name, phone }) {
  try {
    const twilioSid = process.env.TWILIO_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. whatsapp:+14155238886

    const message = `Welcome to QuasarPrep, ${name}! 🧠

Your Neural Profile is being processed.

Next steps:
1. Check your email for onboarding details
2. Reply here to schedule your DNA Profiler diagnostic
3. Your SSM will guide you to 1550+

Questions? Reply anytime.`;

    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: twilioWhatsAppNumber,
        To: `whatsapp:${phone}`,
        Body: message
      })
    });
  } catch (error) {
    console.error('WhatsApp send failed:', error);
  }
}

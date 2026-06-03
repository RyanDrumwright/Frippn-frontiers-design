export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, linkedin, portfolio, role, company } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !linkedin) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'ryan.drumwright@gmail.com',
        subject: `FRIPPN Interest: ${name} — ${role} at ${company}`,
        html: `
          <div style="font-family: monospace; max-width: 500px; padding: 24px; background: #0a0a0a; color: #f5f0e8; border-radius: 6px;">
            <p style="color: #E8510A; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 20px;">/// New Interest Submission</p>
            <p style="font-size: 16px; margin: 0 0 24px; color: #fff;"><strong>${role}</strong> at ${company}</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; width: 100px;">Name</td><td style="padding: 8px 0; color: #f5f0e8;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #E8510A;">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Phone</td><td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #E8510A;">${phone}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">LinkedIn</td><td style="padding: 8px 0;"><a href="${linkedin}" style="color: #E8510A;">${linkedin}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Portfolio</td><td style="padding: 8px 0;">${portfolio ? `<a href="${portfolio}" style="color: #E8510A;">${portfolio}</a>` : '—'}</td></tr>
            </table>
            <p style="margin: 24px 0 0; font-size: 10px; color: #444;">Submitted via FRIPPN Frontiers</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Resend error');
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Notify error:', err);
    return res.status(500).json({ error: 'Failed to send notification' });
  }
}

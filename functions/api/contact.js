export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const company = formData.get('company') || 'Not provided';
    const message = formData.get('message');

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const results = { 
      web3forms: null, 
      resend: null,
      hasResendKey: !!context.env.RESEND_API_KEY,
      keyPrefix: context.env.RESEND_API_KEY ? context.env.RESEND_API_KEY.substring(0, 10) + '...' : 'NOT SET'
    };

    // 1. Send notification to William via Web3Forms
    try {
      const web3Response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '7e122848-6b2c-40e7-a93e-56f5029a9b62',
          subject: `New Contact Form Submission from ${name}`,
          from_name: 'NCC Contact Form',
          replyto: email,
          name: name,
          email: email,
          company: company,
          message: message
        })
      });
      results.web3forms = await web3Response.json();
    } catch (e) {
      results.web3forms = { error: e.message };
    }

    // 2. Send auto-response to customer via Resend
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'National Controls Consulting <noreply@nationalcontrolsconsulting.com>',
          to: email,
          subject: 'Thank you for contacting National Controls Consulting',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1a1a1a;">Thank You for Reaching Out!</h2>
              <p>Hi ${name},</p>
              <p>Thank you for contacting National Controls Consulting. We have received your message and will get back to you within 24-48 hours.</p>
              <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Your message:</strong></p>
                <p style="font-style: italic; margin: 10px 0 0 0;">"${message}"</p>
              </div>
              <p>In the meantime, if you have any urgent questions, feel free to reply directly to this email.</p>
              <p style="margin-top: 30px;">Best regards,<br><strong>William</strong><br>National Controls Consulting</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #666; font-size: 12px;">
                <a href="https://nationalcontrolsconsulting.com" style="color: #0ab4ff;">nationalcontrolsconsulting.com</a><br>
                Independent Lighting Controls Consulting & Training
              </p>
            </div>
          `
        })
      });
      results.resend = await resendResponse.json();
    } catch (e) {
      results.resend = { error: e.message };
    }

    // For debugging - show results instead of redirect
    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

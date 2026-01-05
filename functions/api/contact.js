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
          access_key: context.env.WEB3FORMS_KEY,
          subject: `New Contact Form Submission from ${name}`,
          from_name: name,
          email: email,
          message: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`
        })
      });
      
      const responseText = await web3Response.text();
      let web3Data;
      try {
        web3Data = JSON.parse(responseText);
      } catch {
        web3Data = { rawResponse: responseText };
      }
      
      results.web3forms = { 
        status: web3Response.status, 
        data: web3Data,
        keyPresent: !!context.env.WEB3FORMS_KEY,
        keyPrefix: context.env.WEB3FORMS_KEY ? context.env.WEB3FORMS_KEY.substring(0, 8) + '...' : 'MISSING'
      };
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
              <p>Thank you for your interest in lighting controls consultations and training. A member of our team will reach out to you soon with more details.</p>
              <p>We look forward to helping you meet your goals and get your projects over the finish line on time.</p>
              <p style="margin-top: 30px;">
                <strong>Owner/Principal</strong><br>
                William Arbelo
              </p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #666; font-size: 12px;">
                <a href="https://nationalcontrolsconsulting.com" style="color: #0ab4ff;">nationalcontrolsconsulting.com</a><br>
                Independent Lighting Controls Consulting & Training
              </p>
            </div>
          `
        })
      });
      const resendData = await resendResponse.json();
      results.resend = { status: resendResponse.status, data: resendData };
    } catch (e) {
      results.resend = { error: e.message };
    }

    // Check if Web3Forms succeeded
    const web3Success = results.web3forms?.data?.success || results.web3forms?.status === 200;
    
    // For debugging - show results instead of redirect
    return new Response(JSON.stringify({
      ...results,
      web3Success,
      recommendation: web3Success 
        ? 'Both services working - ready to switch to redirect' 
        : 'Check WEB3FORMS_KEY environment variable in Cloudflare Pages settings'
    }, null, 2), {
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

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
      notification: null, 
      autoResponse: null
    };

    // 1. Send notification to William via Resend
    try {
      const notificationResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'NCC Contact Form <noreply@nationalcontrolsconsulting.com>',
          to: 'w.arbelo42@gmail.com',
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #003366;">New Contact Form Submission</h2>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 10px; font-weight: bold;">Name:</td>
                  <td style="padding: 10px;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 10px; font-weight: bold;">Email:</td>
                  <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 10px; font-weight: bold;">Company:</td>
                  <td style="padding: 10px;">${company}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
                  <td style="padding: 10px; white-space: pre-wrap;">${message}</td>
                </tr>
              </table>
            </div>
          `
        })
      });
      const notificationData = await notificationResponse.json();
      results.notification = { status: notificationResponse.status, data: notificationData };
    } catch (e) {
      results.notification = { error: e.message };
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
      const autoResponseData = await resendResponse.json();
      results.autoResponse = { status: resendResponse.status, data: autoResponseData };
    } catch (e) {
      results.autoResponse = { error: e.message };
    }

    // Check if both emails succeeded
    const notificationSuccess = results.notification?.status === 200;
    const autoResponseSuccess = results.autoResponse?.status === 200;
    
    if (notificationSuccess && autoResponseSuccess) {
      // Production: Redirect to thank you page
      const url = new URL(context.request.url);
      const redirectUrl = `${url.origin}/thank-you.html`;
      return Response.redirect(redirectUrl, 303);
    } else {
      // If either failed, show debug info
      return new Response(JSON.stringify({
        ...results,
        notificationSuccess,
        autoResponseSuccess,
        message: 'One or both emails failed to send. See details above.'
      }, null, 2), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const company = formData.get('company') || 'Not provided';
    const message = formData.get('message');

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send email to William (business owner)
    const ownerEmail = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'William@nationalcontrolsconsulting.com', name: 'William' }]
          }
        ],
        from: {
          email: 'noreply@nationalcontrolsconsulting.com',
          name: 'NCC Contact Form'
        },
        reply_to: {
          email: email,
          name: name
        },
        subject: `New Contact Form Submission from ${name}`,
        content: [
          {
            type: 'text/plain',
            value: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`
          },
          {
            type: 'text/html',
            value: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Company:</strong> ${company}</p>
              <h3>Message:</h3>
              <p>${message.replace(/\n/g, '<br>')}</p>
            `
          }
        ]
      })
    });

    // Send confirmation email to the visitor
    const confirmationEmail = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: email, name: name }]
          }
        ],
        from: {
          email: 'William@nationalcontrolsconsulting.com',
          name: 'National Controls Consulting'
        },
        subject: 'Thank you for contacting National Controls Consulting',
        content: [
          {
            type: 'text/plain',
            value: `Hi ${name},\n\nThank you for reaching out to National Controls Consulting. We have received your message and will get back to you within 24-48 hours.\n\nHere's a copy of your message:\n\n"${message}"\n\nBest regards,\nWilliam\nNational Controls Consulting\nwww.nationalcontrolsconsulting.com`
          },
          {
            type: 'text/html',
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a1a1a;">Thank You for Contacting Us</h2>
                <p>Hi ${name},</p>
                <p>Thank you for reaching out to National Controls Consulting. We have received your message and will get back to you within 24-48 hours.</p>
                <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Your message:</strong></p>
                  <p style="font-style: italic;">"${message.replace(/\n/g, '<br>')}"</p>
                </div>
                <p>Best regards,<br><strong>William</strong><br>National Controls Consulting</p>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                  <a href="https://www.nationalcontrolsconsulting.com">www.nationalcontrolsconsulting.com</a>
                </p>
              </div>
            `
          }
        ]
      })
    });

    if (!ownerEmail.ok) {
      const errorText = await ownerEmail.text();
      console.error('MailChannels error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Redirect back to the page with success message
    return Response.redirect(`${new URL(context.request.url).origin}/?success=true`, 303);

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

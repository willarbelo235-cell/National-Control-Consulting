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

    // Use Web3Forms API (free tier)
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: context.env.WEB3FORMS_KEY,
        subject: `New Contact Form Submission from ${name}`,
        from_name: 'NCC Contact Form',
        to: 'William@nationalcontrolsconsulting.com',
        reply_to: email,
        name: name,
        email: email,
        company: company,
        message: message,
        // Auto-response to the visitor
        autoresponse: {
          to: email,
          subject: 'Thank you for contacting National Controls Consulting',
          from: 'National Controls Consulting',
          message: `Hi ${name},\n\nThank you for reaching out to National Controls Consulting. We have received your message and will get back to you within 24-48 hours.\n\nBest regards,\nWilliam\nNational Controls Consulting`
        }
      })
    });

    const result = await response.json();

    if (!result.success) {
      console.error('Web3Forms error:', result);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Redirect back to the page with success message
    return Response.redirect(`${new URL(context.request.url).origin}/?success=true`, 303);

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

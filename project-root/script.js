// Check for success parameter in URL (after form redirect)
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        const successMessage = document.getElementById('successMessage');
        const contactForm = document.getElementById('contactForm');
        if (successMessage) {
            successMessage.style.display = 'block';
            contactForm.style.display = 'none';
        }
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    console.log('National Controls Consulting site loaded');
});

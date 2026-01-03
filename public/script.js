// Simple alert on submit
document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    alert('Thank you! Your message has been sent.');
    this.reset();
});
// Minimal JS
document.addEventListener('DOMContentLoaded',()=>{
  console.log('National Control Consulting site loaded')
});

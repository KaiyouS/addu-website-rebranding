// ================================================
// Contact form
// ================================================
const contactForm = document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    this.reset();
    alert('Your message has been sent!');
  });
}
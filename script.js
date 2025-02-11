document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.story-section');

  const checkVisibility = () => {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight * 0.75 && rect.bottom >= windowHeight * 0.25) {
        section.classList.add('visible');
      }
    });
  };

  // Check visibility on load
  checkVisibility();

  // Check visibility on scroll
  window.addEventListener('scroll', () => {
    requestAnimationFrame(checkVisibility);
  });

  // Smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});
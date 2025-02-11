document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.story-section');
  const sectionViewTimes = new Map();

  const checkVisibility = () => {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight * 0.75 && rect.bottom >= windowHeight * 0.25) {
        section.classList.add('visible');

        // Track section visibility
        if (!sectionViewTimes.has(section)) {
          sectionViewTimes.set(section, {
            startTime: Date.now(),
            viewed: false
          });

          // Google Analytics event
          if (typeof gtag !== 'undefined') {
            gtag('event', 'section_view', {
              'section_id': section.id || 'section-' + Array.from(sections).indexOf(section),
              'section_content': section.textContent.substring(0, 50) + '...'
            });
          }

          // Local storage tracking
          const viewCount = parseInt(localStorage.getItem('pageViews') || '0');
          localStorage.setItem('pageViews', viewCount + 1);

          // Log to console for debugging
          console.log(`Section viewed: ${section.id || 'section-' + Array.from(sections).indexOf(section)}`);
          console.log(`Total page views: ${viewCount + 1}`);
        }
      } else if (sectionViewTimes.has(section)) {
        const viewData = sectionViewTimes.get(section);
        if (!viewData.viewed) {
          viewData.viewed = true;
          const viewDuration = (Date.now() - viewData.startTime) / 1000; // in seconds

          // Google Analytics event for view duration
          if (typeof gtag !== 'undefined') {
            gtag('event', 'section_view_duration', {
              'section_id': section.id || 'section-' + Array.from(sections).indexOf(section),
              'duration_seconds': viewDuration
            });
          }

          // Log to console for debugging
          console.log(`Section view duration: ${viewDuration}s`);
        }
      }
    });
  };

  // Check visibility on load
  checkVisibility();

  // Check visibility on scroll with throttling
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        checkVisibility();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Track total time on page
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const totalTime = (Date.now() - startTime) / 1000;
    if (typeof gtag !== 'undefined') {
      gtag('event', 'total_time_on_page', {
        'duration_seconds': totalTime
      });
    }
    console.log(`Total time on page: ${totalTime}s`);
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
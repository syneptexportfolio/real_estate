/**
 * High-End Luxury Scroll Animations Component.
 * Orchestrates popup intro and outro animations from down to up for text and main images
 * across all editorial sections of the residence.
 */

export function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // 1. Text elements in each section
  const textElements = document.querySelectorAll(
    '.editorial-content, .section-intro-header, .enquiry-info, .closing-hero-content'
  );
  textElements.forEach(el => el.classList.add('scroll-reveal-text'));

  // 2. Main visuals, image frames, interactive maps, and grids in each section
  const visualElements = document.querySelectorAll(
    '.editorial-visual, .metrics-grid, .lifestyle-grid, .specs-table, .gallery-strip, .enquiry-form-wrap, .faq-list'
  );
  visualElements.forEach(el => el.classList.add('scroll-reveal-visual'));

  const animatedElements = document.querySelectorAll('.scroll-reveal-text, .scroll-reveal-visual');

  let isTicking = false;

  const updateVisibility = () => {
    const windowHeight = window.innerHeight;
    // Enter trigger: top of element reaches bottom 12% of screen
    const enterTrigger = windowHeight * 0.90;
    // Exit trigger: bottom of element reaches top 12% of screen
    const exitTrigger = windowHeight * 0.12;

    animatedElements.forEach((el) => {
      const rect = el.getBoundingClientRect();

      if (rect.top < enterTrigger && rect.bottom > exitTrigger) {
        // Active viewing zone: intro popup from down to up into resting position
        el.classList.add('is-inview');
        el.classList.remove('is-outro-top');
      } else if (rect.bottom <= exitTrigger) {
        // Scrolled past top: outro popup continuing upward and dissolving
        el.classList.remove('is-inview');
        el.classList.add('is-outro-top');
      } else {
        // Below viewport: ready for intro popup
        el.classList.remove('is-inview');
        el.classList.remove('is-outro-top');
      }
    });

    isTicking = false;
  };

  const onScroll = () => {
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(updateVisibility);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Update on hash navigation clicks
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        requestAnimationFrame(updateVisibility);
      }, 350);
    });
  });

  // Initial assessment on page load
  requestAnimationFrame(updateVisibility);
}

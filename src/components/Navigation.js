/**
 * Luxury Navigation Component.
 * Controls sticky blur transition, mobile drawer toggle, active link tracking, and smooth anchor scrolling.
 */

export function initNavigation() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  // Sticky blur on scroll
  const onScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active Section ScrollSpy
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const updateActiveNav = () => {
    const scrollPosition = window.scrollY + 160;
    let currentId = '';

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section.offsetTop <= scrollPosition) {
        currentId = section.getAttribute('id');
        break;
      }
    }

    if (!currentId && sections.length > 0) {
      currentId = sections[0].getAttribute('id');
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // Mobile drawer toggle
  if (menuToggle && drawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('active');
      if (isOpen) {
        drawer.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        drawer.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Smooth anchor navigation
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();

          // Close mobile drawer if open
          if (drawer?.classList.contains('active')) {
            drawer.classList.remove('active');
            menuToggle?.classList.remove('active');
            menuToggle?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          }

          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

/**
 * Luxury Interactive FAQ Accordion Component.
 * Orchestrates smooth, accessible accordion toggles with auto-closing siblings,
 * rotating indicators, and keyboard accessibility.
 */

export function initFAQAccordion() {
  const faqSection = document.querySelector('.section-faq');
  if (!faqSection) return;

  const items = faqSection.querySelectorAll('.faq-accordion-item');
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      // Close all items
      items.forEach((otherItem) => {
        otherItem.classList.remove('active');
        const otherTrigger = otherItem.querySelector('.faq-trigger');
        if (otherTrigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked item
      if (!isAlreadyActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard navigation (Arrow keys up/down)
    trigger.addEventListener('keydown', (e) => {
      const currentIndex = Array.from(items).indexOf(item);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].querySelector('.faq-trigger')?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex].querySelector('.faq-trigger')?.focus();
      }
    });
  });
}

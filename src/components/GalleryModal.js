/**
 * Curated Lightbox Gallery Modal.
 * Displays high-resolution architectural photography with caption and keyboard accessibility.
 */

export function initGalleryModal() {
  const modal = document.querySelector('.lightbox-modal');
  const modalImg = modal?.querySelector('img');
  const modalCaption = modal?.querySelector('.lightbox-caption');
  const closeBtn = modal?.querySelector('.lightbox-close');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (!modal || !modalImg) return;

  function openModal(src, title, category) {
    modalImg.src = src;
    modalImg.alt = title;
    if (modalCaption) {
      modalCaption.textContent = `${category} — ${title}`;
    }
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalImg.src = '';
  }

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.gallery-card-title')?.textContent || '';
      const category = card.querySelector('.gallery-card-cat')?.textContent || '';
      if (img) {
        openModal(img.getAttribute('src'), title, category);
      }
    });

    // Keyboard enter trigger
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Mobile Carousel HUD & Touch Navigation
  const galleryStrip = document.querySelector('.gallery-strip');
  const currLabel = document.querySelector('.gallery-counter-curr');
  const totalLabel = document.querySelector('.gallery-counter-total');
  const prevBtn = document.querySelector('.gallery-prev-btn');
  const nextBtn = document.querySelector('.gallery-next-btn');

  if (galleryStrip && galleryCards.length > 0) {
    if (totalLabel) {
      totalLabel.textContent = String(galleryCards.length).padStart(2, '0');
    }

    let scrollTimeout;
    function updateActiveSlide() {
      if (!currLabel) return;
      const scrollLeft = galleryStrip.scrollLeft;
      const card = galleryCards[0];
      const cardWidth = card ? card.offsetWidth : 300;
      const step = cardWidth + 14;
      const index = Math.min(
        galleryCards.length - 1,
        Math.max(0, Math.round(scrollLeft / step))
      );
      currLabel.textContent = String(index + 1).padStart(2, '0');
    }

    galleryStrip.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveSlide, 35);
    }, { passive: true });

    prevBtn?.addEventListener('click', () => {
      const card = galleryCards[0];
      const cardWidth = card ? card.offsetWidth : 300;
      galleryStrip.scrollBy({ left: -(cardWidth + 14), behavior: 'smooth' });
    });

    nextBtn?.addEventListener('click', () => {
      const card = galleryCards[0];
      const cardWidth = card ? card.offsetWidth : 300;
      galleryStrip.scrollBy({ left: cardWidth + 14, behavior: 'smooth' });
    });
  }
}

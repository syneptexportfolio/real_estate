import './styles/index.css';
import { FrameEngine } from './engine/FrameEngine.js';
import { initNavigation } from './components/Navigation.js';
import { initCinematicHUD } from './components/CinematicHUD.js';
import { initLocationMap } from './components/LocationMap.js';
import { initGalleryModal } from './components/GalleryModal.js';
import { initEnquiryForm } from './components/EnquiryForm.js';
import { initScrollAnimations } from './components/ScrollAnimations.js';
import { initNumericalCounter } from './components/NumericalCounter.js';
import { initFAQAccordion } from './components/FAQAccordion.js';
import { seoConfig } from './data/seoConfig.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject Dynamic Schema.org JSON-LD if not already present
  if (!document.querySelector('#structured-data-jsonld')) {
    const script = document.createElement('script');
    script.id = 'structured-data-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(seoConfig.getJsonLd(), null, 2);
    document.head.appendChild(script);
  }

  // 2. Initialize Navigation
  initNavigation();

  // 3. Initialize Frame Engine & Cinematic HUD
  const canvas = document.querySelector('.cinematic-canvas');
  const track = document.querySelector('.cinematic-track');

  let frameEngine = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && track && !prefersReducedMotion) {
    frameEngine = new FrameEngine(canvas, track);
    initCinematicHUD(frameEngine);
  }

  // 4. Initialize Interactive Topographic Radar Visual
  initLocationMap();

  // 5. Initialize Lightbox Gallery Modal
  initGalleryModal();

  // 6. Initialize Enquiry & WhatsApp Conversion Form
  initEnquiryForm();

  // 7. Initialize Section Scroll Animations (Down-to-Up Popup on Text and Main Images)
  initScrollAnimations();

  // 8. Initialize Precision Luxury Numerical Counter
  initNumericalCounter();

  // 9. Initialize Interactive Luxury FAQ Accordion
  initFAQAccordion();

  console.log('AURELIA Cinematic Experience Initialized.');
});

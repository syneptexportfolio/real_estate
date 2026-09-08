import { TOTAL_FRAMES } from '../data/scenesConfig.js';

/**
 * High-Performance Smooth Scroll Controller.
 * Normalizes scroll progress [0..1] and maps it continuously to frame index.
 */

export class ScrollController {
  constructor(trackElement) {
    this.track = trackElement;
    this.progress = 0;
    this.targetFrame = 0;
    this.currentFrame = 0;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    this.damping = isMobile ? 0.22 : 0.14; // Tuned for responsive yet silky fluid movement
    this.isTicking = false;
    this.listeners = new Set();
    this.lastIntegerFrame = -1;

    this.onScroll = this.onScroll.bind(this);
    this.update = this.update.bind(this);

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', () => {
      this.damping = window.innerWidth < 768 ? 0.22 : 0.14;
      this.onScroll();
    }, { passive: true });

    // Initial check
    this.onScroll();
  }

  onScroll() {
    if (!this.track) return;

    const rect = this.track.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const trackHeight = this.track.offsetHeight;
    const windowHeight = window.innerHeight;

    const maxScroll = trackHeight - windowHeight;
    const currentScroll = window.scrollY - trackTop;

    this.progress = Math.max(0, Math.min(1, currentScroll / maxScroll));
    this.targetFrame = this.progress * (TOTAL_FRAMES - 1);

    if (!this.isTicking) {
      this.isTicking = true;
      requestAnimationFrame(this.update);
    }
  }

  update() {
    const diff = this.targetFrame - this.currentFrame;

    if (Math.abs(diff) > 0.005) {
      this.currentFrame += diff * this.damping;
      this.isTicking = true;
      requestAnimationFrame(this.update);
    } else {
      this.currentFrame = this.targetFrame;
      this.isTicking = false;
    }

    const roundedFrame = Math.round(this.currentFrame);
    if (roundedFrame !== this.lastIntegerFrame) {
      this.lastIntegerFrame = roundedFrame;
      this.notify(roundedFrame, this.progress);
    }
  }

  onFrameChange(cb) {
    this.listeners.add(cb);
  }

  notify(frameIndex, progress) {
    for (const cb of this.listeners) {
      cb(frameIndex, progress);
    }
  }

  destroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    this.listeners.clear();
  }
}

/**
 * Intelligent Sliding Window & LRU Cache for Cinematic Frames.
 * Holds all 452 frames in memory on desktop for 60fps locked scrubbing.
 */

import { TOTAL_FRAMES } from '../data/scenesConfig.js';

export class CacheManager {
  constructor() {
    this.cache = new Map(); // frameIndex -> { img, lastAccessed }
    this.inFlight = new Map(); // frameIndex -> Promise<HTMLImageElement>
    this.maxCapacity = this.determineMaxCapacity();
    this.lastRenderedIndex = 0;
  }

  determineMaxCapacity() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;
    const memory = navigator.deviceMemory || 4;

    if (isMobile || memory <= 2) {
      return 150; // Ample buffer for mobile
    }
    if (isTablet || memory <= 4) {
      return 250;
    }
    return 500; // Easily accommodates all 452 frames (~45MB) for zero-latency scrubbing
  }

  setRenderedIndex(index) {
    this.lastRenderedIndex = index;
  }

  has(index) {
    return this.cache.has(index);
  }

  get(index) {
    const item = this.cache.get(index);
    if (item) {
      item.lastAccessed = performance.now();
      return item.img;
    }
    return null;
  }

  set(index, img) {
    this.cache.set(index, {
      img,
      lastAccessed: performance.now()
    });

    if (this.cache.size > this.maxCapacity) {
      this.evictFurthest(this.lastRenderedIndex);
    }
  }

  getClosest(targetIndex) {
    if (this.cache.has(targetIndex)) {
      return { img: this.get(targetIndex), index: targetIndex };
    }

    let closestDist = Infinity;
    let closestIndex = -1;
    let closestImg = null;

    for (const [idx, item] of this.cache.entries()) {
      const dist = Math.abs(idx - targetIndex);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = idx;
        closestImg = item.img;
      }
    }

    return closestImg ? { img: closestImg, index: closestIndex } : null;
  }

  evictFurthest(currentIndex) {
    const target = currentIndex !== undefined ? currentIndex : this.lastRenderedIndex;
    let furthestIndex = -1;
    let maxDist = -1;

    for (const [index] of this.cache.entries()) {
      // Safeguard frame 0, terminal frame, and the active viewing window (+/- 30 frames)
      if (index === 0 || index === TOTAL_FRAMES - 1) continue;
      if (Math.abs(index - target) <= 30) continue;

      const dist = Math.abs(index - target);
      if (dist > maxDist) {
        maxDist = dist;
        furthestIndex = index;
      }
    }

    if (furthestIndex !== -1) {
      this.cache.delete(furthestIndex);
    }
  }

  clear() {
    this.cache.clear();
    this.inFlight.clear();
  }
}

import { TOTAL_FRAMES } from '../data/scenesConfig.js';

/**
 * Priority Progressive Preloader for Cinematic Frames.
 * Prioritizes: Current frame -> Forward window -> Backward window -> Idle background stream.
 */

export class Preloader {
  constructor(cacheManager) {
    this.cacheManager = cacheManager;
    this.queue = [];
    this.maxConcurrent = this.determineConcurrency();
    this.activeLoads = 0;
    this.subscribers = new Set();
  }

  determineConcurrency() {
    const isMobile = window.innerWidth < 768;
    const connection = navigator.connection;

    if (connection && (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === '3g')) {
      return 2;
    }
    return isMobile ? 4 : 8;
  }

  getFrameUrl(index) {
    return `/frames/frame_${index}.jpg?v=2`;
  }

  onFrameLoaded(cb) {
    this.subscribers.add(cb);
  }

  notifyFrameLoaded(index, img) {
    for (const cb of this.subscribers) {
      cb(index, img);
    }
  }

  async loadInitialFrames(count = 25) {
    const initialIndices = [0, TOTAL_FRAMES - 1];
    for (let i = 1; i < count; i++) {
      if (i < TOTAL_FRAMES - 1) {
        initialIndices.push(i);
      }
    }

    const promises = initialIndices.map(idx => this.loadSingleFrame(idx, true));
    return Promise.allSettled(promises);
  }

  loadSingleFrame(index, isPriority = false) {
    if (index < 0 || index >= TOTAL_FRAMES) return Promise.resolve(null);
    if (this.cacheManager.has(index)) {
      return Promise.resolve(this.cacheManager.get(index));
    }
    if (this.cacheManager.inFlight.has(index)) {
      return this.cacheManager.inFlight.get(index);
    }

    const promise = new Promise((resolve) => {
      const img = new Image();
      let settled = false;

      const finish = () => {
        if (settled) return;
        settled = true;
        this.cacheManager.inFlight.delete(index);
        this.cacheManager.set(index, img);
        this.notifyFrameLoaded(index, img);
        resolve(img);
      };

      const fail = () => {
        if (settled) return;
        settled = true;
        this.cacheManager.inFlight.delete(index);
        resolve(null);
      };

      img.onload = () => {
        if ('decode' in img) {
          img.decode().then(finish).catch(finish);
        } else {
          finish();
        }
      };

      img.onerror = fail;

      // Timeout safety: if network hangs for 6s, fail gracefully and release concurrency
      setTimeout(() => {
        if (!settled) fail();
      }, 6000);

      img.src = this.getFrameUrl(index);
    });

    this.cacheManager.inFlight.set(index, promise);
    return promise;
  }

  updatePreloadWindow(currentIndex) {
    const isMobile = window.innerWidth < 768;
    const forwardCount = isMobile ? 25 : 50;
    const backwardCount = isMobile ? 10 : 20;

    const priorities = [];
    priorities.push(currentIndex);

    for (let i = 1; i <= forwardCount; i++) {
      const nextIdx = currentIndex + i;
      if (nextIdx < TOTAL_FRAMES) priorities.push(nextIdx);
    }

    for (let i = 1; i <= backwardCount; i++) {
      const prevIdx = currentIndex - i;
      if (prevIdx >= 0) priorities.push(prevIdx);
    }

    // Filter unneeded items
    const needed = priorities.filter(idx => !this.cacheManager.has(idx) && !this.cacheManager.inFlight.has(idx));

    // Prepend immediate needed priorities to front of queue
    const neededSet = new Set(needed);
    const existingRemaining = this.queue.filter(idx => !neededSet.has(idx) && !this.cacheManager.has(idx));
    this.queue = [...needed, ...existingRemaining];

    this.pump();
  }

  pump() {
    while (this.activeLoads < this.maxConcurrent && this.queue.length > 0) {
      const nextIdx = this.queue.shift();
      if (this.cacheManager.has(nextIdx) || this.cacheManager.inFlight.has(nextIdx)) {
        continue;
      }

      this.activeLoads++;
      this.loadSingleFrame(nextIdx)
        .finally(() => {
          this.activeLoads = Math.max(0, this.activeLoads - 1);
          this.pump();
        });
    }
  }

  startBackgroundStreaming() {
    let nextIndex = 0;
    const streamNext = () => {
      // If user is actively scrolling and generating priority queue, pause background stream
      if (this.queue.length > 0 || this.activeLoads >= 3) {
        setTimeout(streamNext, 400);
        return;
      }

      while (nextIndex < TOTAL_FRAMES && (this.cacheManager.has(nextIndex) || this.cacheManager.inFlight.has(nextIndex))) {
        nextIndex++;
      }

      if (nextIndex < TOTAL_FRAMES) {
        this.loadSingleFrame(nextIndex)
          .finally(() => {
            nextIndex++;
            setTimeout(streamNext, 25);
          });
      }
    };

    setTimeout(streamNext, 1200);
  }
}

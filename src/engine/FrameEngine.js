import { CacheManager } from './CacheManager.js';
import { Preloader } from './Preloader.js';
import { ScrollController } from './ScrollController.js';
import { getSceneForFrame, TOTAL_FRAMES } from '../data/scenesConfig.js';

/**
 * Master Frame Engine.
 * Manages Canvas 2D rendering, DPR scaling, fallback recovery, and UI HUD synchronization.
 */

export class FrameEngine {
  constructor(canvasElement, trackElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.track = trackElement;
    this.options = options;

    this.cacheManager = new CacheManager();
    this.preloader = new Preloader(this.cacheManager);
    this.scrollController = new ScrollController(this.track);

    this.currentRenderedIndex = -1;
    this.isRendering = false;
    this.sceneListeners = new Set();
    this.lastSceneId = null;

    this.onResize = this.onResize.bind(this);
    this.renderFrame = this.renderFrame.bind(this);

    this.init();
  }

  async init() {
    this.handleDprAndSize();
    window.addEventListener('resize', this.onResize, { passive: true });

    // When new frames arrive, if it's the target frame or closer than what's currently rendered, re-render
    this.preloader.onFrameLoaded((loadedIndex) => {
      const currentTarget = this.scrollController.lastIntegerFrame >= 0 ? this.scrollController.lastIntegerFrame : 0;
      if (
        loadedIndex === currentTarget ||
        this.currentRenderedIndex === -1 ||
        Math.abs(loadedIndex - currentTarget) < Math.abs(this.currentRenderedIndex - currentTarget)
      ) {
        this.renderFrame(currentTarget);
      }
    });

    // Listen to scroll controller
    this.scrollController.onFrameChange((frameIndex, progress) => {
      this.preloader.updatePreloadWindow(frameIndex);
      this.renderFrame(frameIndex);
      this.checkSceneUpdate(frameIndex, progress);
    });

    // Initial load: priority initial frames
    await this.preloader.loadInitialFrames(25);
    this.renderFrame(0);
    this.checkSceneUpdate(0, 0);

    // Start background streaming for seamless scrubbing
    this.preloader.startBackgroundStreaming();
  }

  handleDprAndSize() {
    const isMobile = window.innerWidth < 768;
    // Mobile capped at 1.0 to guarantee 60fps; desktop capped at 1.5 for retina sharpness
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5);
    const rect = this.canvas.getBoundingClientRect();

    const clientW = rect.width > 0 ? rect.width : window.innerWidth;
    const clientH = rect.height > 0 ? rect.height : window.innerHeight;

    const w = Math.round(clientW * dpr);
    const h = Math.round(clientH * dpr);

    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'medium';

      if (this.currentRenderedIndex !== -1) {
        this.drawDirect(this.currentRenderedIndex);
      }
    }
  }

  onResize() {
    this.handleDprAndSize();
    if (this.currentRenderedIndex !== -1) {
      this.drawDirect(this.currentRenderedIndex);
    }
  }

  renderFrame(frameIndex) {
    const targetIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));
    this.cacheManager.setRenderedIndex(targetIdx);

    let imgToDraw = this.cacheManager.get(targetIdx);

    // Fallback recovery: if exact frame is not yet decoded, draw the closest available frame
    if (!imgToDraw) {
      const closest = this.cacheManager.getClosest(targetIdx);
      if (closest) {
        imgToDraw = closest.img;
      }
    }

    if (imgToDraw && imgToDraw.complete && imgToDraw.naturalWidth > 0) {
      this.drawToCanvas(imgToDraw);
      this.currentRenderedIndex = targetIdx;
    }
  }

  drawDirect(index) {
    const item = this.cacheManager.getClosest(index);
    if (item && item.img && item.img.complete) {
      this.drawToCanvas(item.img);
    }
  }

  drawToCanvas(img) {
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    if (cw <= 0 || ch <= 0) return;

    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    // Cover scaling calculation
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    this.ctx.drawImage(img, sx, sy, sw, sh);
  }

  checkSceneUpdate(frameIndex, progress) {
    const scene = getSceneForFrame(frameIndex);
    if (scene && scene.id !== this.lastSceneId) {
      this.lastSceneId = scene.id;
      for (const cb of this.sceneListeners) {
        cb(scene, progress, frameIndex);
      }
    }
  }

  onSceneChange(cb) {
    this.sceneListeners.add(cb);
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.scrollController.destroy();
    this.cacheManager.clear();
    this.sceneListeners.clear();
  }
}

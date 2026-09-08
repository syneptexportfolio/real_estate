/**
 * Luxury Numerical Counter Component.
 * Animates key residence metrics with Swiss-calibrated exponential ease-out counting,
 * tabular numeral stability (zero jitter), comma formatting, and subtle bronze aura glow.
 */

export function initNumericalCounter() {
  const metricsStrip = document.querySelector('.metrics-strip');
  if (!metricsStrip) return;

  const metricCards = metricsStrip.querySelectorAll('.metric-card');
  if (!metricCards.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Configuration for each metric card
  const metricsConfig = [
    {
      target: 1,
      hasComma: false,
      duration: 850,
      delay: 0,
      steps: [0, 1]
    },
    {
      target: 2,
      hasComma: false,
      duration: 1050,
      delay: 140,
      steps: [0, 1, 2]
    },
    {
      target: 900,
      hasComma: false,
      duration: 1750,
      delay: 260
    },
    {
      target: 4000,
      hasComma: true,
      duration: 2000,
      delay: 380
    }
  ];

  // Easing function: Exponential Deceleration (easeOutExpo)
  // Rapid acceleration followed by ultra-smooth, high-precision glide into target
  const easeOutExpo = (t) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  // Helper to format numbers with commas
  const formatNumber = (val, hasComma) => {
    if (hasComma) {
      return Math.round(val).toLocaleString('en-US');
    }
    return Math.round(val).toString();
  };

  let isAnimating = false;
  let hasAnimated = false;
  let timeouts = [];
  let frameIds = [];

  const clearAllTimers = () => {
    timeouts.forEach(clearTimeout);
    timeouts = [];
    frameIds.forEach(cancelAnimationFrame);
    frameIds = [];
    isAnimating = false;
  };

  const startCounting = () => {
    if (isAnimating || hasAnimated) return;
    isAnimating = true;
    hasAnimated = true;

    metricCards.forEach((card, i) => {
      const config = metricsConfig[i];
      if (!config) return;

      const numEl = card.querySelector('.metric-num');
      const valContainer = card.querySelector('.metric-val');
      if (!numEl || !valContainer) return;

      if (prefersReducedMotion) {
        numEl.textContent = formatNumber(config.target, config.hasComma);
        valContainer.classList.add('is-counted');
        return;
      }

      // Set starting 0
      numEl.textContent = '0';
      valContainer.classList.remove('is-counted');
      valContainer.classList.add('is-counting');

      const timeoutId = setTimeout(() => {
        const startTime = performance.now();

        const tick = (currentTime) => {
          const elapsed = currentTime - startTime;
          const rawProgress = Math.min(1, elapsed / config.duration);
          const eased = easeOutExpo(rawProgress);

          if (config.steps) {
            // For single-digit counters (1 and 2), step through cleanly
            const stepIndex = Math.min(
              config.steps.length - 1,
              Math.floor(eased * config.steps.length)
            );
            numEl.textContent = config.steps[stepIndex];
          } else {
            const currentVal = eased * config.target;
            numEl.textContent = formatNumber(currentVal, config.hasComma);
          }

          if (rawProgress < 1) {
            const frameId = requestAnimationFrame(tick);
            frameIds.push(frameId);
          } else {
            // Complete: set precise final value and trigger luxury aura glow
            numEl.textContent = formatNumber(config.target, config.hasComma);
            valContainer.classList.remove('is-counting');
            valContainer.classList.add('is-counted');
          }
        };

        const firstFrame = requestAnimationFrame(tick);
        frameIds.push(firstFrame);
      }, config.delay);

      timeouts.push(timeoutId);
    });
  };

  const resetCounting = () => {
    clearAllTimers();
    hasAnimated = false;
    metricCards.forEach((card, i) => {
      const config = metricsConfig[i];
      const numEl = card.querySelector('.metric-num');
      const valContainer = card.querySelector('.metric-val');
      if (numEl && valContainer && config) {
        valContainer.classList.remove('is-counting', 'is-counted');
        numEl.textContent = '0';
      }
    });
  };

  // Trigger when metrics strip intersects viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounting();
        } else {
          // Reset when completely out of viewport so user can re-experience when scrolling back
          const rect = entry.boundingClientRect;
          if (rect.top > window.innerHeight || rect.bottom < 0) {
            resetCounting();
          }
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  observer.observe(metricsStrip);
}

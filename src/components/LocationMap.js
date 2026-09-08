/**
 * Dark Topographic & Radar Coordinate Visualizer.
 * Renders luxury contour rings, glowing coordinate beacon, and radial range markers.
 */

export function initLocationMap() {
  const canvas = document.querySelector('.location-radar-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let pulse = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  function draw() {
    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;
    const cx = w * 0.5;
    const cy = h * 0.5;

    ctx.clearRect(0, 0, w, h);

    // Background radial ambiance
    const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.6);
    bgGrad.addColorStop(0, 'rgba(35, 30, 26, 0.9)');
    bgGrad.addColorStop(1, 'rgba(11, 10, 9, 1)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle Topographic Elevation Contours
    ctx.strokeStyle = 'rgba(194, 166, 132, 0.08)';
    ctx.lineWidth = 1;

    for (let r = 40; r < Math.max(w, h) * 0.7; r += 35) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radial Crosshair Axis
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.moveTo(cx, 20);
    ctx.lineTo(cx, h - 20);
    ctx.moveTo(20, cy);
    ctx.lineTo(w - 20, cy);
    ctx.stroke();

    // Subtle Radar Sweep Beam
    pulse += 0.015;
    const pulseRadius = 30 + (Math.sin(pulse) * 0.5 + 0.5) * 60;

    const pulseGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseRadius);
    pulseGrad.addColorStop(0, 'rgba(194, 166, 132, 0.3)');
    pulseGrad.addColorStop(1, 'rgba(194, 166, 132, 0)');
    ctx.fillStyle = pulseGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
    ctx.fill();

    // Center Coordinate Beacon
    ctx.fillStyle = '#FAF8F5';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#C2A684';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Coordinate Label
    const isMobile = w < 640;
    ctx.fillStyle = '#C2A684';
    ctx.font = (isMobile ? '9px' : '10px') + ' "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = isMobile ? '1.5px' : '2px';
    ctx.textAlign = 'center';
    ctx.fillText('AURELIA — 43.5° N, 10.8° E', cx, cy + (isMobile ? 24 : 28));

    // Range tags
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = (isMobile ? '8.5px' : '9px') + ' "Plus Jakarta Sans", sans-serif';
    if (isMobile) {
      // Keep range tags safely inside the canvas boundary and clear of bottom telemetry bar
      ctx.textAlign = 'right';
      ctx.fillText('5 KM — COASTAL', w - 18, cy - 38);
      ctx.textAlign = 'left';
      ctx.fillText('12 KM — AVIATION', 18, cy - 38);
    } else {
      ctx.textAlign = 'left';
      ctx.fillText('5 KM — COASTAL ACCESS', cx + 45, cy - 45);
      ctx.fillText('12 KM — PRIVATE AVIATION', cx - 110, cy + 85);
    }

    animationId = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
  };
}

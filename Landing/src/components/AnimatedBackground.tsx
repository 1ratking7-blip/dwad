import { useEffect, useRef } from 'react';

/**
 * Decorative canvas background — drifting ash/ember particles through soft
 * fog, plus two slow-moving glow blobs for depth. Purely visual: aria-hidden,
 * pointer-events-none, positioned behind all content at a fixed low z-index.
 *
 * Performance choices (this is explicitly not allowed to hurt Lighthouse):
 * - Single <canvas>, no per-particle DOM nodes.
 * - Particle count capped and scaled down on narrow viewports.
 * - devicePixelRatio capped at 2 — a 3x/4x phone display doesn't need a 4x
 *   canvas for a blurry background effect, and it would multiply fill cost.
 * - Paused entirely via the Page Visibility API when the tab isn't visible.
 * - prefers-reduced-motion: renders one static frame and stops, instead of
 *   a perpetual rAF loop — matches the reduced-motion handling already
 *   established elsewhere in this app (index.css, MotionConfig in App.tsx).
 * - rAF loop is torn down on unmount; resize listener is passive + rAF-batched.
 */

interface Particle {
  x: number;
  y: number;
  depth: number; // 0 (far) .. 1 (near) — drives size/speed/opacity
  size: number;
  speedY: number;
  driftX: number;
  driftPhase: number;
  kind: 'ash' | 'spark' | 'bill' | 'coin' | 'card';
  twinklePhase: number;
  rotation: number;
  rotationSpeed: number;
}

const ACCENT_RGB = '0, 255, 102';
const GOLD_RGB = '211, 180, 90';

/**
 * "Global atmosphere across every section" (brief §2) reuses this existing
 * canvas engine rather than a second DOM-based particle system: it's
 * already mounted once at the App root, already perf-hardened (capped DPR,
 * paused on tab-hide, reduced-motion static frame, particle count scaled by
 * viewport), and a canvas draw call is far cheaper than dozens of extra
 * animated DOM nodes spread across the whole document. `money` kinds
 * (bill/coin/card) are a low-probability addition on top of the existing
 * ash/spark — Hero keeps its own denser FloatingWealth particle system for
 * its own dedicated composition; this is the sparse, everywhere-else layer.
 */
function createParticles(width: number, height: number, count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const depth = Math.random();
    const roll = Math.random();
    const kind: Particle['kind'] = roll < 0.06 ? 'bill' : roll < 0.1 ? 'coin' : roll < 0.13 ? 'card' : roll < 0.31 ? 'spark' : 'ash';
    const isMoney = kind === 'bill' || kind === 'coin' || kind === 'card';
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      depth,
      size: isMoney ? 5 + depth * 10 : (kind === 'spark' ? 1 : 1.5) + depth * (kind === 'spark' ? 1.5 : 2.5),
      speedY: (isMoney ? 0.08 + depth * 0.18 : 0.15 + depth * 0.35) * (kind === 'spark' ? 1.4 : 1),
      driftX: (Math.random() - 0.5) * (isMoney ? 0.5 : 0.3),
      driftPhase: Math.random() * Math.PI * 2,
      kind,
      twinklePhase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * (isMoney ? 0.01 : 0),
    });
  }
  return particles;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];
    let rafId = 0;
    let resizeRaf = 0;
    let running = true;
    let t = 0;

    function particleCountFor(w: number) {
      if (w < 640) return 26;
      if (w < 1280) return 45;
      return 65;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(width, height, particleCountFor(width));
    }

    function drawGlowBlobs(time: number) {
      const blobs = [
        { baseX: width * 0.22, baseY: height * 0.35, r: Math.max(width, height) * 0.28, speed: 0.00012, phase: 0 },
        { baseX: width * 0.78, baseY: height * 0.65, r: Math.max(width, height) * 0.24, speed: 0.00009, phase: 2 },
      ];
      for (const b of blobs) {
        const x = b.baseX + Math.sin(time * b.speed + b.phase) * width * 0.06;
        const y = b.baseY + Math.cos(time * b.speed * 0.8 + b.phase) * height * 0.06;
        const gradient = ctx!.createRadialGradient(x, y, 0, x, y, b.r);
        gradient.addColorStop(0, `rgba(${ACCENT_RGB}, 0.07)`);
        gradient.addColorStop(1, `rgba(${ACCENT_RGB}, 0)`);
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, width, height);
      }
    }

    function drawMoneyParticle(p: Particle, opacity: number) {
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);
      if (p.kind === 'coin') {
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${GOLD_RGB}, ${opacity})`;
        ctx!.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.strokeStyle = `rgba(${GOLD_RGB}, ${opacity * 1.3})`;
        ctx!.lineWidth = Math.max(0.5, p.size * 0.12);
        ctx!.beginPath();
        ctx!.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
        ctx!.stroke();
      } else if (p.kind === 'bill') {
        const w = p.size * 2;
        const h = p.size * 1.1;
        ctx!.fillStyle = `rgba(20, 30, 26, ${opacity})`;
        ctx!.fillRect(-w / 2, -h / 2, w, h);
        ctx!.strokeStyle = `rgba(${GOLD_RGB}, ${opacity * 1.2})`;
        ctx!.lineWidth = Math.max(0.4, p.size * 0.06);
        ctx!.strokeRect(-w / 2, -h / 2, w, h);
      } else {
        // card
        const w = p.size * 1.3;
        const h = p.size * 1.8;
        ctx!.fillStyle = `rgba(15, 22, 19, ${opacity})`;
        ctx!.beginPath();
        ctx!.roundRect(-w / 2, -h / 2, w, h, Math.max(1, p.size * 0.18));
        ctx!.fill();
        ctx!.strokeStyle = `rgba(${ACCENT_RGB}, ${opacity})`;
        ctx!.lineWidth = Math.max(0.4, p.size * 0.06);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function drawParticles(time: number) {
      for (const p of particles) {
        p.y -= p.speedY;
        p.x += Math.sin(time * 0.0006 + p.driftPhase) * p.driftX;
        p.rotation += p.rotationSpeed;
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        const twinkle = 0.55 + 0.45 * Math.sin(time * 0.002 + p.twinklePhase);
        const isMoney = p.kind === 'bill' || p.kind === 'coin' || p.kind === 'card';
        const baseOpacity = (isMoney ? 0.16 : p.kind === 'spark' ? 0.5 : 0.22) * (0.4 + p.depth * 0.6);
        const opacity = baseOpacity * twinkle;

        if (isMoney) {
          drawMoneyParticle(p, opacity);
          continue;
        }

        ctx!.beginPath();
        ctx!.fillStyle =
          p.kind === 'spark'
            ? `rgba(${ACCENT_RGB}, ${opacity})`
            : `rgba(180, 220, 200, ${opacity * 0.6})`;
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();

        if (p.kind === 'spark') {
          ctx!.beginPath();
          ctx!.fillStyle = `rgba(${ACCENT_RGB}, ${opacity * 0.25})`;
          ctx!.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    function frame() {
      if (!running) return;
      t += 16;
      ctx!.clearRect(0, 0, width, height);
      drawGlowBlobs(t);
      drawParticles(t);
      rafId = requestAnimationFrame(frame);
    }

    function handleResize() {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    }

    function handleVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!reduceMotion) {
        running = true;
        rafId = requestAnimationFrame(frame);
      }
    }

    resize();

    if (reduceMotion) {
      // One static frame — depth/glow still visible, nothing perpetually animates.
      drawGlowBlobs(0);
      drawParticles(0);
    } else {
      rafId = requestAnimationFrame(frame);
      document.addEventListener('visibilitychange', handleVisibility);
    }

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

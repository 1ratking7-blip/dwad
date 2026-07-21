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
  kind: 'ash' | 'spark';
  twinklePhase: number;
}

const ACCENT_RGB = '0, 255, 102';

function createParticles(width: number, height: number, count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const depth = Math.random();
    const kind: Particle['kind'] = Math.random() < 0.18 ? 'spark' : 'ash';
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      depth,
      size: (kind === 'spark' ? 1 : 1.5) + depth * (kind === 'spark' ? 1.5 : 2.5),
      speedY: (0.15 + depth * 0.35) * (kind === 'spark' ? 1.4 : 1),
      driftX: (Math.random() - 0.5) * 0.3,
      driftPhase: Math.random() * Math.PI * 2,
      kind,
      twinklePhase: Math.random() * Math.PI * 2,
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

    function drawParticles(time: number) {
      for (const p of particles) {
        p.y -= p.speedY;
        p.x += Math.sin(time * 0.0006 + p.driftPhase) * p.driftX;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const twinkle = 0.55 + 0.45 * Math.sin(time * 0.002 + p.twinklePhase);
        const baseOpacity = (p.kind === 'spark' ? 0.5 : 0.22) * (0.4 + p.depth * 0.6);
        const opacity = baseOpacity * twinkle;

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

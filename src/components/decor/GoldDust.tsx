"use client";

import { useEffect, useRef } from "react";

/**
 * Drifting gold dust on a single canvas. Pauses when off-screen or when the
 * tab is hidden, and renders a still frame for reduced-motion users.
 */
export default function GoldDust({ density = 42, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;

    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number };
    let particles: P[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(density * Math.min(1.6, (w * h) / (390 * 844)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(Math.random() * 0.22 + 0.05),
        a: Math.random() * 0.6 + 0.2,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
          if (p.x < -4) p.x = w + 4;
          if (p.x > w + 4) p.x = -4;
        }
        const alpha = p.a * (0.55 + 0.45 * Math.sin(t / 900 + p.tw));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(240, 214, 150, ${alpha})`);
        g.addColorStop(1, "rgba(201, 164, 92, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      draw(t);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };

    resize();
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !was && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}

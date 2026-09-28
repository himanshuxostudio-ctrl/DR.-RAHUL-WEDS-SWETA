"use client";

import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fade + rise, once, when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "p" | "h2" | "h3" | "span" | "li";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.2, delay, ease }}
    >
      {children}
    </M>
  );
}

/**
 * Split a line into words that rise out of a mask one after another. The
 * in-view trigger lives on the (always visible) wrapper; each word's mask has
 * extra vertical headroom so Devanagari matras above/below the line never clip.
 */
export function RevealWords({ text, className = "", delay = 0, stagger = 0.08 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden className="-my-[0.3em] inline-block overflow-hidden py-[0.3em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "130%" }, show: { y: "0%", transition: { duration: 1.1, ease } } }}
          >
            {w}
            {i < words.length - 1 ? "\u00a0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Masked image reveal: the frame "opens" from one edge while the photo settles
 * from a slight scale — revealed, not loaded. Built only from transforms (an
 * outer window slides in while the image counter-slides), so it stays on the
 * compositor and never repaints — smooth on phones.
 */
export function MaskReveal({
  children,
  className = "",
  delay = 0,
  from = "bottom",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left" | "right" | "center";
}) {
  const film = { duration: 1.5, delay, ease: [0.65, 0, 0.35, 1] as const };
  const viewport = { once: true, margin: "-12% 0px" } as const;
  const dir = from === "left" ? -1 : 1;
  const offset = (sign: number) => (from === "bottom" ? { y: `${sign * 100}%` } : { x: `${sign * 100}%` });
  const settled = from === "bottom" ? { y: "0%" } : { x: "0%" };

  if (from === "center") {
    return (
      <motion.div
        className={`relative overflow-hidden ${className}`}
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewport}
        transition={{ duration: 1.4, delay, ease }}
      >
        <motion.div className="h-full w-full" initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={viewport} transition={{ duration: 2.2, delay, ease }}>
          {children}
        </motion.div>
      </motion.div>
    );
  }

  // The in-view trigger sits on the static outer box (the sliding window starts
  // outside its own mask, so it could never be "in view" by itself).
  return (
    <motion.div className={`relative overflow-hidden ${className}`} initial="hidden" whileInView="show" viewport={viewport}>
      <motion.div
        className="absolute inset-0 overflow-hidden will-change-transform"
        variants={{ hidden: offset(dir), show: { ...settled, transition: film } }}
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          variants={{ hidden: offset(-dir), show: { ...settled, transition: film } }}
        >
          <motion.div
            className="h-full w-full"
            variants={{ hidden: { scale: 1.1 }, show: { scale: 1, transition: { duration: 2.2, delay, ease } } }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Scroll-linked vertical drift for parallax layers. */
export function useParallax(distance = 60): [React.RefObject<HTMLDivElement | null>, MotionValue<number>] {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return [ref, y];
}

export function Parallax({ children, distance = 50, className = "" }: { children: ReactNode; distance?: number; className?: string }) {
  const [ref, y] = useParallax(distance);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="relative h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Progress (0 → 1) of scrolling through a pinned section: 0 when its top
 * reaches the top of the viewport, 1 when its bottom reaches the bottom.
 * A plain passive listener feeding a motion value — deterministic even for
 * the very last section on the page.
 */
export function usePinnedProgress(ref: React.RefObject<HTMLElement | null>) {
  const progress = useMotionValue(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      progress.set(span <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / span)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, progress]);
  return progress;
}

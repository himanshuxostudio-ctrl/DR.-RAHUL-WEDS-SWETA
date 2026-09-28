"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";

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

/** Split a line into words that rise out of a mask one after another. */
export function RevealWords({ text, className = "", delay = 0, stagger = 0.08 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 1.1, delay: delay + i * stagger, ease }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Masked image reveal: the frame "opens" from the bottom while the photo
 * settles from a slight scale — revealed, not loaded.
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
  const hidden = {
    bottom: "inset(100% 0% 0% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
    center: "inset(48% 48% 48% 48%)",
  }[from];
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ clipPath: hidden }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1.6, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 2.4, delay, ease }}
      >
        {children}
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

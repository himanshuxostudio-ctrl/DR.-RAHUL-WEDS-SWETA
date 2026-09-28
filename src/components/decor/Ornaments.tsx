"use client";

/**
 * The decorative language of the invitation — thin antique-gold linework,
 * lotus, cusped palace arches and a quiet mandala. Everything is inline SVG
 * (tiny, crisp at any size, animatable via stroke-dash).
 */
import { motion } from "framer-motion";

type Tone = "gold" | "wine";
const stroke = (tone: Tone = "gold") => (tone === "gold" ? "var(--gold)" : "var(--wine)");

/** Global SVG defs: the cusped palace arch used as an image mask. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <clipPath id="arch-clip" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,0.27 C0,0.13 0.2,0.07 0.36,0.045 C0.43,0.034 0.47,0.02 0.5,0 C0.53,0.02 0.57,0.034 0.64,0.045 C0.8,0.07 1,0.13 1,0.27 L1,1 Z" />
        </clipPath>
        <clipPath id="dome-clip" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,0.5 C0,0.22 0.22,0 0.5,0 C0.78,0 1,0.22 1,0.5 L1,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function LotusMark({ className = "", tone = "gold" }: { className?: string; tone?: Tone }) {
  const s = stroke(tone);
  return (
    <svg viewBox="0 0 64 40" className={className} fill="none" aria-hidden>
      <g stroke={s} strokeWidth="1" strokeLinecap="round">
        <path d="M32 4 C38 14 38 26 32 36 C26 26 26 14 32 4Z" />
        <path d="M32 36 C24 30 17 22 16 12 C24 15 30 24 32 36Z" />
        <path d="M32 36 C40 30 47 22 48 12 C40 15 34 24 32 36Z" />
        <path d="M32 36 C22 35 10 30 4 22 C14 21 25 27 32 36Z" />
        <path d="M32 36 C42 35 54 30 60 22 C50 21 39 27 32 36Z" />
        <path d="M18 38 H46" />
      </g>
    </svg>
  );
}

/** Horizontal divider: lines that draw outward from a lotus. */
export function OrnamentDivider({ className = "", tone = "gold", animate = true }: { className?: string; tone?: Tone; animate?: boolean }) {
  const s = stroke(tone);
  const line = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] as const } },
  };
  return (
    <motion.svg
      viewBox="0 0 320 40"
      className={className}
      fill="none"
      aria-hidden
      initial={animate ? "hidden" : "show"}
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      <g stroke={s} strokeWidth="0.9" strokeLinecap="round">
        <motion.path variants={line} d="M136 22 H20 M20 22 l-6 -4 M20 22 l-6 4" />
        <motion.path variants={line} d="M184 22 H300 M300 22 l6 -4 M300 22 l6 4" />
        <motion.path variants={line} d="M128 22 c-6 -8 -14 -8 -18 -2" />
        <motion.path variants={line} d="M192 22 c6 -8 14 -8 18 -2" />
        <circle cx="104" cy="22" r="1.6" fill={s} />
        <circle cx="216" cy="22" r="1.6" fill={s} />
      </g>
      <g transform="translate(144 6) scale(0.5)">
        <LotusPaths stroke={s} />
      </g>
    </motion.svg>
  );
}

function LotusPaths({ stroke: s }: { stroke: string }) {
  return (
    <g stroke={s} strokeWidth="1.8" strokeLinecap="round" fill="none">
      <path d="M32 4 C38 14 38 26 32 36 C26 26 26 14 32 4Z" />
      <path d="M32 36 C24 30 17 22 16 12 C24 15 30 24 32 36Z" />
      <path d="M32 36 C40 30 47 22 48 12 C40 15 34 24 32 36Z" />
      <path d="M32 36 C22 35 10 30 4 22 C14 21 25 27 32 36Z" />
      <path d="M32 36 C42 35 54 30 60 22 C50 21 39 27 32 36Z" />
    </g>
  );
}

/** A floral corner flourish; rotate for the other corners. */
export function CornerFlourish({ className = "", tone = "gold" }: { className?: string; tone?: Tone }) {
  const s = stroke(tone);
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <g stroke={s} strokeWidth="0.9" strokeLinecap="round">
        <path d="M4 116 V30 C4 14 14 4 30 4 H116" />
        <path d="M12 116 V36 C12 22 22 12 36 12 H116" opacity="0.5" />
        <path d="M30 4 C30 20 20 30 4 30" />
        <path d="M22 22 C34 26 44 36 48 48 C36 44 26 34 22 22Z" />
        <path d="M48 48 C58 50 66 58 68 68" />
        <path d="M58 22 c6 -2 12 0 16 4 M22 58 c-2 6 0 12 4 16" />
        <circle cx="80" cy="30" r="1.6" fill={s} />
        <circle cx="30" cy="80" r="1.6" fill={s} />
        <circle cx="94" cy="12" r="1.2" fill={s} />
        <circle cx="12" cy="94" r="1.2" fill={s} />
      </g>
    </svg>
  );
}

/** A quiet line mandala, used very large and very faint behind headings. */
export function Mandala({ className = "", tone = "gold" }: { className?: string; tone?: Tone }) {
  const s = stroke(tone);
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden>
      <g stroke={s} strokeWidth="0.6" transform="translate(200 200)">
        <circle r="196" />
        <circle r="186" strokeDasharray="2 6" />
        <circle r="120" />
        <circle r="62" />
        <circle r="30" strokeDasharray="1 4" />
        {petals.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0 -62 C14 -86 14 -104 0 -120 C-14 -104 -14 -86 0 -62Z" />
            <path d="M0 -120 C22 -140 24 -164 0 -186 C-24 -164 -22 -140 0 -120Z" />
            <circle cy="-150" r="3" />
          </g>
        ))}
        {petals.map((a) => (
          <path key={`i${a}`} transform={`rotate(${a + 11.25})`} d="M0 -30 C8 -42 8 -52 0 -62 C-8 -52 -8 -42 0 -30Z" />
        ))}
      </g>
    </svg>
  );
}

/** Outline of a palace arch — draws itself in when it scrolls into view. */
export function ArchOutline({ className = "", tone = "gold", delay = 0 }: { className?: string; tone?: Tone; delay?: number }) {
  const s = stroke(tone);
  return (
    <motion.svg
      viewBox="0 0 200 300"
      preserveAspectRatio="none"
      className={className}
      fill="none"
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      <motion.path
        d="M1 299 L1 81 C1 39 40 21 72 13.5 C86 10.2 94 6 100 1 C106 6 114 10.2 128 13.5 C160 21 199 39 199 81 L199 299"
        stroke={s}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        variants={{
          hidden: { pathLength: 0 },
          show: { pathLength: 1, transition: { duration: 2.2, delay, ease: [0.65, 0, 0.35, 1] } },
        }}
      />
    </motion.svg>
  );
}

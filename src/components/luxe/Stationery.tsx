"use client";

/**
 * The invitation's stationery system (luxury redesign experiment).
 *
 * One visual identity shared by every section, like a printed card suite:
 *  - RSMonogram      — the R ✦ S mark from the wax seal
 *  - RoyalArch       — a thin double-line palace arch (ogee / cusped / round)
 *  - MonogramDivider — gold lines drawing outward from the monogram
 *  - MadhubaniBand   — a whisper of Bihar's Madhubani border (hatched double line)
 *  - .buti / .buti-wine (globals.css) — faint repeating floral booti pattern
 *
 * All inline SVG in currentColor, hairline strokes (non-scaling), so they stay
 * crisp and delicate at any size and take the colour of their context.
 */
import { m } from "framer-motion";

/* A stretched crown (crownHeight) can't use pathLength drawing: with
   non-scaling hairline strokes the dash is measured in stretched units and
   the line is left partly undrawn. Those arches fade in instead. */
const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 2, ease: [0.65, 0, 0.35, 1] as const } },
};

/** R ✦ S — the couple's monogram, as on the wax seal. */
export function RSMonogram({ className = "", ring = true }: { className?: string; ring?: boolean }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      {ring && (
        <g stroke="currentColor">
          <circle cx="60" cy="60" r="57" strokeWidth="0.8" />
          <circle cx="60" cy="60" r="52" strokeWidth="0.5" strokeDasharray="1.2 3" />
          {petals.map((d) => (
            <path key={d} d="M60 5.5 Q62 8.6 60 11 Q58 8.6 60 5.5Z" fill="currentColor" stroke="none" transform={`rotate(${d} 60 60)`} />
          ))}
          <circle cx="60" cy="60" r="41" strokeWidth="0.45" />
        </g>
      )}
      <text x="60" y="69" textAnchor="middle" fill="currentColor" className="font-serif" fontSize="30" letterSpacing="1">
        R<tspan fontSize="14" dy="-6"> ✦ </tspan>
        <tspan dy="6">S</tspan>
      </text>
      <path d="M49 42 Q60 35 71 42 M49 79 Q60 86 71 79" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

type ArchVariant = "ogee" | "cusped" | "round";

const CROWNS: Record<ArchVariant, { vb: string; outer: string; inner: string; finial?: boolean }> = {
  // Mughal pointed (ogee) arch with a lotus finial
  ogee: {
    vb: "0 0 400 170",
    outer: "M1 170 C1 112 40 84 112 66 C160 54 190 36 200 16 C210 36 240 54 288 66 C360 84 399 112 399 170",
    inner: "M9 170 C9 116 46 91 115 74 C161 62 189 47 200 30 C211 47 239 62 285 74 C354 91 391 116 391 170",
    finial: true,
  },
  // cusped (multifoil) palace arch
  cusped: {
    vb: "0 0 400 210",
    outer: "M1 210 A199 199 0 0 1 399 210",
    inner: (() => {
      const lobes = 9;
      const r = 190;
      let d = `M9 210`;
      for (let i = 1; i <= lobes; i++) {
        const a = Math.PI - (Math.PI * i) / lobes;
        const x = 200 + Math.cos(a) * r;
        const y = 210 - Math.sin(a) * r;
        d += ` A30 30 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      return d;
    })(),
  },
  round: {
    vb: "0 0 400 204",
    outer: "M1 204 A199 199 0 0 1 399 204",
    inner: "M9 204 A191 191 0 0 1 391 204",
  },
};

/**
 * A thin palace arch framing its container. The crown keeps its proportions;
 * the sides stretch to the container height. `base` closes the bottom.
 */
export function RoyalArch({
  variant = "ogee",
  className = "",
  base = false,
  animate = true,
  crownHeight,
}: {
  variant?: ArchVariant;
  className?: string;
  base?: boolean;
  animate?: boolean;
  /** Fix the crown height (e.g. "5rem") for wide panels — a flatter palace arch. */
  crownHeight?: string;
}) {
  const c = CROWNS[variant];
  const line = crownHeight ? fade : draw;
  const inset = "2%"; // inner line offset (8 / 400)
  return (
    <m.div
      aria-hidden
      className={`pointer-events-none flex flex-col ${className}`}
      initial={animate ? "hidden" : "show"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
    >
      <svg
        viewBox={c.vb}
        className="block w-full shrink-0 overflow-visible"
        style={crownHeight ? { height: crownHeight } : undefined}
        fill="none"
        preserveAspectRatio={crownHeight ? "none" : "xMidYMax meet"}
      >
        <m.path d={c.outer} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" variants={line} />
        <m.path d={c.inner} stroke="currentColor" strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke" variants={line} />
        {c.finial && (
          <m.g variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 1.4, duration: 1 } } }}>
            <path d="M200 1 C204 6 204 11 200 15 C196 11 196 6 200 1Z" fill="currentColor" />
            <circle cx="200" cy="-4" r="1.6" fill="currentColor" />
          </m.g>
        )}
      </svg>
      <m.div
        className="relative -mt-px flex-1"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1.6, delay: 0.3 } } }}
      >
        <span className="absolute inset-y-0 left-0 w-px bg-current" />
        <span className="absolute inset-y-0 right-0 w-px bg-current" />
        <span className="absolute inset-y-0 w-px bg-current opacity-55" style={{ left: inset }} />
        <span className="absolute inset-y-0 w-px bg-current opacity-55" style={{ right: inset }} />
        {base && (
          <>
            <span className="absolute inset-x-0 bottom-0 h-px bg-current" />
            <span className="absolute h-px bg-current opacity-55" style={{ left: inset, right: inset, bottom: "0.5rem" }} />
          </>
        )}
      </m.div>
    </m.div>
  );
}

/** Gold lines drawing outward from a small monogram — the section seam. */
export function MonogramDivider({ className = "" }: { className?: string }) {
  return (
    <m.div
      aria-hidden
      className={`flex items-center justify-center gap-3 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
    >
      <m.span
        className="h-px w-16 origin-right bg-gradient-to-l from-current to-transparent sm:w-28"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] } } }}
      />
      <m.span
        className="block h-11 w-11 shrink-0 sm:h-12 sm:w-12"
        variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } } }}
      >
        <RSMonogram className="h-full w-full" />
      </m.span>
      <m.span
        className="h-px w-16 origin-left bg-gradient-to-r from-current to-transparent sm:w-28"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] } } }}
      />
    </m.div>
  );
}

/** Madhubani-inspired border: double line with fine hatching, a lotus dot every so often. */
export function MadhubaniBand({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`madhubani-band ${className}`} />;
}

/** Small motif per ceremony: Chheka (marigold), Matkor (kalash with leaves), Vivah (jaimala). */
export function EventMotif({ kind, className = "" }: { kind: "chheka" | "matkor" | "vivah"; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        {kind === "chheka" && (
          <>
            {Array.from({ length: 10 }, (_, i) => (
              <path key={i} d="M32 12 C36 18 36 24 32 28 C28 24 28 18 32 12Z" transform={`rotate(${i * 36} 32 32)`} />
            ))}
            <circle cx="32" cy="32" r="4.5" />
            <circle cx="32" cy="32" r="1.4" fill="currentColor" />
          </>
        )}
        {kind === "matkor" && (
          <>
            {/* kalash with mango leaves — honouring Mother Earth */}
            <path d="M21 34 C21 46 26 54 32 54 C38 54 43 46 43 34 Z" />
            <path d="M19 34 H45 M24 30 H40 M26 26 H38" />
            <path d="M32 26 V19" />
            <path d="M32 21 C27 15 21 15 17 18 C22 21 27 22 32 21Z" />
            <path d="M32 21 C37 15 43 15 47 18 C42 21 37 22 32 21Z" />
            <path d="M32 19 C30 13 32 9 32 7 C32 9 34 13 32 19Z" />
            <path d="M26 42 C29 45 35 45 38 42" />
            <circle cx="32" cy="47" r="1.3" fill="currentColor" />
          </>
        )}
        {kind === "vivah" && (
          <>
            {/* a jaimala loop */}
            <path d="M14 14 C14 44 24 54 32 54 C40 54 50 44 50 14" strokeDasharray="0.1 4.2" strokeWidth="3.2" />
            <path d="M14 14 C14 44 24 54 32 54 C40 54 50 44 50 14" strokeOpacity="0.5" />
            <circle cx="32" cy="54" r="3" />
            <path d="M32 57 V62 M29 61 L32 57 L35 61" />
            <path d="M10 12 Q14 8 18 12 M46 12 Q50 8 54 12" />
          </>
        )}
      </g>
    </svg>
  );
}

/**
 * Gathbandhan — the wedding knot: two threads meet and tie in a loop.
 * Draws itself when it scrolls into view.
 */
export function KnotDivider({ className = "", delay = 0.2 }: { className?: string; delay?: number }) {
  const d = (x: number) => ({
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { duration: 1.4, delay: delay + x, ease: [0.65, 0, 0.35, 1] as const } },
  });
  return (
    <m.svg
      viewBox="0 0 240 40"
      className={className}
      fill="none"
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
    >
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <m.path variants={d(0)} d="M4 20 H96 C106 20 110 12 118 12 C128 12 130 26 120 28 C112 30 108 22 114 16" />
        <m.path variants={d(0)} d="M236 20 H144 C134 20 130 28 122 28 C112 28 110 14 120 12 C128 10 132 18 126 24" />
        <m.circle variants={d(0.9)} cx="120" cy="20" r="2" fill="currentColor" />
        <m.path variants={d(1)} d="M60 20 l-4 -3 M60 20 l-4 3 M180 20 l4 -3 M180 20 l4 3" strokeOpacity="0.7" />
      </g>
    </m.svg>
  );
}

/**
 * A long, slow gold thread across a section (behind content). The SVG
 * stretches with its box, so it is revealed with a moving clip rather than
 * stroke-dash drawing (which mis-measures under non-uniform scaling).
 */
export function GoldThread({ className = "", d, dir = "x" }: { className?: string; d: string; dir?: "x" | "y" }) {
  const hidden = dir === "x" ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)";
  return (
    <m.svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none ${className}`}
      fill="none"
      aria-hidden
      initial={{ clipPath: hidden }}
      whileInView={{ clipPath: "inset(0 0% 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 3.2, ease: [0.45, 0, 0.25, 1] }}
    >
      <path d={d} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </m.svg>
  );
}

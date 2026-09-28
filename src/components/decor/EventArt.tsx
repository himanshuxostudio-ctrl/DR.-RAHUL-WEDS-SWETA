"use client";

import { m } from "framer-motion";

/**
 * Line artwork for each celebration. Drawn stroke-by-stroke when in view.
 */
const draw = (delay = 0) => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 2.4, delay, ease: [0.65, 0, 0.35, 1] as const } },
});

const svgProps = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, margin: "-15% 0px" },
  fill: "none",
  "aria-hidden": true,
} as const;

/** Chheka — a delicate floral garland (toran) with hanging buds. */
export function ChhekaArt({ className = "" }: { className?: string }) {
  const buds = [40, 80, 120, 160, 200, 240, 280];
  return (
    <m.svg viewBox="0 0 320 220" className={className} {...svgProps}>
      <g stroke="var(--wine)" strokeWidth="1" strokeLinecap="round">
        <m.path variants={draw()} d="M10 30 C80 80 240 80 310 30" />
        <m.path variants={draw(0.2)} d="M10 30 C80 64 240 64 310 30" opacity="0.5" />
        {buds.map((x, i) => {
          const y = 30 + 50 * Math.sin((Math.PI * x) / 320) * 0.95;
          const len = 40 + (i % 2) * 26 + (i === 3 ? 30 : 0);
          return (
            <g key={x}>
              <m.path variants={draw(0.5 + i * 0.08)} d={`M${x} ${y} V${y + len}`} opacity="0.6" />
              <m.path
                variants={draw(0.8 + i * 0.08)}
                d={`M${x} ${y + len} c6 6 6 14 0 20 c-6 -6 -6 -14 0 -20Z`}
                stroke="var(--gold-deep)"
              />
              <circle cx={x} cy={y + len / 2} r="1.8" fill="var(--gold-deep)" />
            </g>
          );
        })}
      </g>
      <g stroke="var(--gold-deep)" strokeWidth="1">
        <m.path variants={draw(1.2)} d="M160 150 c14 18 14 36 0 54 c-14 -18 -14 -36 0 -54Z" />
        <m.path variants={draw(1.3)} d="M160 204 c-18 -6 -30 -20 -32 -38 c16 4 28 18 32 38Z" />
        <m.path variants={draw(1.3)} d="M160 204 c18 -6 30 -20 32 -38 c-16 4 -28 18 -32 38Z" />
      </g>
    </m.svg>
  );
}

/** Matkor — the earthen kalash with mango leaves and coconut. */
export function MatkorArt({ className = "" }: { className?: string }) {
  return (
    <m.svg viewBox="0 0 240 280" className={className} {...svgProps}>
      <g stroke="var(--earth)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        {/* pot */}
        <m.path variants={draw()} d="M86 118 C40 140 36 220 74 250 C96 268 144 268 166 250 C204 220 200 140 154 118 Z" />
        <m.path variants={draw(0.3)} d="M80 112 H160 M84 104 H156" />
        <m.path variants={draw(0.5)} d="M58 170 C90 184 150 184 182 170" opacity="0.7" />
        <m.path variants={draw(0.6)} d="M54 196 C90 212 150 212 186 196" opacity="0.7" />
        {/* dotted band */}
        {[70, 90, 110, 130, 150, 170].map((x, i) => (
          <circle key={x} cx={x} cy={183 + (i === 0 || i === 5 ? -3 : 1)} r="1.6" fill="var(--gold-deep)" stroke="none" />
        ))}
        {/* coconut */}
        <m.path variants={draw(0.8)} d="M100 104 C96 70 144 70 140 104" />
        <m.path variants={draw(1)} d="M120 70 V58 M120 58 c-4 -6 -2 -12 2 -14" />
        {/* mango leaves */}
        {[
          "M100 104 C80 96 62 100 48 114 C66 118 84 114 100 104Z",
          "M140 104 C160 96 178 100 192 114 C174 118 156 114 140 104Z",
          "M104 100 C92 84 76 78 58 80 C68 94 86 100 104 100Z",
          "M136 100 C148 84 164 78 182 80 C172 94 154 100 136 100Z",
        ].map((d, i) => (
          <m.path key={i} variants={draw(1 + i * 0.12)} d={d} stroke="var(--gold-deep)" />
        ))}
      </g>
      {/* earth line */}
      <m.path variants={draw(0.2)} d="M20 262 H220" stroke="var(--earth)" strokeWidth="0.8" strokeDasharray="1 5" strokeLinecap="round" />
    </m.svg>
  );
}

/**
 * Vivah — the crown of a palace arch (dome, cusped arch, lamp, jaali dots),
 * drawn at its true proportions. The arch's pillars continue below as plain
 * borders on the content box (see EventSection), so no line crosses text.
 * Pillar x-positions: outer 30/370, inner 52/348 of the 400-wide viewBox.
 */
export function PalaceArchCrown({ className = "" }: { className?: string }) {
  return (
    <m.svg viewBox="0 0 400 250" className={className} {...svgProps}>
      <g stroke="var(--gold)" strokeWidth="1" strokeLinecap="round">
        <m.path variants={draw()} d="M30 250 V200 C30 130 110 96 160 82 C182 76 194 66 200 52 C206 66 218 76 240 82 C290 96 370 130 370 200 V250" />
        <m.path variants={draw(0.2)} d="M52 250 V210 C52 150 122 118 166 106 C186 100 196 92 200 80 C204 92 214 100 234 106 C278 118 348 150 348 210 V250" opacity="0.55" />
        {/* cusps */}
        <m.path
          variants={draw(0.5)}
          d="M52 250 c10 -14 26 -14 30 -30 c6 -18 22 -28 40 -30 c8 -16 26 -22 40 -18 c10 -12 28 -16 38 -10 c10 -6 28 -2 38 10 c14 -4 32 2 40 18 c18 2 34 12 40 30 c4 16 20 16 30 30"
          opacity="0.8"
        />
        {/* crown dome */}
        <m.path variants={draw(0.7)} d="M170 50 C170 22 230 22 230 50 M200 22 V6 M196 12 H204" />
        <m.path variants={draw(0.8)} d="M160 52 H240" />
        {/* side minaret tops (larger screens) */}
        <g className="hidden sm:inline">
          <m.path variants={draw(0.9)} d="M6 250 V170 M24 250 V170 M4 170 H26 M6 170 C6 140 24 140 24 170 M15 140 V128" />
          <m.path variants={draw(0.9)} d="M376 250 V170 M394 250 V170 M374 170 H396 M376 170 C376 140 394 140 394 170 M385 140 V128" />
        </g>
        {/* hanging lamp at centre */}
        <m.path variants={draw(1.3)} d="M200 104 V128 M191 128 H209 M193 128 C193 142 207 142 207 128 M200 140 V146" opacity="0.8" />
      </g>
      {/* jaali dots along the arch */}
      {Array.from({ length: 13 }, (_, i) => {
        const angle = Math.PI * (1 - i / 12);
        return <circle key={i} cx={200 + 150 * Math.cos(angle)} cy={210 - 110 * Math.sin(angle)} r="1.6" fill="var(--gold)" opacity="0.7" />;
      })}
    </m.svg>
  );
}

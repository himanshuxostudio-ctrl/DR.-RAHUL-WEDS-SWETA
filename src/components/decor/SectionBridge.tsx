"use client";

import { m } from "framer-motion";

/**
 * A quiet seam between two sections, placed as the first child of a
 * `relative` section:
 *  - "scallop" (default): the section above ends in a soft scalloped edge
 *    (the same motif used above Family Blessings) — crisp, never muddy
 *    between maroon and ivory.
 *  - "fade": the colour above dissolves into a photograph.
 * Either way a thin gold line (the one introduced in the opening) can draw
 * down to a small diamond.
 */
export default function SectionBridge({
  from,
  variant = "scallop",
  line = true,
}: {
  from: string;
  variant?: "scallop" | "fade";
  line?: boolean;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1]">
      {variant === "fade" ? (
        <div className="h-24 sm:h-32" style={{ background: `linear-gradient(to bottom, ${from}, transparent)` }} />
      ) : (
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-7 w-full sm:h-10">
          <path
            d="M0 0 H1440 V16 C1320 16 1300 52 1200 52 C1100 52 1080 16 960 16 C840 16 820 52 720 52 C620 52 600 16 480 16 C360 16 340 52 240 52 C140 52 120 16 0 16 Z"
            fill={from}
          />
        </svg>
      )}
      {line && (
        <m.div
          className={`absolute left-1/2 flex -translate-x-1/2 flex-col items-center ${variant === "fade" ? "top-0" : "top-6 sm:top-9"}`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        >
          <m.span
            className="block h-10 w-px origin-top bg-gradient-to-b from-gold/20 via-gold to-gold sm:h-14"
            variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1.4, ease: [0.65, 0, 0.35, 1] } } }}
          />
          <m.span
            className="mt-1 block h-1.5 w-1.5 rotate-45 border border-gold"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 1.1, duration: 0.6 } } }}
          />
        </m.div>
      )}
    </div>
  );
}

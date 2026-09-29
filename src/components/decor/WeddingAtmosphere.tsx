/**
 * WeddingAtmosphere — the page's single decorative layer.
 *
 * One component, one preset per section. Each preset places a handful of
 * floral motifs at three depths:
 *   bg  — oversized, very faint, softly blurred, with a gentle CSS
 *         scroll-driven parallax (no JavaScript)
 *   mid — the primary atmosphere: garlands, hanging strings, clusters
 *   fg  — a few slowly drifting petals
 * Compositions are deliberately asymmetric and vary section to section, with
 * motifs often cropped by the section edge. Everything is absolutely
 * positioned, behind content, pointer-events: none — no effect on layout.
 * Mobile placements are reduced and pushed towards the edges.
 */
import type { CSSProperties, ReactNode } from "react";
import { BotanicalLine, FloralCluster, GarlandArc, HangingString, JaimalaRing } from "./florals";

type Tone = "dark" | "light";
type Depth = "bg" | "mid";
type Motion = "sway" | "float" | "breathe" | "none";

interface Placement {
  /** Positioning / size / opacity / rotation utilities (outer box). */
  at: string;
  depth: Depth;
  motion?: Motion;
  /** Stagger for the ambient motion, in seconds (negative = mid-cycle). */
  delay?: number;
  art: ReactNode;
}

interface Petal {
  left: string;
  size: number;
  dur: number;
  delay: number;
  colour: string;
  /** Hide on phones to keep density low. */
  desktopOnly?: boolean;
}

interface Preset {
  tone: Tone;
  items: Placement[];
  petals: Petal[];
}

const DARK: CSSProperties = {
  ["--fl-marigold" as string]: "#cf8f36",
  ["--fl-marigold-2" as string]: "#b77a2c",
  ["--fl-marigold-core" as string]: "#8a4f1c",
  ["--fl-jasmine" as string]: "#f3e8d6",
  ["--fl-jasmine-line" as string]: "rgba(201,164,92,0.55)",
  ["--fl-jasmine-core" as string]: "#d9b25e",
  ["--fl-rose" as string]: "#a45862",
  ["--fl-rose-line" as string]: "#743840",
  ["--fl-leaf" as string]: "#6d7a4c",
  ["--fl-leaf-line" as string]: "#56623b",
  ["--fl-thread" as string]: "#c9a45c",
  ["--fl-gold" as string]: "#c9a45c",
};

const LIGHT: CSSProperties = {
  ["--fl-marigold" as string]: "#d8983f",
  ["--fl-marigold-2" as string]: "#c6852f",
  ["--fl-marigold-core" as string]: "#99592a",
  ["--fl-jasmine" as string]: "#fffaf1",
  ["--fl-jasmine-line" as string]: "rgba(154,118,57,0.6)",
  ["--fl-jasmine-core" as string]: "#d6ad55",
  ["--fl-rose" as string]: "#c98a86",
  ["--fl-rose-line" as string]: "#9d5d5c",
  ["--fl-leaf" as string]: "#8a9868",
  ["--fl-leaf-line" as string]: "#6b7850",
  ["--fl-thread" as string]: "#b8924e",
  ["--fl-gold" as string]: "#9a7639",
};

const MARIGOLD = "#e0a04a";
const IVORY = "#f6ecdc";
const BLUSH = "#d9a99a";

export const PRESETS = {
  /** Opening: the fullest composition — garland swags, a faint jaimala behind the art. */
  hero: {
    tone: "dark",
    items: [
      { at: "-left-[5%] -top-3 w-[62%] opacity-50 sm:w-[46%]", depth: "mid", motion: "sway", art: <GarlandArc sag={50} count={13} size={21} /> },
      { at: "-right-[7%] -top-4 w-[58%] opacity-40 sm:w-[44%]", depth: "mid", motion: "sway", delay: -4, art: <GarlandArc sag={38} count={11} size={19} /> },
      { at: "-right-[20%] -bottom-[16%] w-[78%] opacity-[0.09] sm:w-[44%]", depth: "bg", art: <JaimalaRing count={32} /> },
      { at: "-left-10 -bottom-8 w-44 opacity-45 rotate-[6deg] sm:w-64", depth: "mid", motion: "float", art: <FloralCluster /> },
      { at: "left-[3%] top-0 hidden h-[40%] opacity-45 lg:block", depth: "mid", motion: "sway", delay: -2, art: <HangingString length={11} className="h-full w-auto" /> },
      { at: "right-[5%] top-[20%] hidden w-[20%] opacity-[0.12] md:block", depth: "bg", art: <BotanicalLine /> },
    ],
    petals: [
      { left: "7%", size: 12, dur: 27, delay: -3, colour: MARIGOLD },
      { left: "31%", size: 9, dur: 32, delay: -17, colour: IVORY, desktopOnly: true },
      { left: "56%", size: 10, dur: 29, delay: -9, colour: BLUSH },
      { left: "78%", size: 11, dur: 34, delay: -22, colour: MARIGOLD },
      { left: "93%", size: 8, dur: 30, delay: -13, colour: IVORY, desktopOnly: true },
    ],
  },

  /** Two Souls: the hero's garland drifts in below the seam; faint lotus vine on the right. */
  story: {
    tone: "light",
    items: [
      { at: "-left-[12%] top-5 w-[52%] opacity-40 sm:w-[30%] sm:top-8", depth: "mid", motion: "sway", art: <GarlandArc sag={42} count={11} size={19} tassel={false} /> },
      { at: "-right-[16%] top-[4%] w-[64%] opacity-[0.14] sm:w-[34%]", depth: "bg", art: <BotanicalLine /> },
      { at: "-left-6 top-[46%] hidden w-40 opacity-30 -rotate-[14deg] lg:block", depth: "mid", motion: "float", delay: -5, art: <FloralCluster variant={1} /> },
    ],
    petals: [
      { left: "16%", size: 10, dur: 33, delay: -8, colour: MARIGOLD },
      { left: "84%", size: 9, dur: 36, delay: -20, colour: BLUSH, desktopOnly: true },
    ],
  },

  /** Families: a faint jaimala ring behind the names, a cluster entering bottom-right. */
  family: {
    tone: "light",
    items: [
      { at: "left-1/2 top-1/2 w-[110%] -translate-x-1/2 -translate-y-1/2 opacity-[0.08] sm:w-[62%] lg:w-[44%]", depth: "bg", art: <JaimalaRing count={34} size={13} /> },
      { at: "-right-10 -bottom-12 w-32 opacity-50 -rotate-[8deg] sm:-bottom-6 sm:w-56", depth: "mid", motion: "float", art: <FloralCluster /> },
      { at: "left-[4%] top-[8%] hidden w-28 opacity-25 sm:block", depth: "bg", art: <BotanicalLine /> },
    ],
    petals: [{ left: "70%", size: 9, dur: 31, delay: -11, colour: MARIGOLD }],
  },

  /** Celebrations: hanging toran strings from the top edge, a jaimala behind the cards. */
  celebrations: {
    tone: "dark",
    items: [
      { at: "left-[3%] top-0 h-32 opacity-55 sm:left-[5%] sm:h-36 xl:h-60", depth: "mid", motion: "sway", art: <HangingString length={9} className="h-full w-auto" /> },
      { at: "left-[11%] top-0 hidden h-28 opacity-40 sm:block xl:h-44", depth: "mid", motion: "sway", delay: -3, art: <HangingString length={6} size={12} className="h-full w-auto" /> },
      { at: "right-[4%] top-0 h-24 opacity-50 sm:right-[8%] sm:h-32 xl:h-52", depth: "mid", motion: "sway", delay: -6, art: <HangingString length={7} className="h-full w-auto" /> },
      { at: "-right-[26%] top-[10%] w-[76%] opacity-[0.07] sm:w-[40%]", depth: "bg", art: <JaimalaRing count={30} /> },
    ],
    petals: [
      { left: "22%", size: 10, dur: 30, delay: -6, colour: MARIGOLD },
      { left: "64%", size: 9, dur: 35, delay: -19, colour: IVORY },
      { left: "88%", size: 11, dur: 28, delay: -12, colour: BLUSH, desktopOnly: true },
    ],
  },

  /** The Wedding: the ceremonial centrepiece — a jaimala arch crowning “Vivah”. */
  wedding: {
    tone: "dark",
    items: [
      { at: "left-1/2 -top-10 w-[96%] max-w-[480px] -translate-x-1/2 opacity-40 sm:-top-14", depth: "mid", motion: "breathe", art: <JaimalaRing count={24} size={15} arc={0.5} /> },
      { at: "-left-[10%] bottom-[6%] w-[50%] opacity-[0.11] sm:w-[26%]", depth: "bg", art: <BotanicalLine /> },
      { at: "-right-8 -bottom-4 w-36 opacity-40 rotate-[10deg] sm:w-52", depth: "mid", motion: "float", delay: -7, art: <FloralCluster variant={1} /> },
    ],
    petals: [{ left: "12%", size: 10, dur: 32, delay: -15, colour: IVORY }],
  },

  /** Countdown: quieter — one faint ring, a garland fragment from the top right. */
  countdown: {
    tone: "dark",
    items: [
      { at: "left-1/2 -top-[10%] w-[120%] -translate-x-1/2 opacity-[0.06] sm:w-[560px]", depth: "bg", art: <JaimalaRing count={36} size={12} /> },
      { at: "-right-[16%] top-2 w-[58%] opacity-35 rotate-[3deg] sm:w-[30%]", depth: "mid", motion: "sway", art: <GarlandArc sag={32} count={10} size={18} /> },
    ],
    petals: [{ left: "34%", size: 9, dur: 31, delay: -4, colour: MARIGOLD }],
  },

  /** Closing: refined and calm — a single string, a small cluster, gold line art. */
  closing: {
    tone: "dark",
    items: [
      { at: "right-1 top-0 h-32 opacity-40 sm:right-[10%] sm:h-44 xl:h-56", depth: "mid", motion: "sway", delay: -2, art: <HangingString length={8} size={12} className="h-full w-auto" /> },
      { at: "-left-6 -bottom-6 w-32 opacity-35 rotate-[4deg] sm:w-48", depth: "mid", motion: "float", art: <FloralCluster /> },
      { at: "-right-[10%] top-[34%] hidden w-[24%] opacity-[0.1] md:block", depth: "bg", art: <BotanicalLine /> },
    ],
    petals: [
      { left: "18%", size: 10, dur: 34, delay: -10, colour: IVORY },
      { left: "72%", size: 9, dur: 30, delay: -21, colour: MARIGOLD, desktopOnly: true },
    ],
  },
} satisfies Record<string, Preset>;

export type AtmospherePreset = keyof typeof PRESETS;

const MOTION: Record<Motion, string> = {
  sway: "atm-sway",
  float: "atm-float",
  breathe: "atm-breathe",
  none: "",
};

/**
 * `bleed` is for blocks inside a section's max-width column: the layer spans
 * the full viewport width (clipped by the section) and sits at -z-10, so the
 * block needs `isolate` to keep it above the section background.
 */
export default function WeddingAtmosphere({ preset, bleed = false, className = "" }: { preset: AtmospherePreset; bleed?: boolean; className?: string }) {
  const p: Preset = PRESETS[preset];
  const box = bleed ? "-z-10 -top-8 -bottom-8 left-1/2 w-screen -translate-x-1/2" : "inset-0";
  return (
    <div aria-hidden className={`pointer-events-none absolute overflow-hidden ${box} ${className}`} style={p.tone === "dark" ? DARK : LIGHT}>
      {p.items.map((it, i) => (
        <div key={i} className={`absolute ${it.at}`}>
          {/* inner wrapper carries the scroll-driven parallax (bg only) */}
          <div className={`h-full ${it.depth === "bg" ? "atm-bg atm-parallax" : ""}`}>
            <div className={`h-full ${MOTION[it.motion ?? "none"]}`} style={it.delay ? { animationDelay: `${it.delay}s` } : undefined}>
              {it.art}
            </div>
          </div>
        </div>
      ))}
      {p.petals.map((pt, i) => (
        <span
          key={`p${i}`}
          className={`petal absolute -top-6 ${pt.desktopOnly ? "hidden sm:block" : "block"}`}
          style={{ left: pt.left, width: pt.size, height: pt.size * 1.35, background: pt.colour, animationDuration: `${pt.dur}s`, animationDelay: `${pt.delay}s` }}
        />
      ))}
    </div>
  );
}

/**
 * Two small decorative wedding moments — a jaimala exchange and a shehnai
 * duet. Transparent cut-outs (scripts/cutout-decor.py → npm run images) of
 * generic wedding characters, not the couple: the Rahul & Sweta
 * illustrations remain the primary artwork.
 */
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { getImage } from "@/data/weddingData";
import { F } from "./florals";

const ART = {
  jaimala: "decor/jaimala-couple",
  shehnai: "decor/shehnai-couple",
} as const;

const FLORALS = {
  "--fl-marigold": "#cf8f36",
  "--fl-marigold-2": "#b77a2c",
  "--fl-marigold-core": "#8a4f1c",
  "--fl-jasmine": "#f3e8d6",
  "--fl-jasmine-line": "rgba(201,164,92,0.55)",
  "--fl-jasmine-core": "#d9b25e",
  "--fl-rose": "#a45862",
  "--fl-rose-line": "#743840",
  "--fl-leaf": "#6d7a4c",
  "--fl-leaf-line": "#56623b",
} as CSSProperties;

/** A low bed of marigolds, jasmine and leaves for the couple to stand on. */
function FloralBed() {
  const kinds = ["leaf", "marigold", "jasmine", "marigold", "leaf", "rose", "marigold", "jasmine", "marigold", "leaf"] as const;
  return (
    <svg viewBox="0 0 200 40" className="block h-auto w-full" aria-hidden>
      {kinds.map((k, i) => {
        const x = 12 + i * 19.5;
        const y = 24 - Math.sin((i / (kinds.length - 1)) * Math.PI) * 7 + (i % 2) * 3;
        const s = k === "leaf" ? 20 : k === "jasmine" ? 13 : 17;
        return <F key={i} kind={k} x={x} y={y} s={s} r={i * 37 + (k === "leaf" ? (i < 5 ? 200 : -20) : 0)} o={k === "leaf" ? 0.85 : 1} />;
      })}
    </svg>
  );
}

/**
 * A vignette as it appears on the page: fades up gently when it scrolls into
 * view, then floats almost imperceptibly (CSS). Decorative only.
 */
export function Vignette({ kind, className = "" }: { kind: keyof typeof ART; className?: string }) {
  const reduce = useReducedMotion();
  const img = getImage(ART[kind]);
  return (
    <m.div
      aria-hidden
      className={`pointer-events-none ${className.includes("absolute") ? "" : "relative"} ${className}`}
      initial={{ opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* a soft pool of warm light behind the couple */}
      <div aria-hidden className="absolute -inset-x-[18%] bottom-[-6%] top-[12%] rounded-full bg-[radial-gradient(closest-side,rgba(236,204,140,0.17),transparent)]" />
      {/* contact shadow + the floral bed they stand on */}
      <div aria-hidden className="absolute bottom-[0.5%] left-1/2 h-[5%] w-[72%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-md" />
      <div className="atm-float relative">
        <Image
          src={img.src}
          width={img.width}
          height={img.height}
          alt=""
          sizes="(min-width: 1024px) 180px, 40vw"
          quality={85}
          className="block h-auto w-full drop-shadow-[0_10px_14px_rgba(20,4,8,0.35)]"
        />
      </div>
      <div aria-hidden className="absolute -bottom-[5%] left-1/2 w-[92%] -translate-x-1/2 opacity-80" style={FLORALS}>
        <FloralBed />
      </div>
    </m.div>
  );
}

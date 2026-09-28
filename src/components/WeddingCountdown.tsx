"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { weddingData } from "@/data/weddingData";
import GoldDust from "./decor/GoldDust";
import { Mandala, OrnamentDivider } from "./decor/Ornaments";
import { Reveal, RevealWords } from "./ui/Reveal";

const { countdown } = weddingData;
const target = new Date(countdown.target).getTime();

function remaining(now: number) {
  const diff = Math.max(0, target - now);
  return {
    done: diff === 0,
    parts: [
      { label: "Days", value: Math.floor(diff / 86_400_000) },
      { label: "Hours", value: Math.floor(diff / 3_600_000) % 24 },
      { label: "Minutes", value: Math.floor(diff / 60_000) % 60 },
      { label: "Seconds", value: Math.floor(diff / 1000) % 60 },
    ],
  };
}

/** A digit that rolls softly when it changes. */
function Rolling({ value, pad }: { value: number | null; pad: number }) {
  const text = value === null ? "–".repeat(pad) : String(value).padStart(pad, "0");
  return (
    <span className="relative inline-flex overflow-hidden" aria-hidden>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: "60%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-60%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="gold-text inline-block tabular-nums"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function WeddingCountdown() {
  // Rendered empty on the server, filled after mount → no hydration mismatch.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const r = now === null ? null : remaining(now);
  const summary = r ? r.parts.map((p) => `${p.value} ${p.label.toLowerCase()}`).join(", ") : "";

  return (
    <section id="countdown" aria-labelledby="countdown-heading" className="surface-maroon grain relative overflow-hidden py-[var(--space-section)] text-center">
      <GoldDust density={26} />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]">
        <Mandala className="animate-slow-spin h-full w-full" />
      </div>

      <div className="relative px-[var(--gutter)]">
        <Reveal>
          <p className="eyebrow text-gold">{countdown.caption}</p>
        </Reveal>
        <h2 id="countdown-heading" className="mx-auto mt-5 max-w-3xl font-serif text-[2.7rem] leading-[1.02] text-ivory sm:text-7xl">
          <RevealWords text={r?.done ? countdown.arrived : countdown.heading} />
        </h2>
        <Reveal delay={0.2}>
          <OrnamentDivider className="mx-auto mt-8 h-8 w-60" />
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-y-10 sm:grid-cols-4" role="timer" aria-live="off">
            {(r?.parts ?? remaining(target).parts.map((p) => ({ ...p, value: null as number | null }))).map((p, i) => (
              <div key={p.label} className={`relative flex flex-col items-center border-gold/25 ${i % 2 === 1 ? "border-l" : ""} ${i > 0 ? "sm:border-l" : ""}`}>
                <span className="font-serif text-[4.2rem] leading-none sm:text-7xl">
                  <Rolling value={p.value} pad={2} />
                </span>
                <span className="eyebrow mt-3 text-[0.62rem] text-champagne/70">{p.label}</span>
              </div>
            ))}
          </div>
          <p className="sr-only">{summary ? `${summary} until the wedding.` : ""}</p>
        </Reveal>
      </div>
    </section>
  );
}

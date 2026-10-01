"use client";

import { m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { weddingData } from "@/data/weddingData";
import { useT, useWedding } from "@/i18n/LanguageProvider"; // HINDI EXPERIMENT
import { CornerFlourish, LotusMark, OrnamentDivider } from "./decor/Ornaments";
import WeddingAtmosphere from "./decor/WeddingAtmosphere";
import GoldDust from "./decor/GoldDust";
import Illustration from "./ui/Illustration";

const target = new Date(weddingData.countdown.target).getTime();

const ease = [0.22, 1, 0.36, 1] as const;
const film = [0.65, 0, 0.35, 1] as const;
const CORNERS = ["left-1.5 top-1.5", "right-1.5 top-1.5 rotate-90", "right-1.5 bottom-1.5 rotate-180", "left-1.5 bottom-1.5 -rotate-90"];

/** Ticks once a second in isolation (only this row re-renders). */
function Countdown() {
  const { countdown } = useWedding();
  const t = useT();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = now === null ? null : Math.max(0, target - now);
  if (diff === 0) return <p className="eyebrow text-gold">{countdown.arrived}</p>;
  const parts: [number | null, string][] = [
    [diff === null ? null : Math.floor(diff / 86_400_000), t.days],
    [diff === null ? null : Math.floor(diff / 3_600_000) % 24, t.hours],
    [diff === null ? null : Math.floor(diff / 60_000) % 60, t.minutes],
    [diff === null ? null : Math.floor(diff / 1000) % 60, t.seconds],
  ];
  return (
    <div role="timer" aria-label={t.timerLabel} className="mx-auto grid max-w-md grid-cols-4">
      {parts.map(([n, label], i) => (
        <div key={label} className={`flex flex-col items-center ${i > 0 ? "border-l border-gold/25" : ""}`}>
          <span className="gold-text font-serif text-[2.6rem] leading-none tabular-nums sm:text-5xl">
            {n === null ? "--" : String(n).padStart(2, "0")}
          </span>
          <span className="eyebrow mt-2 text-[0.55rem] text-champagne/70">{label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * The finale: the countdown, then the closing — gold frame drawing in, the
 * couple, names, date and a short message. It is the true end of the page.
 */
export default function FinalSection() {
  const { final, couple, countdown, images } = useWedding();
  const reduce = useReducedMotion();
  const at = (delay: number, y = 14) => ({
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: { opacity: 1, y: 0, transition: { duration: 1.1, delay: reduce ? 0 : delay, ease } },
  });

  return (
    <div id="closing" className="surface-maroon relative overflow-hidden">
      <GoldDust density={16} className="opacity-50" />

      {/* The Wait Is Almost Over */}
      <m.section
        id="countdown"
        aria-labelledby="countdown-heading"
        className="relative isolate px-[var(--gutter)] pb-2 pt-12 text-center lg:pt-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      >
        <WeddingAtmosphere preset="countdown" className="-z-10" />
        <div aria-hidden className="mx-auto h-8 w-px bg-gradient-to-b from-transparent to-gold/70" />
        <m.p variants={at(0)} className="eyebrow mt-4 text-gold">
          {countdown.caption}
        </m.p>
        <m.h2 variants={at(0.08)} id="countdown-heading" className="mt-3 font-serif text-[2.3rem] leading-[1.05] text-ivory sm:text-5xl">
          {countdown.heading}
        </m.h2>
        <m.div variants={at(0.2)} className="mt-7">
          <Countdown />
        </m.div>
      </m.section>

      {/* Closing */}
      <m.section
        aria-labelledby="thanks-heading"
        className="relative flex items-center px-8 pb-12 pt-10 sm:px-14 lg:min-h-[88svh]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      >
        <WeddingAtmosphere preset="closing" />
        <div aria-hidden className="pointer-events-none absolute inset-x-3 bottom-3 top-6 sm:inset-x-6 sm:bottom-6">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" fill="none">
            <m.rect
              x="0.5" y="0.5" width="99.8%" height="99.8%" stroke="var(--gold)" strokeOpacity="0.65" strokeWidth="1"
              variants={{ hidden: { pathLength: reduce ? 1 : 0 }, show: { pathLength: 1, transition: { duration: 2.2, delay: 0.1, ease: film } } }}
            />
          </svg>
          {CORNERS.map((pos) => (
            <m.div key={pos} className={`absolute ${pos} h-10 w-10 sm:h-16 sm:w-16`} variants={at(1, 0)}>
              <CornerFlourish className="h-full w-full" />
            </m.div>
          ))}
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-7 text-center lg:grid-cols-[auto_1fr] lg:gap-16 lg:text-left">
          <div className="flex justify-center">
            <Illustration id={images.closing.id} alt={images.closing.alt} sizes="(min-width: 1024px) 400px, 56vw" maxWidth={400} maxVh={39} maxVhLg={60} delay={0.3} />
          </div>

          <div>
            <m.div variants={at(0.6)}>
              <LotusMark className="mx-auto mb-3 h-7 w-11 lg:mx-0" />
            </m.div>
            <m.p variants={at(0.7, 18)} className="serif-display text-[3rem] sm:text-6xl">
              <span className="gold-text gold-text-animate">{couple.groom}</span>
              <span className="mx-2 font-serif text-2xl italic text-champagne sm:text-3xl">&amp;</span>
              <span className="gold-text gold-text-animate">{couple.bride}</span>
            </m.p>
            <m.div variants={at(1)} className="mt-4 flex items-center justify-center gap-4 lg:justify-start">
              <span className="h-px w-10 bg-gold/70" />
              <time dateTime="2026-12-12" className="eyebrow text-[0.72rem] tracking-[0.45em] text-ivory">
                {couple.dateShort}
              </time>
              <span className="h-px w-10 bg-gold/70" />
            </m.div>
            <m.h2 variants={at(1.25)} id="thanks-heading" className="mt-6 font-serif text-3xl italic text-ivory">
              {final.heading}
            </m.h2>
            <m.p variants={at(1.4)} className="mx-auto mt-2 max-w-xs font-serif text-lg italic leading-relaxed text-champagne/85 lg:mx-0 lg:max-w-sm">
              {final.message}
            </m.p>
            <m.div variants={at(1.6)}>
              <OrnamentDivider animate={false} className="mx-auto mt-5 h-7 w-44 opacity-70 lg:mx-0" />
            </m.div>
          </div>
        </div>
      </m.section>
    </div>
  );
}

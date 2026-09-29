"use client";

import { m, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/weddingData";
import { CornerFlourish } from "./decor/Ornaments";
import GoldDust from "./decor/GoldDust";
import Illustration from "./ui/Illustration";

const ease = [0.22, 1, 0.36, 1] as const;
const { couple, invitation, images } = weddingData;

/**
 * Opening frame: names → illustration → date → blessing → scroll cue.
 * Phones: one stacked column that fits a single screen. Desktop: text left,
 * illustration right.
 */
export default function HeroSection({ revealed }: { revealed: boolean }) {
  const reduce = useReducedMotion();
  const d = (s: number) => (reduce ? 0 : s);
  const state = revealed ? "show" : "hidden";
  const rise = (delay: number) => ({
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 1.4, delay: d(delay), ease } },
  });

  return (
    <section
      id="top"
      aria-label={`${couple.groom} and ${couple.bride}`}
      className="surface-maroon relative flex min-h-[100svh] items-center overflow-hidden px-6 py-14 sm:px-10"
    >
      <GoldDust density={18} className="opacity-60" />

      {/* card border */}
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-3 z-10 border border-gold/40 sm:inset-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 2, delay: d(1) }}
      >
        <CornerFlourish className="absolute left-1.5 top-1.5 h-12 w-12 sm:h-20 sm:w-20" />
        <CornerFlourish className="absolute right-1.5 top-1.5 h-12 w-12 rotate-90 sm:h-20 sm:w-20" />
        <CornerFlourish className="absolute bottom-1.5 right-1.5 h-12 w-12 rotate-180 sm:h-20 sm:w-20" />
        <CornerFlourish className="absolute bottom-1.5 left-1.5 h-12 w-12 -rotate-90 sm:h-20 sm:w-20" />
      </m.div>

      <m.div
        className="relative z-20 mx-auto grid w-full max-w-6xl items-center gap-7 text-center lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:text-left"
        initial="hidden"
        animate={state}
      >
        <div className="flex flex-col items-center lg:items-start">
          <m.p variants={rise(0.2)} className="eyebrow mb-4 text-gold">
            The wedding of
          </m.p>
          <m.h2 variants={rise(0.4)} className="serif-display text-[3.4rem] leading-[0.9] text-ivory sm:text-7xl lg:text-[6rem]">
            <span className="block">{couple.groom}</span>
            <span className="my-1 block font-serif text-3xl italic text-gold-light lg:text-5xl">&amp;</span>
            <span className="block">{couple.bride}</span>
          </m.h2>
          <m.div variants={rise(1.6)} className="mt-5 flex items-center gap-4">
            <span className="h-px w-8 bg-gold/70" />
            <time dateTime="2026-12-12" className="eyebrow text-[0.75rem] text-champagne">
              {couple.date}
            </time>
            <span className="h-px w-8 bg-gold/70" />
          </m.div>
          {/* desktop: blessing + cue sit under the date */}
          <m.p variants={rise(2)} className="mt-6 hidden max-w-sm font-serif text-xl italic leading-relaxed text-champagne/85 lg:block">
            {invitation.blessingLine}
          </m.p>
          <ScrollCue revealed={revealed} delay={d(2.8)} className="mt-10 hidden lg:flex" />
        </div>

        <div className="flex flex-col items-center">
          <Illustration
            id={images.opening.id}
            alt={images.opening.alt}
            sizes="(min-width: 1024px) 620px, 88vw"
            maxWidth={620}
            maxVh={42}
            priority
            show={revealed}
            delay={d(0.9)}
            className="mx-auto"
          />
          {/* phones: blessing + cue under the illustration */}
          <m.p variants={rise(2)} className="mx-auto mt-6 max-w-[20rem] font-serif text-[1.05rem] italic leading-relaxed text-champagne/85 lg:hidden">
            {invitation.blessingLine}
          </m.p>
          <ScrollCue revealed={revealed} delay={d(2.8)} className="mt-5 lg:hidden" />
        </div>
      </m.div>
    </section>
  );
}

function ScrollCue({ revealed, delay, className }: { revealed: boolean; delay: number; className: string }) {
  return (
    <m.a
      href="#story"
      className={`group flex-col items-center gap-2 text-champagne/60 lg:items-start ${className} ${className.includes("hidden") ? "" : "flex"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: revealed ? 1 : 0 }}
      transition={{ duration: 1.5, delay }}
    >
      <span className="eyebrow text-[0.62rem]">Scroll to begin</span>
      <span className="relative h-7 w-px overflow-hidden bg-gold/25 lg:h-10">
        <span className="absolute inset-x-0 top-0 h-1/2 bg-gold-light [animation:scroll-cue_2.2s_ease-in-out_infinite]" />
      </span>
      <style>{`@keyframes scroll-cue{0%{transform:translateY(-100%)}100%{transform:translateY(220%)}}`}</style>
    </m.a>
  );
}

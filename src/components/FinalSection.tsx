"use client";

import { m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { weddingData } from "@/data/weddingData";
import { LotusMark } from "./decor/Ornaments";
import WeddingAtmosphere from "./decor/WeddingAtmosphere";
import GoldDust from "./decor/GoldDust";
import { MadhubaniBand, RoyalArch, RSMonogram } from "./luxe/Stationery";
import Illustration from "./ui/Illustration";

const { final, couple, countdown, images, invitation } = weddingData;
const target = new Date(countdown.target).getTime();

const ease = [0.22, 1, 0.36, 1] as const;

/** One countdown digit group; the number settles in softly whenever it changes. */
function Unit({ n, label, first }: { n: number | null; label: string; first: boolean }) {
  const text = n === null ? "--" : String(n).padStart(2, "0");
  return (
    <div className="relative flex flex-col items-center">
      {!first && <span aria-hidden className="absolute -left-px top-1 h-[70%] w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent" />}
      <span key={text} className="digit-in font-serif text-[2.9rem] leading-none text-ivory tabular-nums sm:text-6xl">
        {text}
      </span>
      <span className="eyebrow mt-2.5 text-[0.52rem] !tracking-[0.16em] text-champagne/70 sm:text-[0.56rem] sm:!tracking-[0.3em]">{label}</span>
    </div>
  );
}

/** Ticks once a second in isolation (only this row re-renders). */
function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = now === null ? null : Math.max(0, target - now);
  if (diff === 0) return <p className="eyebrow text-gold">{countdown.arrived}</p>;
  const parts: [number | null, string][] = [
    [diff === null ? null : Math.floor(diff / 86_400_000), "Days"],
    [diff === null ? null : Math.floor(diff / 3_600_000) % 24, "Hours"],
    [diff === null ? null : Math.floor(diff / 60_000) % 60, "Minutes"],
    [diff === null ? null : Math.floor(diff / 1000) % 60, "Seconds"],
  ];
  return (
    <div role="timer" aria-label="Time until the wedding" className="mx-auto grid max-w-md grid-cols-4">
      {parts.map(([n, label], i) => (
        <Unit key={label} n={n} label={label} first={i === 0} />
      ))}
    </div>
  );
}

/**
 * The finale: the countdown under a round palace arch, then the closing —
 * the back page of the invitation: crest, "With love & blessings", the names,
 * the date and शुभ विवाह, growing quieter toward the bottom.
 */
export default function FinalSection() {
  const reduce = useReducedMotion();
  const at = (delay: number, y = 14) => ({
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: { opacity: 1, y: 0, transition: { duration: 1.1, delay: reduce ? 0 : delay, ease } },
  });

  return (
    <div id="closing" className="surface-maroon relative overflow-hidden">
      <GoldDust density={16} className="opacity-50" />
      <div aria-hidden className="buti pointer-events-none absolute inset-0 opacity-[0.045] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />

      {/* The Wait Is Almost Over */}
      <m.section
        id="countdown"
        aria-labelledby="countdown-heading"
        className="relative isolate px-[var(--gutter)] pb-4 pt-12 text-center lg:pt-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      >
        <WeddingAtmosphere preset="countdown" className="-z-10" />
        <div className="relative mx-auto max-w-xl px-4 pb-8 pt-[clamp(3.5rem,11vw,5.5rem)] sm:px-10">
          <RoyalArch variant="round" crownHeight="clamp(3.5rem,11vw,5.5rem)" className="absolute inset-0 text-gold/35" />
          {/* tiny R ✦ S watermark behind the numbers */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[58%] w-44 -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.06] sm:w-56">
            <RSMonogram className="h-auto w-full" />
          </div>
          <m.h2 variants={at(0)} id="countdown-heading" className="relative font-serif text-[2.3rem] leading-[1.05] text-ivory sm:text-5xl">
            {countdown.heading}
          </m.h2>
          <m.p variants={at(0.1)} className="eyebrow relative mt-4 text-gold">
            {countdown.caption}
          </m.p>
          <m.div variants={at(0.22)} className="relative mt-8">
            <Countdown />
          </m.div>
        </div>
      </m.section>

      {/* Closing — the back of the invitation */}
      <m.section
        aria-labelledby="thanks-heading"
        className="relative flex items-center px-6 pb-12 pt-8 sm:px-14 lg:min-h-[86svh]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      >
        <WeddingAtmosphere preset="closing" />
        <div aria-hidden className="pointer-events-none absolute inset-x-3 bottom-3 top-4 sm:inset-x-6 sm:bottom-6">
          <RoyalArch variant="cusped" base crownHeight="clamp(3rem,8vw,6rem)" className="h-full w-full text-gold/45" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-7 pt-[clamp(2rem,6vw,4rem)] text-center lg:grid-cols-[auto_1fr] lg:gap-16">
          <div className="flex justify-center">
            <Illustration id={images.closing.id} alt={images.closing.alt} sizes="(min-width: 1024px) 400px, 56vw" maxWidth={400} maxVh={39} maxVhLg={60} delay={0.3} />
          </div>

          <div className="flex flex-col items-center">
            <m.div variants={at(0.5)} className="text-gold/80">
              <RSMonogram className="mx-auto h-14 w-14 sm:h-16 sm:w-16" />
            </m.div>
            <m.p variants={at(0.65)} className="eyebrow mt-4 text-[0.66rem] text-gold">
              {final.blessing}
            </m.p>
            <m.p variants={at(0.8, 18)} className="serif-display mt-4 flex flex-col items-center text-[3rem] leading-[0.95] sm:text-6xl">
              <span className="text-ivory">{couple.groom}</span>
              <span className="my-2 font-serif text-2xl italic text-gold-light sm:text-3xl">{invitation.weds}</span>
              <span className="text-ivory">{couple.bride}</span>
            </m.p>
            <m.div variants={at(1.05)} className="mt-5 flex items-center gap-4">
              <span className="h-px w-10 bg-gold/70" />
              <time dateTime="2026-12-12" className="eyebrow text-[0.74rem] tracking-[0.3em] text-ivory">
                {couple.dateDots}
              </time>
              <span className="h-px w-10 bg-gold/70" />
            </m.div>
            <m.p variants={at(1.2)} lang="hi" className="font-deva mt-4 text-xl leading-[1.6] text-gold-light/85">
              {invitation.hindiTitle}
            </m.p>
            <m.div variants={at(1.35)} className="mt-6 max-w-xs lg:max-w-sm">
              <h2 id="thanks-heading" className="font-serif text-2xl italic text-ivory/90">
                {final.heading}
              </h2>
              <p className="mt-1.5 font-serif text-lg italic leading-relaxed text-champagne/75">{final.message}</p>
            </m.div>
            <m.div variants={at(1.55)} className="mt-6 flex flex-col items-center gap-3 opacity-70">
              <LotusMark className="h-6 w-10" />
              <MadhubaniBand className="w-28 opacity-60" />
            </m.div>
          </div>
        </div>
      </m.section>
    </div>
  );
}

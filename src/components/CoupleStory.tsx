"use client";

import { m, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/weddingData";
import { LotusMark } from "./decor/Ornaments";
import SectionBridge from "./decor/SectionBridge";
import WeddingAtmosphere, { FLORAL_LIGHT } from "./decor/WeddingAtmosphere";
import { HangingString } from "./decor/florals";
import { GoldThread, KnotDivider, MadhubaniBand, RoyalArch, RSMonogram } from "./luxe/Stationery";
import Illustration from "./ui/Illustration";

const { story, families, couple, images } = weddingData;
const ease = [0.22, 1, 0.36, 1] as const;

/** Reveal the moment the block enters the viewport — no waiting, no scrubbing. */
// Fires as soon as the block's top edge is on screen — independent of block height.
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } } as const;

function useRise() {
  const reduce = useReducedMotion();
  return (delay: number) => ({
    hidden: { opacity: 0, y: reduce ? 0 : 14, scale: reduce ? 1 : 0.99 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, delay: reduce ? 0 : delay, ease } },
  });
}

function Person({ name, note }: { name: string; note?: string }) {
  return (
    <li className="font-serif text-[1.3rem] leading-snug text-wine sm:text-[1.4rem]">
      {name}
      {note && <span className="ml-2 align-middle font-sans text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">{note}</span>}
    </li>
  );
}

export default function CoupleStory() {
  const rise = useRise();

  return (
    <section id="story" aria-labelledby="story-heading" className="surface-ivory grain relative overflow-hidden px-[var(--gutter)] pb-12 pt-16 lg:pb-24 lg:pt-28">
      <SectionBridge from="var(--deep-maroon)" />
      <div aria-hidden className="buti-wine pointer-events-none absolute inset-0 opacity-[0.045] [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)]" />
      <WeddingAtmosphere preset="story" />

      {/* Two Souls, One Journey */}
      <m.div className="relative mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-16" {...inView}>
        {/* a gold thread winding from the couple to their names */}
        <GoldThread className="absolute -inset-x-4 inset-y-0 hidden h-full w-[calc(100%+2rem)] text-gold-deep/30 lg:block" d="M1 96 C14 70 6 30 22 12 C34 -2 46 30 58 38 C70 46 84 30 99 6" />
        <GoldThread dir="y" className="absolute inset-x-0 -top-4 h-[calc(100%+2rem)] w-full text-gold-deep/25 lg:hidden" d="M50 0 C20 8 18 22 50 30 C82 38 84 52 60 62 C40 70 30 86 50 100" />
        <div className="text-center lg:order-2 lg:text-left">
          <m.p variants={rise(0)} className="eyebrow text-gold-deep">
            {story.eyebrow}
          </m.p>
          <m.h2 variants={rise(0.08)} id="story-heading" className="mt-3 font-serif text-[2.8rem] leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
            {story.titleA} <span className="block italic text-wine sm:inline lg:block">{story.titleB}</span>
          </m.h2>
          <m.div variants={rise(0.18)}>
            <KnotDivider className="mx-auto mt-4 h-8 w-52 text-gold-deep/80 lg:mx-0" delay={0.3} />
          </m.div>
          {/* short introduction: the two of them, by name */}
          <m.dl variants={rise(0.3)} className="mx-auto mt-5 grid max-w-xs grid-cols-2 gap-4 lg:mx-0">
            <div>
              <dt className="eyebrow text-[0.56rem] text-gold-deep">{story.groomLabel}</dt>
              <dd className="mt-1 font-serif text-2xl text-ink">{couple.groom}</dd>
            </div>
            <div>
              <dt className="eyebrow text-[0.56rem] text-gold-deep">{story.brideLabel}</dt>
              <dd className="mt-1 font-serif text-2xl text-ink">{couple.bride}</dd>
            </div>
          </m.dl>
        </div>

        <div className="flex justify-center lg:order-1">
          <Illustration id={images.story.id} alt={images.story.alt} sizes="(min-width: 1024px) 380px, 70vw" maxWidth={400} maxVh={44} maxVhLg={62} delay={0.15} />
        </div>
      </m.div>

      {/* With the Blessings of Our Families — an arch-topped stationery card */}
      <m.div id="family" aria-labelledby="family-heading" className="relative isolate mx-auto mt-12 max-w-3xl scroll-mt-10 text-center lg:mt-20 lg:max-w-4xl" {...inView}>
        <WeddingAtmosphere preset="family" bleed />
        <div aria-hidden className="absolute inset-x-0 bottom-0 top-[clamp(4.5rem,11vw,7rem)] -z-[1] bg-[linear-gradient(180deg,rgba(255,251,243,0.7),rgba(252,245,232,0.35))]" />
        <RoyalArch variant="cusped" base crownHeight="clamp(4.5rem,11vw,7rem)" className="absolute inset-0 text-gold-deep/45" />
        {/* a pair of short marigold torans hanging inside the arch, like a doorway */}
        <div aria-hidden className="pointer-events-none absolute inset-x-[6%] top-[clamp(3.6rem,9vw,6rem)] hidden justify-between sm:flex" style={FLORAL_LIGHT}>
          <div className="atm-sway h-20 opacity-55 lg:h-24"><HangingString length={6} size={12} className="h-full w-auto" /></div>
          <div className="atm-sway h-16 opacity-50 lg:h-20" style={{ animationDelay: "-3s" }}><HangingString length={5} size={12} className="h-full w-auto" /></div>
        </div>

        <div className="relative px-5 pb-10 pt-[clamp(3.4rem,8.5vw,5.4rem)] sm:px-12 sm:pb-12">
          <m.div variants={rise(0)} className="flex justify-center">
            <LotusMark tone="wine" className="h-6 w-10" />
          </m.div>
          <m.h3 variants={rise(0.08)} id="family-heading" className="mt-3 font-serif text-[1.9rem] leading-tight text-ink sm:text-4xl">
            With the Blessings <span className="italic text-wine">of Our Families</span>
          </m.h3>
          <m.div variants={rise(0.14)}>
            <MadhubaniBand className="mx-auto mt-4 w-36 opacity-70 sm:w-44" />
          </m.div>
          <m.p variants={rise(0.18)} className="mx-auto mt-4 max-w-md text-[0.9rem] leading-relaxed text-ink-soft">
            {families.intro} {couple.groom} &amp; {couple.bride}.
          </m.p>
          <m.div variants={rise(0.26)} className="mt-8 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
            <div>
              <p className="eyebrow text-[0.58rem] text-gold-deep">{families.groom.label}</p>
              <span aria-hidden className="mx-auto mt-2 block h-px w-10 bg-gold-deep/40" />
              <ul className="mt-3 space-y-1">
                <Person name={families.groom.father} note={families.groom.fatherTitle} />
                <Person name={families.groom.mother} />
              </ul>
            </div>
            {/* central motif: the couple's monogram, between the two families */}
            <div aria-hidden className="flex items-center justify-center gap-3 text-gold-deep/70 lg:flex-col">
              <span className="h-px w-12 bg-gradient-to-l from-gold-deep/50 to-transparent lg:h-12 lg:w-px lg:bg-gradient-to-t" />
              <RSMonogram className="h-12 w-12 lg:h-14 lg:w-14" />
              <span className="h-px w-12 bg-gradient-to-r from-gold-deep/50 to-transparent lg:h-12 lg:w-px lg:bg-gradient-to-b" />
            </div>
            <div>
              <p className="eyebrow text-[0.58rem] text-gold-deep">{families.bride.label}</p>
              <span aria-hidden className="mx-auto mt-2 block h-px w-10 bg-gold-deep/40" />
              <ul className="mt-3 space-y-1">
                <Person name={families.bride.grandfather} note={families.bride.grandfatherTitle} />
                <Person name={families.bride.father} />
                <Person name={families.bride.mother} />
              </ul>
            </div>
          </m.div>
          <MadhubaniBand className="mx-auto mt-9 w-24 opacity-50" />
        </div>
      </m.div>
    </section>
  );
}

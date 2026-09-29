"use client";

import { m, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/weddingData";
import { LotusMark, OrnamentDivider } from "./decor/Ornaments";
import SectionBridge from "./decor/SectionBridge";
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

      {/* Two Souls, One Journey */}
      <m.div className="relative mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-16" {...inView}>
        <div className="text-center lg:order-2 lg:text-left">
          <m.p variants={rise(0)} className="eyebrow text-gold-deep">
            {story.eyebrow}
          </m.p>
          <m.h2 variants={rise(0.08)} id="story-heading" className="mt-3 font-serif text-[2.6rem] leading-[1.02] text-ink sm:text-6xl">
            {story.titleA} <span className="block italic text-wine sm:inline lg:block">{story.titleB}</span>
          </m.h2>
          <m.div variants={rise(0.18)}>
            <OrnamentDivider tone="wine" animate={false} className="mx-auto mt-4 h-7 w-44 opacity-60 lg:mx-0" />
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

      {/* With the Blessings of Our Families */}
      <m.div id="family" aria-labelledby="family-heading" className="relative mx-auto mt-10 max-w-3xl scroll-mt-10 text-center lg:mt-20" {...inView}>
        <m.div variants={rise(0)} className="flex items-center justify-center gap-4">
          <span className="h-px flex-1 bg-gold-deep/25" />
          <LotusMark tone="wine" className="h-6 w-10" />
          <span className="h-px flex-1 bg-gold-deep/25" />
        </m.div>
        <m.h3 variants={rise(0.08)} id="family-heading" className="mt-4 font-serif text-[1.9rem] leading-tight text-ink sm:text-4xl">
          With the Blessings <span className="italic text-wine">of Our Families</span>
        </m.h3>
        <m.p variants={rise(0.16)} className="mx-auto mt-3 max-w-md text-[0.9rem] leading-relaxed text-ink-soft">
          {families.intro} {couple.groom} &amp; {couple.bride}.
        </m.p>
        <m.div variants={rise(0.26)} className="mt-7 grid gap-7 sm:grid-cols-2 sm:gap-10">
          <div>
            <p className="eyebrow text-[0.58rem] text-gold-deep">{families.groom.label}</p>
            <ul className="mt-2 space-y-1">
              <Person name={families.groom.father} note={families.groom.fatherTitle} />
              <Person name={families.groom.mother} />
            </ul>
          </div>
          <div>
            <p className="eyebrow text-[0.58rem] text-gold-deep">{families.bride.label}</p>
            <ul className="mt-2 space-y-1">
              <Person name={families.bride.grandfather} note={families.bride.grandfatherTitle} />
              <Person name={families.bride.father} />
              <Person name={families.bride.mother} />
            </ul>
          </div>
        </m.div>
      </m.div>
    </section>
  );
}

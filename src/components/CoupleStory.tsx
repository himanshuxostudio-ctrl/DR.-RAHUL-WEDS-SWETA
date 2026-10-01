"use client";

import { m, useReducedMotion } from "framer-motion";
import { useT, useWedding } from "@/i18n/LanguageProvider"; // HINDI EXPERIMENT
import { LotusMark, OrnamentDivider } from "./decor/Ornaments";
import SectionBridge from "./decor/SectionBridge";
import WeddingAtmosphere from "./decor/WeddingAtmosphere";
import Illustration from "./ui/Illustration";

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
  const { story, families, couple, images, invitation } = useWedding();
  const t = useT();
  const rise = useRise();

  return (
    <section id="story" aria-labelledby="story-heading" className="surface-ivory grain relative overflow-hidden px-[var(--gutter)] pb-12 pt-16 lg:pb-24 lg:pt-28">
      <SectionBridge from="var(--deep-maroon)" />
      <WeddingAtmosphere preset="story" />

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
          {/* the couple, as on the card: bride and her family on the left, groom and his on the right */}
          <m.dl variants={rise(0.3)} className="mx-auto mt-6 grid max-w-md grid-cols-[1fr_auto_1fr] items-start gap-3 sm:gap-5 lg:mx-0">
            <div className="text-center lg:text-left">
              <dt className="eyebrow text-[0.56rem] text-gold-deep">{story.brideLabel}</dt>
              <dd className="mt-1 font-serif text-2xl text-ink">{couple.bride}</dd>
              <dd className="mt-2 text-[0.72rem] leading-snug text-ink-soft">
                <span className="block font-serif text-[0.8rem] italic text-gold-deep">{story.brideParentsLabel}</span>
                {families.bride.father} {t.parentsJoin} {families.bride.mother}
              </dd>
            </div>
            <div aria-hidden className="flex flex-col items-center gap-1.5 pt-5 text-gold-deep/80">
              <span className="h-5 w-px bg-gradient-to-b from-transparent to-gold-deep/45" />
              <span className="font-serif text-lg italic">{invitation.weds}</span>
              <span className="h-5 w-px bg-gradient-to-t from-transparent to-gold-deep/45" />
            </div>
            <div className="text-center lg:text-right">
              <dt className="eyebrow text-[0.56rem] text-gold-deep">{story.groomLabel}</dt>
              <dd className="mt-1 font-serif text-2xl text-ink">{couple.groom}</dd>
              <dd className="mt-2 text-[0.72rem] leading-snug text-ink-soft">
                <span className="block font-serif text-[0.8rem] italic text-gold-deep">{story.groomParentsLabel}</span>
                {families.groom.father} {t.parentsJoin} {families.groom.mother}
              </dd>
            </div>
          </m.dl>
        </div>

        <div className="flex justify-center lg:order-1">
          <Illustration id={images.story.id} alt={images.story.alt} sizes="(min-width: 1024px) 380px, 70vw" maxWidth={400} maxVh={44} maxVhLg={62} delay={0.15} />
        </div>
      </m.div>

      {/* With the Blessings of Our Families */}
      <m.div id="family" aria-labelledby="family-heading" className="relative isolate mx-auto mt-10 max-w-3xl scroll-mt-10 text-center lg:mt-20" {...inView}>
        <WeddingAtmosphere preset="family" bleed />
        <m.div variants={rise(0)} className="flex items-center justify-center gap-4">
          <span className="h-px flex-1 bg-gold-deep/25" />
          <LotusMark tone="wine" className="h-6 w-10" />
          <span className="h-px flex-1 bg-gold-deep/25" />
        </m.div>
        <m.h3 variants={rise(0.08)} id="family-heading" className="mt-4 font-serif text-[1.9rem] leading-tight text-ink sm:text-4xl">
          {t.familiesHeadingA} <span className="italic text-wine">{t.familiesHeadingB}</span>
        </m.h3>
        <m.p variants={rise(0.16)} className="mx-auto mt-3 max-w-md text-[0.9rem] leading-relaxed text-ink-soft">
          {families.intro}
        </m.p>
        {/* bride's family on the left, groom's family on the right — a fine gold seam between */}
        <m.div variants={rise(0.26)} className="mt-8 grid items-stretch gap-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-8">
          <div>
            <p className="eyebrow text-[0.58rem] text-gold-deep">{families.bride.label}</p>
            <span aria-hidden className="mx-auto mt-2 block h-px w-10 bg-gold-deep/40" />
            <ul className="mt-3 space-y-1">
              <Person name={families.bride.grandfather} note={families.bride.grandfatherTitle} />
              <Person name={families.bride.father} />
              <Person name={families.bride.mother} />
            </ul>
          </div>
          <div aria-hidden className="flex items-center justify-center gap-3 sm:flex-col">
            <span className="h-px w-16 bg-gradient-to-l from-gold-deep/40 to-transparent sm:h-auto sm:w-px sm:flex-1 sm:bg-gradient-to-t" />
            <LotusMark tone="wine" className="h-5 w-8 shrink-0 opacity-70" />
            <span className="h-px w-16 bg-gradient-to-r from-gold-deep/40 to-transparent sm:h-auto sm:w-px sm:flex-1 sm:bg-gradient-to-b" />
          </div>
          <div>
            <p className="eyebrow text-[0.58rem] text-gold-deep">{families.groom.label}</p>
            <span aria-hidden className="mx-auto mt-2 block h-px w-10 bg-gold-deep/40" />
            <ul className="mt-3 space-y-1">
              <Person name={families.groom.father} note={families.groom.fatherTitle} />
              <Person name={families.groom.mother} />
            </ul>
          </div>
        </m.div>
      </m.div>
    </section>
  );
}

"use client";

import { m, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/weddingData";
import { LotusMark, OrnamentDivider } from "./decor/Ornaments";
import SectionBridge from "./decor/SectionBridge";
import Illustration from "./ui/Illustration";

const { story, families, images } = weddingData;
const ease = [0.22, 1, 0.36, 1] as const;

function Blessing({ label, lines }: { label: string; lines: { name: string; note?: string }[] }) {
  return (
    <div>
      <p className="eyebrow text-[0.6rem] text-gold-deep">{label}</p>
      <ul className="mt-2 space-y-1.5">
        {lines.map((l) => (
          <li key={l.name} className="font-serif text-[1.3rem] leading-snug text-wine sm:text-[1.4rem]">
            {l.name}
            {l.note && <span className="ml-2 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft">{l.note}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * "Two Hearts, One Journey": the staircase illustration with the families'
 * blessings. Heading and artwork share one in-view trigger.
 */
export default function CoupleStory() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 1.3, delay: reduce ? 0 : delay, ease } },
  });

  return (
    <section id="story" aria-labelledby="story-heading" className="surface-ivory grain relative overflow-hidden px-[var(--gutter)] pb-20 pt-24 lg:py-28">
      <SectionBridge from="var(--deep-maroon)" />
      <m.div
        className="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      >
        {/* heading first on phones; beside the art on desktop */}
        <div className="text-center lg:order-2 lg:text-left">
          <m.p variants={rise(0)} className="eyebrow text-gold-deep">
            {story.eyebrow}
          </m.p>
          <m.h2 variants={rise(0.1)} id="story-heading" className="mt-4 font-serif text-[2.6rem] leading-[1.02] text-ink sm:text-6xl">
            {story.titleA} <span className="block italic text-wine sm:inline lg:block">{story.titleB}</span>
          </m.h2>
          <m.div variants={rise(0.25)}>
            <OrnamentDivider tone="wine" animate={false} className="mx-auto mt-5 h-7 w-48 opacity-60 lg:mx-0" />
          </m.div>

          {/* families — desktop column */}
          <m.div variants={rise(0.5)} className="mt-8 hidden lg:block">
            <Families />
          </m.div>
        </div>

        <div className="flex justify-center lg:order-1">
          <Illustration
            id={images.story.id}
            alt={images.story.alt}
            sizes="(min-width: 1024px) 420px, 80vw"
            maxWidth={420}
            maxVh={66}
            delay={0.2}
          />
        </div>

        {/* families — phones, under the art */}
        <m.div variants={rise(0.3)} className="text-center lg:hidden">
          <Families />
        </m.div>
      </m.div>
    </section>
  );
}

function Families() {
  return (
    <div>
      <p className="flex items-center justify-center gap-3 font-serif text-lg italic text-ink-soft lg:justify-start">
        <LotusMark tone="wine" className="h-5 w-8" />
        {families.heading}
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-8">
        <Blessing
          label={families.groom.label}
          lines={[
            { name: families.groom.father, note: families.groom.fatherTitle },
            { name: families.groom.mother },
          ]}
        />
        <Blessing
          label={families.bride.label}
          lines={[
            { name: families.bride.grandfather, note: families.bride.grandfatherTitle },
            { name: families.bride.father },
            { name: families.bride.mother },
          ]}
        />
      </div>
    </div>
  );
}

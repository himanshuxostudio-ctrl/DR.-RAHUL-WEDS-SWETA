"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Fragment, useRef } from "react";
import { weddingData } from "@/data/weddingData";
import EventSection from "./EventSection";
import { OrnamentDivider } from "./decor/Ornaments";
import Photo from "./ui/Photo";
import { Parallax, Reveal, RevealWords } from "./ui/Reveal";

const { celebrations, events, story, images } = weddingData;

/** Full-bleed photograph that hands the story over to the wedding day. */
function Interlude() {
  return (
    <section aria-label={story.interludeTitle} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-deep-maroon">
      <Parallax distance={70} className="absolute -inset-y-24 inset-x-0">
        <Photo id={images.brideportrait.id} alt={images.brideportrait.alt} sizes="100vw" position="50% 22%" quality={70} className="md:!object-[50%_12%]" />
      </Parallax>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-deep-maroon/70 via-transparent to-deep-maroon" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(30,7,11,0.55))]" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-[14svh] text-center">
        <Reveal>
          <p className="eyebrow text-champagne">{story.interludeEyebrow}</p>
        </Reveal>
        <p lang="hi" className="font-deva mt-4 text-6xl text-gold-light sm:text-8xl">
          <RevealWords text="विवाह" delay={0.2} />
        </p>
        <Reveal delay={0.4}>
          <p className="eyebrow mt-4 tracking-[0.5em] text-ivory">12 · 12 · 2026</p>
        </Reveal>
      </div>
    </section>
  );
}

export default function WeddingTimeline() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.001 });

  return (
    <div id="celebrations" className="relative [--line-x:1.35rem] sm:[--line-x:2.5rem] lg:[--line-x:4vw]">
      <header className="surface-maroon relative overflow-hidden px-[var(--gutter)] pb-20 pt-[var(--space-section)] text-center">
        <Reveal>
          <p className="eyebrow text-gold">{celebrations.eyebrow}</p>
        </Reveal>
        <h2 className="mt-5 font-serif text-[3rem] leading-none text-ivory sm:text-7xl">
          <RevealWords text={celebrations.heading} />
        </h2>
        <Reveal delay={0.2}>
          <OrnamentDivider className="mx-auto mt-8 h-8 w-60" />
        </Reveal>

        {/* At-a-glance: vertical on phones, three columns from md */}
        <ol className="mx-auto mt-12 grid max-w-4xl gap-px overflow-hidden rounded-sm border border-gold/25 bg-gold/25 md:grid-cols-3">
          {events.map((ev, i) => (
            <Reveal as="li" key={ev.id} delay={0.1 * i} className="bg-deep-maroon/95">
              <a href={`#${ev.id}`} className="group flex items-center gap-5 px-6 py-5 text-left transition hover:bg-wine/40 md:flex-col md:gap-2 md:py-8 md:text-center">
                <span className="font-serif text-4xl text-gold-light md:text-5xl">{ev.date.slice(0, 2)}</span>
                <span className="flex flex-col md:items-center">
                  <span className="font-serif text-2xl text-ivory">{ev.name}</span>
                  <span className="eyebrow mt-1 text-[0.6rem] text-champagne/70">
                    Dec 2026 · {ev.time.replace(" onwards", "+")}
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </ol>
      </header>

      <div ref={ref} className="relative">
        {/* The gold line introduced in the opening, carried through the events */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[var(--line-x)] z-10 w-px bg-gold/15">
          <motion.div className="h-full w-full origin-top bg-gradient-to-b from-gold-light via-gold to-gold-deep" style={{ scaleY: reduce ? 1 : scaleY }} />
        </div>

        {events.map((ev) => (
          <Fragment key={ev.id}>
            {ev.theme === "vivah" && <Interlude />}
            <div id={ev.id} className="scroll-mt-0">
              <EventSection event={ev} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

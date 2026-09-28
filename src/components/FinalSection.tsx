"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Mail } from "lucide-react";
import { useRef } from "react";
import { weddingData } from "@/data/weddingData";
import CalendarButton from "./CalendarButton";
import MapButton from "./MapButton";
import { CornerFlourish, LotusMark, Mandala } from "./decor/Ornaments";
import GoldDust from "./decor/GoldDust";
import Photo, { ArtPicture } from "./ui/Photo";
import { Parallax, Reveal, RevealWords } from "./ui/Reveal";

const { final, couple, venue, events, images } = weddingData;

/** Thank-you: full-bleed candid photograph with the message laid over it. */
function ThankYou() {
  return (
    <section aria-labelledby="thanks-heading" className="relative min-h-[100svh] overflow-hidden bg-deep-maroon">
      <Parallax distance={60} className="absolute -inset-y-20 inset-x-0">
        <Photo id={images.candid.id} alt={images.candid.alt} sizes="100vw" position="50% 18%" quality={70} />
      </Parallax>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-deep-maroon/40 via-deep-maroon/10 to-deep-maroon" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-deep-maroon via-deep-maroon/85 to-transparent" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-[var(--gutter)] pb-[max(5rem,env(safe-area-inset-bottom))] text-center">
        <h2 id="thanks-heading" className="serif-display text-[4rem] text-ivory sm:text-8xl">
          <RevealWords text={final.heading} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-sm font-serif text-xl italic leading-relaxed text-champagne sm:text-2xl">{final.message}</p>
        </Reveal>
        <Reveal delay={0.35} className="mt-10 flex flex-wrap justify-center gap-3">
          <MapButton href={venue.mapsUrl} label={venue.directionsLabel} solid />
          <CalendarButton events={events} />
          <a href="#rsvp" className="btn-gold">
            <Mail className="h-4 w-4" aria-hidden /> RSVP
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * The closing shot: the photograph dissolves into maroon, gold lines draw,
 * the names settle, and the screen slowly fades — like the end of a film.
 */
function Finale() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const photoOpacity = useTransform(p, [0, 0.35], [1, 0]);
  const photoScale = useTransform(p, [0, 0.4], [1, 1.08]);
  const lines = useTransform(p, [0.28, 0.5], [0, 1]);
  const namesOpacity = useTransform(p, [0.38, 0.52], [0, 1]);
  const namesY = useTransform(p, [0.38, 0.55], [30, 0]);
  const dateOpacity = useTransform(p, [0.5, 0.6], [0, 1]);
  const signOpacity = useTransform(p, [0.58, 0.68], [0, 1]);
  const fadeToBlack = useTransform(p, [0.86, 1], [0, 0.7]);
  const mandalaOpacity = useTransform(p, [0.3, 0.6], [0, 0.08]);

  const still = reduce ? { opacity: 1 } : undefined;

  return (
    <section ref={ref} aria-label="Closing" className={`relative bg-deep-maroon ${reduce ? "" : "h-[240svh]"}`}>
      <div className={`${reduce ? "min-h-[100svh]" : "sticky top-0 h-[100svh]"} flex items-center justify-center overflow-hidden`}>
        {!reduce && (
          <motion.div className="absolute inset-0" style={{ opacity: photoOpacity, scale: photoScale }}>
            <ArtPicture mobile={images.heroPortrait.id} desktop={images.heroWide.id} alt="" desktopSizes="100vw" className="object-[50%_25%]" />
            <div aria-hidden className="absolute inset-0 bg-deep-maroon/30" />
          </motion.div>
        )}
        <div aria-hidden className="surface-maroon absolute inset-0 -z-0 opacity-60" />
        <GoldDust density={30} className="opacity-80" />
        <motion.div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 w-[110vmin] -translate-x-1/2 -translate-y-1/2" style={reduce ? { opacity: 0.08 } : { opacity: mandalaOpacity }}>
          <Mandala className="animate-slow-spin h-full w-full" />
        </motion.div>

        {/* gold ornamental frame drawing in */}
        <div aria-hidden className="absolute inset-5 sm:inset-10">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" fill="none">
            <motion.rect x="0.5" y="0.5" width="99.8%" height="99.8%" stroke="var(--gold)" strokeWidth="1" style={reduce ? undefined : { pathLength: lines }} />
          </svg>
          {["left-0 top-0", "right-0 top-0 rotate-90", "right-0 bottom-0 rotate-180", "left-0 bottom-0 -rotate-90"].map((pos) => (
            <motion.div key={pos} className={`absolute ${pos} h-20 w-20 sm:h-28 sm:w-28`} style={still ?? { opacity: lines }}>
              <CornerFlourish className="h-full w-full" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 px-8 text-center">
          <motion.div style={still ?? { opacity: namesOpacity, y: namesY }}>
            <LotusMark className="mx-auto mb-6 h-8 w-12" />
            <p className="serif-display gold-text gold-text-animate text-[4.2rem] sm:text-8xl">{couple.groom}</p>
            <p className="my-2 font-serif text-3xl italic text-champagne">&amp;</p>
            <p className="serif-display gold-text gold-text-animate text-[4.2rem] sm:text-8xl">{couple.bride}</p>
          </motion.div>
          <motion.div style={still ?? { opacity: dateOpacity }} className="mt-8 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gold" />
            <time dateTime="2026-12-12" className="eyebrow text-sm tracking-[0.5em] text-ivory">
              {couple.dateShort}
            </time>
            <span className="h-px w-10 bg-gold" />
          </motion.div>
          <motion.p style={still ?? { opacity: signOpacity }} className="mx-auto mt-8 max-w-xs font-serif text-xl italic leading-relaxed text-champagne/85">
            {final.signoff}
          </motion.p>
        </div>

        {!reduce && <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-black" style={{ opacity: fadeToBlack }} />}
      </div>
    </section>
  );
}

export default function FinalSection() {
  return (
    <>
      <ThankYou />
      <Finale />
    </>
  );
}

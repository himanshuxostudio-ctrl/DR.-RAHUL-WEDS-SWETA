"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useRef } from "react";
import { weddingData } from "@/data/weddingData";
import { CornerFlourish, LotusMark, Mandala, OrnamentDivider } from "./decor/Ornaments";
import GoldDust from "./decor/GoldDust";
import Photo, { ArtPicture } from "./ui/Photo";
import { Parallax, Reveal, RevealWords, usePinnedProgress } from "./ui/Reveal";

const { final, couple, images } = weddingData;

/** Thank-you: a clean closing screen — the candid photograph and the message. */
function ThankYou() {
  return (
    <section aria-labelledby="thanks-heading" className="relative min-h-[100svh] overflow-hidden bg-deep-maroon">
      <Parallax distance={30} className="absolute -inset-y-10 inset-x-0">
        <Photo id={images.candid.id} alt={images.candid.alt} sizes="100vw" position="43% 8%" quality={70} />
      </Parallax>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-deep-maroon/35 via-transparent to-deep-maroon" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-deep-maroon via-deep-maroon/80 to-transparent" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-[var(--gutter)] pb-[max(4.5rem,env(safe-area-inset-bottom))] text-center">
        <h2 id="thanks-heading" className="serif-display text-[4rem] text-ivory sm:text-8xl">
          <RevealWords text={final.heading} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-sm font-serif text-xl italic leading-relaxed text-champagne sm:text-2xl">{final.message}</p>
        </Reveal>
        <Reveal delay={0.35}>
          <OrnamentDivider className="mx-auto mt-8 h-8 w-52 opacity-70" />
        </Reveal>
      </div>
    </section>
  );
}

/**
 * The closing shot, and the true end of the page: as the guest scrolls, the
 * photograph softens into maroon, the gold frame draws, and the names, date and
 * sign-off settle over it. The last scroll position IS this finished frame —
 * no fade to black, no empty space after it.
 */
function Finale() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const p = usePinnedProgress(ref);

  const photoOpacity = useTransform(p, [0, 0.55], [1, 0.55]);
  const photoScale = useTransform(p, [0, 1], [1.06, 1]);
  const lines = useTransform(p, [0.1, 0.5], [0, 1]);
  const namesOpacity = useTransform(p, [0.2, 0.45], [0, 1]);
  const namesY = useTransform(p, [0.2, 0.5], [30, 0]);
  const dateOpacity = useTransform(p, [0.35, 0.55], [0, 1]);
  const signOpacity = useTransform(p, [0.45, 0.65], [0, 1]);
  const mandalaOpacity = useTransform(p, [0.2, 0.5], [0, 0.07]);

  const still = reduce ? { opacity: 1 } : undefined;

  return (
    <section ref={ref} aria-label="Closing" className={`relative bg-deep-maroon ${reduce ? "" : "h-[180svh]"}`}>
      <div className={`${reduce ? "min-h-[100svh]" : "sticky top-0 h-[100svh]"} surface-maroon flex flex-col items-center justify-end overflow-hidden md:justify-center`}>
        {/* Photograph: fitted to the top of the screen on phones (both faces
            stay whole), full-bleed on larger screens. */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[70svh] md:inset-0 md:h-full"
          style={reduce ? { opacity: 0.55 } : { opacity: photoOpacity, scale: photoScale }}
        >
          <ArtPicture
            mobile={images.heroPortrait.id}
            desktop={images.heroWide.id}
            alt=""
            desktopSizes="68vw"
            className="object-[48%_0%] md:object-[60%_28%]"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-deep-maroon/10 via-deep-maroon/25 to-deep-maroon md:bg-gradient-to-r md:from-deep-maroon/90 md:via-deep-maroon/45 md:to-deep-maroon/20" />
        </motion.div>
        <GoldDust density={26} className="opacity-80" />
        <motion.div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 w-[110vmin] -translate-x-1/2 -translate-y-1/2" style={reduce ? { opacity: 0.07 } : { opacity: mandalaOpacity }}>
          <Mandala className="animate-slow-spin h-full w-full" />
        </motion.div>

        {/* gold ornamental frame drawing in */}
        <div aria-hidden className="absolute inset-4 sm:inset-10">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" fill="none">
            <motion.rect x="0.5" y="0.5" width="99.8%" height="99.8%" stroke="var(--gold)" strokeWidth="1" style={reduce ? undefined : { pathLength: lines }} />
          </svg>
          {["left-1.5 top-1.5", "right-1.5 top-1.5 rotate-90", "right-1.5 bottom-1.5 rotate-180", "left-0 bottom-0 -rotate-90"].map((pos) => (
            <motion.div key={pos} className={`absolute ${pos} h-16 w-16 sm:h-28 sm:w-28`} style={still ?? { opacity: lines }}>
              <CornerFlourish className="h-full w-full" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 px-8 pb-[max(4rem,env(safe-area-inset-bottom))] text-center md:mr-auto md:w-[44%] md:pb-0 md:pl-[8vw] md:pr-0 md:text-left">
          <motion.div style={still ?? { opacity: namesOpacity, y: namesY }}>
            <LotusMark className="mx-auto mb-5 h-8 w-12 md:mx-0" />
            <p className="serif-display gold-text gold-text-animate text-[3.8rem] sm:text-8xl">{couple.groom}</p>
            <p className="my-1.5 font-serif text-3xl italic text-champagne">&amp;</p>
            <p className="serif-display gold-text gold-text-animate text-[3.8rem] sm:text-8xl">{couple.bride}</p>
          </motion.div>
          <motion.div style={still ?? { opacity: dateOpacity }} className="mt-7 flex items-center justify-center gap-4 md:justify-start">
            <span className="h-px w-10 bg-gold" />
            <time dateTime="2026-12-12" className="eyebrow text-sm tracking-[0.5em] text-ivory">
              {couple.dateShort}
            </time>
            <span className="h-px w-10 bg-gold" />
          </motion.div>
          <motion.p style={still ?? { opacity: signOpacity }} className="mx-auto mt-6 max-w-xs font-serif text-xl italic leading-relaxed text-champagne/90 md:mx-0">
            {final.signoff}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

export default function FinalSection() {
  return (
    <div id="closing">
      <ThankYou />
      <Finale />
    </div>
  );
}

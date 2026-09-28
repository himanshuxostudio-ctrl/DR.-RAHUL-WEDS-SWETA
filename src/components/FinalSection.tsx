"use client";

import { m, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/weddingData";
import { CornerFlourish, LotusMark, Mandala, OrnamentDivider } from "./decor/Ornaments";
import SectionBridge from "./decor/SectionBridge";
import GoldDust from "./decor/GoldDust";
import Photo, { ArtPicture } from "./ui/Photo";
import { Parallax, Reveal, RevealWords } from "./ui/Reveal";

const { final, couple, images } = weddingData;

const ease = [0.22, 1, 0.36, 1] as const;
const film = [0.65, 0, 0.35, 1] as const;

const CORNERS = ["left-1.5 top-1.5", "right-1.5 top-1.5 rotate-90", "right-1.5 bottom-1.5 rotate-180", "left-1.5 bottom-1.5 -rotate-90"];

/**
 * The final wedding image. One in-view trigger plays a short film sequence:
 * the photograph settles and softens into maroon, the gold frame draws, then
 * the names, date and sign-off arrive. No scroll-pinning, so nothing waits on
 * how far the guest has scrolled.
 */
function FinalImage() {
  const reduce = useReducedMotion();
  const at = (delay: number, y = 0) => ({
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: { opacity: 1, y: 0, transition: { duration: 1.4, delay: reduce ? 0 : delay, ease } },
  });

  return (
    <m.section
      aria-label={`${couple.groom} and ${couple.bride}`}
      className="surface-maroon relative flex min-h-[100svh] flex-col items-center justify-end overflow-hidden md:justify-center"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.45 }}
    >
      {/* Photograph: fitted to the top of the screen on phones (both faces
          stay whole), full-bleed on larger screens. */}
      <m.div
        className="absolute inset-x-0 top-0 h-[70svh] md:inset-0 md:h-full"
        variants={{
          hidden: { opacity: 1, scale: reduce ? 1 : 1.08 },
          show: {
            opacity: 0.6,
            scale: 1,
            transition: { scale: { duration: 7, ease: "easeOut" }, opacity: { duration: 2.4, delay: 0.8, ease: film } },
          },
        }}
      >
        <ArtPicture mobile={images.heroPortrait.id} desktop={images.heroWide.id} alt="" desktopSizes="68vw" className="object-[48%_0%] md:object-[60%_28%]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-deep-maroon/10 via-deep-maroon/25 to-deep-maroon md:bg-gradient-to-r md:from-deep-maroon/90 md:via-deep-maroon/45 md:to-deep-maroon/20" />
      </m.div>
      <SectionBridge from="#f3e7d6" variant="fade" line={false} />
      <GoldDust density={22} className="opacity-70" />
      <m.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 w-[110vmin] -translate-x-1/2 -translate-y-1/2"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 0.07, transition: { duration: 3, delay: 1 } } }}
      >
        <Mandala className="animate-slow-spin h-full w-full" />
      </m.div>

      {/* gold ornamental frame drawing in */}
      <div aria-hidden className="absolute inset-4 sm:inset-10">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" fill="none">
          <m.rect
            x="0.5" y="0.5" width="99.8%" height="99.8%" stroke="var(--gold)" strokeWidth="1"
            variants={{ hidden: { pathLength: reduce ? 1 : 0 }, show: { pathLength: 1, transition: { duration: 2.6, delay: 0.8, ease: film } } }}
          />
        </svg>
        {CORNERS.map((pos) => (
          <m.div key={pos} className={`absolute ${pos} h-16 w-16 sm:h-28 sm:w-28`} variants={at(1.8)}>
            <CornerFlourish className="h-full w-full" />
          </m.div>
        ))}
      </div>

      <div className="relative z-10 px-8 pb-[max(4.5rem,env(safe-area-inset-bottom))] text-center md:mr-auto md:w-[44%] md:pb-0 md:pl-[8vw] md:pr-0 md:text-left">
        <m.div variants={at(1.4, 24)}>
          <LotusMark className="mx-auto mb-5 h-8 w-12 md:mx-0" />
          <p className="serif-display gold-text gold-text-animate text-[3.8rem] sm:text-8xl">{couple.groom}</p>
          <p className="my-1.5 font-serif text-3xl italic text-champagne">&amp;</p>
          <p className="serif-display gold-text gold-text-animate text-[3.8rem] sm:text-8xl">{couple.bride}</p>
        </m.div>
        <m.div variants={at(2.1)} className="mt-7 flex items-center justify-center gap-4 md:justify-start">
          <span className="h-px w-10 bg-gold" />
          <time dateTime="2026-12-12" className="eyebrow text-sm tracking-[0.5em] text-ivory">
            {couple.dateShort}
          </time>
          <span className="h-px w-10 bg-gold" />
        </m.div>
        <m.p variants={at(2.6)} className="mx-auto mt-6 max-w-xs font-serif text-xl italic leading-relaxed text-champagne/90 md:mx-0">
          {final.signoff}
        </m.p>
      </div>
    </m.section>
  );
}

/**
 * Thank You — the last screen of the film, and the true end of the page:
 * the candid photograph, the message and a closing gold frame. No buttons.
 */
function ThankYou() {
  return (
    <section aria-labelledby="thanks-heading" className="relative min-h-[100svh] overflow-hidden bg-deep-maroon">
      <Parallax distance={24} className="absolute -inset-y-8 inset-x-0">
        <Photo id={images.candid.id} alt={images.candid.alt} sizes="100vw" position="43% 8%" quality={70} />
      </Parallax>
      {/* soft bridge from the final image above, and a floor for the text */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-deep-maroon to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-deep-maroon via-deep-maroon/85 to-transparent" />

      <div aria-hidden className="pointer-events-none absolute inset-4 border border-gold/35 sm:inset-10">
        {CORNERS.map((pos) => (
          <CornerFlourish key={pos} className={`absolute ${pos} h-14 w-14 opacity-80 sm:h-24 sm:w-24`} />
        ))}
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-[var(--gutter)] pb-[max(4.5rem,env(safe-area-inset-bottom))] text-center">
        <h2 id="thanks-heading" className="serif-display text-[4rem] text-ivory sm:text-8xl">
          <RevealWords text={final.heading} />
        </h2>
        <Reveal delay={0.25}>
          <p className="mx-auto mt-5 max-w-sm font-serif text-xl italic leading-relaxed text-champagne sm:text-2xl">{final.message}</p>
        </Reveal>
        <Reveal delay={0.45}>
          <OrnamentDivider className="mx-auto mt-8 h-8 w-52 opacity-70" />
          <p className="eyebrow mt-4 text-[0.62rem] text-gold/80">
            {couple.groomFirstName} &amp; {couple.bride} · {couple.dateShort}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default function FinalSection() {
  return (
    <div id="closing">
      <FinalImage />
      <ThankYou />
    </div>
  );
}

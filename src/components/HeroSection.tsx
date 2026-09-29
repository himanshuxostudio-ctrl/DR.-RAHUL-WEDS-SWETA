"use client";

import { getImageProps } from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { getImage, weddingData } from "@/data/weddingData";
import { CornerFlourish, OrnamentDivider } from "./decor/Ornaments";
import FloralAmbience from "./decor/FloralAmbience";
import GoldDust from "./decor/GoldDust";

const ease = [0.22, 1, 0.36, 1] as const;
const { couple, invitation, images } = weddingData;

/** Art-directed hero artwork: closer crop on phones, full stage from 640px. */
function HeroArt() {
  const wide = getImage(images.hero.id);
  const tall = getImage(images.heroMobile.id);
  const common = { alt: images.hero.alt, quality: 80, priority: true, fill: true } as const;
  const { props: d } = getImageProps({ ...common, src: wide.src, sizes: "(min-width: 1024px) 56vw, 92vw" });
  const { props: mob } = getImageProps({ ...common, src: tall.src, sizes: "92vw" });
  const { srcSet: mSet, sizes: mSizes, ...img } = mob;
  return (
    <picture>
      <source media="(min-width: 640px)" srcSet={d.srcSet} sizes={d.sizes} />
      <source media="(max-width: 639px)" srcSet={mSet} sizes={mSizes} />
      <img
        {...img}
        alt={images.hero.alt}
        className="object-cover"
        style={{ ...img.style, backgroundImage: `url(${tall.blurDataURL})`, backgroundSize: "cover" }}
      />
    </picture>
  );
}

export default function HeroSection({ revealed }: { revealed: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);
  const d = (s: number) => (reduce ? 0 : s);
  const rise = (delay: number) => ({
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 1.2, delay: d(delay), ease } },
  });

  return (
    <section
      ref={ref}
      id="top"
      aria-label={`${couple.groom} and ${couple.bride}`}
      className="surface-maroon relative flex min-h-[100svh] items-center overflow-hidden px-6 pb-12 pt-20 sm:px-10"
    >
      {/* atmosphere: breathing glow, garland, florals, petals, gold dust */}
      <div aria-hidden className="glow-breathe pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_58%,rgba(201,164,92,0.16),transparent_70%)]" />
      <FloralAmbience />
      <GoldDust density={14} className="opacity-50" />

      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-3 z-10 border border-gold/35 sm:inset-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 2, delay: d(0.8) }}
      >
        <CornerFlourish className="absolute left-1.5 top-1.5 h-10 w-10 sm:h-16 sm:w-16" />
        <CornerFlourish className="absolute right-1.5 top-1.5 h-10 w-10 rotate-90 sm:h-16 sm:w-16" />
        <CornerFlourish className="absolute bottom-1.5 right-1.5 h-10 w-10 rotate-180 sm:h-16 sm:w-16" />
        <CornerFlourish className="absolute bottom-1.5 left-1.5 h-10 w-10 -rotate-90 sm:h-16 sm:w-16" />
      </m.div>

      <m.div
        className="relative z-20 mx-auto grid w-full max-w-6xl items-center gap-6 text-center lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:text-left"
        initial="hidden"
        animate={revealed ? "show" : "hidden"}
      >
        <div className="flex flex-col items-center lg:items-start">
          <m.p variants={rise(0.1)} lang="hi" className="font-deva text-[1.7rem] leading-[1.6] text-gold-light sm:text-3xl">
            {invitation.hindiTitle}
          </m.p>
          <m.p variants={rise(0.3)} className="eyebrow mt-1 text-[0.62rem] text-champagne/75">
            {invitation.cordially}
          </m.p>
          <m.h2 variants={rise(0.5)} className="serif-display mt-4 text-[3.1rem] leading-[0.92] text-ivory sm:text-6xl lg:text-[5.4rem]">
            <span className="block">{couple.groom}</span>
            <span className="my-1.5 block font-serif text-2xl italic text-gold-light lg:text-4xl">{invitation.weds}</span>
            <span className="block">{couple.bride}</span>
          </m.h2>
          <m.div variants={rise(0.8)} className="mt-4 flex items-center gap-4">
            <span className="h-px w-8 bg-gold/70" />
            <time dateTime="2026-12-12" className="eyebrow text-[0.72rem] text-champagne">
              {couple.date}
            </time>
            <span className="h-px w-8 bg-gold/70" />
          </m.div>
          <ScrollCue revealed={revealed} delay={d(2.4)} className="mt-10 hidden lg:flex" />
        </div>

        <div className="flex flex-col items-center">
          <m.div style={{ y: artY }} className="w-full">
            <m.div
              className="feather relative mx-auto aspect-[680/604] w-[min(100%,calc(44svh*1.126))] sm:aspect-[900/600] sm:w-[min(100%,calc(48svh*1.5),760px)] lg:w-full"
              variants={{
                hidden: { opacity: 0, scale: reduce ? 1 : 1.04 },
                show: { opacity: 1, scale: 1, transition: { duration: 2.2, delay: d(0.7), ease } },
              }}
            >
              <HeroArt />
            </m.div>
          </m.div>
          <m.div variants={rise(1.6)}>
            <OrnamentDivider animate={false} className="mx-auto mt-3 h-7 w-44 opacity-70" />
          </m.div>
          <ScrollCue revealed={revealed} delay={d(2.4)} className="mt-3 lg:hidden" />
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
      <span className="eyebrow text-[0.6rem]">Scroll to begin</span>
      <span className="relative h-7 w-px overflow-hidden bg-gold/25 lg:h-10">
        <span className="absolute inset-x-0 top-0 h-1/2 bg-gold-light [animation:scroll-cue_2.2s_ease-in-out_infinite]" />
      </span>
      <style>{`@keyframes scroll-cue{0%{transform:translateY(-100%)}100%{transform:translateY(220%)}}`}</style>
    </m.a>
  );
}

"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { weddingData } from "@/data/weddingData";
import { ArtPicture } from "./ui/Photo";
import { CornerFlourish, OrnamentDivider } from "./decor/Ornaments";
import GoldDust from "./decor/GoldDust";

const ease = [0.22, 1, 0.36, 1] as const;
const film = [0.65, 0, 0.35, 1] as const;
const { couple, invitation, images } = weddingData;

export default function HeroSection({ revealed }: { revealed: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const state = revealed ? "show" : "hidden";
  const d = (s: number) => (reduce ? 0 : s);

  return (
    <section ref={ref} id="top" aria-label={`${couple.groom} and ${couple.bride}`} className="surface-maroon relative min-h-[100svh] overflow-hidden">
      {/* Photograph — revealed through a widening mask, settling from 1.1 → 1 */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[72svh] md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[68%]"
        style={{ y: imgY }}
      >
        <motion.div
          className="relative h-full w-full overflow-hidden"
          initial={{ clipPath: "inset(18% 22% 30% 22%)" }}
          animate={state}
          variants={{
            hidden: { clipPath: "inset(18% 22% 30% 22%)" },
            show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: d(2.4), delay: d(0.2), ease: film } },
          }}
        >
          <motion.div
            className="h-full w-full"
            variants={{
              hidden: { scale: 1.1 },
              show: { scale: 1, transition: { duration: d(4.5), ease } },
            }}
            initial="hidden"
            animate={state}
          >
            <ArtPicture
              mobile={images.heroPortrait.id}
              desktop={images.heroWide.id}
              alt={images.heroWide.alt}
              desktopSizes="68vw"
              priority
              className="object-[50%_20%] md:object-[62%_30%]"
            />
          </motion.div>
          {revealed && !reduce && <div className="light-sweep" style={{ ["--sweep-delay" as string]: "1.6s" }} />}
          {/* blend into the maroon */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep-maroon via-deep-maroon/10 to-transparent md:bg-gradient-to-r md:from-deep-maroon md:via-deep-maroon/5 md:to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-deep-maroon/60 to-transparent" />
        </motion.div>
      </motion.div>

      <GoldDust density={22} className="opacity-70" />

      {/* Card border */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-3 z-10 border border-gold/40 sm:inset-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 2, delay: d(1.4) }}
      >
        <CornerFlourish className="absolute -left-px -top-px h-14 w-14 sm:h-20 sm:w-20" />
        <CornerFlourish className="absolute -right-px -top-px h-14 w-14 rotate-90 sm:h-20 sm:w-20" />
        <CornerFlourish className="absolute -bottom-px -right-px h-14 w-14 rotate-180 sm:h-20 sm:w-20" />
        <CornerFlourish className="absolute -bottom-px -left-px h-14 w-14 -rotate-90 sm:h-20 sm:w-20" />
      </motion.div>

      {/* Typography */}
      <motion.div
        style={{ y: textY, opacity: fadeOut }}
        className="relative z-20 flex min-h-[100svh] flex-col justify-end px-7 pb-[max(4.5rem,env(safe-area-inset-bottom))] pt-24 text-center md:w-[46%] md:justify-center md:pb-24 md:pl-[7vw] md:pr-0 md:text-left"
      >
        <motion.div
          initial="hidden"
          animate={state}
          variants={{ hidden: {}, show: { transition: { staggerChildren: d(0.18), delayChildren: d(1.1) } } }}
        >
          {[
            <p key="e" className="eyebrow mb-5 text-gold">The wedding of</p>,
            <h2 key="n" className="serif-display text-[3.9rem] leading-[0.88] text-ivory sm:text-7xl lg:text-[6.6rem]">
              <span className="block">{couple.groom}</span>
              <span className="my-1 block font-serif text-4xl italic text-gold-light lg:text-5xl">&amp;</span>
              <span className="block">{couple.bride}</span>
            </h2>,
            <div key="d" className="mt-7 flex items-center justify-center gap-4 md:justify-start">
              <span className="h-px w-8 bg-gold/70" />
              <time dateTime="2026-12-12" className="eyebrow text-[0.78rem] text-champagne">
                {couple.date}
              </time>
              <span className="h-px w-8 bg-gold/70" />
            </div>,
            <p key="b" className="mx-auto mt-6 max-w-[21rem] font-serif text-[1.15rem] italic leading-relaxed text-champagne/85 md:mx-0 md:max-w-sm md:text-xl">
              {invitation.blessingLine}
            </p>,
          ].map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: reduce ? 0 : 26 },
                show: { opacity: 1, y: 0, transition: { duration: d(1.4), ease } },
              }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>

        <motion.a
          href="#story"
          className="group mx-auto mt-10 flex flex-col items-center gap-2 text-champagne/60 md:mx-0 md:items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1.5, delay: d(2.6) }}
        >
          <span className="eyebrow text-[0.62rem]">Scroll to begin</span>
          <span className="relative h-10 w-px overflow-hidden bg-gold/25">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-gold-light [animation:scroll-cue_2.2s_ease-in-out_infinite]" />
          </span>
          <style>{`@keyframes scroll-cue{0%{transform:translateY(-100%)}100%{transform:translateY(220%)}}`}</style>
        </motion.a>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 z-10 translate-y-1/2">
        <OrnamentDivider className="mx-auto h-8 w-56 opacity-60" />
      </div>
    </section>
  );
}

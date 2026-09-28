"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { weddingData } from "@/data/weddingData";
import { ArtPicture } from "./ui/Photo";

const { story, couple, images } = weddingData;

function Half({ side, x, scale }: { side: "left" | "right"; x?: MotionValue<string>; scale?: MotionValue<number> }) {
  return (
    <motion.div className="absolute inset-0" style={x ? { x, scale } : undefined}>
      <div
        className="absolute inset-0"
        style={{
          clipPath: side === "left" ? "inset(0 calc(100% - var(--split) - 1px) 0 0)" : "inset(0 0 0 var(--split))",
        }}
      >
        <ArtPicture
          mobile={images.togetherMobile.id}
          desktop={images.togetherWide.id}
          alt={side === "left" ? images.togetherWide.alt : ""}
          desktopSizes="(min-width: 1280px) 1100px, 86vw"
          mobileSizes="92vw"
          className="object-center"
        />
      </div>
    </motion.div>
  );
}

/**
 * "Two Souls · One Journey" — the back-to-back photograph is split where the
 * couple meet. On scroll the two halves drift together into one frame.
 */
export default function CoupleStory() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const leftX = useTransform(p, [0.05, 0.6], ["-14%", "0%"]);
  const rightX = useTransform(p, [0.05, 0.6], ["14%", "0%"]);
  const halvesScale = useTransform(p, [0.05, 0.6], [0.9, 1]);
  const seam = useTransform(p, [0.4, 0.62], [1, 0]);
  const twoOpacity = useTransform(p, [0, 0.12, 0.38, 0.5], [0, 1, 1, 0]);
  const oneOpacity = useTransform(p, [0.55, 0.7], [0, 1]);
  const oneY = useTransform(p, [0.55, 0.72], [30, 0]);
  const labelOpacity = useTransform(p, [0.1, 0.2, 0.42, 0.55], [0, 1, 1, 0]);

  return (
    <section
      id="story"
      ref={ref}
      aria-labelledby="story-heading"
      className={`surface-maroon relative ${reduce ? "" : "h-[260svh]"}`}
    >
      <div className={`${reduce ? "py-24" : "sticky top-0 h-[100svh]"} flex flex-col items-center justify-center overflow-hidden px-[var(--gutter)]`}>
        <p className="eyebrow mb-5 text-gold">{story.eyebrow}</p>

        {/* Headline crossfade: Two Souls → One Journey */}
        <h2 id="story-heading" className="relative mb-8 h-[1.1em] w-full text-center font-serif text-[2.9rem] leading-none text-ivory sm:text-6xl lg:text-7xl">
          <motion.span className="absolute inset-0" style={reduce ? { opacity: 0 } : { opacity: twoOpacity }}>
            {story.titleA}
          </motion.span>
          <motion.span className="absolute inset-0 italic text-gold-light" style={reduce ? undefined : { opacity: oneOpacity, y: oneY }}>
            {story.titleB}
          </motion.span>
          <span className="sr-only">
            {story.titleA}, {story.titleB}
          </span>
        </h2>

        <div className="relative w-full max-w-[min(1100px,calc((100svh-15rem)*1.5))] [--split:57%] md:[--split:69%]">
          <div className="relative aspect-[1160/1066] w-full md:aspect-[1600/1066]">
            <Half side="left" x={reduce ? undefined : leftX} scale={halvesScale} />
            <Half side="right" x={reduce ? undefined : rightX} scale={halvesScale} />
            {/* the thin gold seam that disappears as they meet */}
            <motion.div
              aria-hidden
              className="absolute inset-y-[6%] left-[var(--split)] w-px bg-gradient-to-b from-transparent via-gold-light to-transparent"
              style={reduce ? { opacity: 0 } : { opacity: seam }}
            />
            <div aria-hidden className="pointer-events-none absolute -inset-2 border border-gold/30 sm:-inset-3" />
          </div>

        </div>

        <div className="mt-6 grid min-h-[5.5rem] w-full max-w-[1100px] [&>*]:[grid-area:1/1]">
  {/* Name captions under each half */}
        <motion.div
          className="grid grid-cols-2 self-start text-center"
          style={reduce ? { display: "none" } : { opacity: labelOpacity }}
          aria-hidden={!reduce}
        >
          <div>
            <p className="eyebrow text-[0.6rem] text-gold">{story.groomLabel}</p>
            <p className="mt-1 font-serif text-2xl text-ivory sm:text-3xl">{couple.groom}</p>
          </div>
          <div>
            <p className="eyebrow text-[0.6rem] text-gold">{story.brideLabel}</p>
            <p className="mt-1 font-serif text-2xl text-ivory sm:text-3xl">{couple.bride}</p>
          </div>
        </motion.div>
  <motion.p
          className="mx-auto max-w-md self-center text-center font-serif text-lg italic leading-relaxed text-champagne/85 sm:text-xl"
          style={reduce ? undefined : { opacity: oneOpacity }}
        >
          {couple.groom} &amp; {couple.bride}
          <span className="eyebrow mt-3 block text-[0.65rem] not-italic text-gold">{couple.date}</span>
        </motion.p>
        </div>
      </div>

    </section>
  );
}

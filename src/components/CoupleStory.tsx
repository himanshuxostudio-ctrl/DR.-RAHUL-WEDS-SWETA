"use client";

import { m, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/weddingData";
import { ArtPicture } from "./ui/Photo";
import { OrnamentDivider } from "./decor/Ornaments";

const { story, couple, images } = weddingData;

const ease = [0.22, 1, 0.36, 1] as const;
const film = [0.65, 0, 0.35, 1] as const;

function Half({ side }: { side: "left" | "right" }) {
  const dir = side === "left" ? -1 : 1;
  return (
    <m.div
      className="absolute inset-0 will-change-transform"
      variants={{
        hidden: { x: `${dir * 11}%`, scale: 0.94, opacity: 0 },
        show: {
          x: "0%",
          scale: 1,
          opacity: 1,
          transition: { x: { duration: 2.2, delay: 0.35, ease: film }, scale: { duration: 2.2, delay: 0.35, ease: film }, opacity: { duration: 1, delay: 0.2 } },
        },
      }}
    >
      <div
        className="absolute inset-0"
        style={{ clipPath: side === "left" ? "inset(0 calc(100% - var(--split) - 1px) 0 0)" : "inset(0 0 0 var(--split))" }}
      >
        <ArtPicture
          mobile={images.togetherMobile.id}
          desktop={images.togetherWide.id}
          alt={side === "left" ? images.togetherWide.alt : ""}
          desktopSizes="(min-width: 1280px) 960px, 76vw"
          mobileSizes="92vw"
          className="object-[50%_30%]"
        />
      </div>
    </m.div>
  );
}

/**
 * "Two Hearts, One Journey". The heading and the photograph share ONE in-view
 * trigger, so they start together the moment the section arrives: the words
 * rise, and the two halves of the back-to-back portrait (split where the
 * couple meet) drift together into a single frame.
 */
export default function CoupleStory() {
  const reduce = useReducedMotion();
  const line = (delay: number) => ({
    hidden: { y: reduce ? "0%" : "115%" },
    show: { y: "0%", transition: { duration: 1.2, delay, ease } },
  });

  return (
    <section id="story" aria-labelledby="story-heading" className="surface-maroon relative overflow-hidden pb-[var(--space-section)] pt-[calc(var(--space-section)*0.8)]">
      <m.div
        className="relative mx-auto flex max-w-[1000px] flex-col items-center px-[var(--gutter)]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      >
        <m.p className="eyebrow text-gold" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1 } } }}>
          {story.eyebrow}
        </m.p>

        <h2 id="story-heading" className="mt-5 text-center font-serif text-[2.9rem] leading-[1.02] text-ivory sm:text-6xl lg:text-7xl">
          <span className="-my-[0.2em] block overflow-hidden py-[0.2em] sm:inline-block">
            <m.span className="inline-block" variants={line(0.1)}>
              {story.titleA}
            </m.span>
          </span>{" "}
          <span className="-my-[0.2em] block overflow-hidden py-[0.2em] sm:inline-block">
            <m.span className="inline-block italic text-gold-light" variants={line(0.28)}>
              {story.titleB}
            </m.span>
          </span>
        </h2>

        <m.div className="mt-6 w-56" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1.2, delay: 0.5 } } }}>
          <OrnamentDivider className="h-8 w-56 opacity-80" animate={false} />
        </m.div>

        <div className="relative mt-10 w-full max-w-[min(960px,calc((100svh-12rem)*1.5))] [--split:57%] md:[--split:69%]">
          <div className="relative aspect-[1160/1066] w-full md:aspect-[1600/1066]">
            <Half side="left" />
            <Half side="right" />
            {/* the thin gold seam that fades as the halves meet */}
            <m.div
              aria-hidden
              className="absolute inset-y-[6%] left-[var(--split)] w-px bg-gradient-to-b from-transparent via-gold-light to-transparent"
              variants={{ hidden: { opacity: 1 }, show: { opacity: 0, transition: { duration: 0.8, delay: 2.1 } } }}
            />
            <m.div
              aria-hidden
              className="pointer-events-none absolute -inset-2 border border-gold/35 sm:-inset-3"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1.4, delay: 1.8 } } }}
            />
          </div>

          {/* captions aligned under each half */}
          <m.div
            className="mt-7 grid text-center [grid-template-columns:var(--split)_1fr]"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 1.2, delay: 1.9, ease } } }}
          >
            <div>
              <p className="eyebrow text-[0.6rem] text-gold">{story.groomLabel}</p>
              <p className="mt-1 font-serif text-2xl text-ivory sm:text-3xl">{couple.groom}</p>
            </div>
            <div>
              <p className="eyebrow text-[0.6rem] text-gold">{story.brideLabel}</p>
              <p className="mt-1 font-serif text-2xl text-ivory sm:text-3xl">{couple.bride}</p>
            </div>
          </m.div>
        </div>
      </m.div>
    </section>
  );
}

"use client";

import { m, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/weddingData";
import { CornerFlourish, LotusMark, OrnamentDivider } from "./decor/Ornaments";
import GoldDust from "./decor/GoldDust";
import Illustration from "./ui/Illustration";

const { final, couple, images } = weddingData;

const ease = [0.22, 1, 0.36, 1] as const;
const film = [0.65, 0, 0.35, 1] as const;
const CORNERS = ["left-1.5 top-1.5", "right-1.5 top-1.5 rotate-90", "right-1.5 bottom-1.5 rotate-180", "left-1.5 bottom-1.5 -rotate-90"];

/**
 * The closing — and the true end of the page. One in-view trigger plays the
 * final sequence: the gold frame draws, the illustration settles, then Thank
 * You, the message, names/date and sign-off arrive. No buttons.
 */
export default function FinalSection() {
  const reduce = useReducedMotion();
  const at = (delay: number, y = 16) => ({
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: { opacity: 1, y: 0, transition: { duration: 1.4, delay: reduce ? 0 : delay, ease } },
  });

  return (
    <m.section
      id="closing"
      aria-labelledby="thanks-heading"
      className="surface-maroon relative flex min-h-[100svh] items-center overflow-hidden px-8 py-16 sm:px-14"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      <GoldDust density={20} className="opacity-60" />

      {/* gold ornamental frame drawing in */}
      <div aria-hidden className="pointer-events-none absolute inset-3 sm:inset-6">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" fill="none">
          <m.rect
            x="0.5" y="0.5" width="99.8%" height="99.8%" stroke="var(--gold)" strokeOpacity="0.7" strokeWidth="1"
            variants={{ hidden: { pathLength: reduce ? 1 : 0 }, show: { pathLength: 1, transition: { duration: 2.4, delay: 0.2, ease: film } } }}
          />
        </svg>
        {CORNERS.map((pos) => (
          <m.div key={pos} className={`absolute ${pos} h-12 w-12 sm:h-20 sm:w-20`} variants={at(1.2, 0)}>
            <CornerFlourish className="h-full w-full" />
          </m.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-8 text-center lg:grid-cols-[auto_1fr] lg:gap-16 lg:text-left">
        <div className="flex justify-center">
          <Illustration id={images.closing.id} alt={images.closing.alt} sizes="(min-width: 1024px) 380px, 64vw" maxWidth={380} maxVh={48} delay={0.4} />
        </div>

        <div>
          <m.div variants={at(1)}>
            <LotusMark className="mx-auto mb-4 h-7 w-11 lg:mx-0" />
          </m.div>
          <m.h2 variants={at(1.1, 20)} id="thanks-heading" className="serif-display text-[3.6rem] text-ivory sm:text-7xl">
            {final.heading}
          </m.h2>
          <m.p variants={at(1.4)} className="mx-auto mt-4 max-w-xs font-serif text-lg italic leading-relaxed text-champagne lg:mx-0 lg:max-w-sm lg:text-xl">
            {final.message}
          </m.p>
          <m.div variants={at(1.8)}>
            <OrnamentDivider animate={false} className="mx-auto mt-6 h-7 w-48 opacity-70 lg:mx-0" />
            <p className="mt-4 font-serif text-2xl">
              <span className="gold-text">{couple.groom}</span> <span className="italic text-champagne">&amp;</span>{" "}
              <span className="gold-text">{couple.bride}</span>
            </p>
            <p className="eyebrow mt-2 text-[0.7rem] tracking-[0.45em] text-ivory">{couple.dateShort}</p>
          </m.div>
          <m.p variants={at(2.2)} className="mx-auto mt-4 max-w-xs font-serif text-base italic text-champagne/75 lg:mx-0">
            {final.signoff}
          </m.p>
        </div>
      </div>
    </m.section>
  );
}

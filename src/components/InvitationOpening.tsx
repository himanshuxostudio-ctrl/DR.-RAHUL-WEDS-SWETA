"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { weddingData } from "@/data/weddingData";
import GoldDust from "./decor/GoldDust";
import { CornerFlourish, LotusMark, Mandala } from "./decor/Ornaments";
import { useMusic } from "./MusicPlayer";

const ease = [0.22, 1, 0.36, 1] as const;
const film = [0.65, 0, 0.35, 1] as const;

const { couple, invitation } = weddingData;

/**
 * The royal card coming alive: frame draws, blessing, names, date — then the
 * guest opens it and the two halves swing apart like card doors.
 */
export default function InvitationOpening({ onOpen }: { onOpen: () => void }) {
  const reduce = useReducedMotion();
  const { begin } = useMusic();
  const [phase, setPhase] = useState<"card" | "opening" | "gone">("card");
  const t = (s: number) => (reduce ? 0 : s);

  useEffect(() => {
    document.body.classList.add("is-locked");
    return () => document.body.classList.remove("is-locked");
  }, []);

  const open = () => {
    if (phase !== "card") return;
    begin();
    setPhase("opening");
    window.setTimeout(onOpen, reduce ? 0 : 900);
    window.setTimeout(() => {
      document.body.classList.remove("is-locked");
      setPhase("gone");
    }, reduce ? 50 : 2300);
  };

  const fade = (delay: number, y = 18) => ({
    initial: { opacity: 0, y: reduce ? 0 : y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.4, delay: t(delay), ease },
  });

  return (
    <AnimatePresence>
      {phase !== "gone" && (
        <motion.div
          key="opening"
          role="dialog"
          aria-modal="true"
          aria-label={`${couple.title} — wedding invitation`}
          className="fixed inset-0 z-[80] overflow-hidden [perspective:1800px]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Card doors */}
          {(["left", "right"] as const).map((side) => (
            <motion.div
              key={side}
              aria-hidden
              className={`surface-maroon grain absolute top-0 h-full w-1/2 ${side === "left" ? "left-0 origin-left" : "right-0 origin-right"}`}
              animate={
                phase === "opening"
                  ? { rotateY: side === "left" ? -100 : 100, opacity: [1, 1, 0] }
                  : { rotateY: 0 }
              }
              transition={{ duration: t(1.7), delay: t(0.45), ease: film }}
            >
              <div className="jaali absolute inset-0 opacity-[0.05]" />
              <div className={`absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/70 to-transparent ${side === "left" ? "right-0" : "left-0"}`} />
            </motion.div>
          ))}

          {/* Card face */}
          <motion.div
            className="relative flex h-full w-full items-center justify-center px-6"
            animate={phase === "opening" ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }}
            transition={{ duration: t(0.7), ease }}
          >
            <GoldDust density={46} />

            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 w-[150vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.08, scale: 1 }}
              transition={{ duration: 4, ease }}
            >
              <Mandala className="animate-slow-spin h-full w-full" />
            </motion.div>

            {/* Ornamental frame */}
            <div className="absolute inset-4 sm:inset-8" aria-hidden>
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" fill="none">
                <motion.rect
                  x="0.5" y="0.5" width="99.8%" height="99.8%"
                  stroke="var(--gold)" strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: t(2.6), delay: t(0.3), ease: film }}
                />
              </svg>
              <motion.div
                className="absolute inset-2 border border-gold/35"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: t(1.6) }}
              />
              {[
                "left-0 top-0",
                "right-0 top-0 rotate-90",
                "right-0 bottom-0 rotate-180",
                "left-0 bottom-0 -rotate-90",
              ].map((pos, i) => (
                <motion.div
                  key={pos}
                  className={`absolute ${pos} h-20 w-20 sm:h-28 sm:w-28`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.6, delay: t(1.2 + i * 0.12), ease }}
                >
                  <CornerFlourish className="h-full w-full" />
                </motion.div>
              ))}
            </div>

            {/* Typography */}
            <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
              <motion.div {...fade(1.1)}>
                <LotusMark className="mx-auto mb-5 h-8 w-12" />
              </motion.div>
              <motion.p {...fade(1.5)} lang="hi" className="font-deva text-3xl text-gold-light sm:text-4xl">
                {invitation.hindiTitle}
              </motion.p>
              <motion.p {...fade(2.3)} className="eyebrow mt-6 text-champagne/80">
                {invitation.cordially}
              </motion.p>

              <h1 className="mt-8 flex flex-col items-center">
                <motion.span {...fade(3.0, 30)} className="serif-display gold-text gold-text-animate text-[3.6rem] sm:text-7xl">
                  {couple.groom}
                </motion.span>
                <motion.span {...fade(3.6)} className="my-3 font-serif text-2xl italic text-champagne/90 sm:text-3xl">
                  {invitation.weds}
                </motion.span>
                <motion.span {...fade(4.0, 30)} className="serif-display gold-text gold-text-animate text-[3.6rem] sm:text-7xl">
                  {couple.bride}
                </motion.span>
              </h1>

              <motion.div
                className="mt-9 flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: t(4.7) }}
              >
                <motion.span className="h-px w-10 origin-right bg-gold" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: t(4.8), ease }} />
                <span className="eyebrow text-[0.8rem] tracking-[0.4em] text-ivory">{couple.date}</span>
                <motion.span className="h-px w-10 origin-left bg-gold" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: t(4.8), ease }} />
              </motion.div>

              <motion.div {...fade(5.5, 12)} className="mt-12">
                <button type="button" onClick={open} className="btn-gold solid relative" autoFocus>
                  <span className="pointer-events-none absolute inset-0 rounded-full border border-gold-light [animation:pulse-ring_2.6s_ease-out_infinite]" aria-hidden />
                  {invitation.openButton}
                </button>
                <p className="mt-4 text-[0.68rem] tracking-[0.2em] text-champagne/50">♫ with music</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

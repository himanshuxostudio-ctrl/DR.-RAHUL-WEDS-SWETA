"use client";

/**
 * EXPERIMENT — envelope opening.
 *
 * A drop-in alternative to InvitationOpening (same props, same contract:
 * starts the music, locks scroll until opened, calls onOpen as the site is
 * revealed). Toggle it with ENVELOPE_OPENING in WeddingInvitation.tsx; the
 * original card opening is untouched and restored by flipping that flag.
 *
 * Sequence on tapping the seal / flap:
 *   wax seal splits → flap lifts over the top → invitation card rises out
 *   of the pocket → card and envelope dissolve into the site.
 */
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { weddingData } from "@/data/weddingData";
import GoldDust from "./decor/GoldDust";
import { LotusMark, Mandala } from "./decor/Ornaments";
import { useMusic } from "./MusicPlayer";

const ease = [0.22, 1, 0.36, 1] as const;
const film = [0.65, 0, 0.35, 1] as const;
const { couple, invitation } = weddingData;

/** Experiment-only microcopy (kept here so reverting touches no data files). */
const HINT = "Tap the seal to open";

type Phase = "sealed" | "breaking" | "lifting" | "rising" | "revealing" | "gone";
const AFTER: Record<Phase, number> = { sealed: 0, breaking: 0, lifting: 1, rising: 2, revealing: 3, gone: 4 };

/* Envelope geometry, in % of the envelope box (3:2). */
const FLAP_TIP = 57; // how far down the top flap reaches
const POCKET = `polygon(0 0, 50% ${FLAP_TIP - 3}%, 100% 0, 100% 100%, 0 100%)`;
const FLAP = `polygon(0 0, 100% 0, 50% ${FLAP_TIP}%)`;
/* The flap's lining face is pre-mirrored (it is flipped with rotateX(180)). */
const FLAP_BACK = `polygon(0 100%, 100% 100%, 50% ${100 - FLAP_TIP}%)`;

/** Wax seal: an irregular, slightly domed disc with an embossed monogram. */
function WaxSeal({ className = "" }: { className?: string }) {
  const edge = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2;
    const r = 46 + (i % 2 ? 1.8 : -1.2) + Math.sin(i * 1.7) * 1.2;
    return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#a8323f" />
          <stop offset="0.55" stopColor="#7c1a28" />
          <stop offset="1" stopColor="#4d0c17" />
        </radialGradient>
        <linearGradient id="wax-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3d99a" />
          <stop offset="0.5" stopColor="#c9a45c" />
          <stop offset="1" stopColor="#8f6a2c" />
        </linearGradient>
      </defs>
      <polygon points={edge} fill="url(#wax)" />
      <circle cx="50" cy="50" r="35" fill="none" stroke="#3c0911" strokeOpacity="0.45" strokeWidth="2.2" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="url(#wax-gold)" strokeWidth="1" strokeOpacity="0.85" />
      <circle cx="50" cy="50" r="28.5" fill="none" stroke="url(#wax-gold)" strokeWidth="0.5" strokeOpacity="0.6" strokeDasharray="1 2.2" />
      <text x="50" y="57.5" textAnchor="middle" fill="url(#wax-gold)" className="font-serif" fontSize="21" letterSpacing="1">
        R<tspan fontSize="11" dy="-3"> ✦ </tspan><tspan dy="3">S</tspan>
      </text>
      <ellipse cx="38" cy="30" rx="13" ry="6" fill="#fff" fillOpacity="0.12" transform="rotate(-28 38 30)" />
    </svg>
  );
}

export default function EnvelopeOpening({ onOpen }: { onOpen: () => void }) {
  const reduce = useReducedMotion();
  const { begin } = useMusic();
  const [phase, setPhase] = useState<Phase>("sealed");
  const [flapBehind, setFlapBehind] = useState(false);
  const [peek, setPeek] = useState(false);
  const at = (p: Phase) => AFTER[phase] >= AFTER[p] && phase !== "sealed";
  const t = (s: number) => (reduce ? 0 : s);

  useEffect(() => {
    document.body.classList.add("is-locked");
    return () => document.body.classList.remove("is-locked");
  }, []);

  const open = () => {
    if (phase !== "sealed") return;
    begin();
    if (reduce) {
      onOpen();
      setPhase("revealing");
      window.setTimeout(() => {
        document.body.classList.remove("is-locked");
        setPhase("gone");
      }, 350);
      return;
    }
    setPhase("breaking");
    const steps: [number, () => void][] = [
      [520, () => setPhase("lifting")],
      [1020, () => setFlapBehind(true)],
      [1500, () => setPhase("rising")],
      [2750, () => {
        setPhase("revealing");
        onOpen();
      }],
      [3750, () => {
        document.body.classList.remove("is-locked");
        setPhase("gone");
      }],
    ];
    steps.forEach(([ms, fn]) => window.setTimeout(fn, ms));
  };

  const intro = (delay: number, y = 14) => ({
    initial: { opacity: 0, y: reduce ? 0 : y },
    animate: at("breaking") ? { opacity: 0, y: 0 } : { opacity: 1, y: 0 },
    transition: at("breaking") ? { duration: 0.6 } : { duration: 1.3, delay: t(delay), ease },
  });

  return (
    <AnimatePresence>
      {phase !== "gone" && (
        <m.div
          key="envelope"
          role="dialog"
          aria-modal="true"
          aria-label={`${couple.title} — wedding invitation`}
          className="surface-maroon grain fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden px-6"
          animate={{ opacity: phase === "revealing" ? 0 : 1 }}
          transition={{ duration: t(1), delay: t(0.2), ease }}
        >
          <GoldDust density={36} />
          <m.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 w-[150vmin] -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.07, scale: 1 }}
            transition={{ duration: 4, ease }}
          >
            <Mandala className="animate-slow-spin h-full w-full" />
          </m.div>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_55%,rgba(201,164,92,0.14),transparent_70%)]" />

          <m.p {...intro(0.3)} className="eyebrow relative mb-[clamp(1.5rem,5svh,3rem)] text-center text-champagne/80">
            {invitation.cordially}
          </m.p>

          {/* ── The envelope ─────────────────────────────────────────── */}
          <m.div
            className="relative aspect-[3/2] w-[min(88vw,600px,calc(56svh*1.5))]"
            initial={{ opacity: 0, y: reduce ? 0 : 26, scale: reduce ? 1 : 0.97 }}
            animate={
              at("revealing")
                ? { opacity: 0, y: 70, scale: 0.96 }
                : { opacity: 1, y: at("rising") ? "14%" : 0, scale: 1 }
            }
            transition={
              at("revealing")
                ? { duration: t(0.9), ease }
                : at("rising")
                  ? { duration: t(1.1), ease: film }
                  : { duration: 1.4, delay: t(0.5), ease }
            }
          >
            {/* soft cast shadow */}
            <div aria-hidden className="absolute inset-x-[4%] -bottom-[7%] h-[14%] rounded-[50%] bg-black/45 blur-xl" />

            {/* back of the envelope (inside) */}
            <div aria-hidden className="absolute inset-0 rounded-[3px] bg-[linear-gradient(180deg,#e6d4b6,#dcc6a2)]" />

            {/* the invitation card inside */}
            <m.div
              aria-hidden
              className="surface-maroon absolute inset-x-[5%] top-[4%] z-10 h-[92%] overflow-hidden rounded-[2px] shadow-[0_-6px_18px_rgba(40,8,14,0.35)]"
              animate={
                at("revealing")
                  ? { y: "-56%", scale: 1.08, opacity: 0 }
                  : { y: at("rising") ? "-56%" : 0, scale: 1, opacity: 1 }
              }
              transition={at("revealing") ? { duration: t(0.9), ease } : { duration: t(1.2), ease: film }}
            >
              <div className="absolute inset-[4%] border border-gold/45" />
              <div className="absolute inset-[6%] border border-gold/20" />
              <div className="relative flex h-[56%] flex-col items-center justify-center px-4 text-center">
                <LotusMark className="mb-[3%] h-[12%] w-auto" />
                <p lang="hi" className="font-deva text-[clamp(0.95rem,3.6vw,1.45rem)] leading-tight text-gold-light">
                  {invitation.hindiTitle}
                </p>
                <p className="serif-display gold-text mt-[2%] text-[clamp(1.35rem,6vw,2.4rem)] leading-none">
                  {couple.groom} <span className="font-serif text-[0.55em] italic text-champagne">&amp;</span> {couple.bride}
                </p>
                <p className="eyebrow mt-[3%] text-[clamp(0.5rem,1.9vw,0.68rem)] text-ivory/85">{couple.date}</p>
              </div>
            </m.div>

            {/* front pocket */}
            <div aria-hidden className="absolute inset-0 z-20" style={{ clipPath: POCKET }}>
              <div className="absolute inset-0 rounded-[3px] bg-[linear-gradient(170deg,#f7eddb_0%,#efe1c8_55%,#e7d5b6_100%)]" />
              <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none">
                <path d="M0 200 L128 118 M300 200 L172 118" stroke="#b89a66" strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d={`M0 0 L150 ${(FLAP_TIP - 3) * 2} L300 0`} stroke="#b08c4a" strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <rect x="8" y="8" width="284" height="184" stroke="#c9a45c" strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
              <div className="absolute inset-x-0 bottom-[9%] text-center">
                <p className="font-serif text-[clamp(0.95rem,3.7vw,1.35rem)] italic leading-none text-wine/80">
                  {couple.groom} &amp; {couple.bride}
                </p>
                <p className="eyebrow mt-[0.4em] text-[clamp(0.45rem,1.6vw,0.6rem)] text-gold-deep/80">{couple.dateShort}</p>
              </div>
            </div>

            {/* the flap's shadow on the pocket (fades as it lifts) */}
            <m.div
              aria-hidden
              className="absolute inset-0 z-[25] translate-y-[3px] bg-[#6b4a22]/25 blur-[3px]"
              style={{ clipPath: FLAP }}
              animate={{ opacity: at("lifting") ? 0 : 1 }}
              transition={{ duration: t(0.4) }}
            />

            {/* top flap — ivory face, maroon jaali lining */}
            <m.div
              aria-hidden
              className="absolute inset-0 [transform-style:preserve-3d]"
              style={{ transformOrigin: "50% 0%", transformPerspective: 1400, zIndex: flapBehind ? 5 : 30 }}
              animate={{ rotateX: at("lifting") ? 180 : peek ? 9 : 0 }}
              transition={at("lifting") ? { duration: t(1.05), ease: film } : { duration: 0.6, ease }}
            >
              <div className="absolute inset-0 [backface-visibility:hidden]" style={{ clipPath: FLAP }}>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,#f8efdf_0%,#f0e3cb_70%,#e8d7ba_100%)]" />
                <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none">
                  <path d={`M12 8 L150 ${FLAP_TIP * 2 - 12} L288 8`} stroke="#c9a45c" strokeOpacity="0.6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]" style={{ clipPath: FLAP_BACK }}>
                <div className="surface-maroon absolute inset-0" />
                <div className="jaali absolute inset-0 opacity-[0.14]" />
              </div>
            </m.div>

            {/* wax seal — splits in two as the envelope is opened */}
            <div className="pointer-events-none absolute left-1/2 z-40 w-[21%] -translate-x-1/2 -translate-y-1/2" style={{ top: `${FLAP_TIP - 6}%` }}>
              {(["left", "right"] as const).map((half) => (
                <m.div
                  key={half}
                  className="absolute inset-0"
                  style={{ clipPath: half === "left" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" }}
                  animate={
                    at("breaking")
                      ? { x: half === "left" ? "-18%" : "18%", y: "30%", rotate: half === "left" ? -16 : 16, opacity: 0 }
                      : { x: 0, y: 0, rotate: 0, opacity: 1 }
                  }
                  transition={{ duration: t(0.75), ease: film }}
                >
                  <WaxSeal className="h-full w-full drop-shadow-[0_4px_6px_rgba(40,6,12,0.5)]" />
                </m.div>
              ))}
              <div className="aspect-square w-full" />
              {phase === "sealed" && (
                <span aria-hidden className="absolute inset-[4%] rounded-full border border-gold-light/70 [animation:pulse-ring_2.8s_ease-out_infinite]" />
              )}
            </div>

            {/* hit area: the flap and seal */}
            <m.button
              type="button"
              aria-label={invitation.openButton}
              autoFocus
              disabled={phase !== "sealed"}
              onClick={open}
              onPointerEnter={() => setPeek(true)}
              onPointerLeave={() => setPeek(false)}
              className="group absolute inset-x-0 top-0 z-50 h-[62%] cursor-pointer rounded-sm !outline-none disabled:cursor-default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: t(1.2) }}
            >
              <span aria-hidden className="absolute left-1/2 top-[82%] hidden aspect-square w-[25%] -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-gold-light/80 group-focus-visible:block" />
            </m.button>
          </m.div>

          <m.p {...intro(1.6, 8)} aria-hidden className="eyebrow relative mt-[clamp(1.75rem,6svh,3.5rem)] text-[0.62rem] text-gold/85">
            {HINT}
          </m.p>
        </m.div>
      )}
    </AnimatePresence>
  );
}

"use client";

/**
 * EXPERIMENT — royal envelope opening.
 *
 * A drop-in alternative to InvitationOpening (same props, same contract:
 * starts the music, locks scroll until opened, calls onOpen as the site is
 * revealed). Toggle it with ENVELOPE_OPENING in WeddingInvitation.tsx; the
 * original card opening is untouched and restored by flipping that flag.
 *
 * The envelope: ivory handmade paper with gold foil rims and borders, the
 * Ganesh mark and the Vakratunda shloka printed in kumkum ink on the flap,
 * the couple's names on the pocket, and a pressed maroon wax seal (S ✦ R).
 *
 * Sequence on tapping the seal / flap:
 *   seal presses and breaks → flap lifts slowly over the top (maroon jaali
 *   lining) → ivory invitation card rises out → everything dissolves into
 *   the site.
 *
 * All sizes inside the envelope are in container units (cqw), so the whole
 * design scales as one piece on every screen.
 */
import type { CSSProperties } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { getImage } from "@/data/weddingData";
import { useT, useWedding } from "@/i18n/LanguageProvider"; // HINDI EXPERIMENT
import GoldDust from "./decor/GoldDust";
import { BotanicalLine, FloralCluster, GarlandArc } from "./decor/florals";
import { CornerFlourish, LotusMark, Mandala } from "./decor/Ornaments";
import { useMusic } from "./MusicPlayer";

const ease = [0.22, 1, 0.36, 1] as const;
const film = [0.65, 0, 0.35, 1] as const;


type Phase = "sealed" | "breaking" | "lifting" | "rising" | "revealing" | "gone";
const ORDER: Record<Phase, number> = { sealed: 0, breaking: 1, lifting: 2, rising: 3, revealing: 4, gone: 5 };

/* Envelope geometry (% of the envelope box). --tip is set per breakpoint. */
const FLAP = "polygon(0 0, 100% 0, 50% var(--tip))";
const FLAP_FACE = "polygon(0.9% 0, 99.1% 0, 50% calc(var(--tip) - 1.2%))";
const FLAP_LINE = "polygon(5% 2.6%, 95% 2.6%, 50% calc(var(--tip) - 6%))";
const FLAP_INNER = "polygon(5.7% 3.1%, 94.3% 3.1%, 50% calc(var(--tip) - 6.9%))";
/* the lining face is pre-mirrored (it is flipped with rotateX(180)) */
const FLAP_BACK = "polygon(0 100%, 100% 100%, 50% calc(100% - var(--tip)))";
const POCKET = "polygon(0 0, 50% calc(var(--tip) - 3%), 100% 0, 100% 100%, 0 100%)";
const POCKET_FACE = "polygon(0 0.8%, 50% calc(var(--tip) - 2%), 100% 0.8%, 100% 100%, 0 100%)";

const PAPER = "linear-gradient(172deg,#fbf4e6 0%,#f4e8d2 55%,#ecdcc0 100%)";
const FLAP_PAPER = "linear-gradient(180deg,#fcf6ea 0%,#f5ead6 65%,#ecdfc6 100%)";
const FOIL = "linear-gradient(115deg,#9a7639 0%,#e8d3a0 30%,#c9a45c 52%,#f0dfb0 70%,#9a7639 100%)";
const INK = "#8e2a35";

/** Floral colours for the ambient garlands (maroon surface). */
const FLORALS = {
  "--fl-marigold": "#cf8f36",
  "--fl-marigold-2": "#b77a2c",
  "--fl-marigold-core": "#8a4f1c",
  "--fl-jasmine": "#f3e8d6",
  "--fl-jasmine-line": "rgba(201,164,92,0.55)",
  "--fl-jasmine-core": "#d9b25e",
  "--fl-rose": "#a45862",
  "--fl-rose-line": "#743840",
  "--fl-leaf": "#6d7a4c",
  "--fl-leaf-line": "#56623b",
  "--fl-thread": "#c9a45c",
  "--fl-gold": "#b8924e",
} as CSSProperties;

const PETALS = [
  { left: "8%", size: 11, dur: 26, delay: -4, colour: "#e0a04a" },
  { left: "24%", size: 8, dur: 31, delay: -17, colour: "#f6ecdc" },
  { left: "41%", size: 13, dur: 36, delay: -25, colour: "#e0a04a", soft: true },
  { left: "63%", size: 9, dur: 28, delay: -9, colour: "#d9a99a" },
  { left: "79%", size: 10, dur: 33, delay: -21, colour: "#f6ecdc" },
  { left: "92%", size: 8, dur: 29, delay: -2, colour: "#e0a04a" },
];

/** Printed ink mark (Ganesh, shloka): an alpha mask tinted with kumkum ink. */
function InkMark({ id, className, style }: { id: "decor/ganesh-mark" | "decor/shloka-mark"; className: string; style?: CSSProperties }) {
  const img = getImage(id);
  const mask = `url(${img.src})`;
  return (
    // a hairline highlight under the ink reads as a light letterpress
    <div aria-hidden className={`absolute drop-shadow-[0_0.6px_0_rgba(255,255,255,0.7)] ${className}`} style={style}>
      <div
        className="h-full w-full"
        style={{
          aspectRatio: `${img.width} / ${img.height}`,
          background: INK,
          opacity: 0.9,
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </div>
  );
}

/** Wax seal: an organic poured-wax edge, a pressed inner disc, a gold-leaf ring and the monogram. */
function WaxSeal({ className = "" }: { className?: string }) {
  const edge = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const r = 45.5 + Math.sin(a * 7 + 0.6) * 1.6 + Math.sin(a * 13 + 2) * 0.9 + Math.sin(a * 3) * 1.1;
    return `${(50 + Math.cos(a) * r).toFixed(2)},${(50 + Math.sin(a) * r).toFixed(2)}`;
  }).join(" ");
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id="seal-wax" cx="36%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ad3443" />
          <stop offset="0.5" stopColor="#801b2a" />
          <stop offset="1" stopColor="#4a0b16" />
        </radialGradient>
        <radialGradient id="seal-press" cx="60%" cy="66%" r="70%">
          <stop offset="0" stopColor="#8a2130" />
          <stop offset="1" stopColor="#5e1020" />
        </radialGradient>
        <linearGradient id="seal-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e2ad" />
          <stop offset="0.45" stopColor="#d2ae66" />
          <stop offset="1" stopColor="#8d672b" />
        </linearGradient>
      </defs>
      {/* poured wax */}
      <polygon points={edge} fill="url(#seal-wax)" />
      <polygon points={edge} fill="none" stroke="#3a0710" strokeOpacity="0.35" strokeWidth="0.8" />
      {/* pressed disc with an inner shadow rim */}
      <circle cx="50" cy="50" r="34" fill="url(#seal-press)" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#2f050c" strokeOpacity="0.5" strokeWidth="1.6" />
      <circle cx="50.6" cy="50.8" r="33.2" fill="none" stroke="#c0505e" strokeOpacity="0.35" strokeWidth="0.7" />
      {/* gold-leaf ring of petals */}
      <circle cx="50" cy="50" r="29.5" fill="none" stroke="url(#seal-gold)" strokeWidth="0.9" />
      {petals.map((deg) => (
        <path key={deg} d="M50 21.6 Q51.7 24.3 50 26.4 Q48.3 24.3 50 21.6Z" fill="url(#seal-gold)" opacity="0.9" transform={`rotate(${deg} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="22" fill="none" stroke="url(#seal-gold)" strokeWidth="0.45" strokeOpacity="0.8" />
      {/* monogram */}
      <text x="50" y="57" textAnchor="middle" fill="url(#seal-gold)" className="font-serif" fontSize="17.5" letterSpacing="0.6">
        S<tspan fontSize="8.5" dy="-3.4"> ✦ </tspan>
        <tspan dy="3.4">R</tspan>
      </text>
      <path d="M44 39.5 Q50 35 56 39.5" fill="none" stroke="url(#seal-gold)" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M44 61 Q50 65.5 56 61" fill="none" stroke="url(#seal-gold)" strokeWidth="0.6" strokeLinecap="round" />
      {/* wax sheen */}
      <ellipse cx="36" cy="27" rx="14" ry="5.5" fill="#fff" fillOpacity="0.14" transform="rotate(-30 36 27)" />
      <ellipse cx="68" cy="75" rx="9" ry="3" fill="#fff" fillOpacity="0.05" transform="rotate(-30 68 75)" />
    </svg>
  );
}

export default function EnvelopeOpening({ onOpen }: { onOpen: () => void }) {
  const reduce = useReducedMotion();
  const { begin } = useMusic();
  const { couple, invitation } = useWedding();
  const tr = useT();
  const [phase, setPhase] = useState<Phase>("sealed");
  const [flapBehind, setFlapBehind] = useState(false);
  const [peek, setPeek] = useState(false);
  const at = (p: Phase) => ORDER[phase] >= ORDER[p];
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
      [750, () => setPhase("lifting")],
      [1420, () => setFlapBehind(true)],
      [2050, () => setPhase("rising")],
      [3550, () => {
        setPhase("revealing");
        onOpen();
      }],
      [4650, () => {
        document.body.classList.remove("is-locked");
        setPhase("gone");
      }],
    ];
    steps.forEach(([ms, fn]) => window.setTimeout(fn, ms));
  };

  const intro = (delay: number, y = 14) => ({
    initial: { opacity: 0, y: reduce ? 0 : y },
    animate: at("breaking") ? { opacity: 0, y: 0 } : { opacity: 1, y: 0 },
    transition: at("breaking") ? { duration: 0.7 } : { duration: 1.4, delay: t(delay), ease },
  });

  return (
    <AnimatePresence>
      {phase !== "gone" && (
        <m.div
          key="envelope"
          role="dialog"
          aria-modal="true"
          aria-label={tr.invitationDialog(couple.title)}
          className="surface-maroon grain fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden px-6"
          animate={{ opacity: phase === "revealing" ? 0 : 1 }}
          transition={{ duration: t(1.1), delay: t(0.2), ease }}
        >
          {/* ── Atmosphere ───────────────────────────────────────────── */}
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
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_52%,rgba(201,164,92,0.16),transparent_70%)]" />
          <m.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={FLORALS}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.4, delay: t(0.8) }}
          >
            <div className="atm-sway absolute -left-[6%] -top-2 w-[58%] opacity-45 sm:w-[34%]">
              <GarlandArc sag={44} count={13} size={20} />
            </div>
            <div className="atm-sway absolute -right-[8%] -top-3 w-[50%] opacity-35 sm:w-[30%]" style={{ animationDelay: "-4s" }}>
              <GarlandArc sag={34} count={11} size={18} />
            </div>
            <div className="atm-float absolute -bottom-6 -left-8 w-40 rotate-[6deg] opacity-40 sm:w-56">
              <FloralCluster />
            </div>
            <div className="atm-float absolute -bottom-5 -right-10 hidden w-44 -rotate-[8deg] opacity-30 sm:block" style={{ animationDelay: "-6s" }}>
              <FloralCluster variant={1} />
            </div>
            {PETALS.map((p, i) => (
              <span
                key={i}
                className={`petal absolute -top-6 ${p.soft ? "petal-soft" : ""}`}
                style={{ left: p.left, width: p.size, height: p.size * 1.35, background: p.colour, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
              />
            ))}
          </m.div>

          <m.p {...intro(0.3)} className="eyebrow relative mb-[clamp(1.25rem,4.5svh,2.75rem)] text-center text-champagne/85">
            {invitation.cordially}
          </m.p>

          {/* ── The envelope ─────────────────────────────────────────── */}
          <m.div
            className="@container relative aspect-[5/6] w-[min(88vw,400px,calc(60svh*5/6))] [--tip:56%] sm:aspect-[4/3] sm:w-[min(80vw,580px,calc(64svh*4/3))] sm:[--tip:55%]"
            initial={{ opacity: 0, y: reduce ? 0 : 26, scale: reduce ? 1 : 0.97 }}
            animate={
              at("revealing")
                ? { opacity: 0, y: 80, scale: 0.96 }
                : { opacity: 1, y: at("rising") ? "15%" : 0, scale: 1 }
            }
            transition={
              at("revealing")
                ? { duration: t(1), ease }
                : at("rising")
                  ? { duration: t(1.4), ease: film }
                  : { duration: 1.5, delay: t(0.5), ease }
            }
          >
            {/* soft cast shadow */}
            <div aria-hidden className="absolute inset-x-[5%] -bottom-[6%] h-[12%] rounded-[50%] bg-black/50 blur-xl" />

            {/* inside of the envelope: maroon jaali lining */}
            <div aria-hidden className="surface-maroon absolute inset-0 overflow-hidden rounded-[3px]">
              <div className="jaali absolute inset-0 opacity-[0.22]" />
            </div>

            {/* the invitation card inside (ivory, printed in maroon & gold) */}
            <m.div
              aria-hidden
              className="absolute inset-x-[5%] top-[4%] z-10 h-[92%] overflow-hidden rounded-[2px] bg-[linear-gradient(180deg,#fdf8ee,#f6ecda)] shadow-[0_-6px_22px_rgba(30,4,10,0.45)]"
              animate={
                at("revealing")
                  ? { y: "-58%", scale: 1.06, opacity: 0 }
                  : { y: at("rising") ? "-58%" : 0, scale: 1, opacity: 1 }
              }
              transition={at("revealing") ? { duration: t(1), ease } : { duration: t(1.5), ease: film }}
            >
              <div className="absolute inset-[3.5%] border border-gold/60" />
              <div className="absolute inset-[5%] border border-gold/30" />
              <div className="relative flex h-[54%] flex-col items-center justify-center px-[8%] text-center">
                <p className="font-sans font-semibold uppercase tracking-[0.34em] text-[2.3cqw] text-gold-deep sm:text-[1.55cqw]">{tr.envelopeBlessings}</p>
                <LotusMark tone="wine" className="my-[3%] h-[3.6cqw] w-auto opacity-80 sm:h-[2.6cqw]" />
                <p className="serif-display text-[8.4cqw] leading-none text-wine sm:text-[5.6cqw]">{couple.bride}</p>
                <p className="my-[1.5%] font-serif text-[4cqw] italic text-gold-deep sm:text-[2.7cqw]">{invitation.weds}</p>
                <p className="serif-display text-[8.4cqw] leading-none text-wine sm:text-[5.6cqw]">{couple.groom}</p>
                <p className="font-sans font-semibold uppercase tracking-[0.34em] mt-[4%] text-[2.4cqw] text-ink-soft sm:text-[1.6cqw]">{couple.date}</p>
              </div>
            </m.div>

            {/* ── front pocket: foil rim, paper, borders, names ── */}
            <div aria-hidden className="absolute inset-0 z-20" style={{ clipPath: POCKET }}>
              <div className="absolute inset-0 rounded-[3px]" style={{ background: FOIL }} />
              <div className="grain absolute inset-0 rounded-[3px]" style={{ clipPath: POCKET_FACE, background: PAPER }}>
                <div className="jaali absolute inset-0 opacity-[0.06]" />
                {/* double gold border + corner ornaments */}
                <div className="absolute inset-[3.2%] border border-gold/55" />
                <div className="absolute inset-[4.6%] border border-gold/25" />
                <CornerFlourish className="absolute bottom-[5.2%] left-[5.2%] h-[11cqw] w-[11cqw] -rotate-90 opacity-70 sm:h-[7.5cqw] sm:w-[7.5cqw]" />
                <CornerFlourish className="absolute bottom-[5.2%] right-[5.2%] h-[11cqw] w-[11cqw] rotate-180 opacity-70 sm:h-[7.5cqw] sm:w-[7.5cqw]" />
                {/* faint botanical sprigs */}
                <div className="absolute bottom-[9%] left-[6%] w-[19%] opacity-[0.28] sm:w-[15%]" style={FLORALS}>
                  <BotanicalLine />
                </div>
                <div className="absolute bottom-[9%] right-[6%] w-[19%] -scale-x-100 opacity-[0.28] sm:w-[15%]" style={FLORALS}>
                  <BotanicalLine />
                </div>
                {/* printed wording */}
                <div className="absolute inset-x-0 bottom-[7.5%] flex flex-col items-center text-center">
                  <p lang="hi" className="font-deva text-[4cqw] leading-[1.5] sm:text-[2.8cqw]" style={{ color: INK }}>
                    {invitation.hindiTitle}
                  </p>
                  <p className="serif-display mt-[0.4em] text-[7.4cqw] leading-[0.95] text-wine sm:text-[4.9cqw]">{couple.bride}</p>
                  <p className="font-serif text-[3.9cqw] italic leading-[1.35] text-gold-deep sm:text-[2.6cqw]">{invitation.weds}</p>
                  <p className="serif-display text-[7.4cqw] leading-[0.95] text-wine sm:text-[4.9cqw]">{couple.groom}</p>
                  <div className="mt-[0.9em] flex items-center gap-[1.5cqw] sm:mt-[0.8em]">
                    <span className="h-px w-[6cqw] bg-gold/70 sm:w-[4cqw]" />
                    <p className="font-sans font-semibold uppercase tracking-[0.34em] text-[2.4cqw] text-gold-deep sm:text-[1.65cqw]">{couple.date}</p>
                    <span className="h-px w-[6cqw] bg-gold/70 sm:w-[4cqw]" />
                  </div>
                </div>
              </div>
            </div>

            {/* the flap's shadow on the pocket (fades as it lifts) */}
            <m.div
              aria-hidden
              className="absolute inset-0 z-[25] translate-y-[3px] bg-[#5a3a18]/30 blur-[3px]"
              style={{ clipPath: FLAP }}
              animate={{ opacity: at("lifting") ? 0 : 1 }}
              transition={{ duration: t(0.5) }}
            />

            {/* ── top flap: foil rim, paper, Ganesh + shloka; jaali lining behind ── */}
            <m.div
              aria-hidden
              className="absolute inset-0 [transform-style:preserve-3d]"
              style={{ transformOrigin: "50% 0%", transformPerspective: 1500, zIndex: flapBehind ? 5 : 30 }}
              animate={{ rotateX: at("lifting") ? 180 : peek ? 7 : 0 }}
              transition={at("lifting") ? { duration: t(1.4), ease: film } : { duration: 0.7, ease }}
            >
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <div className="absolute inset-0" style={{ clipPath: FLAP, background: FOIL }} />
                <div className="grain absolute inset-0" style={{ clipPath: FLAP_FACE, background: FLAP_PAPER }}>
                  <div className="jaali absolute inset-0 opacity-[0.05]" />
                </div>
                <div className="absolute inset-0" style={{ clipPath: FLAP_LINE, background: FOIL, opacity: 0.55 }} />
                <div className="absolute inset-0" style={{ clipPath: FLAP_INNER, background: FLAP_PAPER }} />
                {/* printed: Ganesh mark, then the shloka */}
                <InkMark id="decor/ganesh-mark" className="left-1/2 top-[5.5%] h-[11.5%] -translate-x-1/2 sm:top-[5%] sm:h-[12%]" />
                <InkMark id="decor/shloka-mark" className="left-1/2 top-[19.5%] w-[44%] -translate-x-1/2 sm:top-[19%] sm:w-[40%]" />
              </div>
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]" style={{ clipPath: FLAP_BACK }}>
                <div className="surface-maroon absolute inset-0" />
                <div className="jaali absolute inset-0 opacity-[0.25]" />
              </div>
            </m.div>

            {/* ── wax seal: glows on hover, presses, then breaks and falls away ── */}
            <m.div
              className="pointer-events-none absolute left-1/2 z-40 w-[25%] -translate-x-1/2 -translate-y-1/2 sm:w-[18.5%]"
              style={{ top: "45.5%" }}
              animate={{ scale: phase === "breaking" ? [1, 0.95, 1.03] : peek && phase === "sealed" ? 1.04 : 1 }}
              transition={{ duration: phase === "breaking" ? t(0.35) : 0.5, ease }}
            >
              <div
                aria-hidden
                className="absolute -inset-[18%] rounded-full bg-[radial-gradient(closest-side,rgba(232,211,160,0.4),transparent)] transition-opacity duration-700"
                style={{ opacity: phase === "sealed" ? (peek ? 1 : 0.55) : 0 }}
              />
              {(["left", "right"] as const).map((half) => (
                <m.div
                  key={half}
                  className="absolute inset-0"
                  style={{
                    clipPath:
                      half === "left"
                        ? "polygon(-30% -30%, 54% -30%, 54% 0, 47% 38%, 53% 62%, 46% 100%, 46% 130%, -30% 130%)"
                        : "polygon(54% -30%, 130% -30%, 130% 130%, 46% 130%, 46% 100%, 53% 62%, 47% 38%, 54% 0)",
                  }}
                  animate={
                    at("breaking")
                      ? { x: half === "left" ? "-16%" : "16%", y: "42%", rotate: half === "left" ? -18 : 18, opacity: 0 }
                      : { x: 0, y: 0, rotate: 0, opacity: 1 }
                  }
                  transition={{ duration: t(0.95), delay: t(0.28), ease: film }}
                >
                  <WaxSeal className="h-full w-full drop-shadow-[0_5px_7px_rgba(40,6,12,0.55)]" />
                </m.div>
              ))}
              <div className="aspect-square w-full" />
              {phase === "sealed" && (
                <span aria-hidden className="absolute inset-[3%] rounded-full border border-gold-light/70 [animation:pulse-ring_3s_ease-out_infinite]" />
              )}
            </m.div>

            {/* hit area: the flap and seal */}
            <m.button
              type="button"
              aria-label={invitation.openButton}
              autoFocus
              disabled={phase !== "sealed"}
              onClick={open}
              onPointerEnter={() => setPeek(true)}
              onPointerLeave={() => setPeek(false)}
              className="group absolute inset-x-0 top-0 z-50 h-[64%] cursor-pointer rounded-sm !outline-none disabled:cursor-default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: t(1.2) }}
            />
          </m.div>

          <m.p {...intro(1.6, 8)} aria-hidden className="eyebrow relative mt-[clamp(1.5rem,5svh,3rem)] text-[0.62rem] text-gold/90">
            {tr.envelopeHint}
          </m.p>
        </m.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import SectionBridge from "./decor/SectionBridge";
import { m } from "framer-motion";
import { weddingData } from "@/data/weddingData";
import CalendarButton from "./CalendarButton";
import MapButton from "./MapButton";
import { ArchOutline, LotusMark } from "./decor/Ornaments";
import { Reveal, RevealWords } from "./ui/Reveal";

const { venue, events } = weddingData;
const vivah = events.filter((e) => e.theme === "vivah");

const film = [0.65, 0, 0.35, 1] as const;

/** Stylised (not-to-scale) map: roads, SH 90 and an animated route to the pin. */
function IllustratedMap() {
  const view = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-15% 0px" } } as const;
  return (
    <m.svg viewBox="0 0 360 440" className="h-full w-full" role="img" aria-label={`Illustrated map to ${venue.name}`} {...view}>
      <rect width="360" height="440" fill="#f6ead8" />
      <g stroke="#e3cfae" strokeWidth="1">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 40} H360`} opacity="0.5" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 40} 0 V440`} opacity="0.5" />
        ))}
      </g>
      {/* local streets */}
      <g stroke="#dcc39c" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M-10 120 C80 130 120 90 200 110 S320 150 370 130" />
        <path d="M60 -10 C70 100 50 200 90 300 S120 420 110 450" />
        <path d="M250 -10 C240 80 280 160 260 260 S300 380 290 450" />
        <path d="M-10 330 C100 320 200 360 370 330" />
      </g>
      {/* SH 90 */}
      <path d="M-10 250 C90 230 150 270 230 230 S330 200 370 215" stroke="#caa56a" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M-10 250 C90 230 150 270 230 230 S330 200 370 215" stroke="#f6ead8" strokeWidth="1" strokeDasharray="6 8" fill="none" />
      <g fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="2" fill="#8a6a3b">
        <text x="24" y="232" fontSize="10">SH 90</text>
        <text x="30" y="98" fontSize="8" opacity="0.8">PRABHUNATH NAGAR</text>
        <text x="236" y="316" fontSize="8" opacity="0.8">RATANPURA</text>
      </g>
      {/* animated route */}
      <m.path
        d="M20 420 C60 380 80 330 92 300 C104 270 130 255 175 250 C205 246 222 238 236 224"
        stroke="var(--wine)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 2.6, delay: 0.4, ease: film } } }}
      />
      <circle cx="20" cy="420" r="4" fill="var(--wine)" />
      {/* pin */}
      <m.g variants={{ hidden: { opacity: 0, y: -20 }, show: { opacity: 1, y: 0, transition: { delay: 2.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}>
        <circle cx="240" cy="220" r="10" fill="var(--gold)" opacity="0.35" className="origin-[240px_220px] [animation:pulse-ring_2.4s_ease-out_infinite]" />
        <path d="M240 222 C230 206 222 198 222 188 A18 18 0 0 1 258 188 C258 198 250 206 240 222Z" fill="var(--wine)" stroke="var(--gold)" strokeWidth="1.5" />
        <circle cx="240" cy="188" r="6" fill="var(--gold-light)" />
        <text x="240" y="168" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="17" fontStyle="italic" fill="var(--wine)">
          {venue.name}
        </text>
      </m.g>
    </m.svg>
  );
}

export default function VenueSection() {
  return (
    <section id="venue" aria-labelledby="venue-heading" className="grain relative overflow-hidden py-[var(--space-section)]" style={{ background: "linear-gradient(180deg,#f3e5d1,#ead6ba)" }}>
      <SectionBridge from="var(--deep-maroon)" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-[var(--gutter)] md:grid-cols-[1.05fr_1fr] md:gap-20">
        <div className="relative mx-auto w-full max-w-[360px] md:order-2">
          {/* outline wraps the map only, so the two arches line up exactly */}
          <div className="relative">
            <div className="relative aspect-[9/11] w-full overflow-hidden [clip-path:url(#arch-clip)]">
              <IllustratedMap />
            </div>
            <ArchOutline tone="wine" className="pointer-events-none absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] opacity-70" />
          </div>
          <p className="eyebrow mt-6 text-center text-[0.58rem] text-ink-soft/70">Illustration · not to scale</p>
        </div>

        <div className="text-center md:order-1 md:text-left">
          <Reveal>
            <LotusMark tone="wine" className="mx-auto mb-5 h-7 w-11 md:mx-0" />
            <p className="eyebrow text-gold-deep">{venue.eyebrow}</p>
          </Reveal>
          <h2 id="venue-heading" className="serif-display mt-4 text-[3.6rem] text-wine sm:text-8xl">
            <RevealWords text={venue.name} />
          </h2>
          <Reveal delay={0.2}>
            <address className="mt-6 font-serif text-[1.35rem] not-italic leading-snug text-ink">
              {venue.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <p className="eyebrow mt-5 text-[0.65rem] text-ink-soft">{vivah[0].name} · {vivah[0].date} · {vivah[0].time}</p>
          </Reveal>
          <Reveal delay={0.3} className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start">
            <MapButton href={venue.mapsUrl} label={venue.directionsLabel} solid />
            <CalendarButton events={vivah} variant="light" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

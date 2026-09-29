"use client";

import { m, useReducedMotion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { weddingData, type WeddingEvent } from "@/data/weddingData";
import CalendarButton from "./CalendarButton";
import MapButton from "./MapButton";
import { CornerFlourish } from "./decor/Ornaments";
import WeddingAtmosphere from "./decor/WeddingAtmosphere";
import SectionBridge from "./decor/SectionBridge";
import Illustration from "./ui/Illustration";

const { celebrations, events, venue, images } = weddingData;
const vivah = events.find((e) => e.theme === "vivah")!;
const ease = [0.22, 1, 0.36, 1] as const;
// Fires as soon as the block's top edge is on screen — independent of block height.
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } } as const;

const iconBtn =
  "grid h-11 w-11 place-items-center rounded-full border border-gold/50 text-gold-light transition hover:border-gold-light hover:bg-gold/10 active:scale-95";

function EventTile({ ev, featured }: { ev: WeddingEvent; featured: boolean }) {
  return (
    <li
      id={ev.id}
      className={`relative flex items-center gap-4 border px-5 py-3 text-left sm:flex-col sm:items-center sm:gap-3 sm:py-7 sm:text-center ${
        featured ? "border-gold/60 bg-gold/[0.06]" : "border-gold/25"
      }`}
    >
      <div className="w-[5.6rem] shrink-0 sm:w-auto">
        <p className="eyebrow text-[0.55rem] text-gold/80">{ev.index}</p>
        <p className={`mt-0.5 font-serif text-[1.65rem] leading-none ${featured ? "gold-text" : "text-ivory"}`}>{ev.name}</p>
        <p lang="hi" className="font-deva mt-0.5 text-sm leading-[1.7] text-gold-light">
          {ev.nameHindi}
        </p>
      </div>
      <div className="min-w-0 flex-1 text-[0.8rem] leading-relaxed text-champagne/80 sm:flex-none">
        <p className="text-ivory">
          {ev.date.replace(" 2026", "")} · {ev.weekday}
        </p>
        <p>{ev.time}</p>
        <p>
          {ev.venue}, {ev.location.replace(", Bihar", "")}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {ev.mapsUrl && (
          <a href={ev.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Directions to ${ev.name} (opens Google Maps)`} className={iconBtn}>
            <MapPin className="h-4 w-4" aria-hidden />
          </a>
        )}
        <CalendarButton events={[ev]} compact />
      </div>
    </li>
  );
}

export default function CelebrationSection() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: reduce ? 0 : delay, ease } },
  });
  const [day, month, year] = vivah.date.split(" ");

  return (
    <section id="celebrations" aria-labelledby="celebrations-heading" className="surface-maroon grain relative overflow-hidden px-[var(--gutter)] pb-12 pt-16 lg:pb-24 lg:pt-28">
      <SectionBridge from="#f3e7d6" />
      <WeddingAtmosphere preset="celebrations" />

      {/* The Celebrations — compact cards */}
      <m.div className="relative mx-auto max-w-5xl" {...inView}>
        <header className="text-center">
          <m.p variants={rise(0)} className="eyebrow text-gold">
            {celebrations.eyebrow}
          </m.p>
          <m.h2 variants={rise(0.08)} id="celebrations-heading" className="mt-3 font-serif text-[2.6rem] leading-none text-ivory sm:text-6xl">
            {celebrations.heading}
          </m.h2>
        </header>
        <m.ul variants={rise(0.2)} className="mt-6 grid gap-2.5 sm:grid-cols-3 sm:gap-5">
          {events.map((ev) => (
            <EventTile key={ev.id} ev={ev} featured={ev.theme === "vivah"} />
          ))}
        </m.ul>
      </m.div>

      {/* The Wedding — Vivah details with the couple illustration */}
      <m.div id="wedding" aria-labelledby="wedding-heading" className="relative isolate mx-auto mt-10 max-w-5xl scroll-mt-10 lg:mt-20" {...inView}>
        <WeddingAtmosphere preset="wedding" bleed />
        <m.div variants={rise(0)} className="flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
          <p className="eyebrow text-gold">{celebrations.weddingEyebrow}</p>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
        </m.div>
        <m.h3 variants={rise(0.08)} id="wedding-heading" className="serif-display gold-text mt-3 text-center text-[3.4rem] sm:text-7xl">
          {vivah.name}
        </m.h3>
        <m.p variants={rise(0.14)} lang="hi" className="font-deva text-center text-[1.5rem] leading-[1.7] text-gold-light">
          {vivah.nameHindi}
        </m.p>

        <div className="mt-5 grid items-center gap-7 lg:grid-cols-[auto_1fr] lg:gap-14">
          <div className="flex justify-center">
            <Illustration id={images.wedding.id} alt={images.wedding.alt} sizes="(min-width: 1024px) 400px, 60vw" maxWidth={400} maxVh={41} maxVhLg={58} delay={0.15} />
          </div>

          <m.article variants={rise(0.3)} aria-label={`${vivah.name} details`} className="relative border border-gold/35 px-6 py-7 text-center sm:px-10 lg:text-left">
            <CornerFlourish className="pointer-events-none absolute left-1.5 top-1.5 h-10 w-10 opacity-80" />
            <CornerFlourish className="pointer-events-none absolute bottom-1.5 right-1.5 h-10 w-10 rotate-180 opacity-80" />

            <time dateTime={vivah.start} className="flex items-end justify-center gap-4 lg:justify-start">
              <span className="font-serif text-6xl leading-[0.8] text-ivory">{day}</span>
              <span className="flex flex-col pb-0.5 text-left">
                <span className="eyebrow text-[0.7rem] text-ivory">
                  {month} {year}
                </span>
                <span className="mt-1 text-sm text-champagne/75">{vivah.weekday}</span>
              </span>
            </time>

            <div className="mx-auto my-5 h-px w-24 bg-gold/40 lg:mx-0" />

            <dl className="space-y-4 text-[0.95rem] text-ivory">
              <div className="flex items-center justify-center gap-3 lg:justify-start">
                <dt className="sr-only">Time</dt>
                <Clock className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <dd>{vivah.time}</dd>
              </div>
              <div className="flex flex-col items-center gap-1.5 lg:flex-row lg:items-start lg:gap-3">
                <dt className="sr-only">Venue</dt>
                <MapPin className="h-4 w-4 shrink-0 text-gold lg:mt-1" aria-hidden />
                <dd>
                  <span className="font-serif text-2xl text-gold-light">{venue.name}</span>
                  <span className="mt-1 block leading-relaxed text-champagne/80">{vivah.address}</span>
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <MapButton href={venue.mapsUrl} label={venue.directionsLabel} solid />
              <CalendarButton events={[vivah]} />
            </div>
          </m.article>
        </div>
      </m.div>
    </section>
  );
}

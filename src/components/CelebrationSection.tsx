"use client";

import { m, useReducedMotion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { weddingData, type WeddingEvent } from "@/data/weddingData";
import CalendarButton from "./CalendarButton";
import MapButton from "./MapButton";
import WeddingAtmosphere from "./decor/WeddingAtmosphere";
import { Vignette } from "./decor/WeddingVignettes";
import SectionBridge from "./decor/SectionBridge";
import { EventMotif, MadhubaniBand, RoyalArch, RSMonogram } from "./luxe/Stationery";
import Illustration from "./ui/Illustration";

const { celebrations, events, venue, images } = weddingData;
const vivah = events.find((e) => e.theme === "vivah")!;
const ease = [0.22, 1, 0.36, 1] as const;
// Fires as soon as the block's top edge is on screen — independent of block height.
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } } as const;

const iconBtn =
  "grid h-11 w-11 place-items-center rounded-full border border-gold/50 text-gold-light transition hover:border-gold-light hover:bg-gold/10 active:scale-95";

/** An arch-topped invitation panel for one ceremony, with its own small motif. */
function EventTile({ ev, featured }: { ev: WeddingEvent; featured: boolean }) {
  return (
    <li id={ev.id} className="relative [--crown:1.35rem] sm:[--crown:2.6rem]">
      <div aria-hidden className={`absolute inset-x-0 bottom-0 top-[var(--crown)] ${featured ? "bg-gold/[0.07]" : "bg-gold/[0.025]"}`} />
      <RoyalArch variant="cusped" base animate={false} crownHeight="var(--crown)" className={`absolute inset-0 ${featured ? "text-gold/70" : "text-gold/35"}`} />
      <div className="relative flex items-center gap-4 px-5 pb-3.5 pt-[calc(var(--crown)-0.1rem)] text-left sm:flex-col sm:items-center sm:gap-3 sm:pb-7 sm:pt-[calc(var(--crown)+0.4rem)] sm:text-center">
        <div className="w-[5.9rem] shrink-0 sm:w-auto">
          <div className="flex items-center gap-1.5 sm:flex-col sm:gap-2">
            <EventMotif kind={ev.theme} className="h-5 w-5 text-gold/80 sm:h-10 sm:w-10" />
            <p className="eyebrow text-[0.55rem] text-gold/80">{ev.index} —</p>
          </div>
          <p className={`mt-1 font-serif text-[1.65rem] leading-none ${featured ? "gold-text" : "text-ivory"}`}>{ev.name}</p>
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
        <header className="relative text-center">
          <m.p variants={rise(0)} className="eyebrow text-gold">
            {celebrations.eyebrow}
          </m.p>
          <m.h2 variants={rise(0.08)} id="celebrations-heading" className="mt-3 font-serif text-[2.6rem] leading-none text-ivory sm:text-6xl">
            {celebrations.heading}
          </m.h2>
        </header>
        <m.ul variants={rise(0.2)} className="mt-7 grid gap-3 sm:grid-cols-3 sm:gap-5">
          {events.map((ev) => (
            <EventTile key={ev.id} ev={ev} featured={ev.theme === "vivah"} />
          ))}
        </m.ul>
        {/* phones: shehnai couple (left) and jaimala couple (right) flank the
            top of the Vivah arch, tucked under the cards */}
        <div className="-mb-7 mt-3 flex items-end justify-between sm:hidden">
          <Vignette kind="shehnai" className="w-[35%] max-w-[150px]" />
          <Vignette kind="jaimala" className="mr-1 w-[29%] max-w-[125px] translate-y-3" />
        </div>
      </m.div>

      {/* The Wedding — Vivah details with the couple illustration */}
      <m.div id="wedding" aria-labelledby="wedding-heading" className="relative isolate mx-auto mt-10 max-w-5xl scroll-mt-10 lg:mt-20" {...inView}>
        <WeddingAtmosphere preset="wedding" bleed />
        {/* one grand, very faint palace arch framing the whole Vivah composition */}
        <RoyalArch variant="ogee" crownHeight="clamp(7rem,20vw,12rem)" className="absolute -inset-x-1 -bottom-4 -top-16 -z-[5] text-gold/[0.16] sm:-inset-x-6 sm:-top-20 lg:-inset-x-12" />
        {/* tablet+: the two wedding moments flank the Vivah arch — shehnai left, jaimala right */}
        <Vignette kind="shehnai" className="absolute right-[calc(50%+150px)] top-1 hidden w-[5.5rem] sm:block lg:right-[calc(50%+185px)] lg:-top-2 lg:w-[7.2rem]" />
        <Vignette kind="jaimala" className="absolute left-[calc(50%+150px)] top-3 hidden w-24 sm:block lg:left-[calc(50%+185px)] lg:top-1 lg:w-32" />
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

          <div className="flex flex-col">
            <m.article variants={rise(0.3)} aria-label={`${vivah.name} details`} className="relative px-6 pb-8 pt-[4.6rem] text-center sm:px-10">
              <div aria-hidden className="absolute inset-x-0 bottom-0 top-16 bg-gold/[0.035]" />
              <RoyalArch variant="ogee" base crownHeight="4rem" className="absolute inset-0 text-gold/50" />
              {/* the couple's crest at the top of the card */}
              <div aria-hidden className="absolute left-1/2 top-[1.45rem] h-10 w-10 -translate-x-1/2 text-gold/85">
                <RSMonogram className="h-full w-full" />
              </div>

              <div className="relative">
                <p className="eyebrow text-[0.62rem] text-gold/85">{vivah.weekday}</p>
                <time dateTime={vivah.start} className="mt-2 flex flex-col items-center">
                  <span className="flex items-center gap-4">
                    <span aria-hidden className="h-px w-10 bg-gradient-to-l from-gold/60 to-transparent" />
                    <span className="font-serif text-[4.4rem] leading-[0.85] text-ivory">{day}</span>
                    <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold/60 to-transparent" />
                  </span>
                  <span className="eyebrow mt-3 text-[0.72rem] text-ivory">
                    {month} {year}
                  </span>
                </time>

                <MadhubaniBand className="mx-auto my-5 w-28 opacity-60" />

                <dl className="space-y-4 text-[0.95rem] text-ivory">
                  <div className="flex items-center justify-center gap-3">
                    <dt className="sr-only">Time</dt>
                    <Clock className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <dd>{vivah.time}</dd>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <dt className="sr-only">Venue</dt>
                    <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <dd>
                      <span className="font-serif text-[1.7rem] leading-tight text-gold-light">{venue.name}</span>
                      <span className="mx-auto mt-1 block max-w-xs leading-relaxed text-champagne/80">{vivah.address}</span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <MapButton href={venue.mapsUrl} label={venue.directionsLabel} solid />
                  <CalendarButton events={[vivah]} />
                </div>
              </div>
            </m.article>
          </div>
        </div>
      </m.div>
    </section>
  );
}

"use client";

import { m, useReducedMotion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { weddingData } from "@/data/weddingData";
import CalendarButton from "./CalendarButton";
import MapButton from "./MapButton";
import { CornerFlourish, OrnamentDivider } from "./decor/Ornaments";
import SectionBridge from "./decor/SectionBridge";
import Illustration from "./ui/Illustration";

const { celebrations, events, venue, countdown, images } = weddingData;
const vivah = events.find((e) => e.theme === "vivah")!;
const others = events.filter((e) => e.theme !== "vivah");
const target = new Date(countdown.target).getTime();
const ease = [0.22, 1, 0.36, 1] as const;

/** One quiet line: "74 days · 12 hrs · 31 min to go". Empty on the server. */
function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  if (now === null) return <p className="h-6" aria-hidden />;
  const diff = Math.max(0, target - now);
  if (diff === 0) return <p className="eyebrow text-gold">{countdown.arrived}</p>;
  const parts = [
    [Math.floor(diff / 86_400_000), "days"],
    [Math.floor(diff / 3_600_000) % 24, "hrs"],
    [Math.floor(diff / 60_000) % 60, "min"],
  ] as const;
  return (
    <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-champagne/75 lg:justify-start" role="timer">
      {parts.map(([n, unit], i) => (
        <span key={unit} className="flex items-baseline gap-1.5">
          {i > 0 && <span className="mr-1.5 text-gold/50">·</span>}
          <span className="gold-text font-serif text-3xl leading-none">{n}</span>
          <span className="eyebrow text-[0.58rem]">{unit}</span>
        </span>
      ))}
      <span className="eyebrow ml-1 text-[0.58rem]">to go</span>
    </p>
  );
}

export default function CelebrationSection() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 1.3, delay: reduce ? 0 : delay, ease } },
  });
  const [day, month, year] = vivah.date.split(" ");

  return (
    <section id="celebrations" aria-labelledby="celebrations-heading" className="surface-maroon grain relative overflow-hidden px-[var(--gutter)] pb-20 pt-24 lg:py-28">
      <SectionBridge from="#f3e7d6" />
      <m.div
        className="relative mx-auto max-w-5xl"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      >
        <header className="text-center">
          <m.p variants={rise(0)} className="eyebrow text-gold">
            {celebrations.eyebrow}
          </m.p>
          <m.h2 variants={rise(0.1)} id="celebrations-heading" className="serif-display gold-text mt-3 text-[3.6rem] sm:text-7xl">
            {celebrations.heading}
          </m.h2>
          {/* generous line-height so the matras render whole */}
          <m.p variants={rise(0.2)} lang="hi" className="font-deva mt-1 pt-1 text-[1.6rem] leading-[1.7] text-gold-light">
            {vivah.nameHindi}
          </m.p>
        </header>

        <div className="mt-8 grid items-center gap-10 lg:mt-12 lg:grid-cols-[auto_1fr] lg:gap-14">
          <div className="flex justify-center">
            <Illustration id={images.bride.id} alt={images.bride.alt} sizes="(min-width: 1024px) 380px, 78vw" maxWidth={380} maxVh={56} delay={0.2} />
          </div>

          {/* Vivah details */}
          <m.article variants={rise(0.35)} aria-label={vivah.name} className="relative border border-gold/35 px-6 py-8 text-center sm:px-10 lg:text-left">
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

            <div className="mx-auto my-6 h-px w-24 bg-gold/40 lg:mx-0" />

            <dl className="space-y-4 text-[0.95rem] text-ivory">
              <div className="flex items-center justify-center gap-3 lg:justify-start">
                <dt className="sr-only">Time</dt>
                <Clock className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <dd>{vivah.time}</dd>
              </div>
              <div className="flex flex-col items-center gap-1.5 lg:flex-row lg:items-start lg:gap-3">
                <dt className="sr-only">Venue</dt>
                <MapPin className="h-4 w-4 shrink-0 text-gold lg:mt-0.5" aria-hidden />
                <dd>
                  <span className="font-serif text-2xl text-gold-light">{venue.name}</span>
                  <span className="mt-1 block leading-relaxed text-champagne/80">{vivah.address}</span>
                </dd>
              </div>
            </dl>

            <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
              <MapButton href={venue.mapsUrl} label={venue.directionsLabel} solid />
              <CalendarButton events={[vivah]} />
            </div>

            <div className="mt-8 border-t border-gold/20 pt-6">
              <Countdown />
            </div>
          </m.article>
        </div>

        {/* Also celebrating — compact rows */}
        <m.div variants={rise(0.5)} className="mx-auto mt-12 max-w-2xl">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px flex-1 bg-gold/25" />
            <p className="eyebrow text-[0.62rem] text-gold">{celebrations.alsoCelebrating}</p>
            <span className="h-px flex-1 bg-gold/25" />
          </div>
          <ul className="mt-2 divide-y divide-gold/15">
            {others.map((ev) => (
              <li key={ev.id} id={ev.id} className="flex items-center gap-4 py-4">
                <div className="w-[5.5rem] shrink-0 text-left">
                  <p className="font-serif text-2xl leading-none text-ivory">{ev.name}</p>
                  <p lang="hi" className="font-deva mt-0.5 text-sm leading-[1.7] text-gold-light">
                    {ev.nameHindi}
                  </p>
                </div>
                <div className="min-w-0 flex-1 text-left text-[0.82rem] leading-relaxed text-champagne/80">
                  <p className="text-ivory">
                    {ev.date.replace(" 2026", "")} · {ev.weekday}
                  </p>
                  <p>
                    {ev.time} · {ev.venue}, {ev.location.replace(", Bihar", "")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {ev.mapsUrl && (
                    <a
                      href={ev.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Directions to ${ev.name} (opens Google Maps)`}
                      className="grid h-11 w-11 place-items-center rounded-full border border-gold/50 text-gold-light transition hover:border-gold-light hover:bg-gold/10 active:scale-95"
                    >
                      <MapPin className="h-4 w-4" aria-hidden />
                    </a>
                  )}
                  <CalendarButton events={[ev]} compact />
                </div>
              </li>
            ))}
          </ul>
          <OrnamentDivider className="mx-auto mt-8 h-8 w-52 opacity-60" />
        </m.div>
      </m.div>
    </section>
  );
}

"use client";

import { Clock, MapPin } from "lucide-react";
import type { WeddingEvent } from "@/data/weddingData";
import CalendarButton from "./CalendarButton";
import MapButton from "./MapButton";
import { Reveal } from "./ui/Reveal";

const tones = {
  chheka: { title: "text-wine", body: "text-ink-soft", meta: "text-ink", accent: "text-gold-deep", rule: "bg-gold-deep/40", button: "light" },
  matkor: { title: "text-[#5a3322]", body: "text-[#6e4a36]", meta: "text-[#3d2418]", accent: "text-earth", rule: "bg-earth/40", button: "light" },
  vivah: { title: "gold-text", body: "text-champagne/80", meta: "text-ivory", accent: "text-gold", rule: "bg-gold/40", button: "dark" },
} as const;

/** Date, time, venue, story and actions for one celebration. */
export default function EventCard({ event, align = "left" }: { event: WeddingEvent; align?: "left" | "center" }) {
  const t = tones[event.theme];
  const [day, month, year] = event.date.split(" ");
  const center = align === "center";

  return (
    <article aria-labelledby={`${event.id}-title`} className={center ? "text-center" : ""}>
      <Reveal>
        <p className={`eyebrow ${t.accent}`}>Celebration {event.index}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h3 id={`${event.id}-title`} className={`serif-display mt-3 ${center ? "text-[3.4rem] sm:text-7xl" : "text-[4.2rem] sm:text-8xl"} ${t.title}`}>
          {event.name}
        </h3>
      </Reveal>
      <Reveal delay={0.14}>
        {/* generous line-height so matras above/below the headline never clip */}
        <p lang="hi" className={`font-deva mt-1 pt-1 leading-[1.7] ${center ? "text-[1.6rem]" : "text-2xl"} ${t.accent}`}>
          {event.nameHindi}
        </p>
      </Reveal>

      <Reveal delay={0.2} className={`${center ? "mt-6" : "mt-8"} flex items-end gap-5 ${center ? "justify-center" : ""}`}>
        <time dateTime={event.start} className="flex items-end gap-4">
          <span className={`font-serif leading-[0.8] ${center ? "text-6xl" : "text-7xl"} ${t.meta}`}>{day}</span>
          <span className="flex flex-col pb-1 text-left">
            <span className={`eyebrow text-[0.7rem] ${t.meta}`}>{month} {year}</span>
            <span className={`mt-1 text-sm ${t.body}`}>{event.weekday}</span>
          </span>
        </time>
      </Reveal>

      <Reveal delay={0.26}>
        <div className={`${center ? "my-6" : "my-7"} h-px w-24 ${t.rule} ${center ? "mx-auto" : ""}`} />
        <dl className={`space-y-4 ${center ? "text-[0.92rem]" : "text-[0.95rem]"} ${t.meta}`}>
          <div className={`flex items-start gap-3 ${center ? "justify-center" : ""}`}>
            <dt className="sr-only">Time</dt>
            <Clock className={`mt-0.5 h-4 w-4 shrink-0 ${t.accent}`} aria-hidden />
            <dd>{event.time}</dd>
          </div>
          {/* centred cards stack the pin above the (multi-line) address */}
          <div className={`flex ${center ? "flex-col items-center gap-2" : "items-start gap-3"}`}>
            <dt className="sr-only">Venue</dt>
            <MapPin className={`h-4 w-4 shrink-0 ${center ? "" : "mt-0.5"} ${t.accent}`} aria-hidden />
            <dd className={center ? "text-center" : ""}>
              <span className="font-semibold">{event.venue}</span>
              <span className={`mt-1 block leading-relaxed ${t.body}`}>{event.address ?? event.location}</span>
            </dd>
          </div>
        </dl>
      </Reveal>

      <Reveal delay={0.32}>
        <p className={`max-w-md font-serif italic ${center ? "mx-auto mt-6 text-[1.08rem] leading-[1.7]" : "mt-7 text-[1.2rem] leading-relaxed"} ${t.body}`}>
          {event.description}
        </p>
      </Reveal>

      <Reveal delay={0.38} className={`flex flex-wrap gap-3 ${center ? "mt-8 justify-center" : "mt-9"}`}>
        {event.mapsUrl && <MapButton href={event.mapsUrl} label="Map" variant={t.button} />}
        <CalendarButton events={[event]} variant={t.button} />
      </Reveal>
    </article>
  );
}

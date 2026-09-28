"use client";

import type { WeddingEvent } from "@/data/weddingData";
import EventCard from "./EventCard";
import { ChhekaArt, MatkorArt, PalaceArch } from "./decor/EventArt";
import { CornerFlourish, Mandala } from "./decor/Ornaments";
import GoldDust from "./decor/GoldDust";
import { Reveal } from "./ui/Reveal";

/** Node marking the event on the continuous gold timeline line. */
function TimelineNode({ tone }: { tone: "light" | "dark" }) {
  return (
    <span
      aria-hidden
      className={`absolute left-[calc(var(--line-x)-6px)] top-[var(--space-section)] z-20 h-3 w-3 rotate-45 border ${
        tone === "light" ? "border-gold-deep bg-ivory" : "border-gold bg-deep-maroon"
      }`}
    />
  );
}

function Watermark({ text, className }: { text: string; className: string }) {
  return (
    <span aria-hidden lang="hi" className={`font-deva pointer-events-none absolute select-none leading-none ${className}`}>
      {text}
    </span>
  );
}

export default function EventSection({ event }: { event: WeddingEvent }) {
  if (event.theme === "chheka") {
    return (
      <section aria-label={event.name} className="surface-ivory grain relative overflow-hidden py-[var(--space-section)]" style={{ background: "linear-gradient(180deg,#fbf5ec,#f5e6dc 60%,#f3e2d4)" }}>
        <TimelineNode tone="light" />
        <Watermark text={event.nameHindi} className="-right-6 top-10 text-[9rem] text-rose/20 sm:text-[16rem]" />
        <CornerFlourish tone="wine" className="absolute right-4 top-4 h-16 w-16 rotate-90 opacity-40" />
        <CornerFlourish tone="wine" className="absolute bottom-4 left-4 h-16 w-16 -rotate-90 opacity-40" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 pl-[calc(var(--line-x)+1.75rem)] pr-[var(--gutter)] md:grid-cols-2 md:gap-16">
          <Reveal className="order-1 md:order-1">
            <ChhekaArt className="mx-auto w-full max-w-[420px]" />
          </Reveal>
          <div className="order-2">
            <EventCard event={event} />
          </div>
        </div>
      </section>
    );
  }

  if (event.theme === "matkor") {
    return (
      <section aria-label={event.name} className="grain relative overflow-hidden py-[var(--space-section)]" style={{ background: "linear-gradient(180deg,#f0e1c9,#e8d2b0 55%,#dfc39c)" }}>
        <TimelineNode tone="light" />
        <div aria-hidden className="jaali absolute inset-0 opacity-[0.08]" />
        <Watermark text={event.nameHindi} className="-left-4 bottom-6 text-[8rem] text-earth/10 sm:text-[15rem]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 pl-[calc(var(--line-x)+1.75rem)] pr-[var(--gutter)] md:grid-cols-2 md:gap-16">
          <div className="order-2 md:order-1">
            <EventCard event={event} />
          </div>
          <Reveal className="order-1 md:order-2">
            <MatkorArt className="mx-auto w-[62%] max-w-[300px] md:w-full" />
          </Reveal>
        </div>
      </section>
    );
  }

  // Vivah — the grand finale of the sequence
  return (
    <section aria-label={event.name} className="surface-maroon grain relative overflow-hidden py-[var(--space-section)]">
      <TimelineNode tone="dark" />
      <GoldDust density={34} />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 w-[140vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]">
        <Mandala className="animate-slow-spin h-full w-full" />
      </div>
      <div className="relative mx-auto max-w-[620px] pl-[calc(var(--line-x)+1.25rem)] pr-[var(--gutter)] md:px-[var(--gutter)]">
        <div className="relative px-6 pb-16 pt-[42%] sm:px-12 sm:pt-[36%]">
          <PalaceArch className="pointer-events-none absolute inset-0 h-full w-full" />
          <div aria-hidden className="absolute inset-x-[14%] bottom-0 top-[24%] -z-10 rounded-t-full bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,164,92,0.14),transparent_70%)]" />
          <EventCard event={event} align="center" />
        </div>
      </div>
    </section>
  );
}

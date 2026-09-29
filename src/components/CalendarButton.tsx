"use client";

import { CalendarPlus, Download } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { WeddingEvent } from "@/data/weddingData";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";

/**
 * "Add to Calendar" with a small menu: Google Calendar (web) or an .ics file
 * that Apple Calendar / Outlook / Android open natively. All data comes from
 * the event object — nothing is duplicated here.
 */
export default function CalendarButton({
  events,
  label = "Add to Calendar",
  variant = "dark",
  compact = false,
  className = "",
}: {
  events: readonly WeddingEvent[];
  label?: string;
  variant?: "dark" | "light";
  /** Icon-only 44px button (for compact event rows). */
  compact?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const single = events.length === 1 ? events[0] : null;
  const filename = single ? `${single.id}-rahul-weds-sweta.ics` : "rahul-weds-sweta-celebrations.ics";
  const item =
    "flex w-full items-center gap-3 px-4 py-3 text-left text-[0.8rem] tracking-wide text-ivory transition hover:bg-gold/15 focus-visible:bg-gold/15";

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        className={
          compact
            ? "grid h-11 w-11 place-items-center rounded-full border border-gold/50 text-gold-light transition hover:border-gold-light hover:bg-gold/10 active:scale-95"
            : `btn-gold ${variant === "light" ? "on-light" : ""}`
        }
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={compact && single ? `Add ${single.name} to calendar` : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <CalendarPlus className="h-4 w-4" aria-hidden />
        {!compact && label}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className={`absolute bottom-full z-30 mb-3 w-64 overflow-hidden rounded-xl border border-gold/40 bg-maroon/95 shadow-2xl ${
            compact ? "right-0" : "left-1/2 -translate-x-1/2"
          }`}
        >
          {single ? (
            <a role="menuitem" className={item} href={googleCalendarUrl(single)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <CalendarPlus className="h-4 w-4 text-gold-light" aria-hidden /> Google Calendar
            </a>
          ) : (
            events.map((ev) => (
              <a key={ev.id} role="menuitem" className={item} href={googleCalendarUrl(ev)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                <CalendarPlus className="h-4 w-4 text-gold-light" aria-hidden /> Google · {ev.name}
              </a>
            ))
          )}
          <button
            type="button"
            role="menuitem"
            className={`${item} border-t border-gold/20`}
            onClick={() => {
              downloadIcs(events, filename);
              setOpen(false);
            }}
          >
            <Download className="h-4 w-4 text-gold-light" aria-hidden /> Apple / Outlook (.ics)
          </button>
        </div>
      )}
    </div>
  );
}

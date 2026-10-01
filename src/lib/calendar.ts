import type { WeddingEvent } from "@/data/weddingData";
import { weddingData } from "@/data/weddingData";

const toUtcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function eventTimes(event: WeddingEvent) {
  const start = new Date(event.start);
  const end = new Date(start.getTime() + event.durationHours * 3_600_000);
  return { start, end };
}

function eventTitle(event: WeddingEvent) {
  return `${event.name} · ${weddingData.couple.title}`;
}

function eventLocation(event: WeddingEvent) {
  return event.address ? `${event.venue}, ${event.address}` : `${event.venue}, ${event.location}`;
}

function eventDetails(event: WeddingEvent) {
  const lines = [event.description, "", `${event.date} · ${event.time}`];
  if (event.mapsUrl) lines.push(`Directions: ${event.mapsUrl}`);
  return lines.join("\n");
}

export function googleCalendarUrl(event: WeddingEvent) {
  const { start, end } = eventTimes(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(event),
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: eventDetails(event),
    location: eventLocation(event),
    ctz: "Asia/Kolkata",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const escapeIcs = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\;");

/** RFC 5545 line folding at 75 octets. */
const fold = (line: string) => line.match(/.{1,74}/g)?.join("\r\n ") ?? line;

export function buildIcs(events: readonly WeddingEvent[]) {
  const now = toUtcStamp(new Date());
  const body = events.flatMap((event) => {
    const { start, end } = eventTimes(event);
    return [
      "BEGIN:VEVENT",
      `UID:${event.id}-2026@rahul-weds-sweta`,
      `DTSTAMP:${now}`,
      `DTSTART:${toUtcStamp(start)}`,
      `DTEND:${toUtcStamp(end)}`,
      `SUMMARY:${escapeIcs(eventTitle(event))}`,
      `DESCRIPTION:${escapeIcs(eventDetails(event))}`,
      `LOCATION:${escapeIcs(eventLocation(event))}`,
      ...(event.mapsUrl ? [`URL:${event.mapsUrl}`] : []),
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcs(eventTitle(event))} tomorrow`,
      "END:VALARM",
      "END:VEVENT",
    ];
  });
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sweta Weds Rahul//Invitation//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", ...body, "END:VCALENDAR"]
    .map(fold)
    .join("\r\n");
}

export function downloadIcs(events: readonly WeddingEvent[], filename: string) {
  const blob = new Blob([buildIcs(events)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

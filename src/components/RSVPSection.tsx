"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { weddingData } from "@/data/weddingData";
import { submitRsvp } from "@/lib/rsvp";
import { CornerFlourish, LotusMark, OrnamentDivider } from "./decor/Ornaments";
import { Reveal, RevealWords } from "./ui/Reveal";

const { rsvp, events } = weddingData;

type Status = "idle" | "sending" | "done" | "error";

function Pill({ checked, children, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { children: React.ReactNode }) {
  return (
    <label className="relative cursor-pointer">
      <input {...rest} checked={checked} className="peer sr-only" />
      <span className="flex min-h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-gold/40 px-5 py-2.5 text-[0.82rem] tracking-wide text-champagne transition peer-checked:border-gold-light peer-checked:bg-gold/20 peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-light">
        {checked && <Check className="h-3.5 w-3.5 text-gold-light" aria-hidden />}
        {children}
      </span>
    </label>
  );
}

export default function RSVPSection() {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [chosen, setChosen] = useState<string[]>(events.map((e) => e.id));
  const [guestName, setGuestName] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    if (!name) return setError("Please tell us your name.");
    if (!/^[+\d][\d\s-]{7,15}$/.test(phone)) return setError("Please enter a valid phone number.");
    if (!attending) return setError("Please let us know if you can attend.");
    if (attending === "yes" && chosen.length === 0) return setError("Please choose at least one celebration.");
    setError("");
    setStatus("sending");
    try {
      await submitRsvp({
        name,
        phone,
        guests: attending === "yes" ? Number(form.get("guests") ?? 1) : 0,
        attending,
        events: attending === "yes" ? chosen : [],
        message: String(form.get("message") ?? "").trim(),
        submittedAt: new Date().toISOString(),
      });
      setGuestName(name.split(" ")[0]);
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Something went wrong — please try again in a moment.");
    }
  };

  const label = "eyebrow block text-[0.6rem] text-gold";

  return (
    <section id="rsvp" aria-labelledby="rsvp-heading" className="surface-maroon grain relative overflow-hidden py-[var(--space-section)]">
      <div className="relative mx-auto max-w-2xl px-[var(--gutter)]">
        <header className="text-center">
          <Reveal>
            <LotusMark className="mx-auto mb-5 h-8 w-12" />
            <p className="eyebrow text-gold">{rsvp.eyebrow}</p>
          </Reveal>
          <h2 id="rsvp-heading" className="mt-5 font-serif text-[2.9rem] leading-none text-ivory sm:text-7xl">
            <RevealWords text={rsvp.heading} />
          </h2>
          <Reveal delay={0.2}>
            <OrnamentDivider className="mx-auto mt-7 h-8 w-56" />
          </Reveal>
        </header>

        <Reveal delay={0.2}>
          <div className="relative mt-12 border border-gold/35 bg-deep-maroon/50 px-6 pb-11 pt-12 sm:px-12 sm:py-14">
            <CornerFlourish className="pointer-events-none absolute left-1.5 top-1.5 h-14 w-14" />
            <CornerFlourish className="pointer-events-none absolute bottom-1.5 right-1.5 h-14 w-14 rotate-180" />

            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div
                  key="thanks"
                  role="status"
                  className="py-10 text-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold text-gold-light">
                    <Check className="h-7 w-7" aria-hidden />
                  </div>
                  <p className="mt-6 font-serif text-4xl text-ivory">Dhanyavaad{guestName ? `, ${guestName}` : ""}</p>
                  <p className="mx-auto mt-4 max-w-sm font-serif text-lg italic text-champagne/80">{rsvp.thankYou}</p>
                  <button type="button" className="btn-gold mt-8" onClick={() => setStatus("idle")}>
                    Edit response
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" noValidate onSubmit={onSubmit} className="space-y-10" exit={{ opacity: 0 }} aria-describedby={error ? `${uid}-err` : undefined}>
                  <div className="grid gap-9 sm:grid-cols-2 sm:gap-8">
                    <div>
                      <label htmlFor={`${uid}-name`} className={label}>Name</label>
                      <input id={`${uid}-name`} name="name" autoComplete="name" required className="field" placeholder="Your full name" />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-phone`} className={label}>Phone</label>
                      <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required className="field" placeholder="+91" />
                    </div>
                  </div>

                  <fieldset>
                    <legend className={label}>Will you attend?</legend>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
                      <Pill type="radio" name="attending" value="yes" checked={attending === "yes"} onChange={() => setAttending("yes")}>
                        Joyfully accept
                      </Pill>
                      <Pill type="radio" name="attending" value="no" checked={attending === "no"} onChange={() => setAttending("no")}>
                        Regretfully decline
                      </Pill>
                    </div>
                  </fieldset>

                  <AnimatePresence initial={false}>
                    {attending !== "no" && (
                      <motion.div
                        className="space-y-10 overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <fieldset>
                          <legend className={label}>Celebrations</legend>
                          <div className="mt-4 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
                            {events.map((ev) => (
                              <Pill
                                key={ev.id}
                                type="checkbox"
                                name="events"
                                value={ev.id}
                                checked={chosen.includes(ev.id)}
                                onChange={(e) => setChosen((c) => (e.target.checked ? [...c, ev.id] : c.filter((x) => x !== ev.id)))}
                              >
                                {ev.name} · {ev.date.slice(0, 2)} Dec
                              </Pill>
                            ))}
                          </div>
                        </fieldset>
                        <div className="max-w-[14rem]">
                          <label htmlFor={`${uid}-guests`} className={label}>Number of guests</label>
                          <select id={`${uid}-guests`} name="guests" defaultValue="1" className="field">
                            {Array.from({ length: rsvp.maxGuests }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n}>
                                {n} {n === 1 ? "guest" : "guests"}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label htmlFor={`${uid}-msg`} className={label}>Message for the couple</label>
                    <textarea id={`${uid}-msg`} name="message" rows={3} className="field resize-none" placeholder="Your blessings & wishes (optional)" />
                  </div>

                  {error && (
                    <p id={`${uid}-err`} role="alert" className="text-sm text-rose">
                      {error}
                    </p>
                  )}

                  <div className="pt-3 text-center">
                    <button type="submit" className="btn-gold solid min-h-[52px] w-full max-w-[18rem]" disabled={status === "sending"}>
                      {status === "sending" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending
                        </>
                      ) : (
                        "Send RSVP"
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

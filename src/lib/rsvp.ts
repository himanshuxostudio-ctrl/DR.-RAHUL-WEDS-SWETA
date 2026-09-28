/**
 * RSVP submission adapter.
 *
 * - With NEXT_PUBLIC_RSVP_ENDPOINT set, responses are POSTed as JSON. This
 *   works with a Google Apps Script web app (writing to Google Sheets) or a
 *   Supabase Edge Function / REST endpoint.
 * - Without it the form runs in mock mode and keeps responses on the guest's
 *   device so nothing is lost while the backend is being set up.
 */
export interface RsvpPayload {
  name: string;
  phone: string;
  guests: number;
  attending: "yes" | "no";
  events: string[];
  message: string;
  submittedAt: string;
}

const endpoint = process.env.NEXT_PUBLIC_RSVP_ENDPOINT;

export async function submitRsvp(payload: RsvpPayload): Promise<{ mode: "remote" | "local" }> {
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      // text/plain avoids a CORS preflight, which Apps Script web apps reject.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    if (!res.ok && res.type !== "opaque") throw new Error(`RSVP failed (${res.status})`);
    return { mode: "remote" };
  }

  await new Promise((r) => setTimeout(r, 900));
  try {
    const key = "rw-rsvp-responses";
    const existing = JSON.parse(localStorage.getItem(key) ?? "[]") as RsvpPayload[];
    localStorage.setItem(key, JSON.stringify([...existing, payload]));
  } catch {
    /* storage unavailable (private mode) — mock submit still succeeds */
  }
  return { mode: "local" };
}

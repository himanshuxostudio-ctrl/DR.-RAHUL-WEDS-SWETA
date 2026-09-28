# Dr. Rahul weds Sweta — digital wedding invitation

A cinematic, mobile-first invitation built with Next.js (App Router), React,
TypeScript, Tailwind CSS v4 and Framer Motion.

**Story:** Invitation card → hero reveal → Two Souls · One Journey → Families →
The Celebrations (Chheka · Matkor · Vivah) → Venue → Countdown → Gallery →
RSVP → Thank you → closing film shot.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Deploy (Vercel)

1. Push this repository to GitHub (done).
2. Go to https://vercel.com/new, import `DR.-RAHUL-WEDS-SWETA`, keep all defaults
   (framework is detected as Next.js), and click **Deploy**.
3. Optional: add a custom domain and set `NEXT_PUBLIC_SITE_URL` to it so
   WhatsApp previews use that domain.

## Editing content

Everything shown on the site lives in **`src/data/weddingData.ts`**: names,
families, events, times, venue, map links, countdown target, gallery order,
music, RSVP settings and SEO. Components never hard-code content.

## Photographs

Originals are in `assets/originals/` (renamed, untouched). `npm run images`
regenerates every derivative in `public/images/`: cinematic, portrait and
detail crops with a light warm grade (no facial retouching), blur placeholders
(`src/data/imageManifest.generated.ts`) and the 1200×630 share card
`public/og/rahul-sweta-og.jpg`. Crops are defined at the top of
`scripts/process-images.mjs`. next/image serves AVIF/WebP at responsive sizes.

## Music

The couple's own instrumental track (`assets/audio/royal-wedding-procession-original.mp3`)
is served as `public/audio/royal-wedding-procession.mp3`: re-encoded to 128 kbps
MP3 (4.5 MB → 3.0 MB, cover art stripped) with a short fade in/out so the loop
is seamless. The audio element is created only when the guest taps
**Open Invitation**, so nothing is downloaded before then and the file streams
without blocking the page. If a browser still blocks playback, it starts on the
guest's next tap. Mute is remembered for the session; music pauses when the
guest switches apps. To change the track, replace the file and update
`music.src` in `weddingData.ts`.

## Fonts

Fonts are self-hosted (no Google Fonts request at build or runtime). The
Devanagari font is subset to only the Hindi text used on the site (~5 KB). After
adding or changing any Hindi text, run `pip install fonttools brotli && npm run fonts`.

## RSVP

Without configuration, the form runs in mock mode and stores responses in the
guest's browser. To collect responses, set `NEXT_PUBLIC_RSVP_ENDPOINT` to a URL
that accepts a JSON `POST` (see `src/lib/rsvp.ts` for the payload), for example:

- **Google Sheets:** an Apps Script web app whose `doPost(e)` appends
  `JSON.parse(e.postData.contents)` to a sheet (deploy as "Anyone").
- **Supabase:** an Edge Function that inserts the payload into an `rsvps` table.

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

Instrumental only. By default the site plays a generative Raag Bhupali
(bansuri over tanpura, with a soft swarmandal shimmer), synthesised in the
browser, so there's no audio file to download and no licensing issue. It starts
only after the guest taps **Open Invitation**; mute is remembered for the
session. To use a recorded shehnai/sitar track instead, put a licensed
instrumental file in `public/audio/` and set `music.src` in `weddingData.ts`.

## RSVP

Without configuration, the form runs in mock mode and stores responses in the
guest's browser. To collect responses, set `NEXT_PUBLIC_RSVP_ENDPOINT` to a URL
that accepts a JSON `POST` (see `src/lib/rsvp.ts` for the payload), for example:

- **Google Sheets:** an Apps Script web app whose `doPost(e)` appends
  `JSON.parse(e.postData.contents)` to a sheet (deploy as "Anyone").
- **Supabase:** an Edge Function that inserts the payload into an `rsvps` table.

# Dr. Rahul weds Sweta — digital wedding invitation

A cinematic, mobile-first invitation built with Next.js (App Router), React,
TypeScript, Tailwind CSS v4 and Framer Motion.

**Story (short, illustrated):** Invitation card → Opening (शुभ विवाह, names,
date, the stage illustration) → Two Souls, One
Journey → With the Blessings of Our Families → The Celebrations (Chheka ·
Matkor · Vivah) → The Wedding (venue, directions, calendar) → The Wait Is
Almost Over (countdown) → closing.

## Hindi version (experiment)

A small **EN | हिंदी** switch (top-right, and inside the menu) shows the whole
invitation in Hindi. English is always the default; Hindi appears only after a
guest taps हिंदी, and their choice is remembered on that device.

- All Hindi copy lives in `src/i18n/translations.ts` (written as wedding-card
  copy, not word-for-word). Anything missing falls back to English.
- Names, venue names, addresses, Maps links and calendar entries stay as in
  `weddingData.ts`.
- The Hindi font loads only when Hindi is chosen. After changing Hindi text,
  run `npm run fonts`.
- To switch it off without removing anything: set `HINDI_EXPERIMENT = false`
  in `src/i18n/LanguageProvider.tsx` (English only, no switch).

## Opening (experiment)

The site currently opens with an **experimental royal envelope**: ivory
paper with gold foil rims, the Ganesh mark and the Vakratunda shloka printed
in kumkum ink on the flap, "Dr. Rahul weds Sweta" on the front and a pressed
wax seal. Tap the seal: it breaks, the flap lifts, the invitation card rises
out and dissolves into the site (`src/components/EnvelopeOpening.tsx`). The
Ganesh and shloka art live in `assets/originals/decor/`; `cutout-decor.py`
extracts the ink into alpha masks that the page tints. The original
sealed-card opening (`InvitationOpening.tsx`) is untouched; to restore it,
set `ENVELOPE_OPENING = false` in `src/components/WeddingInvitation.tsx`
(or delete the envelope file and that flag).

## Decoration

One reusable layer, `src/components/decor/WeddingAtmosphere.tsx`, dresses every
section with a preset (hero, story, family, celebrations, wedding, countdown,
closing): marigold/jasmine garlands, hanging torans, a jaimala arc motif, gold
botanical line art and a few drifting petals, at background and mid depths.
The flowers are drawn once as SVG symbols (`decor/florals.tsx`) and reused.
Motion is CSS only (transform/opacity) and is off for reduced-motion users.
To tune a section, edit its preset's placements.

Two small decorative wedding moments — a jaimala exchange and a shehnai
duet — sit beside The Celebrations and under the Vivah details
(`decor/WeddingVignettes.tsx`). They are generic wedding characters, not the
couple; the Rahul & Sweta illustrations are untouched. Their source art lives
in `assets/originals/decor/`; `python3 scripts/cutout-decor.py` removes the
paper background into `assets/decor-cutouts/` (transparent PNG), and
`npm run images` serves them as alpha WebP.

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
families, events, times, venue, map links, countdown target, illustrations,
music and SEO. Components never hard-code content.

## Illustrations

The illustrations live untouched in `assets/originals/illustrations/`.
`npm run images` writes the public versions to `public/images/illustrations/`
— trimmed only of empty paper (plus a closer phone crop of the hero), never
stretched or re-coloured, with a faint ink monogram
and copyright EXIF — plus blur placeholders
(`src/data/imageManifest.generated.ts`) and the 1200×630 share card
`public/og/rahul-sweta-og.jpg`. next/image serves AVIF/WebP at responsive
sizes; every illustration keeps its native aspect ratio on every screen.

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

## Protection (deterrent, not absolute)

Anything a browser can display can ultimately be saved or inspected; these
measures make casual and moderately technical copying much harder.

- **Build** (`npm run build` = `next build --webpack` + `scripts/obfuscate.mjs`):
  minified, no browser source maps (any `.map` is deleted), debug console calls
  stripped. The invitation's own client code is isolated in one chunk (`ic-*`)
  and lightly obfuscated (encoded string table, mangled names) — React, Next.js
  and framer-motion are untouched. Cost: ≈ +15 KB gzipped JS.
- **Headers** (`next.config.ts`): no framing by other sites, `nosniff`,
  strict referrer, no `X-Powered-By`; `noindex` keeps it out of search/image search.
- **Assets**: original artwork and the master audio live in `assets/` (never public);
  only optimized derivatives are served. Each derivative carries a faint corner
  monogram and copyright EXIF. The image optimizer only serves `/images/**`.
- **Client deterrents** (`ContentProtection`): no context menu, selection,
  image dragging or devtools / view-source / save shortcuts, plus a console
  ownership notice. Event-driven only — no polling.

## Fonts

Fonts are self-hosted (no Google Fonts request at build or runtime). The
Devanagari font is subset to only the Hindi text used on the site (~5 KB). After
adding or changing any Hindi text, run `pip install fonttools brotli && npm run fonts`.

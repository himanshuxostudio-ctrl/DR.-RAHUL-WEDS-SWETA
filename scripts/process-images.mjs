/**
 * Image pipeline for the invitation.
 *
 * Reads the untouched illustrations in assets/originals/illustrations/ and
 * writes web-ready derivatives into public/images/ — full artwork, never
 * cropped or re-coloured — plus a generated manifest (dimensions + blur
 * placeholders) used by next/image, and the Open Graph share card.
 *
 *   npm run images
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import satori from "satori";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const originals = path.join(root, "assets/originals/illustrations");
const publicDir = path.join(root, "public/images");
const cutouts = path.join(root, "assets/decor-cutouts");

/**
 * Every image the site uses. Crops only trim empty paper margins (or, for the
 * phone hero, tighten on the couple) — the artwork itself is never scaled
 * unevenly, re-coloured or retouched. Crops are in source pixels.
 */
const derivatives = [
  // Hero: the full stage for wider screens, a closer crop for phones.
  { id: "illustrations/rahul-sweta-namaste", src: "rahul-sweta-namaste.jpg", crop: { left: 60, top: 48, width: 900, height: 600 } },
  { id: "illustrations/rahul-sweta-namaste-mobile", src: "rahul-sweta-namaste.jpg", crop: { left: 150, top: 48, width: 680, height: 604 } },
  { id: "illustrations/rahul-sweta-staircase", src: "rahul-sweta-staircase.webp", crop: { left: 45, top: 92, width: 1032, height: 1818 } },
  { id: "illustrations/rahul-sweta-embrace", src: "rahul-sweta-embrace.webp", crop: { left: 44, top: 36, width: 612, height: 962 } },
  { id: "illustrations/rahul-sweta-together", src: "rahul-sweta-together.webp", crop: { left: 50, top: 46, width: 1241, height: 1897 } },
];

/**
 * Decorative couples (not Rahul & Sweta): transparent cut-outs made by
 * scripts/cutout-decor.py, served as alpha WebP, no monogram.
 */
const decor = [
  { id: "decor/jaimala-couple", src: "jaimala-couple.png" },
  { id: "decor/shehnai-couple", src: "shehnai-couple.png" },
];

/**
 * A faint ink monogram in the paper's bottom-right corner — like an
 * illustrator's signature. Identifies the artwork if reused.
 */
function monogram(width, height) {
  const size = Math.max(10, Math.round(Math.min(width, height) * 0.018));
  const pad = Math.round(size * 1.6);
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${width - pad}" y="${height - pad}" text-anchor="end"
        font-family="Georgia, 'DejaVu Serif', serif" font-size="${size}" letter-spacing="${size * 0.25}"
        fill="#7a5a36" fill-opacity="0.38">R ✦ S · 12.12.26</text>
    </svg>`,
  );
}

/** Ownership metadata embedded in every public derivative. */
const EXIF = {
  IFD0: {
    Copyright: "© Dr. Rahul & Sweta — private wedding invitation. Not for reuse.",
    Artist: "Dr. Rahul & Sweta",
    ImageDescription: "Dr. Rahul weds Sweta · 12 December 2026 · private — do not reuse",
  },
};

async function build() {
  await fs.rm(publicDir, { recursive: true, force: true });
  await fs.mkdir(publicDir, { recursive: true });
  const manifest = {};

  for (const d of derivatives) {
    let src = sharp(path.join(originals, d.src)).rotate();
    if (d.crop) src = src.extract(d.crop);
    const cropped = await src.png().toBuffer({ resolveWithObject: true });
    const { width, height } = cropped.info;
    const marked = await sharp(cropped.data).composite([{ input: monogram(width, height), blend: "over" }]).png().toBuffer();
    const out = path.join(publicDir, `${d.id}.jpg`);
    await fs.mkdir(path.dirname(out), { recursive: true });
    // High quality + 4:4:4 keeps fine pen lines crisp.
    const jpg = await sharp(marked).withExif(EXIF).jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer();
    await fs.writeFile(out, jpg);

    const blur = await sharp(jpg).resize(16).webp({ quality: 40 }).toBuffer();
    manifest[d.id] = {
      src: `/images/${d.id}.jpg`,
      width,
      height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };
    console.log(`✓ ${d.id}  ${width}×${height}  ${(jpg.length / 1024).toFixed(0)} KB`);
  }

  for (const d of decor) {
    const out = path.join(publicDir, `${d.id}.webp`);
    await fs.mkdir(path.dirname(out), { recursive: true });
    const webp = await sharp(path.join(cutouts, d.src))
      .resize({ height: 720, withoutEnlargement: true })
      .withExif(EXIF)
      .webp({ quality: 88, alphaQuality: 90, effort: 6 })
      .toBuffer({ resolveWithObject: true });
    await fs.writeFile(out, webp.data);
    const blur = await sharp(webp.data).resize(16).webp({ quality: 40 }).toBuffer();
    manifest[d.id] = {
      src: `/images/${d.id}.webp`,
      width: webp.info.width,
      height: webp.info.height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };
    console.log(`✓ ${d.id}  ${webp.info.width}×${webp.info.height}  ${(webp.data.length / 1024).toFixed(0)} KB`);
  }

  const ts = `// AUTO-GENERATED by scripts/process-images.mjs — do not edit by hand.
export const imageManifest = ${JSON.stringify(manifest, null, 2)} as const;

export type ImageId = keyof typeof imageManifest;
`;
  await fs.writeFile(path.join(root, "src/data/imageManifest.generated.ts"), ts);

  await buildOgImage();
}

/** 1200×630 share card for WhatsApp / social previews. */
async function buildOgImage() {
  const fonts = [
    { name: "Cormorant", data: await fs.readFile(path.join(root, "assets/fonts/cormorant-600.ttf")), weight: 600, style: "normal" },
    { name: "Manrope", data: await fs.readFile(path.join(root, "assets/fonts/manrope-600.ttf")), weight: 600, style: "normal" },
  ];

  // Hero stage illustration, centred on the couple.
  const photo = await sharp(path.join(publicDir, "illustrations/rahul-sweta-namaste-mobile.jpg"))
    .resize(640, 630, { fit: "cover", position: "top" })
    .jpeg({ quality: 88 })
    .toBuffer();
  const photoUri = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const gold = "#d4b06a";
  const el = (type, style, children) => ({ type, props: { style, children } });

  const svg = await satori(
    el("div", { width: 1200, height: 630, display: "flex", background: "#2a0a10", fontFamily: "Manrope" }, [
      el(
        "div",
        {
          width: 560, height: 630, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", position: "relative",
          background: "radial-gradient(circle at 50% 40%, #5a1420 0%, #2a0a10 75%)",
        },
        [
          el("div", { position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: `1.5px solid ${gold}`, display: "flex" }, ""),
          el("div", { position: "absolute", top: 38, left: 38, right: 38, bottom: 38, border: `1px solid rgba(212,176,106,0.35)`, display: "flex" }, ""),
          el("div", { color: gold, fontSize: 18, letterSpacing: 8, marginBottom: 26 }, "THE WEDDING OF"),
          el("div", { color: "#f8f1e6", fontFamily: "Cormorant", fontSize: 84, lineHeight: 1 }, "Dr. Rahul"),
          el("div", { color: gold, fontFamily: "Cormorant", fontSize: 40, margin: "10px 0" }, "weds"),
          el("div", { color: "#f8f1e6", fontFamily: "Cormorant", fontSize: 84, lineHeight: 1 }, "Sweta"),
          el("div", { width: 120, height: 1, background: gold, margin: "30px 0 24px" }, ""),
          el("div", { color: "#ecd9bf", fontSize: 22, letterSpacing: 6 }, "12 DECEMBER 2026"),
          el("div", { color: "rgba(236,217,191,0.7)", fontSize: 15, letterSpacing: 4, marginTop: 12 }, "CHAPRA · BIHAR"),
        ],
      ),
      el("div", { width: 640, height: 630, display: "flex", position: "relative" }, [
        { type: "img", props: { src: photoUri, width: 640, height: 630, style: { objectFit: "cover" } } },
        el("div", { position: "absolute", top: 0, left: 0, width: 36, height: 630, display: "flex", background: "linear-gradient(90deg, #2a0a10, rgba(42,10,16,0))" }, ""),
      ]),
    ]),
    { width: 1200, height: 630, fonts },
  );

  const out = path.join(root, "public/og/rahul-sweta-og.jpg");
  await fs.mkdir(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
  console.log("✓ og/rahul-sweta-og.jpg");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});

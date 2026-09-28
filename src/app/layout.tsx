import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { weddingData } from "@/data/weddingData";
import "./globals.css";

// Self-hosted (OFL) — no build-time dependency on Google Fonts.
const cormorant = localFont({
  src: [
    { path: "./fonts/cormorant-garamond.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/cormorant-garamond-italic.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const manrope = localFont({
  src: "./fonts/manrope.woff2",
  weight: "300 700",
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const tiro = localFont({
  src: "./fonts/tiro-devanagari-hindi.woff2",
  weight: "400",
  variable: "--font-tiro",
  display: "swap",
});

/**
 * Base URL for Open Graph / WhatsApp previews. Candidates are tried in order;
 * empty or malformed values are skipped (an env var can exist but be blank),
 * so the build can never crash on `new URL("")`.
 *   1. NEXT_PUBLIC_SITE_URL           — explicit / custom domain
 *   2. VERCEL_PROJECT_PRODUCTION_URL  — set automatically by Vercel
 *   3. VERCEL_URL                     — set automatically by Vercel (per deployment)
 *   4. http://localhost:3000          — local development
 */
function resolveSiteUrl(): URL {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    } catch {
      // malformed — try the next candidate
    }
  }
  return new URL("http://localhost:3000");
}

const { seo, couple } = weddingData;

export const metadata: Metadata = {
  metadataBase: resolveSiteUrl(),
  title: seo.title,
  description: seo.description,
  applicationName: couple.title,
  openGraph: {
    type: "website",
    title: `${couple.title} · ${couple.date}`,
    description: seo.description,
    siteName: couple.title,
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.ogImageAlt }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${couple.title} · ${couple.date}`,
    description: seo.description,
    images: [seo.ogImage],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: seo.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${manrope.variable} ${tiro.variable}`}>
      <body>{children}</body>
    </html>
  );
}

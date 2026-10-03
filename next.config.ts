import type { NextConfig } from "next";

const securityHeaders = [
  // Nobody can embed the invitation inside another site.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Never ship browser source maps (the original source stays private).
  productionBrowserSourceMaps: false,
  compiler: {
    // Strip debug logging from the production bundle.
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn", "info"] } : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [96, 160, 256, 384],
    qualities: [70, 80],
    // The optimizer only serves this site's own derivatives.
    localPatterns: [{ pathname: "/images/**" }],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    // Static files in public/ keep their URLs if they are ever replaced, so
    // cache them for a day (served instantly for a week while refreshing)
    // rather than forever. Repeat visits skip re-checking the music, marks and
    // icon on every load.
    const staticCache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/audio/:path*", headers: staticCache },
      { source: "/images/:path*", headers: staticCache },
      { source: "/og/:path*", headers: staticCache },
      { source: "/favicon.svg", headers: staticCache },
    ];
  },
  // Production client build: gather the invitation's own modules (src/) into
  // one chunk, "ic", so scripts/obfuscate.mjs can obfuscate just that code and
  // leave React / Next.js / framer-motion untouched.
  webpack(config, { isServer, dev }) {
    if (!isServer && !dev && config.optimization?.splitChunks) {
      const split = config.optimization.splitChunks;
      split.cacheGroups = {
        ...(split.cacheGroups ?? {}),
        ic: {
          test: /[\\/]src[\\/](components|data|lib|i18n)[\\/]/,
          name: "ic",
          chunks: "all",
          enforce: true,
          priority: 60,
        },
      };
    }
    return config;
  },
};

export default nextConfig;

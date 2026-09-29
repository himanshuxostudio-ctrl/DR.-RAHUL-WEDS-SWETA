"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { getImage } from "@/data/weddingData";
import type { ImageId } from "@/data/imageManifest.generated";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * A framed illustration shown whole — native aspect ratio, never cropped or
 * stretched. Width is capped by both the available width and a share of the
 * viewport height, so tall artwork never overflows the screen. Intrinsic
 * width/height reserve the space up front (no layout shift).
 */
export default function Illustration({
  id,
  alt,
  sizes,
  maxWidth,
  maxVh,
  maxVhLg,
  priority = false,
  show,
  delay = 0,
  className = "",
}: {
  id: ImageId;
  alt: string;
  /** next/image sizes hint matching the rendered width. */
  sizes: string;
  /** Upper bound on width, in px. */
  maxWidth: number;
  /** Upper bound on height, as % of the small viewport height. */
  maxVh: number;
  /** Optional larger height cap from the lg breakpoint (desktop). */
  maxVhLg?: number;
  priority?: boolean;
  /** Controlled reveal (hero). Omit to reveal when scrolled into view. */
  show?: boolean;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const img = getImage(id);
  const ratio = img.width / img.height;
  const variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22, scale: reduce ? 1 : 0.985 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.5, delay: reduce ? 0 : delay, ease } },
  };
  const trigger =
    show === undefined
      ? { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } }
      : { initial: "hidden", animate: show ? "show" : "hidden" };

  return (
    <m.figure
      className={`relative w-[var(--w)] lg:w-[var(--w-lg)] ${className}`}
      style={
        {
          "--w": `min(100%, ${maxWidth}px, calc(${maxVh}svh * ${ratio.toFixed(4)}))`,
          "--w-lg": `min(100%, ${maxWidth}px, calc(${maxVhLg ?? maxVh}svh * ${ratio.toFixed(4)}))`,
        } as React.CSSProperties
      }
      variants={variants}
      {...trigger}
    >
      {/* offset hairline frame — mat & frame, like fine stationery */}
      <span aria-hidden className="pointer-events-none absolute -inset-2 border border-gold/45 sm:-inset-3" />
      <Image
        src={img.src}
        width={img.width}
        height={img.height}
        alt={alt}
        sizes={sizes}
        priority={priority}
        quality={80}
        placeholder="blur"
        blurDataURL={img.blurDataURL}
        className="relative block h-auto w-full shadow-[0_24px_50px_-22px_rgba(20,4,8,0.6)]"
      />
    </m.figure>
  );
}

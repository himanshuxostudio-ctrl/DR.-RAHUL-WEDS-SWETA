"use client";

import type { ImageId } from "@/data/imageManifest.generated";
import Photo from "./ui/Photo";
import { MaskReveal, Parallax } from "./ui/Reveal";

export type Frame = "none" | "gold" | "organic" | "panel";

/**
 * One gallery photograph: masked reveal, gentle parallax, one of the shared
 * framing treatments, and a button that opens it in the lightbox.
 */
export default function GalleryImage({
  id,
  alt,
  sizes,
  aspect,
  frame = "none",
  position,
  from = "bottom",
  delay = 0,
  parallax = 30,
  onOpen,
  className = "",
}: {
  id: ImageId;
  alt: string;
  sizes: string;
  aspect: string;
  frame?: Frame;
  position?: string;
  from?: "bottom" | "left" | "right" | "center";
  delay?: number;
  parallax?: number;
  onOpen?: () => void;
  className?: string;
}) {
  const radius = frame === "organic" ? "rounded-[46%_46%_18px_18px/32%_32%_18px_18px]" : "";
  return (
    <figure className={`relative ${className}`}>
      {frame === "gold" && (
        <div aria-hidden className="pointer-events-none absolute -inset-3 translate-x-3 translate-y-3 border border-gold-deep/60 sm:-inset-4 sm:translate-x-5 sm:translate-y-5" />
      )}
      {frame === "panel" && <div aria-hidden className="absolute -bottom-8 -left-6 right-10 top-12 bg-wine" />}
      <MaskReveal from={from} delay={delay} className={`${aspect} ${radius} shadow-[0_40px_70px_-40px_rgba(61,13,22,0.55)]`}>
        <button
          type="button"
          onClick={onOpen}
          className="group absolute inset-0 block h-full w-full cursor-zoom-in overflow-hidden"
          aria-label={`View photograph: ${alt}`}
        >
          <Parallax distance={parallax} className="absolute -inset-y-10 inset-x-0">
            <Photo
              id={id}
              alt={alt}
              sizes={sizes}
              position={position}
              className="transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
            />
          </Parallax>
        </button>
      </MaskReveal>
    </figure>
  );
}

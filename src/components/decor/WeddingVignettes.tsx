/**
 * Two small decorative wedding moments — a jaimala exchange and a shehnai
 * duet. Transparent cut-outs (scripts/cutout-decor.py → npm run images) of
 * generic wedding characters, not the couple: the Rahul & Sweta
 * illustrations remain the primary artwork.
 */
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { getImage } from "@/data/weddingData";

const ART = {
  jaimala: "decor/jaimala-couple",
  shehnai: "decor/shehnai-couple",
} as const;

/**
 * A vignette as it appears on the page: fades up gently when it scrolls into
 * view, then floats almost imperceptibly (CSS). Decorative only.
 */
export function Vignette({ kind, className = "" }: { kind: keyof typeof ART; className?: string }) {
  const reduce = useReducedMotion();
  const img = getImage(ART[kind]);
  return (
    <m.div
      aria-hidden
      className={`pointer-events-none ${className}`}
      initial={{ opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="atm-float">
        <Image
          src={img.src}
          width={img.width}
          height={img.height}
          alt=""
          sizes="(min-width: 1024px) 180px, 40vw"
          quality={85}
          className="block h-auto w-full drop-shadow-[0_14px_18px_rgba(20,4,8,0.45)]"
        />
      </div>
    </m.div>
  );
}

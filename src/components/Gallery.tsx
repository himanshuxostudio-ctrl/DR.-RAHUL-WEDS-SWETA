"use client";

import SectionBridge from "./decor/SectionBridge";
import { AnimatePresence, m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { getImage, weddingData } from "@/data/weddingData";
import GalleryImage from "./GalleryImage";
import { LotusMark, OrnamentDivider } from "./decor/Ornaments";
import { ArtPicture } from "./ui/Photo";
import { Reveal, RevealWords } from "./ui/Reveal";

const { gallery, couple, images } = weddingData;
const items = gallery.items;
const byLayout = (layout: string) => {
  const index = items.findIndex((i) => i.layout === layout);
  return { ...items[index], index };
};

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const item = items[index];
  const img = getImage(item.id);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("is-locked");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, [onClose, onStep]);

  const ctrl = "grid h-12 w-12 place-items-center rounded-full border border-gold/50 bg-deep-maroon/80 text-gold-light transition hover:border-gold-light";
  return (
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-deep-maroon/95 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClose}
    >
      <AnimatePresence mode="wait">
        <m.div
          key={item.id}
          className="relative max-h-[82svh] w-auto"
          style={{ aspectRatio: `${img.width}/${img.height}`, height: "min(82svh, calc((100vw - 2rem) * " + img.height / img.width + "))" }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <Image src={img.src} alt={item.alt} fill sizes="92vw" quality={80} placeholder="blur" blurDataURL={img.blurDataURL} className="object-contain" />
          <div aria-hidden className="pointer-events-none absolute -inset-2 border border-gold/40" />
        </m.div>
      </AnimatePresence>
      <p className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 w-[80vw] -translate-x-1/2 text-center font-serif text-base italic text-champagne/80">
        {item.alt}
      </p>
      <button ref={closeRef} type="button" aria-label="Close" onClick={onClose} className={`${ctrl} absolute right-4 top-4`}>
        <X className="h-5 w-5" aria-hidden />
      </button>
      <button type="button" aria-label="Previous photograph" onClick={(e) => { e.stopPropagation(); onStep(-1); }} className={`${ctrl} absolute left-3 top-1/2 -translate-y-1/2 sm:left-6`}>
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <button type="button" aria-label="Next photograph" onClick={(e) => { e.stopPropagation(); onStep(1); }} className={`${ctrl} absolute right-3 top-1/2 -translate-y-1/2 sm:right-6`}>
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>
    </m.div>
  );
}

/** Full-bleed cinematic frame with the big title overlapping its top edge. */
function CinematicBand({ onOpen }: { onOpen: (i: number) => void }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.08, 1]);
  const item = byLayout("cinematic");

  return (
    <div className="relative mt-20 sm:mt-28">
      <h3 className="relative z-10 mx-auto -mb-[0.42em] max-w-6xl px-[var(--gutter)] text-center font-serif text-[3.4rem] leading-[0.86] text-wine sm:text-[7.5rem] lg:text-[9rem]">
        {gallery.heading.map((w, i) => (
          <span key={w} className={`block ${i === 1 ? "italic text-gold-deep" : ""}`}>
            <RevealWords text={w} delay={i * 0.15} />
          </span>
        ))}
      </h3>
      <div ref={ref} className="relative h-[62svh] min-h-[340px] overflow-hidden sm:h-[88svh]">
        <button type="button" onClick={() => onOpen(item.index)} aria-label={`View photograph: ${item.alt}`} className="absolute inset-0 block cursor-zoom-in">
          <m.div className="absolute inset-0" style={{ scale }}>
            {/* phones get the tighter crop so both faces stay in the tall frame */}
            <ArtPicture
              mobile={images.togetherMobile.id}
              desktop={item.id}
              alt={item.alt}
              desktopSizes="100vw"
              className="object-[52%_15%] md:object-[62%_35%]"
            />
          </m.div>
        </button>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#f3e7d6] to-transparent md:h-[16%]" />
      </div>
    </div>
  );
}

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), []);

  const lead = byLayout("portrait-lead");
  const pl = byLayout("pair-left");
  const pr = byLayout("pair-right");
  const ol = byLayout("offset-left");
  const or = byLayout("offset-right");
  const detail = byLayout("detail");

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="surface-ivory grain relative overflow-hidden pb-[var(--space-section)] pt-[var(--space-section)]">
      <SectionBridge from="var(--deep-maroon)" />
      <header className="relative mx-auto max-w-3xl px-[var(--gutter)] text-center">
        <Reveal>
          <LotusMark tone="wine" className="mx-auto mb-5 h-8 w-12" />
          <p id="gallery-heading" className="eyebrow text-gold-deep">
            {gallery.eyebrow} · {couple.groomFirstName} &amp; {couple.bride}
          </p>
        </Reveal>
      </header>

      {/* 1 · Full portrait */}
      <div className="mx-auto mt-12 w-[74vw] max-w-[440px] sm:mt-16">
        <GalleryImage id={lead.id} alt={lead.alt} aspect="aspect-[2/3]" frame="gold" sizes="(min-width: 640px) 440px, 74vw" position="50% 25%" onOpen={() => setOpen(lead.index)} />
      </div>

      {/* 2 · Couple + bride, asymmetric */}
      <div className="mx-auto mt-20 grid max-w-6xl grid-cols-12 items-start gap-4 px-[var(--gutter)] sm:mt-28 sm:gap-8">
        <GalleryImage id={pl.id} alt={pl.alt} className="col-span-12 sm:col-span-7" aspect="aspect-[4/3]" sizes="(min-width: 640px) 58vw, 92vw" position="60% 30%" from="left" onOpen={() => setOpen(pl.index)} />
        <GalleryImage id={pr.id} alt={pr.alt} className="col-span-8 col-start-5 -mt-10 sm:col-span-5 sm:col-start-auto sm:mt-28" aspect="aspect-[2/3]" frame="organic" sizes="(min-width: 640px) 40vw, 62vw" from="right" delay={0.15} onOpen={() => setOpen(pr.index)} />
      </div>

      {/* 3 · "Moments before forever" + cinematic frame */}
      <CinematicBand onOpen={setOpen} />

      {/* 4 · Profiles over a maroon panel */}
      <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-4 px-[var(--gutter)] sm:mt-28 sm:gap-10">
        <GalleryImage id={ol.id} alt={ol.alt} frame="panel" aspect="aspect-[3/4]" sizes="(min-width: 640px) 40vw, 45vw" from="left" onOpen={() => setOpen(ol.index)} />
        <GalleryImage id={or.id} alt={or.alt} className="mt-16 sm:mt-28" aspect="aspect-[3/4]" sizes="(min-width: 640px) 40vw, 45vw" from="right" delay={0.15} onOpen={() => setOpen(or.index)} />
      </div>

      {/* 5 · Detail + quote */}
      <div className="mx-auto mt-20 flex max-w-4xl flex-col items-center gap-10 px-[var(--gutter)] sm:mt-28 sm:flex-row sm:gap-16">
        <GalleryImage id={detail.id} alt={detail.alt} className="w-[58vw] max-w-[300px] shrink-0" aspect="aspect-[3/4]" frame="organic" sizes="300px" from="center" onOpen={() => setOpen(detail.index)} />
        <Reveal className="text-center sm:text-left">
          <p className="font-serif text-[2rem] italic leading-tight text-wine sm:text-5xl">{couple.groom} &amp; {couple.bride}</p>
          <OrnamentDivider tone="wine" className="mx-auto mt-6 h-7 w-48 opacity-60 sm:mx-0" />
          <p className="eyebrow mt-4 text-ink-soft">{couple.date}</p>
        </Reveal>
      </div>

      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  );
}

"use client";

import { weddingData } from "@/data/weddingData";
import { ArchOutline, LotusMark, OrnamentDivider } from "./decor/Ornaments";
import Photo from "./ui/Photo";
import { MaskReveal, Parallax, Reveal } from "./ui/Reveal";

const { families, couple, images } = weddingData;

function Person({ name, title, delay = 0 }: { name: string; title?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className="py-3">
      <p className="font-serif text-[1.7rem] leading-tight text-wine sm:text-3xl">{name}</p>
      {title && <p className="eyebrow mt-1.5 text-[0.62rem] text-ink-soft">{title}</p>}
    </Reveal>
  );
}

function FamilyColumn({ side }: { side: "groom" | "bride" }) {
  const f = side === "groom" ? families.groom : families.bride;
  return (
    <div className="text-center">
      <Reveal>
        <p className="eyebrow mb-4 text-gold-deep">{f.label}</p>
      </Reveal>
      {side === "bride" && (
        <Person name={families.bride.grandfather} title={families.bride.grandfatherTitle} />
      )}
      <Person name={f.father} title={side === "groom" ? families.groom.fatherTitle : undefined} delay={0.1} />
      <Reveal delay={0.15}>
        <span aria-hidden className="font-serif text-xl italic text-gold-deep">&amp;</span>
      </Reveal>
      <Person name={f.mother} delay={0.2} />
    </div>
  );
}

export default function FamilySection() {
  return (
    <section id="family" aria-labelledby="family-heading" className="surface-ivory grain relative overflow-hidden py-[var(--space-section)]">
      {/* scalloped arch edge carried over from the maroon above */}
      <svg aria-hidden viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-8 w-full sm:h-12">
        <path d="M0 0 H1440 V16 C1320 16 1300 52 1200 52 C1100 52 1080 16 960 16 C840 16 820 52 720 52 C620 52 600 16 480 16 C360 16 340 52 240 52 C140 52 120 16 0 16 Z" fill="var(--deep-maroon)" />
      </svg>
      <div aria-hidden className="jaali absolute inset-0 opacity-[0.06]" />

      <div className="relative mx-auto max-w-6xl px-[var(--gutter)]">
        <header className="mx-auto max-w-2xl text-center">
          <Reveal>
            <LotusMark tone="wine" className="mx-auto mb-5 h-8 w-12" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 id="family-heading" className="font-serif text-[2.5rem] leading-[1.02] text-ink sm:text-6xl">
              With the Blessings <span className="block italic text-wine">of Our Families</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">{families.intro}</p>
            <p className="mt-3 font-serif text-2xl text-wine">
              {couple.groom} <span className="italic text-gold-deep">&amp;</span> {couple.bride}
            </p>
          </Reveal>
        </header>

        <div className="mt-14 grid items-center gap-12 md:mt-20 md:grid-cols-[1fr_minmax(260px,360px)_1fr] md:gap-10">
          <div className="order-2 md:order-1">
            <FamilyColumn side="groom" />
          </div>

          <div className="order-1 mx-auto w-[72vw] max-w-[360px] md:order-2 md:w-full">
            <div className="relative">
              <div className="[clip-path:url(#arch-clip)]">
              <MaskReveal className="aspect-[2/3] w-full">
                <Parallax distance={24} className="absolute -inset-y-8 inset-x-0">
                  <Photo id={images.formal.id} alt={images.formal.alt} sizes="(min-width: 768px) 360px, 72vw" position="50% 30%" />
                </Parallax>
              </MaskReveal>
              </div>
              <ArchOutline className="pointer-events-none absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)]" tone="gold" />
            </div>
          </div>

          <div className="order-3">
            <OrnamentDivider tone="wine" className="mx-auto mb-10 h-7 w-52 opacity-60 md:hidden" />
            <FamilyColumn side="bride" />
          </div>
        </div>
      </div>
    </section>
  );
}

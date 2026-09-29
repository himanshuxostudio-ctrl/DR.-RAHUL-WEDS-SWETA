/**
 * Floral motif library. Flowers are defined once as <symbol>s (FloralDefs,
 * mounted a single time) and reused with <use>, so the page carries one copy
 * of each drawing. Colours come from CSS variables set by the surrounding
 * atmosphere (--fl-*), so the same motifs sit correctly on maroon or ivory.
 *
 * Each symbol is drawn in a 100×100 box centred on (50, 50).
 */

export function FloralDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute" focusable="false">
      <defs>
        {/* Marigold — layered ruffles */}
        <symbol id="fl-marigold" viewBox="0 0 100 100">
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <circle key={`o${i}`} cx={50 + Math.cos(a) * 34} cy={50 + Math.sin(a) * 34} r="12" fill="var(--fl-marigold)" />;
          })}
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2 + 0.26;
            return <circle key={`m${i}`} cx={50 + Math.cos(a) * 22} cy={50 + Math.sin(a) * 22} r="11" fill="var(--fl-marigold-2)" />;
          })}
          <circle cx="50" cy="50" r="17" fill="var(--fl-marigold)" />
          <circle cx="50" cy="50" r="8" fill="var(--fl-marigold-core)" />
        </symbol>

        {/* Jasmine — five pointed petals */}
        <symbol id="fl-jasmine" viewBox="0 0 100 100">
          {Array.from({ length: 5 }, (_, i) => (
            <path
              key={i}
              d="M50 50 C40 38 42 14 50 6 C58 14 60 38 50 50Z"
              fill="var(--fl-jasmine)"
              stroke="var(--fl-jasmine-line)"
              strokeWidth="1.5"
              transform={`rotate(${i * 72} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="7" fill="var(--fl-jasmine-core)" />
        </symbol>

        {/* Rose — muted, a few spiralled arcs */}
        <symbol id="fl-rose" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="var(--fl-rose)" />
          <g fill="none" stroke="var(--fl-rose-line)" strokeWidth="3" strokeLinecap="round">
            <path d="M28 56 C30 34 62 26 72 44" />
            <path d="M36 62 C34 44 58 38 64 52" />
            <path d="M44 58 C44 48 56 46 56 54" />
          </g>
        </symbol>

        {/* Leaf */}
        <symbol id="fl-leaf" viewBox="0 0 100 100">
          <path d="M10 90 C20 40 60 12 92 8 C84 48 52 84 10 90Z" fill="var(--fl-leaf)" />
          <path d="M14 86 C40 60 64 34 88 12" stroke="var(--fl-leaf-line)" strokeWidth="2" fill="none" />
        </symbol>

        {/* Bud */}
        <symbol id="fl-bud" viewBox="0 0 100 100">
          <ellipse cx="50" cy="56" rx="18" ry="30" fill="var(--fl-jasmine)" stroke="var(--fl-jasmine-line)" strokeWidth="2" />
          <path d="M50 86 V98" stroke="var(--fl-leaf)" strokeWidth="4" />
        </symbol>
      </defs>
    </svg>
  );
}

type Kind = "marigold" | "jasmine" | "rose" | "leaf" | "bud";

/** Place one symbol centred at (x, y) with size s (user units). */
export function F({ kind, x, y, s, r = 0, o = 1 }: { kind: Kind; x: number; y: number; s: number; r?: number; o?: number }) {
  return (
    <use
      href={`#fl-${kind}`}
      x={x - s / 2}
      y={y - s / 2}
      width={s}
      height={s}
      opacity={o}
      transform={r ? `rotate(${r} ${x} ${y})` : undefined}
    />
  );
}

/** Deterministic flower sequence along a garland (marigold-led, jasmine accents). */
const SEQ: Kind[] = ["marigold", "marigold", "jasmine", "marigold", "rose", "marigold", "jasmine"];

/** Points along a quadratic curve. */
function along(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, n: number) {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const u = 1 - t;
    return { x: u * u * x0 + 2 * u * t * cx + t * t * x1, y: u * u * y0 + 2 * u * t * cy + t * t * y1 };
  });
}

/** A swag of flowers hanging between two points — partial jaimala / toran. */
export function GarlandArc({ sag = 60, count = 15, size = 13, tassel = true, className = "" }: { sag?: number; count?: number; size?: number; tassel?: boolean; className?: string }) {
  const pts = along(0, 10, 200, 10 + sag * 2, 400, 10, count);
  return (
    <svg viewBox={`-10 -10 420 ${sag + 70}`} className={className} aria-hidden>
      <path d={`M0 10 Q200 ${10 + sag * 2} 400 10`} stroke="var(--fl-thread)" strokeWidth="1" fill="none" />
      {pts.map((p, i) => (
        <g key={i}>
          {i % 2 === 1 && <F kind="leaf" x={p.x} y={p.y + size * 0.55} s={size * 0.8} r={i % 4 === 1 ? 20 : 160} o={0.9} />}
          <F kind={SEQ[i % SEQ.length]} x={p.x} y={p.y} s={SEQ[i % SEQ.length] === "jasmine" ? size * 0.85 : size} r={i * 23} />
        </g>
      ))}
      {tassel && (
        <g>
          <path d={`M200 ${10 + sag} V${sag + 34}`} stroke="var(--fl-thread)" strokeWidth="1" />
          <F kind="marigold" x={200} y={sag + 38} s={size * 0.9} />
          <F kind="bud" x={200} y={sag + 52} s={size * 0.8} />
        </g>
      )}
    </svg>
  );
}

/** A vertical toran strand: stacked marigolds with jasmine spacers and a tassel. */
export function HangingString({ length = 8, size = 14, className = "" }: { length?: number; size?: number; className?: string }) {
  const step = size * 1.05;
  const h = length * step + size * 3;
  return (
    <svg viewBox={`${-size} 0 ${size * 2} ${h}`} className={className} aria-hidden>
      <path d={`M0 0 V${h - size * 1.2}`} stroke="var(--fl-thread)" strokeWidth="0.8" />
      {Array.from({ length }, (_, i) => {
        const y = size * 0.8 + i * step;
        return i % 3 === 2 ? (
          <F key={i} kind="jasmine" x={0} y={y} s={size * 0.8} r={i * 30} />
        ) : (
          <F key={i} kind="marigold" x={0} y={y} s={size} r={i * 40} />
        );
      })}
      <F kind="leaf" x={-size * 0.35} y={h - size * 1.6} s={size * 0.9} r={200} />
      <F kind="bud" x={0} y={h - size * 0.9} s={size * 0.9} />
    </svg>
  );
}

/** A full or partial jaimala ring (ellipse of flowers with a knot at the base). */
export function JaimalaRing({ count = 30, size = 14, arc = 1, className = "" }: { count?: number; size?: number; arc?: number; className?: string }) {
  const rx = 150;
  const ry = 170;
  const start = Math.PI / 2 + (1 - arc) * Math.PI; // arc<1 leaves the bottom open
  const span = Math.PI * 2 * arc;
  const pts = Array.from({ length: count }, (_, i) => {
    const a = start + (span * (i + 0.5)) / count;
    return { x: 200 + Math.cos(a) * rx, y: 200 + Math.sin(a) * ry, a };
  });
  return (
    <svg viewBox="20 0 360 420" className={className} aria-hidden>
      {pts.map((p, i) => (
        <g key={i}>
          {i % 3 === 0 && <F kind="leaf" x={p.x} y={p.y} s={size * 1.1} r={(p.a * 180) / Math.PI + 90} o={0.85} />}
          <F kind={SEQ[i % SEQ.length]} x={p.x} y={p.y} s={SEQ[i % SEQ.length] === "jasmine" ? size * 0.9 : size} r={i * 29} />
        </g>
      ))}
      {arc === 1 && (
        <g>
          <F kind="rose" x={200} y={378} s={size * 1.3} />
          <path d="M200 390 V410" stroke="var(--fl-thread)" strokeWidth="1" />
          <F kind="bud" x={194} y={412} s={size * 0.8} r={-10} />
          <F kind="bud" x={206} y={412} s={size * 0.8} r={10} />
        </g>
      )}
    </svg>
  );
}

/** A small bouquet cluster for anchoring a corner or blank area. */
export function FloralCluster({ className = "", variant = 0 }: { className?: string; variant?: 0 | 1 }) {
  const a = variant === 0;
  return (
    <svg viewBox="0 0 160 140" className={className} aria-hidden>
      <F kind="leaf" x={a ? 112 : 44} y={40} s={40} r={a ? 10 : 100} o={0.9} />
      <F kind="leaf" x={a ? 30 : 128} y={96} s={34} r={a ? 200 : -70} o={0.85} />
      <F kind="marigold" x={62} y={70} s={48} />
      <F kind="marigold" x={a ? 102 : 24} y={84} s={34} r={30} />
      <F kind="rose" x={a ? 96 : 30} y={48} s={28} />
      <F kind="jasmine" x={a ? 36 : 104} y={50} s={26} r={15} />
      <F kind="jasmine" x={a ? 128 : 88} y={108} s={20} r={40} />
      <F kind="jasmine" x={a ? 60 : 64} y={112} s={16} r={70} />
      <F kind="bud" x={a ? 140 : 12} y={70} s={16} r={a ? 60 : -60} />
    </svg>
  );
}

/** Fine gold botanical line art — lotus and vine, stroke only. */
export function BotanicalLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" className={className} fill="none" aria-hidden>
      <g stroke="var(--fl-gold)" strokeWidth="1" strokeLinecap="round">
        <path d="M150 290 C150 220 120 190 90 170 C60 150 50 110 70 80" />
        <path d="M150 290 C150 210 190 180 220 160 C250 140 256 104 236 76" />
        <path d="M90 170 c-24 4 -40 -6 -48 -24 c22 -2 38 8 48 24Z" />
        <path d="M220 160 c24 6 40 -2 50 -20 c-22 -4 -38 4 -50 20Z" />
        <path d="M70 80 c-16 -10 -18 -30 -8 -44 c12 12 14 30 8 44Z" />
        <path d="M236 76 c16 -12 16 -32 4 -46 c-12 14 -12 32 -4 46Z" />
        {/* lotus */}
        <path d="M150 120 C162 140 162 164 150 184 C138 164 138 140 150 120Z" />
        <path d="M150 184 C132 176 118 160 116 140 C132 146 146 162 150 184Z" />
        <path d="M150 184 C168 176 182 160 184 140 C168 146 154 162 150 184Z" />
        <path d="M150 184 C128 186 106 178 94 162 C114 160 136 168 150 184Z" />
        <path d="M150 184 C172 186 194 178 206 162 C186 160 164 168 150 184Z" />
        <path d="M150 184 V290" />
        <circle cx="120" cy="228" r="2" fill="var(--fl-gold)" />
        <circle cx="182" cy="236" r="2" fill="var(--fl-gold)" />
      </g>
    </svg>
  );
}

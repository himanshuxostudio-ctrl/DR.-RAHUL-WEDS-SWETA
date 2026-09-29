/**
 * Wedding florals as atmosphere, not stickers: a jaimala-style swag of
 * marigold and jasmine along the top edge, soft blurred clusters in the
 * corners, and a few petals drifting very slowly. Everything sits behind the
 * content at low opacity. Petals are CSS-transform animations only.
 */

const MARIGOLD = ["#e8a23a", "#d98a2b", "#f0b95a"];

function Marigold({ x, y, r, shade = 0 }: { x: number; y: number; r: number; shade?: number }) {
  const c = MARIGOLD[shade % MARIGOLD.length];
  return (
    <g transform={`translate(${x} ${y})`}>
      {[1, 0.78, 0.55, 0.32].map((k, i) => (
        <circle key={i} r={r * k} fill={c} opacity={0.55 + i * 0.12} />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} rx={r * 0.18} ry={r * 0.42} cy={-r * 0.68} fill={c} opacity="0.5" transform={`rotate(${i * 30})`} />
      ))}
    </g>
  );
}

function Jasmine({ x, y, r, rot = 0 }: { x: number; y: number; r: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} rx={r * 0.34} ry={r * 0.72} cy={-r * 0.6} fill="#fbf4e8" opacity="0.9" transform={`rotate(${i * 72})`} />
      ))}
      <circle r={r * 0.22} fill="#e9c77a" />
    </g>
  );
}

/** One hanging swag: flowers strung along a catenary-like curve. */
function Swag({ from, to, sag, flip = false }: { from: number; to: number; sag: number; flip?: boolean }) {
  const n = 13;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return { x: from + (to - from) * t, y: 8 + sag * 4 * t * (1 - t) };
  });
  return (
    <g>
      <path
        d={`M${from} 8 Q${(from + to) / 2} ${8 + sag * 2} ${to} 8`}
        stroke="#c9a45c"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      {pts.map((p, i) =>
        (i + (flip ? 1 : 0)) % 3 === 1 ? (
          <Jasmine key={i} x={p.x} y={p.y} r={4.2} rot={i * 17} />
        ) : (
          <Marigold key={i} x={p.x} y={p.y} r={5.6} shade={i} />
        ),
      )}
      {/* a short tassel at the swag's lowest point */}
      <g transform={`translate(${(from + to) / 2} ${8 + sag})`} opacity="0.8">
        <path d="M0 6 V22" stroke="#c9a45c" strokeWidth="0.7" />
        <Marigold x={0} y={25} r={4.6} shade={2} />
        <Jasmine x={0} y={35} r={3.4} />
      </g>
    </g>
  );
}

function CornerCluster({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <Marigold x={28} y={30} r={16} shade={0} />
      <Marigold x={58} y={18} r={11} shade={1} />
      <Marigold x={18} y={62} r={10} shade={2} />
      <Jasmine x={50} y={46} r={8} rot={15} />
      <Jasmine x={78} y={30} r={6} rot={40} />
      <Jasmine x={34} y={80} r={6} rot={70} />
      <path d="M40 40 C70 60 80 80 96 108" stroke="#7d9460" strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M70 66 c8 -6 16 -4 20 2 c-8 4 -14 4 -20 -2Z" fill="#7d9460" opacity="0.45" />
    </svg>
  );
}

const PETALS = [
  { left: "8%", size: 12, dur: 26, delay: -3, hue: "#e8a23a" },
  { left: "22%", size: 9, dur: 31, delay: -17, hue: "#fbf4e8" },
  { left: "41%", size: 11, dur: 28, delay: -9, hue: "#d98a2b" },
  { left: "63%", size: 8, dur: 34, delay: -22, hue: "#fbf4e8" },
  { left: "79%", size: 12, dur: 29, delay: -6, hue: "#f0b95a" },
  { left: "92%", size: 9, dur: 33, delay: -14, hue: "#e7b9a7" },
];

export function DriftingPetals({ count = 6, className = "" }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {PETALS.slice(0, count).map((p, i) => (
        <span
          key={i}
          className="petal absolute -top-6 block"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.35,
            background: p.hue,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Garland + corner florals + petals, layered behind a section's content. */
export default function FloralAmbience({ garland = true, petals = 6 }: { garland?: boolean; petals?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {garland && (
        <svg viewBox="0 0 400 70" preserveAspectRatio="none" className="garland-sway absolute inset-x-0 top-0 h-[70px] w-full opacity-[0.42] sm:h-[90px]">
          <Swag from={-10} to={140} sag={34} />
          <Swag from={130} to={270} sag={26} flip />
          <Swag from={260} to={410} sag={34} />
        </svg>
      )}
      <CornerCluster className="absolute -bottom-6 -left-6 h-40 w-40 rotate-[-90deg] opacity-[0.22] blur-[1px] sm:h-56 sm:w-56" />
      <CornerCluster className="absolute -bottom-6 -right-6 h-40 w-40 rotate-180 opacity-[0.22] blur-[1px] sm:h-56 sm:w-56" />
      {petals > 0 && <DriftingPetals count={petals} />}
    </div>
  );
}

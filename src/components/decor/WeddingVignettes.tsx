/**
 * Two small decorative wedding moments — a jaimala exchange and a shehnai
 * duet. Original, stylised (faceless) figures drawn as inline SVG in the
 * site's maroon / gold / ivory palette. They are generic wedding characters,
 * not the couple: the Rahul & Sweta illustrations remain the primary artwork.
 *
 * Garland flowers reuse the shared <symbol>s from florals.tsx, so the parent
 * must provide the --fl-* colour variables (see WeddingAtmosphere DARK/LIGHT).
 */
import { m, useReducedMotion } from "framer-motion";
import { F } from "./florals";
import { FLORAL_DARK } from "./WeddingAtmosphere";

const C = {
  skin: "#d4a27c",
  skinShade: "#bf8c66",
  hair: "#2e1a17",
  lehenga: "#9c3646",
  lehengaDeep: "#782432",
  dupatta: "#c65a6b",
  ivory: "#eee0c3",
  ivoryShade: "#dac7a2",
  gold: "#d2ad62",
  line: "rgba(214,178,104,0.7)",
  wood: "#8f5f34",
  shoe: "#b0823f",
};

/** Flowers along a hanging loop between two hands (cubic sag). */
function GarlandLoop({ x1, y1, x2, y2, depth, n = 11, s = 7 }: { x1: number; y1: number; x2: number; y2: number; depth: number; n?: number; s?: number }) {
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const u = 1 - t;
    const x = u * u * u * x1 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x2;
    const y = u * u * u * y1 + 3 * u * u * t * (y1 + depth) + 3 * u * t * t * (y2 + depth) + t * t * t * y2;
    return { x, y };
  });
  const mid = Math.floor(n / 2);
  return (
    <g>
      <path d={`M${x1} ${y1} C${x1} ${y1 + depth} ${x2} ${y2 + depth} ${x2} ${y2}`} stroke="var(--fl-thread)" strokeWidth="0.6" fill="none" />
      {pts.map((p, i) => (
        <F key={i} kind={i === mid ? "rose" : i % 3 === 1 ? "jasmine" : "marigold"} x={p.x} y={p.y} s={i === mid ? s * 1.25 : s} r={i * 37} />
      ))}
    </g>
  );
}

/** Bride, facing right, centred on x≈80. Arms are drawn per pose. */
function Bride() {
  return (
    <g stroke={C.line} strokeWidth="0.6" strokeLinejoin="round">
      {/* dupatta behind */}
      <path d="M74 56 Q54 70 52 112 Q48 176 28 254 Q40 262 50 254 Q68 176 74 118 Z" fill={C.dupatta} fillOpacity="0.5" />
      {/* lehenga */}
      <path d="M68 118 L98 118 Q118 200 134 282 Q84 294 22 282 Q46 200 68 118 Z" fill={C.lehenga} />
      <g stroke={C.gold} strokeOpacity="0.45" fill="none">
        <path d="M75 122 L56 284" />
        <path d="M83 122 L84 289" />
        <path d="M91 122 L110 286" />
      </g>
      <path d="M26 277 Q84 290 131 277" stroke={C.gold} strokeWidth="5" strokeOpacity="0.75" fill="none" />
      <path d="M34 256 Q84 268 126 256" stroke={C.gold} strokeWidth="1" strokeOpacity="0.5" fill="none" strokeDasharray="1 4" strokeLinecap="round" />
      {/* choli */}
      <path d="M69 92 Q83 86 96 92 L98 120 L67 120 Z" fill={C.lehengaDeep} />
      {/* dupatta across the front */}
      <path d="M95 91 Q86 108 70 128 L64 121 Q78 104 90 88 Z" fill={C.dupatta} fillOpacity="0.8" />
      {/* neck + head */}
      <rect x="79" y="80" width="9" height="12" fill={C.skinShade} stroke="none" />
      <circle cx="84" cy="70" r="14" fill={C.skin} />
      {/* hair, bun */}
      <circle cx="68" cy="68" r="8.5" fill={C.hair} stroke="none" />
      <path d="M70 76 Q68 54 86 55 Q99 57 98 67 Q90 61 81 64 Q75 69 74 80 Z" fill={C.hair} stroke="none" />
      {/* dupatta over the head */}
      <path d="M68 60 Q76 48 90 52 Q84 52 78 58 Q72 66 72 80 L67 78 Z" fill={C.dupatta} fillOpacity="0.85" />
      {/* jewellery */}
      <circle cx="90" cy="57.5" r="1.8" fill={C.gold} stroke="none" />
      <circle cx="75.5" cy="80" r="1.6" fill={C.gold} stroke="none" />
      <path d="M78 91 Q84 97 90 91" stroke={C.gold} strokeWidth="1.3" fill="none" />
    </g>
  );
}

/** Groom, facing left, centred on x≈160. Arms are drawn per pose. */
function Groom() {
  return (
    <g stroke={C.line} strokeWidth="0.6" strokeLinejoin="round">
      {/* safa tail */}
      <path d="M175 60 Q188 82 184 106 L178 106 Q181 82 170 64 Z" fill={C.lehenga} />
      {/* churidar + mojari */}
      <path d="M148 212 L159 212 L157 283 L148 283 Z" fill={C.ivoryShade} />
      <path d="M163 212 L175 212 L174 283 L165 283 Z" fill={C.ivoryShade} />
      <ellipse cx="149" cy="285.5" rx="9" ry="3.6" fill={C.shoe} />
      <ellipse cx="172" cy="285.5" rx="9" ry="3.6" fill={C.shoe} />
      {/* sherwani */}
      <path d="M146 90 Q160 84 176 90 L185 214 Q163 220 139 214 Z" fill={C.ivory} />
      <path d="M158 92 L156 214" stroke={C.gold} strokeOpacity="0.8" />
      {[100, 114, 128, 142].map((y) => (
        <circle key={y} cx={157.6 - (y - 92) * 0.016} cy={y} r="1.3" fill={C.gold} stroke="none" />
      ))}
      <path d="M139 212 Q163 218 185 212" stroke={C.gold} strokeWidth="3" strokeOpacity="0.6" fill="none" />
      {/* stole */}
      <path d="M146 90 L153 88 Q170 140 188 178 L180 184 Q164 142 146 97 Z" fill={C.lehengaDeep} />
      {/* neck + head */}
      <rect x="155" y="78" width="9" height="12" fill={C.skinShade} stroke="none" />
      <path d="M150 88 Q160 94 170 88" stroke={C.gold} strokeWidth="2" fill="none" />
      <circle cx="160" cy="69" r="14" fill={C.skin} />
      {/* beard */}
      <path d="M148.5 75 Q151 83.5 158 84 Q164 84 167 79 Q160 81 155 79.5 Q151 78 148.5 75 Z" fill={C.hair} fillOpacity="0.85" stroke="none" />
      {/* safa */}
      <path d="M144 66 Q141 44 162 42 Q181 42 178 64 Q170 56 160 56 Q150 56 144 66 Z" fill={C.lehenga} />
      <path d="M146 59 Q160 50 176 56 M150 50 Q164 44 176 50" stroke={C.gold} strokeOpacity="0.8" fill="none" />
      {/* kalgi */}
      <path d="M163 45 Q160 34 168 28 Q166 36 167 45 Z" fill={C.ivory} />
      <circle cx="164.5" cy="46" r="2.2" fill={C.gold} stroke="none" />
    </g>
  );
}

/** Arm as a soft stroke: sleeve section + skin section + a hand. */
function Arm({ d, sleeve, sleeveLen = 0.4, hand }: { d: string; sleeve: string; sleeveLen?: number; hand: [number, number] }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={C.skin} strokeWidth="6" />
      <path d={d} stroke={sleeve} strokeWidth="7.5" pathLength={1} strokeDasharray={`${sleeveLen} 1`} />
      <circle cx={hand[0]} cy={hand[1]} r="3.6" fill={C.skin} />
    </g>
  );
}

/** Bride and groom each raising a jaimala towards the other. */
export function JaimalaCouple({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="16 20 180 276" className={className} aria-hidden>
      <ellipse cx="104" cy="287" rx="84" ry="6" fill="#000" fillOpacity="0.18" />
      {/* far arms (behind bodies) */}
      <Arm d="M76 96 Q96 124 108 104" sleeve={C.lehengaDeep} sleeveLen={0.25} hand={[108, 103]} />
      <Arm d="M168 96 Q148 126 138 106" sleeve={C.ivory} sleeveLen={0.86} hand={[138, 105]} />
      <Bride />
      <Groom />
      {/* garlands, held up between them */}
      <GarlandLoop x1={105} y1={100} x2={118} y2={96} depth={74} n={15} s={8.5} />
      <GarlandLoop x1={128} y1={96} x2={141} y2={101} depth={70} n={15} s={8.5} />
      {/* near arms */}
      <Arm d="M94 96 Q104 118 118 99" sleeve={C.lehengaDeep} sleeveLen={0.3} hand={[118, 97]} />
      <Arm d="M150 96 Q140 120 128 99" sleeve={C.ivory} sleeveLen={0.86} hand={[128, 97]} />
      {/* bangles */}
      <path d="M113 102 l3.5 3 M111 104.5 l3.5 3" stroke={C.gold} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** A shehnai: slim tapered pipe with gold bands and a flared bell. */
function Shehnai({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <g transform={`translate(${x1} ${y1}) rotate(${ang})`}>
      <path d={`M0 -1.4 L${len} -2.8 L${len} 2.8 L0 1.4 Z`} fill={C.wood} />
      {[0.2, 0.45, 0.7].map((t) => (
        <rect key={t} x={len * t} y={-2.6} width="2" height="5.2" fill={C.gold} />
      ))}
      <path d={`M${len - 1} -2.8 Q${len + 7} -4 ${len + 11} -8 L${len + 11} 8 Q${len + 7} 4 ${len - 1} 2.8 Z`} fill={C.gold} />
      <circle r="1.6" fill={C.gold} />
    </g>
  );
}

/** Bride and groom back to back, both playing shehnai. */
export function ShehnaiCouple({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="8 20 224 276" className={className} aria-hidden>
      <ellipse cx="120" cy="287" rx="92" ry="6" fill="#000" fillOpacity="0.18" />
      {/* far arms (behind bodies) */}
      <Arm d="M96 96 Q62 92 40 55" sleeve={C.lehengaDeep} sleeveLen={0.2} hand={[40, 55]} />
      <Arm d="M144 96 Q180 90 200 56" sleeve={C.ivory} sleeveLen={0.88} hand={[200, 56]} />
      <g transform="translate(168 0) scale(-1 1)">
        <Bride />
      </g>
      <g transform="translate(312 0) scale(-1 1)">
        <Groom />
      </g>
      <Shehnai x1={72} y1={77} x2={24} y2={43} />
      <Shehnai x1={166} y1={78} x2={216} y2={45} />
      {/* near arms */}
      <Arm d="M74 96 Q50 106 55 66" sleeve={C.lehengaDeep} sleeveLen={0.25} hand={[55, 65]} />
      <Arm d="M162 96 Q190 106 184 67" sleeve={C.ivory} sleeveLen={0.86} hand={[184, 66]} />
      <path d="M54 72 l4 1 M54 75 l4 1" stroke={C.gold} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const ART = { jaimala: JaimalaCouple, shehnai: ShehnaiCouple };

/**
 * A vignette as it appears on the page: fades up gently when it scrolls into
 * view, then floats almost imperceptibly (CSS). Decorative only.
 */
export function Vignette({ kind, className = "" }: { kind: keyof typeof ART; className?: string }) {
  const reduce = useReducedMotion();
  const Art = ART[kind];
  return (
    <m.div
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={FLORAL_DARK}
      initial={{ opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 0.97 }}
      whileInView={{ opacity: 0.92, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="atm-float">
        <Art className="block h-auto w-full" />
      </div>
    </m.div>
  );
}

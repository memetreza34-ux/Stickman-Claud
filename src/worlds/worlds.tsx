// Welten: jede hat Farben für Tag, Nacht und Sonnenuntergang und zeichnet sich selbst.
import React from "react";
import { random } from "remotion";
import { drawProp, PropDef } from "./props";

export type TimeOfDay = "day" | "night" | "sunset";

export type Palette = {
  sky: [string, string];
  far: string;
  mid: string;
  near: string;
  ground: string;
  ground2: string;
  accent: string;
  glow: string; // Licht in Fenstern, Lampen
};

export type WorldCtx = {
  W: number;
  H: number;
  g: number; // Bodenlinie (px)
  u: number; // px pro Stickman-Einheit
  frame: number;
  time: TimeOfDay;
  night: boolean;
  c: Palette;
  ink: string;
};

type WorldDef = { palettes: Record<TimeOfDay, Palette>; draw: (x: WorldCtx) => React.ReactNode };

const pal = (
  sky: [string, string], far: string, mid: string, near: string,
  ground: string, ground2: string, accent: string, glow = "#ffe066",
): Palette => ({ sky, far, mid, near, ground, ground2, accent, glow });

// ---------- Bausteine ----------
const Sky: React.FC<{ x: WorldCtx; id: string }> = ({ x, id }) => (
  <>
    <defs>
      <linearGradient id={`w-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={x.c.sky[0]} />
        <stop offset="1" stopColor={x.c.sky[1]} />
      </linearGradient>
    </defs>
    <rect width={x.W} height={x.H} fill={`url(#w-${id})`} />
  </>
);

const Stars: React.FC<{ x: WorldCtx; n?: number; top?: number }> = ({ x, n = 70, top = 0.6 }) =>
  x.night ? (
    <g>
      {new Array(n).fill(0).map((_, i) => (
        <circle
          key={i}
          cx={random(`sx${i}`) * x.W}
          cy={random(`sy${i}`) * x.H * top}
          r={(0.8 + random(`sr${i}`) * 1.8) * x.u * 0.6}
          fill="#fff"
          opacity={0.4 + 0.6 * Math.abs(Math.sin(x.frame / 20 + i))}
        />
      ))}
    </g>
  ) : null;

const SunMoon: React.FC<{ x: WorldCtx; px: number; py: number; r?: number }> = ({ x, px, py, r = 50 }) => {
  const R = r * x.u;
  if (x.night)
    return (
      <g>
        <circle cx={px} cy={py} r={R * 2.2} fill="#fff" opacity={0.05} />
        <circle cx={px} cy={py} r={R} fill="#ebe5d0" />
        <circle cx={px - R * 0.3} cy={py - R * 0.2} r={R * 0.18} fill="#d4cdb6" />
        <circle cx={px + R * 0.35} cy={py + R * 0.3} r={R * 0.12} fill="#d4cdb6" />
      </g>
    );
  const sunset = x.time === "sunset";
  return (
    <g>
      <circle cx={px} cy={py} r={R * 1.9} fill={sunset ? "#ffa94d" : "#fff6c8"} opacity={0.35} />
      <circle cx={px} cy={py} r={R} fill={sunset ? "#ff8a3d" : "#ffd95a"} />
    </g>
  );
};

const Ground: React.FC<{ x: WorldCtx }> = ({ x }) => (
  <>
    <rect y={x.g} width={x.W} height={x.H - x.g} fill={x.c.ground} />
    <rect y={x.g - 3} width={x.W} height={6} fill={x.c.ground2} />
  </>
);

const Hills: React.FC<{ x: WorldCtx; color: string; base: number; amp: number; seed: string }> = ({ x, color, base, amp, seed }) => {
  const pts: string[] = [`0,${x.H}`];
  for (let i = 0; i <= 12; i++) {
    pts.push(`${(i / 12) * x.W},${base - (Math.sin(i * 1.3 + random(seed) * 6) * 0.5 + 0.5) * amp}`);
  }
  pts.push(`${x.W},${x.H}`);
  return <polygon points={pts.join(" ")} fill={color} />;
};

const Skyline: React.FC<{ x: WorldCtx; color: string; seed: string; minH: number; maxH: number; lit?: boolean; base?: number }> = ({
  x, color, seed, minH, maxH, lit, base,
}) => {
  const b = base ?? x.g;
  const out: React.ReactNode[] = [];
  let px = -20;
  let i = 0;
  while (px < x.W) {
    const w = (60 + random(`${seed}w${i}`) * 90) * x.u * 0.8;
    const h = (minH + random(`${seed}h${i}`) * (maxH - minH)) * x.u;
    out.push(<rect key={`b${i}`} x={px} y={b - h} width={w - 4} height={h} fill={color} />);
    if (lit) {
      for (let wy = b - h + 14 * x.u; wy < b - 20 * x.u; wy += 26 * x.u) {
        for (let wx = px + 10 * x.u; wx < px + w - 20 * x.u; wx += 22 * x.u) {
          if (random(`${seed}${i}-${wx}-${wy}`) > (x.night ? 0.55 : 0.75))
            out.push(<rect key={`w${i}-${wx}-${wy}`} x={wx} y={wy} width={9 * x.u} height={12 * x.u} fill={x.night ? x.c.glow : "#d0ebff"} opacity={0.85} />);
        }
      }
    }
    px += w;
    i++;
  }
  return <g>{out}</g>;
};

const Bricks: React.FC<{ x0: number; y0: number; w: number; h: number; color: string; line: string; s: number }> = ({ x0, y0, w, h, color, line, s }) => {
  const bw = 60 * s;
  const bh = 26 * s;
  const rows: React.ReactNode[] = [];
  for (let r = 0; r * bh < h; r++) {
    for (let c = -1; c * bw < w; c++) {
      rows.push(<rect key={`${r}-${c}`} x={x0 + c * bw + (r % 2 ? bw / 2 : 0)} y={y0 + r * bh} width={bw - 4 * s} height={bh - 4 * s} fill={color} />);
    }
  }
  return (
    <g>
      <rect x={x0} y={y0} width={w} height={h} fill={line} />
      {rows}
    </g>
  );
};

const Wall: React.FC<{ x: WorldCtx; color: string }> = ({ x, color }) => <rect width={x.W} height={x.g} fill={color} />;

const P = (x: WorldCtx, type: PropDef["type"], xp: number, more: Partial<PropDef> = {}) => {
  const s = more.scale ?? 1;
  return (
    <g key={`${type}-${xp}-${more.y ?? 0}`} transform={`translate(${(xp / 100) * x.W} ${x.g - (more.y ?? 0) * x.u}) scale(${more.flip ? -s : s} ${s})`}>
      {drawProp({ type, x: xp, ...more }, { u: x.u, frame: x.frame, night: x.night, ink: x.ink })}
    </g>
  );
};

const WindowFrame: React.FC<{ x: WorldCtx; px: number; py: number; w: number; h: number }> = ({ x, px, py, w, h }) => (
  <g>
    <rect x={px} y={py} width={w} height={h} fill={x.night ? "#0b1530" : x.time === "sunset" ? "#ffb37a" : "#bfe3ff"} />
    {x.night ? <circle cx={px + w * 0.7} cy={py + h * 0.3} r={w * 0.1} fill="#ebe5d0" /> : null}
    <rect x={px} y={py} width={w} height={h} fill="none" stroke={x.c.near} strokeWidth={12 * x.u * 0.5} />
    <line x1={px + w / 2} x2={px + w / 2} y1={py} y2={py + h} stroke={x.c.near} strokeWidth={6 * x.u * 0.5} />
  </g>
);

// ---------- Welten ----------
export const WORLDS = {
  city: {
    palettes: {
      day: pal(["#8ecdf5", "#d6eefc"], "#a9c4dc", "#7d93ab", "#4f5d73", "#6c757d", "#adb5bd", "#e03131"),
      sunset: pal(["#ff9a5a", "#ffd1a1"], "#c08497", "#80576b", "#4a3248", "#5c4a55", "#8a6d78", "#ff6b6b"),
      night: pal(["#050914", "#16213e"], "#1c2541", "#222b45", "#151a2e", "#22252e", "#3a3f4b", "#e03131", "#ffd43b"),
    },
    draw: (x) => (
      <>
        <Sky x={x} id="city" />
        <Stars x={x} top={0.4} />
        <SunMoon x={x} px={x.W * 0.8} py={x.H * 0.12} />
        <Skyline x={x} color={x.c.far} seed="cf" minH={200} maxH={420} lit />
        <Skyline x={x} color={x.c.mid} seed="cm" minH={120} maxH={260} lit />
        <Ground x={x} />
        {P(x, "lamp", 20)}
        {P(x, "lamp", 82)}
      </>
    ),
  },
  rooftop: {
    palettes: {
      day: pal(["#74c0fc", "#d0ebff"], "#a5b8cc", "#7d8fa3", "#5c6670", "#868e96", "#495057", "#e03131"),
      sunset: pal(["#f76707", "#ffc078"], "#b07a8c", "#7a5266", "#5c4048", "#6b5a60", "#3b3036", "#ff6b6b"),
      night: pal(["#03060f", "#141b33"], "#1b2240", "#232a48", "#2b2f3a", "#3a3f4b", "#1d2027", "#e03131", "#ffd43b"),
    },
    draw: (x) => (
      <>
        <Sky x={x} id="roof" />
        <Stars x={x} top={0.5} />
        <SunMoon x={x} px={x.W * 0.2} py={x.H * 0.14} />
        <Skyline x={x} color={x.c.far} seed="rf" minH={80} maxH={300} lit base={x.g - 40 * x.u} />
        <rect x={x.W * 0.7} y={x.g - 170 * x.u} width={90 * x.u} height={110 * x.u} rx={8} fill={x.c.near} />
        <rect x={x.W * 0.7 + 10 * x.u} y={x.g - 60 * x.u} width={8 * x.u} height={60 * x.u} fill={x.c.near} />
        <rect x={x.W * 0.7 + 72 * x.u} y={x.g - 60 * x.u} width={8 * x.u} height={60 * x.u} fill={x.c.near} />
        <line x1={x.W * 0.12} y1={x.g} x2={x.W * 0.12} y2={x.g - 260 * x.u} stroke={x.c.near} strokeWidth={6 * x.u} />
        <circle cx={x.W * 0.12} cy={x.g - 262 * x.u} r={6 * x.u} fill="#ff6b6b" opacity={x.frame % 30 < 15 ? 1 : 0.2} />
        <rect y={x.g} width={x.W} height={x.H - x.g} fill={x.c.ground} />
      </>
    ),
  },
  livingroom: {
    palettes: {
      day: pal(["#fff", "#fff"], "#f3e9dc", "#d8c3a5", "#8d6e63", "#c8a27a", "#a47551", "#e07a5f"),
      sunset: pal(["#fff", "#fff"], "#f2d0b5", "#d19c7a", "#7a4f3a", "#b0805a", "#8a5a3c", "#e07a5f"),
      night: pal(["#000", "#000"], "#2a2833", "#3b3646", "#1c1a22", "#2d2620", "#3a3028", "#e07a5f", "#ffd8a8"),
    },
    draw: (x) => (
      <>
        <Wall x={x} color={x.c.far} />
        <WindowFrame x={x} px={x.W * 0.08} py={x.g - 300 * x.u} w={120 * x.u} h={140 * x.u} />
        <rect x={x.W * 0.55} y={x.g - 290 * x.u} width={90 * x.u} height={65 * x.u} fill={x.c.mid} stroke={x.c.near} strokeWidth={6} />
        <Ground x={x} />
        <ellipse cx={x.W * 0.5} cy={x.g + 30 * x.u} rx={x.W * 0.3} ry={18 * x.u} fill={x.c.accent} opacity={0.5} />
        {P(x, "sofa", 30)}
        {P(x, "tv", 80)}
        {P(x, "plant", 95)}
      </>
    ),
  },
  kitchen: {
    palettes: {
      day: pal(["#fff", "#fff"], "#e6f2ee", "#b5d3c9", "#5c7d73", "#d9cbb8", "#a89580", "#ff8787"),
      sunset: pal(["#fff", "#fff"], "#f2dfcc", "#d4b49a", "#6e5544", "#c9ad94", "#957a62", "#ff8787"),
      night: pal(["#000", "#000"], "#233038", "#2f3f48", "#1a2328", "#2b2a28", "#3b3a36", "#ff8787", "#ffd8a8"),
    },
    draw: (x) => (
      <>
        <Wall x={x} color={x.c.far} />
        {new Array(Math.ceil(x.W / (40 * x.u))).fill(0).map((_, i) => (
          <rect key={i} x={i * 40 * x.u} y={x.g - 190 * x.u} width={38 * x.u} height={70 * x.u} fill={x.c.mid} opacity={0.5} />
        ))}
        <WindowFrame x={x} px={x.W * 0.42} py={x.g - 330 * x.u} w={110 * x.u} h={110 * x.u} />
        <rect x={0} y={x.g - 110 * x.u} width={x.W * 0.62} height={110 * x.u} fill={x.c.near} />
        <rect x={0} y={x.g - 120 * x.u} width={x.W * 0.64} height={14 * x.u} fill={x.c.ground} />
        <rect x={x.W * 0.12} y={x.g - 150 * x.u} width={70 * x.u} height={30 * x.u} rx={6} fill="#495057" />
        <Ground x={x} />
        {P(x, "fridge", 88)}
      </>
    ),
  },
  school: {
    palettes: {
      day: pal(["#fff", "#fff"], "#f1ead8", "#2f4f3f", "#7a5a3a", "#c9b38f", "#9c8463", "#f08c00"),
      sunset: pal(["#fff", "#fff"], "#f0d9bf", "#2b4537", "#6e4f33", "#bf9f7a", "#8c7254", "#f08c00"),
      night: pal(["#000", "#000"], "#24282f", "#1c2b24", "#3b2f22", "#2e2a24", "#3e3830", "#f08c00", "#ffe8a3"),
    },
    draw: (x) => (
      <>
        <Wall x={x} color={x.c.far} />
        <rect x={x.W * 0.2} y={x.g - 330 * x.u} width={x.W * 0.6} height={160 * x.u} fill={x.c.mid} stroke={x.c.near} strokeWidth={10 * x.u * 0.6} />
        <text x={x.W * 0.25} y={x.g - 270 * x.u} fontSize={34 * x.u} fill="#fff" opacity={0.85} fontFamily="cursive">
          2 + 2 = 4
        </text>
        <path d={`M ${x.W * 0.5} ${x.g - 250 * x.u} q ${30 * x.u} ${-40 * x.u} ${60 * x.u} 0 t ${60 * x.u} 0`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.7} />
        <circle cx={x.W * 0.9} cy={x.g - 330 * x.u} r={30 * x.u} fill="#fff" stroke={x.c.near} strokeWidth={5} />
        <line x1={x.W * 0.9} y1={x.g - 330 * x.u} x2={x.W * 0.9} y2={x.g - 350 * x.u} stroke="#222" strokeWidth={3} />
        <line x1={x.W * 0.9} y1={x.g - 330 * x.u} x2={x.W * 0.9 + 14 * x.u} y2={x.g - 330 * x.u} stroke="#222" strokeWidth={3} />
        <Ground x={x} />
        {P(x, "table", 15, { scale: 0.8 })}
        {P(x, "chair", 22, { scale: 0.8, flip: true })}
        {P(x, "table", 85, { scale: 0.8 })}
        {P(x, "chair", 78, { scale: 0.8 })}
      </>
    ),
  },
  office: {
    palettes: {
      day: pal(["#fff", "#fff"], "#e9ecef", "#ced4da", "#495057", "#adb5bd", "#868e96", "#1c7ed6"),
      sunset: pal(["#fff", "#fff"], "#f1e3d3", "#d6c2ad", "#5a4a3c", "#b8a590", "#8f7c68", "#1c7ed6"),
      night: pal(["#000", "#000"], "#1f2329", "#2a2f37", "#111418", "#25292f", "#33383f", "#1c7ed6", "#ffe8a3"),
    },
    draw: (x) => (
      <>
        <Wall x={x} color={x.c.far} />
        <rect x={x.W * 0.1} y={x.g - 340 * x.u} width={x.W * 0.8} height={170 * x.u} fill={x.night ? "#0b1530" : "#bfe3ff"} />
        <Skyline x={{ ...x, g: x.g - 170 * x.u }} color={x.night ? "#1c2541" : "#9fb4c8"} seed="of" minH={30} maxH={150} lit />
        {new Array(12).fill(0).map((_, i) => (
          <rect key={i} x={x.W * 0.1} y={x.g - 340 * x.u + i * 14 * x.u} width={x.W * 0.8} height={6 * x.u} fill={x.c.mid} opacity={0.55} />
        ))}
        <rect x={x.W * 0.1} y={x.g - 340 * x.u} width={x.W * 0.8} height={170 * x.u} fill="none" stroke={x.c.near} strokeWidth={8} />
        <Ground x={x} />
        {P(x, "computer", 25)}
        {P(x, "chair", 32, { flip: true })}
        {P(x, "computer", 75)}
        {P(x, "plant", 94)}
      </>
    ),
  },
  hospital: {
    palettes: {
      day: pal(["#fff", "#fff"], "#d8efe6", "#a9d6c5", "#4f7a6c", "#e9ecef", "#ced4da", "#e03131"),
      sunset: pal(["#fff", "#fff"], "#e8dccb", "#c9b59c", "#6b5a48", "#ddd3c6", "#bfb2a2", "#e03131"),
      night: pal(["#000", "#000"], "#1d2a27", "#26362f", "#121a17", "#2a2e30", "#383d40", "#e03131", "#c3fae8"),
    },
    draw: (x) => (
      <>
        <Wall x={x} color={x.c.far} />
        <rect y={x.g - 120 * x.u} width={x.W} height={10 * x.u} fill={x.c.mid} />
        <WindowFrame x={x} px={x.W * 0.12} py={x.g - 320 * x.u} w={110 * x.u} h={120 * x.u} />
        <g transform={`translate(${x.W * 0.82} ${x.g - 300 * x.u})`}>
          <rect x={-30 * x.u} y={-10 * x.u} width={60 * x.u} height={20 * x.u} fill={x.c.accent} />
          <rect x={-10 * x.u} y={-30 * x.u} width={20 * x.u} height={60 * x.u} fill={x.c.accent} />
        </g>
        {new Array(7).fill(0).map((_, i) => (
          <rect key={i} x={x.W * 0.62 + i * 18 * x.u} y={x.g - 330 * x.u} width={16 * x.u} height={330 * x.u} fill="#a5d8ff" opacity={0.6} />
        ))}
        <Ground x={x} />
        {P(x, "bed", 40, { color: "#e7f5ff" })}
        <g transform={`translate(${x.W * 0.2} ${x.g})`}>
          <line x1={0} y1={0} x2={0} y2={-220 * x.u} stroke="#868e96" strokeWidth={5 * x.u} />
          <rect x={-14 * x.u} y={-215 * x.u} width={28 * x.u} height={40 * x.u} rx={6} fill="#a5d8ff" opacity={0.8} />
        </g>
      </>
    ),
  },
  cafe: {
    palettes: {
      day: pal(["#fff", "#fff"], "#b5654a", "#8a4430", "#3e2b22", "#7a5235", "#5c3d28", "#f08c00"),
      sunset: pal(["#fff", "#fff"], "#a8553e", "#7a3a28", "#2e1f18", "#6b452c", "#4f3220", "#f08c00"),
      night: pal(["#000", "#000"], "#4a2a22", "#331c16", "#1a0f0c", "#3a2618", "#2a1a10", "#f08c00", "#ffd8a8"),
    },
    draw: (x) => (
      <>
        <Bricks x0={0} y0={0} w={x.W} h={x.g} color={x.c.far} line={x.c.mid} s={x.u * 0.7} />
        <rect x={x.W * 0.55} y={x.g - 330 * x.u} width={200 * x.u} height={120 * x.u} rx={6} fill="#212529" stroke="#8d5a3b" strokeWidth={8} />
        <text x={x.W * 0.55 + 100 * x.u} y={x.g - 290 * x.u} textAnchor="middle" fontSize={26 * x.u} fill="#fff" fontFamily="cursive">
          MENÜ
        </text>
        <text x={x.W * 0.55 + 100 * x.u} y={x.g - 255 * x.u} textAnchor="middle" fontSize={18 * x.u} fill="#ffe066" fontFamily="cursive">
          Kaffee 2,50 €
        </text>
        {[0.2, 0.4, 0.8].map((lx) => (
          <g key={lx}>
            <line x1={x.W * lx} y1={0} x2={x.W * lx} y2={x.g - 360 * x.u} stroke="#222" strokeWidth={3} />
            <path d={`M ${x.W * lx - 25 * x.u} ${x.g - 340 * x.u} L ${x.W * lx + 25 * x.u} ${x.g - 340 * x.u} L ${x.W * lx + 12 * x.u} ${x.g - 362 * x.u} L ${x.W * lx - 12 * x.u} ${x.g - 362 * x.u} Z`} fill="#343a40" />
            <circle cx={x.W * lx} cy={x.g - 336 * x.u} r={8 * x.u} fill={x.c.glow} />
          </g>
        ))}
        <rect x={x.W * 0.6} y={x.g - 120 * x.u} width={x.W * 0.4} height={120 * x.u} fill={x.c.near} />
        <rect x={x.W * 0.58} y={x.g - 128 * x.u} width={x.W * 0.42} height={12 * x.u} fill="#c08552" />
        <Ground x={x} />
        {P(x, "table", 22, { scale: 0.75 })}
        {P(x, "chair", 12, { scale: 0.8, flip: true })}
      </>
    ),
  },
  library: {
    palettes: {
      day: pal(["#fff", "#fff"], "#efe2c8", "#c9a87a", "#5c3d28", "#a0673f", "#7a4e2d", "#c92a2a"),
      sunset: pal(["#fff", "#fff"], "#e8cfa8", "#bb9466", "#4f3220", "#94592f", "#6b4226", "#c92a2a"),
      night: pal(["#000", "#000"], "#2b2418", "#3b2f20", "#1a140c", "#33251a", "#4a3624", "#c92a2a", "#ffd8a8"),
    },
    draw: (x) => (
      <>
        <Wall x={x} color={x.c.far} />
        <Ground x={x} />
        {[10, 30, 70, 90].map((px) => P(x, "bookshelf", px))}
        {P(x, "table", 50, { scale: 0.9 })}
        <g transform={`translate(${x.W * 0.55} ${x.g - 68 * x.u})`}>
          <line x1={0} y1={0} x2={0} y2={-40 * x.u} stroke="#343a40" strokeWidth={3} />
          <path d={`M ${-14 * x.u} ${-40 * x.u} L ${14 * x.u} ${-40 * x.u} L ${8 * x.u} ${-58 * x.u} L ${-8 * x.u} ${-58 * x.u} Z`} fill="#2f9e44" />
          {x.night ? <circle cx={0} cy={-30 * x.u} r={60 * x.u} fill={x.c.glow} opacity={0.15} /> : null}
        </g>
      </>
    ),
  },
  stage: {
    palettes: {
      day: pal(["#1a1a2e", "#16213e"], "#7a0f1f", "#5c0a17", "#2b1810", "#8d5a3b", "#6b4226", "#ffd43b"),
      sunset: pal(["#1a1a2e", "#16213e"], "#7a0f1f", "#5c0a17", "#2b1810", "#8d5a3b", "#6b4226", "#ffd43b"),
      night: pal(["#0a0a12", "#10101c"], "#5c0a17", "#420712", "#1a0f0a", "#6b4226", "#4f3220", "#ffd43b"),
    },
    draw: (x) => (
      <>
        <Sky x={x} id="stage" />
        {[0, 1].map((side) =>
          new Array(5).fill(0).map((_, i) => (
            <rect key={`${side}-${i}`} x={side ? x.W * 0.82 + i * 30 * x.u : i * 30 * x.u} y={0} width={34 * x.u} height={x.g} fill={i % 2 ? x.c.far : x.c.mid} />
          )),
        )}
        <path d={`M 0 0 L ${x.W} 0 L ${x.W} ${60 * x.u} Q ${x.W / 2} ${120 * x.u} 0 ${60 * x.u} Z`} fill={x.c.far} />
        {[0.3, 0.7].map((sx, i) => (
          <polygon
            key={sx}
            points={`${x.W * sx - 20 * x.u},0 ${x.W * sx + 20 * x.u},0 ${x.W * (0.5 + Math.sin(x.frame / 40 + i * 2) * 0.12) + 140 * x.u},${x.g} ${x.W * (0.5 + Math.sin(x.frame / 40 + i * 2) * 0.12) - 140 * x.u},${x.g}`}
            fill="#fff8db"
            opacity={0.14}
          />
        ))}
        <Ground x={x} />
        {new Array(10).fill(0).map((_, i) => (
          <line key={i} x1={0} x2={x.W} y1={x.g + i * 22 * x.u} y2={x.g + i * 22 * x.u} stroke={x.c.ground2} strokeWidth={2} />
        ))}
      </>
    ),
  },
  castle: {
    palettes: {
      day: pal(["#fff", "#fff"], "#9a9184", "#7d7468", "#4a443c", "#6e6559", "#524a40", "#c92a2a"),
      sunset: pal(["#fff", "#fff"], "#9a8170", "#7a6252", "#3e3028", "#655244", "#4a3a2e", "#c92a2a"),
      night: pal(["#000", "#000"], "#3a3630", "#2c2924", "#1a1815", "#2a2622", "#36312b", "#c92a2a", "#ffb84d"),
    },
    draw: (x) => (
      <>
        <Bricks x0={0} y0={0} w={x.W} h={x.g} color={x.c.far} line={x.c.mid} s={x.u} />
        {[0.25, 0.75].map((bx) => (
          <path key={bx} d={`M ${x.W * bx - 40 * x.u} ${x.g - 380 * x.u} L ${x.W * bx + 40 * x.u} ${x.g - 380 * x.u} L ${x.W * bx + 40 * x.u} ${x.g - 200 * x.u} L ${x.W * bx} ${x.g - 230 * x.u} L ${x.W * bx - 40 * x.u} ${x.g - 200 * x.u} Z`} fill={x.c.accent} />
        ))}
        <Ground x={x} />
        <rect x={x.W * 0.35} y={x.g} width={x.W * 0.3} height={x.H - x.g} fill="#a61e1e" opacity={0.85} />
        {P(x, "torch", 12)}
        {P(x, "torch", 88)}
        {P(x, "throne", 50)}
      </>
    ),
  },
  beach: {
    palettes: {
      day: pal(["#4dabf7", "#d0ebff"], "#1c7ed6", "#4dabf7", "#e3c08d", "#f4dca5", "#e3c08d", "#ff6b6b"),
      sunset: pal(["#ff7b54", "#ffd59e"], "#b8526b", "#e07a6b", "#d9a86c", "#e8c08a", "#d0a26a", "#ff6b6b"),
      night: pal(["#020617", "#13203f"], "#0b1f3a", "#163055", "#5c5040", "#6e604c", "#5a4e3c", "#ff6b6b"),
    },
    draw: (x) => {
      const sea = x.g - 70 * x.u;
      return (
        <>
          <Sky x={x} id="beach" />
          <Stars x={x} top={0.5} />
          <SunMoon x={x} px={x.W * 0.7} py={x.time === "sunset" ? sea - 30 * x.u : x.H * 0.14} r={60} />
          <rect y={sea - 120 * x.u} width={x.W} height={120 * x.u} fill={x.c.far} />
          {[0, 1, 2].map((k) => (
            <path
              key={k}
              d={`M 0 ${sea - (40 - k * 15) * x.u} ${new Array(9).fill(0).map((_, i) => `q ${x.W / 18} ${(10 * x.u) * Math.sin(x.frame / 15 + i + k)} ${x.W / 9} 0`).join(" ")} L ${x.W} ${sea} L 0 ${sea} Z`}
              fill={x.c.mid}
              opacity={0.5}
            />
          ))}
          <path d={`M 0 ${sea} Q ${x.W / 2} ${sea - 20 * x.u} ${x.W} ${sea} L ${x.W} ${x.H} L 0 ${x.H} Z`} fill={x.c.ground} />
          <rect y={x.g} width={x.W} height={x.H - x.g} fill={x.c.ground} />
          {P(x, "palm", 10)}
          {P(x, "umbrella", 85)}
        </>
      );
    },
  },
  desert: {
    palettes: {
      day: pal(["#74c0fc", "#fff3bf"], "#e8b46a", "#d99a4e", "#b3742f", "#f0c27a", "#d9a35c", "#e8590c"),
      sunset: pal(["#e8590c", "#ffd8a8"], "#c46b3a", "#a8552c", "#7a3a1c", "#d98a4e", "#bf7038", "#e8590c"),
      night: pal(["#03071e", "#1d2a4d"], "#3d3550", "#33304a", "#29263c", "#4a4058", "#3a3248", "#e8590c"),
    },
    draw: (x) => (
      <>
        <Sky x={x} id="desert" />
        <Stars x={x} n={100} />
        <SunMoon x={x} px={x.W * 0.25} py={x.H * 0.15} r={70} />
        <Hills x={x} color={x.c.far} base={x.g - 60 * x.u} amp={140 * x.u} seed="d1" />
        <Hills x={x} color={x.c.mid} base={x.g + 10 * x.u} amp={70 * x.u} seed="d2" />
        <Ground x={x} />
        {P(x, "cactus", 15)}
        {P(x, "cactus", 85, { scale: 0.7, flip: true })}
        {P(x, "rock", 65, { scale: 0.7 })}
      </>
    ),
  },
  mountains: {
    palettes: {
      day: pal(["#74c0fc", "#e7f5ff"], "#8aa1b8", "#6b8299", "#2f6b4f", "#f8f9fa", "#dee2e6", "#1c7ed6"),
      sunset: pal(["#f783ac", "#ffd8a8"], "#8f6a8a", "#6e4f6b", "#2e4f45", "#f3e6e8", "#d9c3c8", "#1c7ed6"),
      night: pal(["#020617", "#1e2a4a"], "#2a3550", "#202942", "#122a22", "#c5cfdc", "#9aa7b8", "#1c7ed6"),
    },
    draw: (x) => (
      <>
        <Sky x={x} id="mtn" />
        <Stars x={x} />
        <SunMoon x={x} px={x.W * 0.8} py={x.H * 0.12} />
        {[
          [0.2, 380, x.c.far],
          [0.55, 460, x.c.far],
          [0.85, 360, x.c.far],
          [0.38, 300, x.c.mid],
          [0.72, 280, x.c.mid],
        ].map(([mx, mh, col], i) => {
          const cx = x.W * (mx as number);
          const h = (mh as number) * x.u;
          const w = h * 1.1;
          return (
            <g key={i}>
              <polygon points={`${cx - w},${x.g} ${cx},${x.g - h} ${cx + w},${x.g}`} fill={col as string} />
              <polygon points={`${cx - w * 0.25},${x.g - h * 0.75} ${cx},${x.g - h} ${cx + w * 0.25},${x.g - h * 0.75} ${cx + w * 0.1},${x.g - h * 0.7} ${cx - w * 0.08},${x.g - h * 0.78}`} fill="#fff" />
            </g>
          );
        })}
        <Ground x={x} />
        {P(x, "pine", 8, { color: x.c.near })}
        {P(x, "pine", 18, { scale: 0.7, color: x.c.near })}
        {P(x, "pine", 90, { scale: 0.85, color: x.c.near })}
      </>
    ),
  },
  jungle: {
    palettes: {
      day: pal(["#b2f2bb", "#ebfbee"], "#2b8a3e", "#37b24d", "#1e6b30", "#5c4a2e", "#4a3a22", "#f59f00"),
      sunset: pal(["#ffc078", "#d8f5a2"], "#2b6a3e", "#3a8a4d", "#1a4f28", "#4f3e26", "#3e301c", "#f59f00"),
      night: pal(["#06140c", "#0f2a1a"], "#0f2d1a", "#14391f", "#0a1f11", "#1f1a12", "#2a2418", "#f59f00", "#c0eb75"),
    },
    draw: (x) => (
      <>
        <Sky x={x} id="jungle" />
        {new Array(14).fill(0).map((_, i) => (
          <ellipse key={i} cx={random(`jx${i}`) * x.W} cy={x.g - (150 + random(`jy${i}`) * 250) * x.u} rx={(80 + random(`jr${i}`) * 80) * x.u} ry={(50 + random(`jq${i}`) * 40) * x.u} fill={i % 2 ? x.c.far : x.c.mid} />
        ))}
        {new Array(6).fill(0).map((_, i) => (
          <path key={i} d={`M ${(i + 0.5) * (x.W / 6)} 0 Q ${(i + 0.5) * (x.W / 6) + Math.sin(x.frame / 30 + i) * 20} ${x.g * 0.3} ${(i + 0.5) * (x.W / 6)} ${x.g * (0.35 + random(`v${i}`) * 0.3)}`} stroke={x.c.near} strokeWidth={6 * x.u} fill="none" />
        ))}
        <Ground x={x} />
        {P(x, "palm", 5, { scale: 1.2 })}
        {P(x, "bush", 30, { color: x.c.mid })}
        {P(x, "bush", 92, { color: x.c.far, scale: 1.3 })}
      </>
    ),
  },
  farm: {
    palettes: {
      day: pal(["#74c0fc", "#e7f5ff"], "#8ce99a", "#69db7c", "#40c057", "#94d82d", "#74b816", "#c92a2a"),
      sunset: pal(["#ff922b", "#ffe8cc"], "#a9c97a", "#86b05a", "#5f8a3a", "#9ab84a", "#7a9a32", "#c92a2a"),
      night: pal(["#020617", "#1b2747"], "#1f3a2c", "#1a3326", "#132a1e", "#1d331f", "#2a4a2c", "#c92a2a"),
    },
    draw: (x) => (
      <>
        <Sky x={x} id="farm" />
        <Stars x={x} />
        <SunMoon x={x} px={x.W * 0.18} py={x.H * 0.13} />
        <Hills x={x} color={x.c.far} base={x.g - 40 * x.u} amp={90 * x.u} seed="f1" />
        <g transform={`translate(${x.W * 0.7} ${x.g})`}>
          <rect x={-120 * x.u} y={-200 * x.u} width={240 * x.u} height={200 * x.u} fill={x.c.accent} />
          <polygon points={`${-140 * x.u},${-195 * x.u} 0,${-300 * x.u} ${140 * x.u},${-195 * x.u}`} fill="#7a1c1c" />
          <rect x={-45 * x.u} y={-120 * x.u} width={90 * x.u} height={120 * x.u} fill="#fff" />
          <path d={`M ${-45 * x.u} ${-120 * x.u} L ${45 * x.u} 0 M ${45 * x.u} ${-120 * x.u} L ${-45 * x.u} 0`} stroke={x.c.accent} strokeWidth={8 * x.u} />
        </g>
        <Ground x={x} />
        {P(x, "fence", 20)}
        {P(x, "tree", 95, { scale: 0.8 })}
      </>
    ),
  },
  space: {
    palettes: {
      day: pal(["#000005", "#0b0b24"], "#5f3dc4", "#f76707", "#868e96", "#adb5bd", "#868e96", "#4dabf7"),
      sunset: pal(["#000005", "#1a0b24"], "#862e9c", "#f76707", "#868e96", "#adb5bd", "#868e96", "#4dabf7"),
      night: pal(["#000005", "#0b0b24"], "#5f3dc4", "#f76707", "#868e96", "#adb5bd", "#868e96", "#4dabf7"),
    },
    draw: (x) => {
      const nx = { ...x, night: true };
      return (
        <>
          <Sky x={x} id="space" />
          <Stars x={nx} n={160} top={1} />
          <g transform={`translate(${x.W * 0.75} ${x.H * 0.2})`}>
            <circle r={90 * x.u} fill={x.c.far} />
            <ellipse rx={150 * x.u} ry={28 * x.u} fill="none" stroke="#e5dbff" strokeWidth={8 * x.u} transform="rotate(-18)" />
          </g>
          <g transform={`translate(${x.W * 0.15} ${x.H * 0.12})`}>
            <circle r={45 * x.u} fill="#1c7ed6" />
            <path d={`M ${-30 * x.u} ${-10 * x.u} q ${20 * x.u} ${-20 * x.u} ${35 * x.u} 0 q ${-5 * x.u} ${25 * x.u} ${-25 * x.u} ${20 * x.u} Z`} fill="#37b24d" />
          </g>
          <path d={`M 0 ${x.g} Q ${x.W / 2} ${x.g - 50 * x.u} ${x.W} ${x.g} L ${x.W} ${x.H} L 0 ${x.H} Z`} fill={x.c.ground} />
          <rect y={x.g} width={x.W} height={x.H - x.g} fill={x.c.ground} />
          {[[0.2, 30], [0.6, 45], [0.85, 22]].map(([cx, r], i) => (
            <ellipse key={i} cx={x.W * cx} cy={x.g + 40 * x.u} rx={r * x.u} ry={r * 0.35 * x.u} fill={x.c.ground2} />
          ))}
        </>
      );
    },
  },
  underwater: {
    palettes: {
      day: pal(["#1c7ed6", "#0b3d6e"], "#1971c2", "#2b8a3e", "#0b7285", "#e3c08d", "#c9a36a", "#ff8787"),
      sunset: pal(["#1c7ed6", "#0b3d6e"], "#1971c2", "#2b8a3e", "#0b7285", "#e3c08d", "#c9a36a", "#ff8787"),
      night: pal(["#062a4a", "#020c1a"], "#0b3d6e", "#1a4f2a", "#063d4a", "#5c5040", "#4a3f30", "#ff8787"),
    },
    draw: (x) => (
      <>
        <Sky x={x} id="sea" />
        {new Array(5).fill(0).map((_, i) => (
          <polygon key={i} points={`${(0.1 + i * 0.2) * x.W},0 ${(0.15 + i * 0.2) * x.W},0 ${(0.25 + i * 0.2) * x.W + Math.sin(x.frame / 40 + i) * 30},${x.g} ${(0.05 + i * 0.2) * x.W + Math.sin(x.frame / 40 + i) * 30},${x.g}`} fill="#fff" opacity={0.05} />
        ))}
        <rect y={x.g} width={x.W} height={x.H - x.g} fill={x.c.ground} />
        {new Array(9).fill(0).map((_, i) => {
          const bx = (i / 8) * x.W + random(`kx${i}`) * 40;
          const h = (100 + random(`kh${i}`) * 160) * x.u;
          return (
            <path key={i} d={`M ${bx} ${x.g + 4} Q ${bx + Math.sin(x.frame / 20 + i) * 30} ${x.g - h / 2} ${bx + Math.sin(x.frame / 25 + i) * 20} ${x.g - h}`} stroke={x.c.mid} strokeWidth={10 * x.u} fill="none" strokeLinecap="round" />
          );
        })}
        {P(x, "rock", 30, { color: "#495057" })}
        {P(x, "rock", 75, { color: "#495057", scale: 1.4 })}
      </>
    ),
  },
  cave: {
    palettes: {
      day: pal(["#2b2622", "#1a1714"], "#3b342e", "#4a423a", "#1a1714", "#3a332c", "#2a241f", "#9775fa", "#ffb84d"),
      sunset: pal(["#2b2622", "#1a1714"], "#3b342e", "#4a423a", "#1a1714", "#3a332c", "#2a241f", "#9775fa", "#ffb84d"),
      night: pal(["#15120f", "#0a0806"], "#26211c", "#332c25", "#0a0806", "#26211c", "#1a1714", "#9775fa", "#ffb84d"),
    },
    draw: (x) => (
      <>
        <Sky x={x} id="cave" />
        {new Array(12).fill(0).map((_, i) => {
          const sx = (i / 11) * x.W;
          const h = (60 + random(`st${i}`) * 140) * x.u;
          return <polygon key={i} points={`${sx - 30 * x.u},0 ${sx + 30 * x.u},0 ${sx},${h}`} fill={x.c.mid} />;
        })}
        {[0.15, 0.82].map((cx, i) => (
          <g key={cx} transform={`translate(${x.W * cx} ${x.g})`}>
            <circle r={70 * x.u} cy={-30 * x.u} fill={x.c.accent} opacity={0.12 + 0.05 * Math.sin(x.frame / 10 + i)} />
            <polygon points={`${-20 * x.u},0 ${-8 * x.u},${-70 * x.u} ${6 * x.u},0`} fill={x.c.accent} />
            <polygon points={`0,0 ${16 * x.u},${-90 * x.u} ${28 * x.u},0`} fill="#b197fc" />
          </g>
        ))}
        <Ground x={x} />
        {P(x, "campfire", 50)}
      </>
    ),
  },
  subway: {
    palettes: {
      day: pal(["#fff", "#fff"], "#e9ecef", "#ced4da", "#343a40", "#868e96", "#ffd43b", "#1c7ed6"),
      sunset: pal(["#fff", "#fff"], "#e9ecef", "#ced4da", "#343a40", "#868e96", "#ffd43b", "#1c7ed6"),
      night: pal(["#000", "#000"], "#2b2f36", "#3b4049", "#111", "#3a3f48", "#e0b500", "#1c7ed6", "#ffe8a3"),
    },
    draw: (x) => {
      const trainX = ((x.frame * 14) % (x.W * 3)) - x.W * 1.5;
      return (
        <>
          <Wall x={x} color={x.c.far} />
          {new Array(Math.ceil(x.W / (30 * x.u))).fill(0).map((_, i) =>
            new Array(Math.ceil(x.g / (30 * x.u))).fill(0).map((__, j) => (
              <rect key={`${i}-${j}`} x={i * 30 * x.u} y={j * 30 * x.u} width={28 * x.u} height={28 * x.u} fill={x.c.mid} opacity={0.35} />
            )),
          )}
          <rect x={x.W * 0.3} y={x.g - 380 * x.u} width={220 * x.u} height={50 * x.u} rx={6} fill={x.c.accent} />
          <text x={x.W * 0.3 + 110 * x.u} y={x.g - 345 * x.u} textAnchor="middle" fontSize={28 * x.u} fill="#fff" fontFamily="sans-serif" fontWeight={700}>
            U2 · Zentrum
          </text>
          <g transform={`translate(${trainX} 0)`}>
            <rect x={0} y={x.g - 300 * x.u} width={x.W * 1.2} height={240 * x.u} rx={20} fill="#adb5bd" stroke="#495057" strokeWidth={4} />
            {new Array(8).fill(0).map((_, i) => (
              <rect key={i} x={40 * x.u + i * 150 * x.u} y={x.g - 270 * x.u} width={110 * x.u} height={80 * x.u} rx={8} fill={x.night ? "#ffe8a3" : "#d0ebff"} />
            ))}
            <rect x={0} y={x.g - 150 * x.u} width={x.W * 1.2} height={14 * x.u} fill={x.c.accent} />
          </g>
          <rect y={x.g - 60 * x.u} width={x.W} height={60 * x.u} fill={x.c.near} />
          <Ground x={x} />
          <rect y={x.g} width={x.W} height={12 * x.u} fill={x.c.ground2} />
        </>
      );
    },
  },
  hauntedHouse: {
    palettes: {
      day: pal(["#495057", "#adb5bd"], "#343a40", "#212529", "#1b1d22", "#3d4a3a", "#2a3328", "#c4161c", "#ffd43b"),
      sunset: pal(["#5f3dc4", "#e8590c"], "#2b1f3a", "#1f1630", "#120c1c", "#2a2433", "#1d1826", "#c4161c", "#ffd43b"),
      night: pal(["#02030a", "#1b1f33"], "#14161f", "#0e1017", "#08090e", "#161a14", "#0f120d", "#c4161c", "#ffcf4d"),
    },
    draw: (x) => (
      <>
        <Sky x={x} id="haunted" />
        <Stars x={x} n={40} />
        <SunMoon x={x} px={x.W * 0.72} py={x.H * 0.16} r={80} />
        <Hills x={x} color={x.c.far} base={x.g - 30 * x.u} amp={60 * x.u} seed="h1" />
        <g transform={`translate(${x.W * 0.5} ${x.g - 40 * x.u})`} fill={x.c.mid}>
          <polygon points={`${-160 * x.u},0 ${-150 * x.u},${-230 * x.u} ${150 * x.u},${-245 * x.u} ${160 * x.u},0`} />
          <polygon points={`${-180 * x.u},${-225 * x.u} ${-10 * x.u},${-380 * x.u} ${170 * x.u},${-240 * x.u}`} />
          <rect x={60 * x.u} y={-400 * x.u} width={40 * x.u} height={120 * x.u} transform="rotate(6)" />
          {[[-100, -170], [40, -175], [-30, -300]].map(([wx, wy], i) => (
            <rect key={i} x={wx * x.u} y={wy * x.u} width={45 * x.u} height={50 * x.u} fill={(x.frame / 9 + i * 3) % 13 < 11 ? x.c.glow : "#000"} opacity={0.85} />
          ))}
          <rect x={-25 * x.u} y={-90 * x.u} width={50 * x.u} height={90 * x.u} fill="#000" />
        </g>
        <Ground x={x} />
        {P(x, "deadTree", 12, { scale: 1.3 })}
        {P(x, "deadTree", 90, { flip: true })}
        {P(x, "fence", 30, { color: x.c.near })}
      </>
    ),
  },
  graveyard: {
    palettes: {
      day: pal(["#868e96", "#ced4da"], "#495057", "#343a40", "#212529", "#5c6b4f", "#46523c", "#c4161c"),
      sunset: pal(["#862e9c", "#f76707"], "#3b2a45", "#2b1f33", "#1a1220", "#3a3528", "#2a261c", "#c4161c"),
      night: pal(["#02030a", "#161b2e"], "#141824", "#0f121b", "#090b10", "#1a2018", "#11160f", "#c4161c"),
    },
    draw: (x) => (
      <>
        <Sky x={x} id="grave" />
        <Stars x={x} n={50} />
        <SunMoon x={x} px={x.W * 0.25} py={x.H * 0.15} r={70} />
        <Hills x={x} color={x.c.far} base={x.g - 20 * x.u} amp={50 * x.u} seed="g1" />
        {P(x, "deadTree", 80, { scale: 1.4 })}
        <Ground x={x} />
        {[[12, 0.9], [26, 1.1], [40, 0.8], [62, 1], [72, 0.85], [92, 1.05]].map(([tx, s], i) => P(x, "tombstone", tx, { scale: s, y: -4 - i }))}
        {P(x, "fence", 50, { color: x.c.near, front: true, scale: 0.8 })}
      </>
    ),
  },
} satisfies Record<string, WorldDef>;

export type WorldName = keyof typeof WORLDS;
export const WORLD_NAMES = Object.keys(WORLDS) as WorldName[];

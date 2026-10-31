// Requisiten – stehen auf dem Boden bei x (Pixel). u = Pixel pro Stickman-Einheit (Stickman ≈ 200u hoch)
import React from "react";

export type PropName =
  | "tree" | "pine" | "palm" | "deadTree" | "bush" | "rock" | "cactus" | "lamp" | "bench"
  | "house" | "car" | "tombstone" | "fence" | "sign" | "table" | "chair" | "bed" | "door"
  | "bookshelf" | "plant" | "tv" | "computer" | "campfire" | "crate" | "ufo" | "sofa"
  | "fridge" | "throne" | "torch" | "mic" | "umbrella";

export type PropDef = {
  type: PropName;
  x: number; // % der Breite
  y?: number; // Höhe über dem Boden (Stickman-Einheiten)
  scale?: number;
  flip?: boolean;
  color?: string;
  text?: string;
  front?: boolean; // vor den Figuren zeichnen
};

export type PropCtx = { u: number; frame: number; night: boolean; ink: string };

const flame = (cx: number, base: number, s: number, frame: number, k = 0) => {
  const f = Math.sin(frame / 3 + k) * 0.15 + 1;
  return (
    <g key={k}>
      <path d={`M ${cx - 14 * s} ${base} Q ${cx - 16 * s} ${base - 30 * s * f} ${cx} ${base - 52 * s * f} Q ${cx + 16 * s} ${base - 30 * s * f} ${cx + 14 * s} ${base} Z`} fill="#ff922b" />
      <path d={`M ${cx - 7 * s} ${base} Q ${cx - 8 * s} ${base - 18 * s * f} ${cx} ${base - 30 * s * f} Q ${cx + 8 * s} ${base - 18 * s * f} ${cx + 7 * s} ${base} Z`} fill="#ffe066" />
    </g>
  );
};

// Zeichnet ein Requisit mit Fußpunkt (0,0); Größe in u
export const drawProp = (p: PropDef, c: PropCtx): React.ReactNode => {
  const { u, frame, night, ink } = c;
  const col = p.color;
  const o = { stroke: ink, strokeWidth: 3 * Math.max(1, u / 2.5), strokeLinejoin: "round" as const };
  switch (p.type) {
    case "tree":
      return (
        <g>
          <rect x={-12 * u} y={-150 * u} width={24 * u} height={150 * u} fill="#7a4e2d" />
          {[[0, -190, 70], [-55, -150, 50], [55, -150, 52], [0, -250, 50]].map(([x, y, r], i) => (
            <circle key={i} cx={x * u} cy={y * u} r={r * u} fill={col ?? (night ? "#1f3b2b" : "#5fbf6a")} />
          ))}
        </g>
      );
    case "pine":
      return (
        <g fill={col ?? (night ? "#14281f" : "#2f8f4e")}>
          <rect x={-8 * u} y={-50 * u} width={16 * u} height={50 * u} fill="#6b4226" />
          <polygon points={`${-70 * u},${-40 * u} ${70 * u},${-40 * u} 0,${-150 * u}`} />
          <polygon points={`${-55 * u},${-110 * u} ${55 * u},${-110 * u} 0,${-210 * u}`} />
          <polygon points={`${-40 * u},${-170 * u} ${40 * u},${-170 * u} 0,${-260 * u}`} />
        </g>
      );
    case "palm": {
      const sway = Math.sin(frame / 30) * 4;
      return (
        <g>
          <path d={`M 0 0 Q ${20 * u} ${-120 * u} ${(5 + sway) * u} ${-260 * u}`} stroke="#9c6b3e" strokeWidth={18 * u} fill="none" strokeLinecap="round" />
          {[-150, -110, -60, -20, 25].map((a, i) => (
            <path
              key={i}
              d={`M ${(5 + sway) * u} ${-260 * u} q ${Math.cos((a * Math.PI) / 180) * 60 * u} ${Math.sin((a * Math.PI) / 180) * 30 * u - 30 * u} ${Math.cos((a * Math.PI) / 180) * 110 * u} ${Math.sin((a * Math.PI) / 180) * 40 * u + 30 * u}`}
              stroke={col ?? (night ? "#1f3b2b" : "#37b24d")}
              strokeWidth={14 * u}
              fill="none"
              strokeLinecap="round"
            />
          ))}
          <circle cx={(sway - 2) * u} cy={-248 * u} r={9 * u} fill="#6b4226" />
          <circle cx={(sway + 12) * u} cy={-250 * u} r={9 * u} fill="#6b4226" />
        </g>
      );
    }
    case "deadTree":
      return (
        <g stroke={col ?? "#2b2420"} strokeLinecap="round" fill="none">
          <path d={`M 0 0 L ${4 * u} ${-160 * u}`} strokeWidth={22 * u} />
          <path d={`M ${2 * u} ${-100 * u} L ${-60 * u} ${-170 * u} L ${-80 * u} ${-160 * u} M ${-40 * u} ${-148 * u} L ${-50 * u} ${-200 * u}`} strokeWidth={9 * u} />
          <path d={`M ${4 * u} ${-140 * u} L ${60 * u} ${-210 * u} L ${90 * u} ${-205 * u} M ${40 * u} ${-185 * u} L ${45 * u} ${-235 * u}`} strokeWidth={8 * u} />
          <path d={`M ${4 * u} ${-160 * u} L ${0} ${-230 * u}`} strokeWidth={10 * u} />
        </g>
      );
    case "bush":
      return (
        <g fill={col ?? (night ? "#1f3b2b" : "#51a35a")}>
          <circle cx={-30 * u} cy={-28 * u} r={32 * u} />
          <circle cx={20 * u} cy={-32 * u} r={38 * u} />
          <circle cx={0} cy={-50 * u} r={34 * u} />
        </g>
      );
    case "rock":
      return <polygon points={`${-50 * u},0 ${-38 * u},${-40 * u} ${-5 * u},${-58 * u} ${35 * u},${-42 * u} ${52 * u},0`} fill={col ?? "#868e96"} {...o} />;
    case "cactus":
      return (
        <g fill={col ?? "#3d8b40"} {...o}>
          <rect x={-14 * u} y={-160 * u} width={28 * u} height={160 * u} rx={14 * u} />
          <path d={`M ${-14 * u} ${-70 * u} L ${-40 * u} ${-70 * u} L ${-40 * u} ${-115 * u}`} stroke={col ?? "#3d8b40"} strokeWidth={22 * u} fill="none" strokeLinecap="round" />
          <path d={`M ${14 * u} ${-95 * u} L ${40 * u} ${-95 * u} L ${40 * u} ${-135 * u}`} stroke={col ?? "#3d8b40"} strokeWidth={22 * u} fill="none" strokeLinecap="round" />
        </g>
      );
    case "lamp":
      return (
        <g>
          {night ? <polygon points={`${-20 * u},${-275 * u} ${-120 * u},0 ${80 * u},0`} fill="#ffe9a8" opacity={0.13} /> : null}
          <rect x={-4 * u} y={-280 * u} width={8 * u} height={280 * u} fill="#343a40" />
          <rect x={-28 * u} y={-288 * u} width={40 * u} height={10 * u} rx={3 * u} fill="#343a40" />
          <circle cx={-18 * u} cy={-274 * u} r={7 * u} fill={night ? "#ffe066" : "#dee2e6"} />
        </g>
      );
    case "bench":
      return (
        <g fill={col ?? "#8d5a3b"}>
          <rect x={-55 * u} y={-44 * u} width={110 * u} height={12 * u} rx={4} />
          <rect x={-55 * u} y={-90 * u} width={110 * u} height={10 * u} rx={4} />
          <rect x={-47 * u} y={-90 * u} width={8 * u} height={90 * u} />
          <rect x={39 * u} y={-90 * u} width={8 * u} height={90 * u} />
        </g>
      );
    case "house": {
      const wall = col ?? "#e9c46a";
      return (
        <g {...o}>
          <rect x={-130 * u} y={-200 * u} width={260 * u} height={200 * u} fill={wall} />
          <polygon points={`${-150 * u},${-195 * u} ${150 * u},${-195 * u} 0,${-310 * u}`} fill="#a63d40" />
          <rect x={-25 * u} y={-110 * u} width={50 * u} height={110 * u} fill="#6b4226" />
          {[-90, 55].map((x) => (
            <rect key={x} x={x * u} y={-160 * u} width={45 * u} height={45 * u} fill={night ? "#ffd43b" : "#a5d8ff"} />
          ))}
        </g>
      );
    }
    case "car":
      return (
        <g {...o}>
          <path d={`M ${-110 * u} ${-25 * u} L ${-110 * u} ${-60 * u} L ${-60 * u} ${-65 * u} L ${-35 * u} ${-105 * u} L ${45 * u} ${-105 * u} L ${75 * u} ${-65 * u} L ${110 * u} ${-58 * u} L ${110 * u} ${-25 * u} Z`} fill={col ?? "#e03131"} />
          <path d={`M ${-28 * u} ${-95 * u} L ${-5 * u} ${-95 * u} L ${-5 * u} ${-66 * u} L ${-50 * u} ${-66 * u} Z M ${5 * u} ${-95 * u} L ${40 * u} ${-95 * u} L ${60 * u} ${-66 * u} L ${5 * u} ${-66 * u} Z`} fill={night ? "#364fc7" : "#d0ebff"} />
          <circle cx={-62 * u} cy={-22 * u} r={22 * u} fill="#212529" />
          <circle cx={62 * u} cy={-22 * u} r={22 * u} fill="#212529" />
          <circle cx={-62 * u} cy={-22 * u} r={8 * u} fill="#adb5bd" />
          <circle cx={62 * u} cy={-22 * u} r={8 * u} fill="#adb5bd" />
        </g>
      );
    case "tombstone":
      return (
        <g {...o}>
          <path d={`M ${-35 * u} 0 L ${-35 * u} ${-70 * u} A ${35 * u} ${35 * u} 0 0 1 ${35 * u} ${-70 * u} L ${35 * u} 0 Z`} fill={col ?? "#6c757d"} />
          <text x={0} y={-62 * u} textAnchor="middle" fontSize={20 * u} fontFamily="serif" fill="#343a40" stroke="none">
            {p.text ?? "RIP"}
          </text>
        </g>
      );
    case "fence":
      return (
        <g fill={col ?? (night ? "#3b3f48" : "#f1e3c8")} {...o}>
          {new Array(8).fill(0).map((_, i) => (
            <path key={i} d={`M ${(-140 + i * 40) * u} 0 L ${(-140 + i * 40) * u} ${-80 * u} L ${(-130 + i * 40) * u} ${-95 * u} L ${(-120 + i * 40) * u} ${-80 * u} L ${(-120 + i * 40) * u} 0 Z`} />
          ))}
          <rect x={-145 * u} y={-62 * u} width={300 * u} height={10 * u} />
          <rect x={-145 * u} y={-28 * u} width={300 * u} height={10 * u} />
        </g>
      );
    case "sign":
      return (
        <g {...o}>
          <rect x={-5 * u} y={-150 * u} width={10 * u} height={150 * u} fill="#8d5a3b" />
          <rect x={-70 * u} y={-175 * u} width={140 * u} height={55 * u} rx={6} fill={col ?? "#f1e3c8"} />
          <text x={0} y={-140 * u} textAnchor="middle" fontSize={26 * u} fontFamily="sans-serif" fontWeight={700} fill="#343a40" stroke="none">
            {p.text ?? ""}
          </text>
        </g>
      );
    case "table":
      return (
        <g fill={col ?? "#8d5a3b"} {...o}>
          <rect x={-70 * u} y={-75 * u} width={140 * u} height={12 * u} />
          <rect x={-60 * u} y={-65 * u} width={8 * u} height={65 * u} />
          <rect x={52 * u} y={-65 * u} width={8 * u} height={65 * u} />
        </g>
      );
    case "chair":
      return (
        <g fill={col ?? "#a0673f"} {...o}>
          <rect x={-25 * u} y={-46 * u} width={50 * u} height={8 * u} />
          <rect x={-25 * u} y={-110 * u} width={8 * u} height={110 * u} />
          <rect x={17 * u} y={-46 * u} width={8 * u} height={46 * u} />
        </g>
      );
    case "bed":
      return (
        <g {...o}>
          <rect x={-130 * u} y={-50 * u} width={260 * u} height={30 * u} rx={8} fill={col ?? "#4dabf7"} />
          <rect x={-130 * u} y={-20 * u} width={260 * u} height={20 * u} fill="#8d5a3b" />
          <rect x={-140 * u} y={-110 * u} width={14 * u} height={110 * u} fill="#8d5a3b" />
          <rect x={-122 * u} y={-72 * u} width={55 * u} height={22 * u} rx={10} fill="#f8f9fa" />
        </g>
      );
    case "door":
      return (
        <g {...o}>
          <rect x={-50 * u} y={-215 * u} width={100 * u} height={215 * u} fill={col ?? "#8d5a3b"} />
          <circle cx={-30 * u} cy={-105 * u} r={6 * u} fill="#fcc419" />
        </g>
      );
    case "bookshelf":
      return (
        <g {...o}>
          <rect x={-80 * u} y={-260 * u} width={160 * u} height={260 * u} fill={col ?? "#6b4226"} />
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              {new Array(9).fill(0).map((_, i) => (
                <rect
                  key={i}
                  x={(-72 + i * 16) * u}
                  y={(-250 + r * 62 + (i % 3) * 4) * u}
                  width={13 * u}
                  height={(52 - (i % 3) * 4) * u}
                  fill={["#c92a2a", "#1971c2", "#2f9e44", "#f08c00", "#862e9c"][(i + r) % 5]}
                  strokeWidth={1}
                />
              ))}
            </g>
          ))}
        </g>
      );
    case "plant":
      return (
        <g>
          <path d={`M ${-22 * u} ${-45 * u} L ${22 * u} ${-45 * u} L ${16 * u} 0 L ${-16 * u} 0 Z`} fill="#c2703d" {...o} />
          {[-40, -15, 15, 40].map((a, i) => (
            <ellipse key={i} cx={a * 0.8 * u} cy={-85 * u} rx={12 * u} ry={40 * u} transform={`rotate(${a} 0 ${-45 * u})`} fill={col ?? "#40c057"} />
          ))}
        </g>
      );
    case "tv":
      return (
        <g {...o}>
          <rect x={-60 * u} y={-60 * u} width={120 * u} height={60 * u} fill="#6b4226" />
          <rect x={-75 * u} y={-150 * u} width={150 * u} height={85 * u} rx={6} fill="#212529" />
          <rect x={-67 * u} y={-142 * u} width={134 * u} height={69 * u} fill={night ? "#74c0fc" : "#343a40"} opacity={night ? 0.7 + 0.3 * Math.sin(frame / 2) : 1} />
        </g>
      );
    case "computer":
      return (
        <g {...o}>
          <rect x={-70 * u} y={-75 * u} width={140 * u} height={12 * u} fill={col ?? "#ced4da"} />
          <rect x={-60 * u} y={-65 * u} width={8 * u} height={65 * u} fill="#868e96" />
          <rect x={52 * u} y={-65 * u} width={8 * u} height={65 * u} fill="#868e96" />
          <rect x={-35 * u} y={-140 * u} width={70 * u} height={50 * u} rx={4} fill="#212529" />
          <rect x={-30 * u} y={-135 * u} width={60 * u} height={40 * u} fill="#4dabf7" />
          <rect x={-4 * u} y={-90 * u} width={8 * u} height={15 * u} fill="#495057" />
        </g>
      );
    case "campfire":
      return (
        <g>
          <circle cx={0} cy={-30 * u} r={90 * u} fill="#ff922b" opacity={0.12 + 0.04 * Math.sin(frame / 2)} />
          <rect x={-40 * u} y={-12 * u} width={80 * u} height={12 * u} rx={6} fill="#6b4226" transform={`rotate(12)`} />
          <rect x={-40 * u} y={-12 * u} width={80 * u} height={12 * u} rx={6} fill="#5c3a1e" transform={`rotate(-12)`} />
          {flame(-8 * u, -6 * u, u, frame, 1)}
          {flame(10 * u, -6 * u, u * 0.8, frame, 2)}
        </g>
      );
    case "crate":
      return (
        <g {...o} fill={col ?? "#c08552"}>
          <rect x={-40 * u} y={-80 * u} width={80 * u} height={80 * u} />
          <path d={`M ${-40 * u} ${-80 * u} L ${40 * u} 0 M ${40 * u} ${-80 * u} L ${-40 * u} 0`} fill="none" />
        </g>
      );
    case "ufo": {
      const bob = Math.sin(frame / 12) * 8 * u;
      return (
        <g transform={`translate(0 ${bob})`}>
          <polygon points={`${-40 * u},${-80 * u} ${40 * u},${-80 * u} ${110 * u},${300 * u} ${-110 * u},${300 * u}`} fill="#b2f2bb" opacity={0.18} />
          <ellipse cx={0} cy={-90 * u} rx={110 * u} ry={28 * u} fill={col ?? "#adb5bd"} {...o} />
          <ellipse cx={0} cy={-115 * u} rx={45 * u} ry={35 * u} fill="#a5d8ff" opacity={0.8} {...o} />
          {[-70, -25, 25, 70].map((x, i) => (
            <circle key={x} cx={x * u} cy={-88 * u} r={7 * u} fill={(frame / 6 + i) % 2 < 1 ? "#ffe066" : "#ff6b6b"} />
          ))}
        </g>
      );
    }
    case "sofa":
      return (
        <g {...o} fill={col ?? "#748ffc"}>
          <rect x={-120 * u} y={-110 * u} width={240 * u} height={60 * u} rx={14} />
          <rect x={-130 * u} y={-60 * u} width={260 * u} height={45 * u} rx={10} />
          <rect x={-140 * u} y={-85 * u} width={30 * u} height={70 * u} rx={10} />
          <rect x={110 * u} y={-85 * u} width={30 * u} height={70 * u} rx={10} />
          <rect x={-120 * u} y={-15 * u} width={10 * u} height={15 * u} fill="#495057" />
          <rect x={110 * u} y={-15 * u} width={10 * u} height={15 * u} fill="#495057" />
        </g>
      );
    case "fridge":
      return (
        <g {...o}>
          <rect x={-50 * u} y={-230 * u} width={100 * u} height={230 * u} rx={10} fill={col ?? "#e9ecef"} />
          <line x1={-50 * u} x2={50 * u} y1={-150 * u} y2={-150 * u} />
          <rect x={30 * u} y={-200 * u} width={6 * u} height={35 * u} fill="#868e96" />
          <rect x={30 * u} y={-130 * u} width={6 * u} height={45 * u} fill="#868e96" />
        </g>
      );
    case "throne":
      return (
        <g {...o}>
          <rect x={-55 * u} y={-200 * u} width={110 * u} height={200 * u} rx={8} fill={col ?? "#c92a2a"} />
          <rect x={-70 * u} y={-60 * u} width={140 * u} height={20 * u} fill="#fcc419" />
          <polygon points={`${-55 * u},${-200 * u} ${-40 * u},${-235 * u} ${-25 * u},${-200 * u} ${-10 * u},${-240 * u} ${10 * u},${-200 * u} ${25 * u},${-235 * u} ${40 * u},${-200 * u} ${55 * u},${-235 * u} ${55 * u},${-200 * u}`} fill="#fcc419" />
        </g>
      );
    case "torch":
      return (
        <g>
          <circle cx={0} cy={-205 * u} r={60 * u} fill="#ff922b" opacity={0.12 + 0.05 * Math.sin(frame / 2)} />
          <rect x={-5 * u} y={-190 * u} width={10 * u} height={50 * u} fill="#5c3a1e" />
          {flame(0, -188 * u, 0.7 * u, frame)}
        </g>
      );
    case "mic":
      return (
        <g>
          <line x1={0} y1={0} x2={0} y2={-150 * u} stroke="#343a40" strokeWidth={5 * u} />
          <ellipse cx={0} cy={-162 * u} rx={9 * u} ry={14 * u} fill="#495057" />
          <ellipse cx={0} cy={-2 * u} rx={30 * u} ry={6 * u} fill="#343a40" />
        </g>
      );
    case "umbrella":
      return (
        <g>
          <line x1={0} y1={0} x2={0} y2={-200 * u} stroke="#868e96" strokeWidth={5 * u} />
          <path d={`M ${-110 * u} ${-180 * u} Q 0 ${-280 * u} ${110 * u} ${-180 * u} Z`} fill={col ?? "#ff6b6b"} {...o} />
          <path d={`M ${-40 * u} ${-180 * u} Q 0 ${-280 * u} ${40 * u} ${-180 * u}`} fill="#fff" opacity={0.7} />
        </g>
      );
  }
};

export const Props: React.FC<{
  props: PropDef[];
  W: number;
  groundY: number;
  ctx: PropCtx;
}> = ({ props, W, groundY, ctx }) => (
  <>
    {props.map((p, i) => {
      const s = p.scale ?? 1;
      return (
        <g
          key={i}
          transform={`translate(${(p.x / 100) * W} ${groundY - (p.y ?? 0) * ctx.u}) scale(${p.flip ? -s : s} ${s})`}
        >
          {drawProp(p, ctx)}
        </g>
      );
    })}
  </>
);

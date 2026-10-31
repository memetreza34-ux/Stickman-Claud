// Haare, Hüte, Brillen, Bärte – im Kopf-Koordinatensystem (Mitte 0,0, Radius R, Blick nach rechts)
import React from "react";
import { Look } from "./looks";

const R = 24;

export const HairBack: React.FC<{ look: Look }> = ({ look }) => {
  const c = look.hairColor ?? "#3b2414";
  if (look.hair === "long")
    return <path d={`M ${-R - 4} -6 Q ${-R - 8} ${R * 1.6} ${-R * 0.2} ${R * 1.9} L ${R * 0.4} ${R * 1.2} Q ${R * 0.2} 0 ${-R * 0.2} -4 Z`} fill={c} />;
  if (look.hair === "afro") return <circle cx={-4} cy={-6} r={R * 1.45} fill={c} />;
  if (look.hat === "hood") return <circle cx={-4} cy={-1} r={R + 7} fill={look.hatColor ?? "#333"} />;
  return null;
};

export const HairFront: React.FC<{ look: Look; t: number; stroke: string }> = ({ look, t, stroke }) => {
  const c = look.hairColor ?? "#3b2414";
  const cap = (
    <path
      d={`M ${-R - 1} 2 A ${R + 1} ${R + 1} 0 0 1 ${R + 1} -6 Q ${R * 0.45} ${-R * 0.55} ${-R * 0.25} ${-R * 0.62} Q ${-R * 0.75} ${-R * 0.35} ${-R - 1} 2 Z`}
      fill={c}
    />
  );
  switch (look.hair) {
    case "short":
    case "long":
      return cap;
    case "slick":
      return (
        <g>
          {cap}
          <path d={`M ${-R * 0.5} ${-R * 0.85} Q ${R * 0.1} ${-R * 1.05} ${R * 0.6} ${-R * 0.75}`} stroke="#fff" strokeOpacity={0.35} strokeWidth={3} fill="none" />
        </g>
      );
    case "spiky": {
      const pts: string[] = [];
      for (let a = 190; a >= -10; a -= 20) {
        const r = a % 40 === 30 || a % 40 === -10 ? R + 1 : R + 13;
        pts.push(`${Math.cos((a * Math.PI) / 180) * r},${-Math.sin((a * Math.PI) / 180) * r}`);
      }
      return <polygon points={`${-R},4 ${pts.join(" ")} ${R},-4 ${R * 0.3},${-R * 0.55} ${-R * 0.4},${-R * 0.5}`} fill={c} />;
    }
    case "ponytail": {
      const swing = Math.sin(t * 5) * 6;
      return (
        <g>
          <path d={`M ${-R - 2} -8 Q ${-R - 20} ${4 + swing} ${-R - 10} ${R + swing}`} stroke={c} strokeWidth={11} strokeLinecap="round" fill="none" />
          {cap}
        </g>
      );
    }
    case "bun":
      return (
        <g>
          <circle cx={-R * 0.45} cy={-R - 3} r={10} fill={c} />
          {cap}
        </g>
      );
    case "curly":
      return (
        <g>
          {[175, 145, 115, 85, 55, 25].map((a) => (
            <circle key={a} cx={Math.cos((a * Math.PI) / 180) * (R - 1)} cy={-Math.sin((a * Math.PI) / 180) * (R - 1)} r={9} fill={c} />
          ))}
        </g>
      );
    case "mohawk":
      return (
        <polygon
          points={`${-12},${-R + 4} -14,${-R - 14} -6,${-R - 4} -2,${-R - 18} 3,${-R - 4} 9,${-R - 15} 12,${-R + 4}`}
          fill={c}
          stroke={stroke}
          strokeWidth={1.5}
        />
      );
    case "afro":
      return null;
    default:
      return null;
  }
};

export const Hat: React.FC<{ look: Look; t: number }> = ({ look, t }) => {
  const c = look.hatColor ?? "#333";
  switch (look.hat) {
    case "cap":
      return (
        <g>
          <path d={`M ${-R - 1} -5 A ${R + 1} ${R + 1} 0 0 1 ${R + 1} -5 Z`} fill={c} />
          <ellipse cx={R + 4} cy={-6} rx={14} ry={4} fill={c} />
        </g>
      );
    case "tophat":
      return (
        <g>
          <rect x={-16} y={-R - 34} width={32} height={38} rx={2} fill={c} />
          <rect x={-16} y={-R - 8} width={32} height={6} fill="#c92a2a" />
          <rect x={-26} y={-R + 2} width={52} height={6} rx={3} fill={c} />
        </g>
      );
    case "beanie":
      return (
        <g>
          <path d={`M ${-R - 1} -6 A ${R + 1} ${R + 1} 0 0 1 ${R + 1} -6 Z`} fill={c} />
          <rect x={-R - 2} y={-11} width={R * 2 + 4} height={8} rx={4} fill={c} stroke="#000" strokeOpacity={0.15} />
          <circle cx={0} cy={-R - 7} r={7} fill={c} />
        </g>
      );
    case "witch":
      return (
        <g>
          <ellipse cx={0} cy={-R + 6} rx={36} ry={7} fill={c} />
          <path d={`M -16 ${-R + 4} L 16 ${-R + 4} L 2 ${-R - 30} Q -6 ${-R - 46} -22 ${-R - 44} Q -8 ${-R - 36} -16 ${-R + 4} Z`} fill={c} />
          <rect x={-16} y={-R - 4} width={30} height={6} fill="#ffd43b" />
        </g>
      );
    case "crown":
      return (
        <g>
          <polygon points={`-17,${-R + 6} 17,${-R + 6} 18,${-R - 16} 9,${-R - 5} 0,${-R - 19} -9,${-R - 5} -18,${-R - 16}`} fill="#fcc419" stroke="#e67700" strokeWidth={2} />
          <circle cx={0} cy={-R - 2} r={3.5} fill="#e03131" />
          <circle cx={-10} cy={-R} r={2.5} fill="#1c7ed6" />
          <circle cx={10} cy={-R} r={2.5} fill="#1c7ed6" />
        </g>
      );
    case "cowboy":
      return (
        <g>
          <path d={`M -15 ${-R + 4} Q -16 ${-R - 20} 0 ${-R - 16} Q 16 ${-R - 20} 15 ${-R + 4} Z`} fill={c} />
          <path d={`M -40 ${-R + 2} Q 0 ${-R + 14} 40 ${-R + 2} Q 30 ${-R + 8} 0 ${-R + 8} Q -30 ${-R + 8} -40 ${-R + 2} Z`} fill={c} />
          <rect x={-15} y={-R - 3} width={30} height={5} fill="#000" opacity={0.3} />
        </g>
      );
    case "chef":
      return (
        <g>
          <circle cx={-12} cy={-R - 12} r={11} fill="#fff" stroke="#ccc" />
          <circle cx={12} cy={-R - 12} r={11} fill="#fff" stroke="#ccc" />
          <circle cx={0} cy={-R - 18} r={13} fill="#fff" stroke="#ccc" />
          <rect x={-19} y={-R - 6} width={38} height={13} fill="#fff" stroke="#ccc" />
        </g>
      );
    case "party":
      return (
        <g transform="rotate(-12)">
          <polygon points={`-12,${-R + 3} 12,${-R + 3} 0,${-R - 32}`} fill="#ff6b6b" />
          <path d={`M -8 ${-R - 8} L 8 ${-R - 4} M -4 ${-R - 20} L 5 ${-R - 17}`} stroke="#ffe066" strokeWidth={4} />
          <circle cx={0} cy={-R - 33} r={5} fill="#ffe066" />
        </g>
      );
    case "helmet":
      return (
        <g>
          <path d={`M ${-R - 3} 8 L ${-R - 3} -4 A ${R + 3} ${R + 3} 0 0 1 ${R + 3} -4 L ${R + 3} 8 Z`} fill="#adb5bd" stroke="#495057" strokeWidth={2.5} />
          <rect x={-4} y={-8} width={R + 6} height={6} rx={2} fill="#212529" />
          <path d={`M 0 ${-R - 3} Q -8 ${-R - 22} -24 ${-R - 18}`} stroke="#c92a2a" strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    case "space":
      return (
        <g>
          <circle r={R + 11} fill="#a5d8ff" fillOpacity={0.22} stroke="#f1f3f5" strokeWidth={4} />
          <path d={`M ${R * 0.2} ${-R - 2} A ${R + 4} ${R + 4} 0 0 1 ${R + 4} ${-R * 0.2}`} stroke="#fff" strokeOpacity={0.8} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      );
    case "halo":
      return <ellipse cx={0} cy={-R - 12 + Math.sin(t * 3) * 2} rx={17} ry={5} fill="none" stroke="#fcc419" strokeWidth={4} />;
    case "horns":
      return (
        <g fill={c}>
          <path d={`M -14 ${-R + 4} Q -24 ${-R - 8} -20 ${-R - 20} Q -12 ${-R - 8} -6 ${-R + 2} Z`} />
          <path d={`M 14 ${-R + 4} Q 24 ${-R - 8} 20 ${-R - 20} Q 12 ${-R - 8} 6 ${-R + 2} Z`} />
        </g>
      );
    case "pirate":
      return (
        <g>
          <path d={`M -34 ${-R + 4} Q -20 ${-R - 26} 0 ${-R - 22} Q 20 ${-R - 26} 34 ${-R + 4} Q 0 ${-R - 6} -34 ${-R + 4} Z`} fill="#111" />
          <circle cx={0} cy={-R - 10} r={4} fill="#fff" />
        </g>
      );
    case "antenna":
      return (
        <g>
          <line x1={0} y1={-R + 2} x2={6} y2={-R - 20} stroke={c} strokeWidth={3} />
          <circle cx={6} cy={-R - 22} r={5} fill="#ff6b6b" opacity={0.6 + 0.4 * Math.sin(t * 6)} />
        </g>
      );
    case "headband":
      return (
        <g>
          <path d={`M ${-R} -10 Q 0 -16 ${R} -10`} stroke={c} strokeWidth={7} fill="none" />
          <path d={`M ${-R + 2} -11 L ${-R - 12} ${-4 + Math.sin(t * 8) * 3} M ${-R + 2} -11 L ${-R - 10} ${4 + Math.sin(t * 8 + 1) * 3}`} stroke={c} strokeWidth={4} strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
};

export const Glasses: React.FC<{ look: Look; stroke: string }> = ({ look, stroke }) => {
  const s = { stroke, strokeWidth: 2.5 };
  switch (look.glasses) {
    case "round":
      return (
        <g {...s} fill="#fff" fillOpacity={0.25}>
          <circle cx={-1} cy={-4} r={6.5} />
          <circle cx={13} cy={-4} r={6.5} />
          <line x1={5.5} y1={-4} x2={6.5} y2={-4} />
        </g>
      );
    case "square":
      return (
        <g {...s} fill="#fff" fillOpacity={0.25}>
          <rect x={-8} y={-10} width={13} height={11} rx={2} />
          <rect x={7} y={-10} width={13} height={11} rx={2} />
        </g>
      );
    case "sun":
      return (
        <g>
          <path d="M -9 -10 L 5 -10 L 4 0 Q -2 3 -8 0 Z M 7 -10 L 21 -10 L 20 0 Q 14 3 8 0 Z" fill="#111" />
          <line x1={-12} y1={-9} x2={22} y2={-9} stroke="#111" strokeWidth={2.5} />
        </g>
      );
    case "eyepatch":
      return (
        <g>
          <line x1={-R + 2} y1={-16} x2={R - 2} y2={4} stroke="#111" strokeWidth={2} />
          <ellipse cx={13} cy={-4} rx={7} ry={6} fill="#111" />
        </g>
      );
    default:
      return null;
  }
};

export const Beard: React.FC<{ look: Look }> = ({ look }) => {
  const c = look.beardColor ?? "#3b2414";
  switch (look.beard) {
    case "full":
      return (
        <path
          d={`M ${-R + 6} 0 Q ${-R + 4} ${R + 6} 6 ${R + 12} Q ${R + 2} ${R + 4} ${R - 2} 2 Q 14 10 6 7 Q -2 10 ${-R + 6} 0 Z`}
          fill={c}
        />
      );
    case "mustache":
      return <path d="M -4 7 Q 1 3 6 6 Q 11 3 16 7 Q 11 10 6 8 Q 1 10 -4 7 Z" fill={c} />;
    case "stubble":
      return (
        <g fill={c} opacity={0.6}>
          {[[-6, 12], [-2, 15], [3, 16], [8, 15], [12, 12], [-9, 8], [15, 8]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.2} />
          ))}
        </g>
      );
    default:
      return null;
  }
};

// Maske: Augenbinde (Held) – Ninja bekommt zusätzlich ein Tuch vor Mund und Nase
export const MaskBand: React.FC<{ look: Look }> = ({ look }) =>
  look.mask && look.hat !== "hood" ? (
    <rect x={-12} y={-11} width={R + 12} height={12} rx={6} fill={look.maskColor ?? "#111"} />
  ) : null;

export const MaskLower: React.FC<{ look: Look }> = ({ look }) =>
  look.mask && look.hat === "hood" ? (
    <path d={`M ${-R} 2 L ${R} 2 A ${R} ${R} 0 0 1 ${-R} 2 Z`} fill={look.maskColor ?? "#111"} />
  ) : null;

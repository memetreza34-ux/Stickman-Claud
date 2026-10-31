import React from "react";
import { Look } from "./looks";
import { Beard, Glasses, HairBack, HairFront, Hat, MaskBand, MaskLower } from "./Outfit";
import { Pose } from "./poses";

export type Emotion =
  | "neutral"
  | "happy"
  | "sad"
  | "scared"
  | "shocked"
  | "angry"
  | "love"
  | "thinking"
  | "crying"
  | "creepy"
  | "sleep";

export type HandItem = "none" | "phone" | "flower" | "flashlight" | "candle" | "heart";

const TORSO = 62;
const HEAD_R = 24;
const UPPER_ARM = 34;
const FOREARM = 32;
const THIGH = 46;
const SHIN = 46;

// Gesamthöhe im Stehen (für Sprechblasen-Position)
export const STICKMAN_HEIGHT = THIGH + SHIN + TORSO + HEAD_R * 2 + 6;

type Pt = { x: number; y: number };
const rad = (d: number) => (d * Math.PI) / 180;
const dir = (from: Pt, angle: number, len: number): Pt => ({
  x: from.x + Math.sin(rad(angle)) * len,
  y: from.y + Math.cos(rad(angle)) * len,
});

const Face: React.FC<{
  emotion: Emotion;
  blink: boolean;
  stroke: string;
  t: number;
}> = ({ emotion, blink, stroke, t }) => {
  const s = { stroke, strokeWidth: 3.5, fill: "none", strokeLinecap: "round" as const };
  const ex = 5;
  const eyeY = -4;
  const dotEyes = blink ? (
    <>
      <line x1={-9 + ex} x2={-3 + ex} y1={eyeY} y2={eyeY} {...s} />
      <line x1={5 + ex} x2={11 + ex} y1={eyeY} y2={eyeY} {...s} />
    </>
  ) : (
    <>
      <circle cx={-6 + ex} cy={eyeY} r={3} fill={stroke} />
      <circle cx={8 + ex} cy={eyeY} r={3} fill={stroke} />
    </>
  );

  switch (emotion) {
    case "happy":
      return (
        <g>
          {dotEyes}
          <path d={`M ${-6 + ex} 7 Q ${1 + ex} 15 ${9 + ex} 7`} {...s} />
        </g>
      );
    case "sad":
      return (
        <g>
          {dotEyes}
          <path d={`M ${-10 + ex} -12 L ${-3 + ex} -10`} {...s} />
          <path d={`M ${12 + ex} -12 L ${5 + ex} -10`} {...s} />
          <path d={`M ${-5 + ex} 13 Q ${1 + ex} 6 ${8 + ex} 13`} {...s} />
        </g>
      );
    case "crying": {
      const tearY = ((t * 40) % 18) + 2;
      return (
        <g>
          <path d={`M ${-9 + ex} -3 Q ${-6 + ex} -7 ${-3 + ex} -3`} {...s} />
          <path d={`M ${5 + ex} -3 Q ${8 + ex} -7 ${11 + ex} -3`} {...s} />
          <path d={`M ${-5 + ex} 14 Q ${1 + ex} 6 ${8 + ex} 14`} {...s} />
          <circle cx={-7 + ex} cy={tearY} r={2.5} fill="#4fa3ff" />
          <circle cx={9 + ex} cy={((tearY + 8) % 18) + 2} r={2.5} fill="#4fa3ff" />
        </g>
      );
    }
    case "scared":
      return (
        <g>
          <circle cx={-6 + ex} cy={eyeY} r={6} {...s} strokeWidth={2.5} />
          <circle cx={9 + ex} cy={eyeY} r={6} {...s} strokeWidth={2.5} />
          <circle cx={-6 + ex} cy={eyeY} r={1.8} fill={stroke} />
          <circle cx={9 + ex} cy={eyeY} r={1.8} fill={stroke} />
          <path
            d={`M ${-5 + ex} 12 L ${-2 + ex} 9 L ${1 + ex} 12 L ${4 + ex} 9 L ${7 + ex} 12`}
            {...s}
            strokeWidth={2.5}
          />
        </g>
      );
    case "shocked":
      return (
        <g>
          <circle cx={-6 + ex} cy={eyeY - 1} r={5.5} {...s} strokeWidth={2.5} />
          <circle cx={9 + ex} cy={eyeY - 1} r={5.5} {...s} strokeWidth={2.5} />
          <circle cx={-6 + ex} cy={eyeY - 1} r={2} fill={stroke} />
          <circle cx={9 + ex} cy={eyeY - 1} r={2} fill={stroke} />
          <ellipse cx={1.5 + ex} cy={12} rx={4.5} ry={6} {...s} strokeWidth={3} />
        </g>
      );
    case "angry":
      return (
        <g>
          {dotEyes}
          <path d={`M ${-11 + ex} -13 L ${-2 + ex} -8`} {...s} />
          <path d={`M ${13 + ex} -13 L ${4 + ex} -8`} {...s} />
          <path d={`M ${-5 + ex} 12 Q ${1 + ex} 7 ${8 + ex} 12`} {...s} />
        </g>
      );
    case "love": {
      const heart = (cx: number) =>
        `M ${cx} ${eyeY + 4} C ${cx - 8} ${eyeY - 2} ${cx - 4} ${eyeY - 9} ${cx} ${eyeY - 4} C ${cx + 4} ${eyeY - 9} ${cx + 8} ${eyeY - 2} ${cx} ${eyeY + 4} Z`;
      return (
        <g>
          <path d={heart(-6 + ex)} fill="#ff3b6b" />
          <path d={heart(9 + ex)} fill="#ff3b6b" />
          <path d={`M ${-5 + ex} 8 Q ${1 + ex} 15 ${8 + ex} 8`} {...s} />
          <ellipse cx={-14 + ex} cy={6} rx={4} ry={2.5} fill="#ff7a9a" opacity={0.6} />
          <ellipse cx={16 + ex} cy={6} rx={4} ry={2.5} fill="#ff7a9a" opacity={0.6} />
        </g>
      );
    }
    case "thinking":
      return (
        <g>
          <circle cx={-4 + ex} cy={eyeY - 3} r={3} fill={stroke} />
          <circle cx={10 + ex} cy={eyeY - 3} r={3} fill={stroke} />
          <path d={`M ${-2 + ex} 11 L ${8 + ex} 9`} {...s} />
        </g>
      );
    case "creepy":
      return (
        <g>
          <ellipse cx={-6 + ex} cy={eyeY} rx={5} ry={7} fill="#000" />
          <ellipse cx={9 + ex} cy={eyeY} rx={5} ry={7} fill="#000" />
          <circle cx={-6 + ex} cy={eyeY} r={1.5} fill="#ff2020" />
          <circle cx={9 + ex} cy={eyeY} r={1.5} fill="#ff2020" />
          <path d={`M ${-12 + ex} 8 Q ${1 + ex} 22 ${15 + ex} 8`} stroke="#000" strokeWidth={3} fill="#000" />
          {[-8, -3, 2, 7, 12].map((x) => (
            <line key={x} x1={x + ex} x2={x + ex} y1={9} y2={13} stroke="#fff" strokeWidth={1.5} />
          ))}
        </g>
      );
    case "sleep":
      return (
        <g>
          <path d={`M ${-9 + ex} -3 Q ${-6 + ex} 0 ${-3 + ex} -3`} {...s} />
          <path d={`M ${5 + ex} -3 Q ${8 + ex} 0 ${11 + ex} -3`} {...s} />
          <path d={`M ${-1 + ex} 10 L ${5 + ex} 10`} {...s} />
        </g>
      );
    default:
      return (
        <g>
          {dotEyes}
          <path d={`M ${-4 + ex} 10 L ${7 + ex} 10`} {...s} />
        </g>
      );
  }
};

const Item: React.FC<{ item: HandItem; at: Pt; angle: number; t: number }> = ({
  item,
  at,
  angle,
  t,
}) => {
  if (item === "none") return null;
  const tr = `translate(${at.x} ${at.y}) rotate(${-angle})`;
  switch (item) {
    case "phone":
      return (
        <g transform={tr}>
          <rect x={-8} y={-2} width={16} height={26} rx={3} fill="#222" />
          <rect x={-6} y={1} width={12} height={18} rx={1} fill="#7fd3ff" />
        </g>
      );
    case "flower":
      return (
        <g transform={tr}>
          <line x1={0} y1={-6} x2={0} y2={34} stroke="#2f9e44" strokeWidth={4} />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle
              key={a}
              cx={Math.sin(rad(a)) * 7}
              cy={36 + Math.cos(rad(a)) * 7}
              r={6}
              fill="#ff3b6b"
            />
          ))}
          <circle cx={0} cy={36} r={4} fill="#ffd43b" />
        </g>
      );
    case "flashlight":
      return (
        <g transform={tr}>
          <polygon points="-6,20 6,20 160,320 -160,320" fill="#fff6c0" opacity={0.18} />
          <rect x={-6} y={-6} width={12} height={28} rx={2} fill="#444" />
        </g>
      );
    case "candle": {
      const flick = Math.sin(t * 30) * 1.5;
      return (
        <g transform={`translate(${at.x} ${at.y})`}>
          <circle cx={0} cy={-38} r={40} fill="#ffb84d" opacity={0.15} />
          <rect x={-5} y={-18} width={10} height={24} fill="#f1e9d2" />
          <ellipse cx={flick} cy={-26} rx={4} ry={8} fill="#ffb020" />
        </g>
      );
    }
    case "heart":
      return (
        <g transform={`translate(${at.x} ${at.y - 10})`}>
          <path d="M 0 14 C -22 0 -12 -16 0 -6 C 12 -16 22 0 0 14 Z" fill="#ff3b6b" />
        </g>
      );
  }
};

const DEFAULT_LOOK: Look = {};

export const Stickman: React.FC<{
  pose: Pose;
  emotion: Emotion;
  stroke: string; // Standard-Linienfarbe (vom Theme)
  headFill: string; // Standard-Kopffarbe (vom Theme)
  look?: Look;
  blink?: boolean;
  item?: HandItem;
  t?: number;
}> = ({ pose, emotion, stroke: themeStroke, headFill, look = DEFAULT_LOOK, blink = false, item = "none", t = 0 }) => {
  const stroke = look.color ?? themeStroke;
  const skin = look.skin ?? headFill;
  const lw = 7 * (look.lineWidth ?? 1);
  const hs = look.headSize ?? 1;
  const ghost = look.body === "ghost";

  // Lokale Koordinaten: Hüfte bei (0,0), y nach unten
  const hip: Pt = { x: 0, y: 0 };
  const kneeB = dir(hip, pose.legB[0], THIGH);
  const footB = dir(kneeB, pose.legB[0] + pose.legB[1], SHIN);
  const kneeF = dir(hip, pose.legF[0], THIGH);
  const footF = dir(kneeF, pose.legF[0] + pose.legF[1], SHIN);
  const neck = dir(hip, 180 - pose.lean, TORSO);
  const shoulder = dir(neck, -pose.lean, 6);
  const headC = dir(neck, 180 - pose.lean - pose.head * 0.3, HEAD_R * hs + 4);
  const elbowB = dir(shoulder, pose.armB[0], UPPER_ARM);
  const handB = dir(elbowB, pose.armB[0] + pose.armB[1], FOREARM);
  const elbowF = dir(shoulder, pose.armF[0], UPPER_ARM);
  const handF = dir(elbowF, pose.armF[0] + pose.armF[1], FOREARM);

  // Automatisch auf den Boden stellen (Geist schwebt)
  const lowest = ghost ? THIGH + SHIN - 10 : Math.max(footB.y, footF.y, kneeB.y, kneeF.y);
  const float = ghost ? Math.sin(t * 2.5) * 6 + 14 : 0;
  const groundOffset = -lowest - float;

  const line = (a: Pt, b: Pt, c?: Pt) => `M ${a.x} ${a.y} L ${b.x} ${b.y}${c ? ` L ${c.x} ${c.y}` : ""}`;
  const st = { stroke, strokeWidth: lw, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  // Stoff: dicke Linie in Stoff-Farbe mit Umrandung
  const cloth = (d: string, color: string, width: number, key?: string) => (
    <g key={key}>
      <path d={d} stroke={stroke} strokeWidth={width + 5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );

  const top = look.top ?? "none";
  const topColor = look.topColor ?? "#888";
  const longSleeve = ["shirt", "hoodie", "suit", "labcoat", "robe", "armor"].includes(top);
  const shortSleeve = top === "tshirt" || top === "dress";

  const arm = (s: Pt, e: Pt, h: Pt, key: string) => {
    if (ghost) return null;
    if (longSleeve) {
      const cuff = { x: e.x + (h.x - e.x) * 0.8, y: e.y + (h.y - e.y) * 0.8 };
      return (
        <g key={key}>
          <path d={line(cuff, h)} {...st} />
          {cloth(line(s, e, cuff), topColor, 13)}
        </g>
      );
    }
    if (shortSleeve) {
      const mid = { x: s.x + (e.x - s.x) * 0.55, y: s.y + (e.y - s.y) * 0.55 };
      return (
        <g key={key}>
          <path d={line(s, e, h)} {...st} />
          {cloth(line(s, mid), topColor, 14)}
        </g>
      );
    }
    return <path key={key} d={line(s, e, h)} {...st} />;
  };

  const bottom = look.bottom ?? "none";
  const bottomColor = look.bottomColor ?? "#444";
  const leg = (k: Pt, f: Pt, key: string) => {
    if (ghost) return null;
    if (bottom === "pants") return cloth(line(hip, k, f), bottomColor, 13, key);
    if (bottom === "shorts") {
      const mid = { x: k.x + (f.x - k.x) * 0.1, y: k.y + (f.y - k.y) * 0.1 };
      return (
        <g key={key}>
          <path d={line(hip, k, f)} {...st} />
          {cloth(line(hip, mid), bottomColor, 15)}
        </g>
      );
    }
    return <path key={key} d={line(hip, k, f)} {...st} />;
  };

  const torsoRot = `rotate(${pose.lean})`;
  const wave = Math.sin(t * 4) * 6;

  // Körper-Silhouetten im Torso-Koordinatensystem (Hüfte 0,0, Hals 0,-62)
  const longCoat = top === "labcoat" ? 48 : top === "robe" ? 90 : top === "dress" ? 42 : 0;
  const coat = longCoat ? (
    <g transform={torsoRot}>
      <path
        d={`M -11 -58 L 11 -58 L ${top === "dress" ? 9 : 13} -18 L ${top === "robe" ? 30 : 26} ${longCoat} Q 0 ${longCoat + 6} ${top === "robe" ? -30 : -26} ${longCoat} L ${top === "dress" ? -9 : -13} -18 Z`}
        fill={topColor}
        stroke={stroke}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {top === "labcoat" ? <line x1={0} y1={-56} x2={0} y2={longCoat - 2} stroke={stroke} strokeWidth={2} /> : null}
    </g>
  ) : null;

  const skirt =
    bottom === "skirt" && !longCoat ? (
      <path d={`M -11 -6 L 11 -6 L 24 34 Q 0 40 -24 34 Z`} fill={bottomColor} stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
    ) : null;

  const torso = ghost ? null : top !== "none" && !longCoat ? (
    <g>
      {cloth(line(hip, neck), topColor, 24)}
      <g transform={torsoRot}>
        {top === "suit" ? <polygon points="-6,-58 6,-58 0,-38" fill="#fff" /> : null}
        {top === "hoodie" ? <path d="M -8 -30 L 8 -30 L 7 -16 L -7 -16 Z" fill="none" stroke={stroke} strokeWidth={2} /> : null}
        {top === "armor" ? <path d="M -10 -50 Q 0 -40 10 -50 M -10 -36 Q 0 -26 10 -36" stroke={stroke} strokeWidth={2} fill="none" /> : null}
      </g>
    </g>
  ) : (
    <path d={line(hip, neck)} {...st} />
  );

  const extraColor = look.extraColor ?? "#c92a2a";
  const extraBack =
    look.extra === "backpack" ? (
      <g transform={torsoRot}>
        <rect x={-30} y={-56} width={22} height={38} rx={7} fill={extraColor} stroke={stroke} strokeWidth={3} />
      </g>
    ) : look.extra === "wings" ? (
      <g transform={torsoRot}>
        {[0, 1].map((k) => (
          <ellipse
            key={k}
            cx={-26 - k * 6}
            cy={-58 + k * 4}
            rx={30}
            ry={12 + Math.sin(t * 8 + k) * 4}
            transform={`rotate(${-30 - k * 15} ${-8} -52)`}
            fill={extraColor}
            stroke={stroke}
            strokeWidth={2.5}
          />
        ))}
      </g>
    ) : look.extra === "tail" ? (
      <g>
        <path d={`M -2 -2 Q -34 ${10 + wave} -30 ${-24 + wave}`} stroke={extraColor} strokeWidth={5} fill="none" strokeLinecap="round" />
        <polygon points={`-30,${-34 + wave} -38,${-20 + wave} -22,${-22 + wave}`} fill={extraColor} />
      </g>
    ) : null;

  const extraFront =
    look.extra === "tie" ? (
      <g transform={torsoRot}>
        <polygon points="-3,-56 3,-56 5,-28 0,-22 -5,-28" fill={extraColor} />
      </g>
    ) : look.extra === "bowtie" ? (
      <g transform={torsoRot}>
        <polygon points="-9,-60 0,-56 -9,-52" fill={extraColor} />
        <polygon points="9,-60 0,-56 9,-52" fill={extraColor} />
      </g>
    ) : look.extra === "scarf" ? (
      <g transform={torsoRot}>
        <path d={`M -10 -58 Q 0 -52 12 -58`} stroke={extraColor} strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d={`M -8 -56 Q ${-22 + wave} -44 ${-30 + wave} -34`} stroke={extraColor} strokeWidth={7} fill="none" strokeLinecap="round" />
      </g>
    ) : null;

  const cape = look.cape ? (
    <g transform={torsoRot}>
      <path
        d={`M -4 -60 L 6 -60 Q 4 0 -6 56 Q ${-30 + wave} ${62} ${-48 + wave} 52 Q -24 0 -4 -60 Z`}
        fill={look.cape}
        stroke={stroke}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </g>
  ) : null;

  const ghostSheet = ghost ? (
    <path
      d={`M ${headC.x - 24 * hs} ${headC.y} L ${-26} ${THIGH + 10} ${[0, 1, 2, 3].map((k) => `Q ${-19.5 + k * 13} ${THIGH + 22 + Math.sin(t * 6 + k) * 5} ${-13 + k * 13} ${THIGH + 10}`).join(" ")} L ${headC.x + 24 * hs} ${headC.y} Z`}
      fill={skin}
      fillOpacity={0.9}
      stroke={stroke}
      strokeWidth={4}
      strokeLinejoin="round"
    />
  ) : null;

  const shape = look.head ?? "round";
  const headShape =
    shape === "square" ? (
      <rect x={-HEAD_R} y={-HEAD_R} width={HEAD_R * 2} height={HEAD_R * 2} rx={8} fill={skin} stroke={stroke} strokeWidth={6} />
    ) : shape === "oval" ? (
      <ellipse rx={HEAD_R * 0.9} ry={HEAD_R * 1.15} fill={skin} stroke={stroke} strokeWidth={6} />
    ) : (
      <circle r={HEAD_R} fill={skin} stroke={stroke} strokeWidth={ghost ? 4 : 6} />
    );

  return (
    <g transform={`translate(0 ${groundOffset - pose.lift})`}>
      <g transform={`rotate(${pose.rotate})`}>
        {cape}
        {extraBack}
        {leg(kneeB, footB, "legB")}
        {arm(shoulder, elbowB, handB, "armB")}
        {torso}
        {leg(kneeF, footF, "legF")}
        {skirt}
        {coat}
        {ghostSheet}
        {extraFront}
        <g transform={`rotate(${pose.lean + pose.head} ${headC.x} ${headC.y})`}>
          <g transform={`translate(${headC.x} ${headC.y}) scale(${hs})`}>
            <HairBack look={look} />
            {headShape}
            <MaskBand look={look} />
            <Face emotion={emotion} blink={blink} stroke={look.mask && look.hat !== "hood" ? "#fff" : stroke} t={t} />
            <MaskLower look={look} />
            <Beard look={look} />
            <Glasses look={look} stroke={stroke} />
            {look.hat === "helmet" || look.hat === "hood" ? null : <HairFront look={look} t={t} stroke={stroke} />}
            <Hat look={look} t={t} />
          </g>
        </g>
        {arm(shoulder, elbowF, handF, "armF")}
        {ghost ? null : <Item item={item} at={handF} angle={pose.armF[0] + pose.armF[1]} t={t} />}
      </g>
    </g>
  );
};

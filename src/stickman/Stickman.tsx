import React from "react";
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

export const Stickman: React.FC<{
  pose: Pose;
  emotion: Emotion;
  stroke: string;
  headFill: string;
  blink?: boolean;
  item?: HandItem;
  t?: number;
}> = ({ pose, emotion, stroke, headFill, blink = false, item = "none", t = 0 }) => {
  // Lokale Koordinaten: Hüfte bei (0,0), y nach unten
  const hip: Pt = { x: 0, y: 0 };
  const kneeB = dir(hip, pose.legB[0], THIGH);
  const footB = dir(kneeB, pose.legB[0] + pose.legB[1], SHIN);
  const kneeF = dir(hip, pose.legF[0], THIGH);
  const footF = dir(kneeF, pose.legF[0] + pose.legF[1], SHIN);
  const neck = dir(hip, 180 - pose.lean, TORSO);
  const shoulder = dir(neck, -pose.lean, 6);
  const headC = dir(neck, 180 - pose.lean - pose.head * 0.3, HEAD_R + 4);
  const elbowB = dir(shoulder, pose.armB[0], UPPER_ARM);
  const handB = dir(elbowB, pose.armB[0] + pose.armB[1], FOREARM);
  const elbowF = dir(shoulder, pose.armF[0], UPPER_ARM);
  const handF = dir(elbowF, pose.armF[0] + pose.armF[1], FOREARM);

  // Automatisch auf den Boden stellen
  const lowest = Math.max(footB.y, footF.y, kneeB.y, kneeF.y);
  const groundOffset = -lowest;

  const line = (a: Pt, b: Pt, c: Pt) => `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`;
  const st = {
    stroke,
    strokeWidth: 7,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <g transform={`translate(0 ${groundOffset - pose.lift})`}>
      <g transform={`rotate(${pose.rotate})`}>
        <path d={line(hip, kneeB, footB)} {...st} />
        <path d={line(shoulder, elbowB, handB)} {...st} />
        <path d={`M ${hip.x} ${hip.y} L ${neck.x} ${neck.y}`} {...st} />
        <path d={line(hip, kneeF, footF)} {...st} />
        <g transform={`rotate(${pose.lean + pose.head} ${headC.x} ${headC.y})`}>
          <circle cx={headC.x} cy={headC.y} r={HEAD_R} fill={headFill} stroke={stroke} strokeWidth={6} />
          <g transform={`translate(${headC.x} ${headC.y})`}>
            <Face emotion={emotion} blink={blink} stroke={stroke} t={t} />
          </g>
        </g>
        <path d={line(shoulder, elbowF, handF)} {...st} />
        <Item item={item} at={handF} angle={pose.armF[0] + pose.armF[1]} t={t} />
      </g>
    </g>
  );
};

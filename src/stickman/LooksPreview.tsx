import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { LOOKS, LookName } from "./looks";
import { animatePose, PoseName } from "./poses";
import { Emotion, Stickman } from "./Stickman";

const POSES: PoseName[] = ["stand", "wave", "walk", "cheer", "point", "think"];
const EMOTIONS: Emotion[] = ["happy", "neutral", "love", "thinking", "shocked"];

// Spickzettel: alle fertigen Figuren
export const LooksPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const names = Object.keys(LOOKS) as LookName[];
  const cols = 9;
  return (
    <AbsoluteFill style={{ backgroundColor: "#f4f1ea", fontFamily: "sans-serif" }}>
      <svg width={1920} height={1080}>
        {names.map((n, i) => {
          const x = 110 + (i % cols) * 212;
          const y = 215 + Math.floor(i / cols) * 245;
          return (
            <g key={n}>
              <line x1={x - 80} x2={x + 80} y1={y} y2={y} stroke="#ccc" strokeWidth={3} />
              <g transform={`translate(${x} ${y}) scale(${0.75 * (LOOKS[n].height ?? 1)})`}>
                <Stickman
                  pose={animatePose(POSES[i % POSES.length], t)}
                  emotion={n === "monster" || n === "zombie" ? "creepy" : EMOTIONS[i % EMOTIONS.length]}
                  stroke="#1d2330"
                  headFill="#fff"
                  look={LOOKS[n]}
                  t={t}
                />
              </g>
              <text x={x} y={y + 34} textAnchor="middle" fontSize={24} fill="#333">
                {n}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { animatePose, POSES, PoseName } from "./poses";
import { Emotion, Stickman } from "./Stickman";

const EMOTIONS: Emotion[] = [
  "neutral", "happy", "sad", "scared", "shocked", "angry",
  "love", "thinking", "crying", "creepy", "sleep",
];

// Spickzettel: alle Posen und Gesichter auf einen Blick
export const PosesPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const names = Object.keys(POSES) as PoseName[];
  const cols = 8;
  return (
    <AbsoluteFill style={{ backgroundColor: "#f4f1ea", fontFamily: "sans-serif" }}>
      <svg width={1920} height={1080}>
        {names.map((n, i) => {
          const x = 120 + (i % cols) * 240;
          const y = 300 + Math.floor(i / cols) * 330;
          return (
            <g key={n}>
              <line x1={x - 90} x2={x + 90} y1={y} y2={y} stroke="#bbb" strokeWidth={3} />
              <g transform={`translate(${x} ${y}) scale(1.1)`}>
                <Stickman
                  pose={animatePose(n, t)}
                  emotion={EMOTIONS[i % EMOTIONS.length]}
                  stroke="#1d2330"
                  headFill="#fff"
                  t={t}
                />
              </g>
              <text x={x} y={y + 40} textAnchor="middle" fontSize={28} fill="#333">
                {n} · {EMOTIONS[i % EMOTIONS.length]}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

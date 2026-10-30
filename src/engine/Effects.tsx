import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Theme } from "./themes";
import { EffectName } from "./types";
import { clamp, useLayout } from "./layout";

const Rain: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H } = useLayout();
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {new Array(140).fill(0).map((_, i) => {
        const speed = 38 + random(`rs${i}`) * 20;
        const x = random(`rx${i}`) * (W + 200) - 100 - ((frame * speed * 0.15) % 200);
        const y = ((random(`ry${i}`) * H + frame * speed) % (H + 100)) - 50;
        return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 40} stroke="#9fb4d0" strokeWidth={2.5} opacity={0.45} />;
      })}
    </svg>
  );
};

const Flicker: React.FC = () => {
  const frame = useCurrentFrame();
  const r = random(`fl${Math.floor(frame / 3)}`);
  const opacity = r > 0.88 ? 0.75 : r > 0.75 ? 0.35 : 0;
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity }} />;
};

const Lightning: React.FC = () => {
  const frame = useCurrentFrame();
  const window = Math.floor(frame / 75);
  const offset = Math.floor(random(`lw${window}`) * 60);
  const local = (frame % 75) - offset;
  const opacity = local === 0 || local === 3 ? 0.85 : local === 1 || local === 4 ? 0.4 : 0;
  return <AbsoluteFill style={{ backgroundColor: "#dfe8ff", opacity }} />;
};

const Fog: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H, groundY } = useLayout();
  return (
    <AbsoluteFill style={{ filter: "blur(40px)", opacity: 0.55 }}>
      {new Array(7).fill(0).map((_, i) => {
        const w = W * (0.5 + random(`fw${i}`) * 0.5);
        const x = ((random(`fx${i}`) * W + frame * (0.6 + i * 0.25)) % (W + w)) - w;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: groundY - H * 0.08 + random(`fy${i}`) * H * 0.12,
              width: w,
              height: H * 0.12,
              borderRadius: "50%",
              background: "#8a93a6",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Hearts: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const { W, H, font } = useLayout();
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {new Array(18).fill(0).map((_, i) => {
        const delay = random(`hd${i}`) * 90;
        const life = 120;
        const f = (frame - delay + life * 10) % life;
        const x = random(`hx${i}`) * W + Math.sin((frame + i * 20) / 15) * 20;
        const y = H * 0.85 - f * (H / 150);
        const s = (0.6 + random(`hs${i}`) * 0.8) * font * 2;
        const op = interpolate(f, [0, 15, life - 30, life], [0, 0.8, 0.8, 0], clamp);
        return (
          <path
            key={i}
            transform={`translate(${x} ${y}) scale(${s})`}
            d="M 0 14 C -22 0 -12 -16 0 -6 C 12 -16 22 0 0 14 Z"
            fill={color}
            opacity={op}
          />
        );
      })}
    </svg>
  );
};

const Sparkles: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H, font } = useLayout();
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {new Array(30).fill(0).map((_, i) => {
        const tw = Math.max(0, Math.sin(frame / 8 + i * 1.7));
        const s = tw * 14 * font;
        const x = random(`sx${i}`) * W;
        const y = random(`sy${i}`) * H * 0.7;
        return (
          <path
            key={i}
            d={`M ${x} ${y - s} L ${x + s * 0.25} ${y - s * 0.25} L ${x + s} ${y} L ${x + s * 0.25} ${y + s * 0.25} L ${x} ${y + s} L ${x - s * 0.25} ${y + s * 0.25} L ${x - s} ${y} L ${x - s * 0.25} ${y - s * 0.25} Z`}
            fill="#fff4b0"
          />
        );
      })}
    </svg>
  );
};

const RedPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = 0.25 + Math.sin((frame / fps) * Math.PI * 2 * 1.2) * 0.2;
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, transparent 30%, #8b0000 100%)",
        opacity: o,
        mixBlendMode: "multiply",
      }}
    />
  );
};

const Thoughts: React.FC<{ words: string[]; theme: Theme }> = ({ words, theme }) => {
  const frame = useCurrentFrame();
  const { W, H, font } = useLayout();
  return (
    <AbsoluteFill>
      {words.map((w, i) => {
        const start = i * 8;
        // Wörter schweben im oberen Bereich, über den Köpfen
        const col = i % 2 === 0 ? 0.3 : 0.7;
        const row = Math.floor(i / 2);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: W * col + Math.sin(frame / 25 + i) * W * 0.03,
              top: H * (0.1 + row * 0.08) + Math.cos(frame / 30 + i) * H * 0.01,
              translate: "-50% -50%",
              rotate: `${(random(`trot${i}`) - 0.5) * 30}deg`,
              fontFamily: theme.titleFont,
              fontSize: (48 + random(`tf${i}`) * 16) * font,
              color: theme.accent,
              opacity: interpolate(frame, [start, start + 10], [0, 0.9], clamp),
              scale: interpolate(frame, [start, start + 10], [0.3, 1], clamp),
              whiteSpace: "nowrap",
            }}
          >
            {w}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Effect: React.FC<{ name: EffectName; theme: Theme; words?: string[] }> = ({
  name,
  theme,
  words,
}) => {
  switch (name) {
    case "rain":
      return <Rain />;
    case "flicker":
      return <Flicker />;
    case "lightning":
      return <Lightning />;
    case "fog":
      return <Fog />;
    case "hearts":
      return <Hearts color={theme.accent} />;
    case "sparkles":
      return <Sparkles />;
    case "redPulse":
      return <RedPulse />;
    case "thoughts":
      return <Thoughts words={words ?? []} theme={theme} />;
  }
};

export const Vignette: React.FC<{ strength: number }> = ({ strength }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

export const Grain: React.FC<{ amount: number }> = ({ amount }) => {
  const frame = useCurrentFrame();
  const { W, H } = useLayout();
  return (
    <svg width={W} height={H} style={{ position: "absolute", opacity: amount, mixBlendMode: "overlay" }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 30} />
      </filter>
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
  );
};

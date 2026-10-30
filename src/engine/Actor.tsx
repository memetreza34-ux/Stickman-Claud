import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { animatePose, blendPose, PoseName } from "../stickman/poses";
import { Emotion, HandItem, Stickman, STICKMAN_HEIGHT } from "../stickman/Stickman";
import { Theme } from "./themes";
import { ActorDef, Keyframe } from "./types";
import { clamp, useLayout } from "./layout";

type Resolved = Required<Omit<Keyframe, "say" | "sayFor" | "facing">> & {
  facing?: "left" | "right";
  say?: string;
  sayFor?: number;
};

const resolveKeys = (keys: Keyframe[]): Resolved[] => {
  const out: Resolved[] = [];
  let prev: Resolved = {
    at: 0,
    x: 50,
    y: 0,
    pose: "stand",
    emotion: "neutral",
    item: "none",
    hidden: false,
  };
  for (const k of [...keys].sort((a, b) => a.at - b.at)) {
    const r: Resolved = {
      ...prev,
      ...k,
      facing: k.facing,
      say: k.say,
      sayFor: k.sayFor,
    };
    out.push(r);
    prev = r;
  }
  return out;
};

const BLEND = 0.3;

export const Actor: React.FC<{ actor: ActorDef; theme: Theme; seed: number }> = ({
  actor,
  theme,
  seed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { W, H, groundY, unit, font } = useLayout();
  const t = frame / fps;
  const keys = React.useMemo(() => resolveKeys(actor.keys), [actor.keys]);

  let i = 0;
  for (let j = 0; j < keys.length; j++) if (keys[j].at <= t) i = j;
  const k = keys[i];
  const next = keys[i + 1];
  const prev = keys[i - 1];

  if (k.hidden) return null;

  const moving = next && next.x !== k.x;
  const x = moving ? interpolate(t, [k.at, next.at], [k.x, next.x], clamp) : k.x;

  // Blickrichtung: explizit, sonst Bewegungsrichtung, sonst letzte bekannte
  let facing: "left" | "right" = "right";
  for (let j = 0; j <= i; j++) {
    const kj = keys[j];
    const nj = keys[j + 1];
    if (kj.facing) facing = kj.facing;
    else if (nj && nj.x !== kj.x) facing = nj.x > kj.x ? "right" : "left";
  }

  const blendT = prev
    ? interpolate(t, [k.at, k.at + BLEND], [0, 1], {
        ...clamp,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
    : 1;
  const pose = prev
    ? blendPose(animatePose(prev.pose as PoseName, t), animatePose(k.pose as PoseName, t), blendT)
    : animatePose(k.pose as PoseName, t);
  const y = prev ? interpolate(blendT, [0, 1], [prev.y, k.y]) : k.y;

  const blink = (frame + seed * 37) % 110 < 4;
  const scale = unit * (actor.size ?? 1);
  const px = (x / 100) * W;
  const py = groundY - y * scale;

  // Sprechblase
  let bubble: { text: string; from: number } | null = null;
  for (let j = 0; j <= i; j++) {
    const kj = keys[j];
    if (!kj.say) continue;
    const end = kj.at + (kj.sayFor ?? (keys[j + 1] ? keys[j + 1].at - kj.at : 999));
    if (t >= kj.at && t < end) bubble = { text: kj.say, from: kj.at };
  }

  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", overflow: "visible" }}>
        <g transform={`translate(${px} ${py}) scale(${facing === "left" ? -scale : scale} ${scale})`}>
          <Stickman
            pose={pose}
            emotion={k.emotion as Emotion}
            stroke={actor.color ?? theme.stroke}
            headFill={theme.headFill}
            blink={blink}
            item={k.item as HandItem}
            t={t}
          />
        </g>
      </svg>
      {bubble ? (
        <div
          style={{
            position: "absolute",
            left: px,
            bottom: H - py + (STICKMAN_HEIGHT + 25) * scale,
            translate: "-50% 0",
            scale: interpolate(t, [bubble.from, bubble.from + 0.25], [0.4, 1], {
              ...clamp,
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            }),
            transformOrigin: "50% 100%",
            background: "#fff",
            color: "#111",
            border: "5px solid #111",
            borderRadius: 36 * font,
            padding: `${18 * font}px ${30 * font}px`,
            fontFamily: theme.textFont,
            fontSize: 50 * font,
            lineHeight: 1.15,
            maxWidth: W * 0.6,
            width: "max-content",
            textAlign: "center",
          }}
        >
          {bubble.text}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: -26 * font,
              width: 0,
              height: 0,
              borderLeft: `${16 * font}px solid transparent`,
              borderRight: `${16 * font}px solid transparent`,
              borderTop: `${26 * font}px solid #111`,
              translate: "-50% 0",
            }}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

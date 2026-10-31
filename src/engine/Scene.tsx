import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AudioCue, PreparedScene } from "./prepare";
import { BoilFilter, Grade, InkFilter, Light, Paper, StyleName, STYLES } from "./styles";
import { Actor } from "./Actor";
import { Background, INK } from "./Backgrounds";
import { Props } from "../worlds/props";
import { Effect, Grain, Vignette } from "./Effects";
import { Theme } from "./themes";
import { Caption } from "./types";
import { clamp, useLayout } from "./layout";

const CaptionText: React.FC<{ caption: Caption; end: number; theme: Theme; ink: boolean }> = ({
  caption,
  end,
  theme,
  ink,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { W, portrait, font } = useLayout();
  const t = frame / fps;
  if (t < caption.at || t >= end) return null;

  const words = caption.text.split(" ");
  const local = t - caption.at;
  return (
    <div
      style={{
        position: "absolute",
        left: W * 0.08,
        right: W * 0.08,
        bottom: portrait ? "9%" : "6%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={
          ink
            ? {
                fontFamily: theme.textFont,
                fontSize: (portrait ? 80 : 64) * font,
                lineHeight: 1.15,
                color: theme.night ? "#f6f1e6" : "#1b1b1b",
                WebkitTextStroke: `${12 * font}px ${theme.night ? "#141414" : "#f6f1e6"}`,
                paintOrder: "stroke fill",
                textAlign: "center",
                rotate: "-1.5deg",
              }
            : {
                background: theme.textBox,
                borderRadius: 24 * font,
                padding: `${18 * font}px ${34 * font}px`,
                fontFamily: theme.textFont,
                fontSize: (portrait ? 64 : 56) * font,
                lineHeight: 1.2,
                color: theme.textColor,
                textAlign: "center",
                opacity: interpolate(local, [0, 0.15], [0, 1], clamp),
              }
        }
      >
        {words.map((w, i) => (
          <span
            key={i}
            style={{
              opacity: interpolate(local, [i * 0.07, i * 0.07 + 0.12], [0, 1], clamp),
              display: "inline-block",
              translate: `0 ${interpolate(local, [i * 0.07, i * 0.07 + 0.2], [12, 0], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })}px`,
              whiteSpace: "pre",
            }}
          >
            {w + (i < words.length - 1 ? " " : "")}
          </span>
        ))}
      </div>
    </div>
  );
};

const Title: React.FC<{ text: string; theme: Theme; ink: boolean }> = ({ text, theme, ink }) => {
  const frame = useCurrentFrame();
  const { W, font } = useLayout();
  const draw = interpolate(frame, [8, 26], [1, 0], { ...clamp, easing: Easing.bezier(0.33, 1, 0.68, 1) });
  const jitter = theme.night ? Math.sin(frame * 1.7) * 2 : 0;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: W * 0.08, flexDirection: "column" }}>
      <div
        style={{
          fontFamily: theme.titleFont,
          fontSize: 120 * font,
          lineHeight: 1.1,
          color: theme.night ? theme.textColor : theme.textColor,
          textAlign: "center",
          textShadow: theme.night ? `0 0 ${30 * font}px ${theme.accent}` : "none",
          translate: `${jitter}px 0`,
          scale: interpolate(frame, [0, 18], [0.8, 1], {
            ...clamp,
            easing: Easing.bezier(0.34, 1.56, 0.64, 1),
          }),
          opacity: interpolate(frame, [0, 10], [0, 1], clamp),
          whiteSpace: "pre-line",
        }}
      >
        {text}
      </div>
      {ink ? (
        <svg width={W * 0.7} height={60 * font} viewBox="0 0 700 60" style={{ marginTop: 10 * font }}>
          <path
            d="M 10 38 C 120 18, 230 50, 350 30 S 580 20, 690 34"
            stroke={theme.accent}
            strokeWidth={12}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={draw}
          />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

const Cue: React.FC<{ cue: AudioCue; name: string }> = ({ cue, name }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(cue.at * fps)} layout="none" name={name}>
      <Audio src={staticFile(cue.file)} volume={cue.volume} loop={cue.loop} />
    </Sequence>
  );
};

export const Scene: React.FC<{ scene: PreparedScene; theme: Theme; style?: StyleName }> = ({ scene, theme, style = "sketch" }) => {
  const look = STYLES[style];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { font, W, H, groundY, unit } = useLayout();
  const t = frame / fps;
  const time = scene.time ?? (theme.night ? "night" : "day");
  const propCtx = { u: unit, frame, night: time === "night", ink: INK };
  const back = (scene.props ?? []).filter((p) => !p.front);
  const front = (scene.props ?? []).filter((p) => p.front);

  const zoom = scene.zoom
    ? interpolate(t, [0, scene.duration], scene.zoom, {
        ...clamp,
        easing: Easing.bezier(0.45, 0, 0.55, 1),
      })
    : 1;
  const focus = scene.focus ?? [50, 55];
  // Stil-Kamera: näher an den Figuren (um die Bodenlinie herum)
  const groundPct = (groundY / H) * 100;
  const camFocus: [number, number] = scene.focus ?? [50, groundPct - 8];
  const boilId = `boil-${scene.name.replace(/\W/g, "")}`;
  const inkId = `ink-${scene.name.replace(/\W/g, "")}`;
  const drift = look.drift
    ? interpolate(t, [0, scene.duration], [1, 1 + look.drift], { ...clamp, easing: Easing.bezier(0.45, 0, 0.55, 1) })
    : 1;
  const driftX = look.drift ? Math.sin(t * 0.5 + scene.name.length) * W * look.drift * 0.15 : 0;

  let shakeX = 0;
  let shakeY = 0;
  for (const s of scene.shake ?? []) {
    const d = t - s;
    if (d >= 0 && d < 0.6) {
      const amp = (1 - d / 0.6) * 22 * font;
      shakeX += Math.sin(d * 90) * amp;
      shakeY += Math.cos(d * 70) * amp;
    }
  }

  const captions = scene.captions ?? [];

  return (
    <AbsoluteFill style={{ backgroundColor: theme.sky[0], overflow: "hidden" }}>
      {look.boil ? <BoilFilter id={boilId} amount={look.boil * font} /> : null}
      {look.ink ? <InkFilter id={inkId} dark={time === "night"} boil={look.boil * font} /> : null}
      <AbsoluteFill
        style={{
          // Eigener Szenen-Zoom ersetzt das Stil-Framing (sonst doppelt gezoomt)
          scale: (scene.zoom ? zoom : look.framing) * drift,
          transformOrigin: !scene.zoom && !scene.focus ? `${camFocus[0]}% ${camFocus[1]}%` : `${focus[0]}% ${focus[1]}%`,
          translate: `${shakeX + driftX}px ${shakeY}px`,
          filter: look.boil && !look.ink ? `url(#${boilId})` : undefined,
        }}
      >
        <AbsoluteFill style={{ filter: look.ink ? `url(#${inkId})` : look.bgFilter }}>
          <Background name={scene.background} theme={theme} time={time} />
          {back.length ? (
            <svg width={W} height={H} style={{ position: "absolute" }}>
              <Props props={back} W={W} groundY={groundY} ctx={propCtx} />
            </svg>
          ) : null}
        </AbsoluteFill>
        <AbsoluteFill style={{ filter: look.ink && look.boil ? `url(#${boilId}) ${look.actorFilter}` : look.actorFilter }}>
          {(scene.actors ?? []).map((a, i) => (
            <Actor key={a.id} actor={a} theme={theme} seed={i + 1} shadow={look.shadow} />
          ))}
        </AbsoluteFill>
        {front.length ? (
          <svg width={W} height={H} style={{ position: "absolute", filter: look.ink ? `url(#${inkId})` : look.bgFilter }}>
            <Props props={front} W={W} groundY={groundY} ctx={propCtx} />
          </svg>
        ) : null}
      </AbsoluteFill>
      {look.light ? <Light strength={look.light} focus={camFocus} /> : null}
      {look.grade ? <Grade gradient={look.grade} /> : null}
      {look.paper ? <Paper /> : null}
      {(scene.effects ?? []).map((e) => (
        <Effect key={e} name={e} theme={theme} words={scene.thoughts} />
      ))}
      <Vignette strength={theme.vignette} />
      {theme.grain > 0 ? <Grain amount={theme.grain} /> : null}
      {scene.title ? <Title text={scene.title} theme={theme} ink={look.captions === "ink"} /> : null}
      {captions.map((c, i) => (
        <CaptionText
          key={i}
          caption={c}
          end={c.dur ? c.at + c.dur : (captions[i + 1]?.at ?? scene.duration)}
          theme={theme}
          ink={look.captions === "ink"}
        />
      ))}
      {scene.voice.map((c, i) => (
        <Cue key={`v${i}`} cue={c} name="Stimme" />
      ))}
      {scene.sounds.map((c, i) => (
        <Cue key={`s${i}`} cue={c} name={c.file.replace(/^sfx\/|\.wav$/g, "")} />
      ))}
    </AbsoluteFill>
  );
};

import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Audio } from "@remotion/media";
import { staticFile, useVideoConfig } from "remotion";
import { Scene } from "./Scene";
import { THEMES } from "./themes";
import { FPS, TRANSITION_FRAMES } from "./constants";
import { PreparedStory } from "./prepare";

export { FPS, TRANSITION_FRAMES };

export const FORMATS = {
  short: { width: 1080, height: 1920 },
  long: { width: 1920, height: 1080 },
};

const sceneFrames = (story: PreparedStory) => story.scenes.map((s) => Math.round(s.duration * FPS));

export const storyDuration = (story: PreparedStory) =>
  sceneFrames(story).reduce((a, b) => a + b, 0) - TRANSITION_FRAMES * (story.scenes.length - 1);

// Zeitfenster (in Frames), in denen gesprochen wird – dort wird die Musik leiser
const voiceWindows = (story: PreparedStory) => {
  const frames = sceneFrames(story);
  const windows: [number, number][] = [];
  let start = 0;
  story.scenes.forEach((scene, i) => {
    for (const v of scene.voice) {
      const from = start + Math.round(v.at * FPS);
      windows.push([from - 6, from + Math.round((v.duration ?? 3) * FPS)]);
    }
    start += frames[i] - TRANSITION_FRAMES;
  });
  return windows;
};

const MUSIC_VOLUME = { horror: 0.3, psychologie: 0.2, liebe: 0.22, comedy: 0.2 };

export const StoryVideo: React.FC<{ story: PreparedStory }> = ({ story }) => {
  const { fps } = useVideoConfig();
  const theme = THEMES[story.theme];
  const windows = React.useMemo(() => voiceWindows(story), [story]);
  const base = MUSIC_VOLUME[story.theme];

  return (
    <>
      {story.musicFile ? (
        <Audio
          src={staticFile(story.musicFile)}
          loop
          volume={(f) => (windows.some(([a, b]) => f >= a && f <= b) ? base * 0.45 : base)}
        />
      ) : null}
      <TransitionSeries>
        {story.scenes.map((scene, i) => (
          <React.Fragment key={i}>
            {i > 0 ? (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            ) : null}
            <TransitionSeries.Sequence durationInFrames={Math.round(scene.duration * fps)} name={scene.name}>
              <Scene scene={scene} theme={theme} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
    </>
  );
};

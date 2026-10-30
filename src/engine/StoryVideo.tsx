import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { useVideoConfig } from "remotion";
import { Scene } from "./Scene";
import { THEMES } from "./themes";
import { StoryDef } from "./types";

export const FPS = 30;
export const TRANSITION_FRAMES = 12;

export const FORMATS = {
  short: { width: 1080, height: 1920 },
  long: { width: 1920, height: 1080 },
};

export const storyDuration = (story: StoryDef) =>
  story.scenes.reduce((sum, s) => sum + Math.round(s.duration * FPS), 0) -
  TRANSITION_FRAMES * (story.scenes.length - 1);

export const StoryVideo: React.FC<{ story: StoryDef }> = ({ story }) => {
  const { fps } = useVideoConfig();
  const theme = THEMES[story.theme];
  return (
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
  );
};

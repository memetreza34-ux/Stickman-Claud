import { Composition, Folder } from "remotion";
import { FORMATS, FPS, storyDuration, StoryVideo } from "./engine/StoryVideo";
import { prepareStory } from "./engine/prepare";
import { STORIES } from "./stories";
import { PosesPreview } from "./stickman/PosesPreview";
import { LooksPreview } from "./stickman/LooksPreview";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Stories">
        {STORIES.map(prepareStory).map((story) => (
          <Composition
            key={story.id}
            id={story.id}
            component={StoryVideo}
            defaultProps={{ story }}
            durationInFrames={storyDuration(story)}
            fps={FPS}
            {...FORMATS[story.format]}
          />
        ))}
      </Folder>
      <Composition
        id="Posen-Uebersicht"
        component={PosesPreview}
        durationInFrames={150}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Figuren-Galerie"
        component={LooksPreview}
        durationInFrames={150}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};

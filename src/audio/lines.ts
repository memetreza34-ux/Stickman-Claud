import type { StoryDef } from "../engine/types";
import type { VoiceRole } from "./sounds";

export type VoiceLine = { key: string; text: string; role: VoiceRole };

// Alles, was vorgelesen wird: Untertitel (Erzähler) und Sprechblasen (Figuren).
// Der key bestimmt den Dateinamen: public/voice/<storyId>/<key>.wav
export const captionKey = (scene: number, i: number) => `s${scene}-c${i}`;
export const sayKey = (scene: number, actor: string, k: number) => `s${scene}-${actor}-${k}`;

export const voiceLines = (story: StoryDef): VoiceLine[] => {
  const narrator = story.narrator ?? "erzaehler";
  const out: VoiceLine[] = [];
  story.scenes.forEach((scene, s) => {
    (scene.captions ?? []).forEach((c, i) => {
      if (c.voice === false) return;
      out.push({ key: captionKey(s, i), text: c.text, role: c.voice ?? narrator });
    });
    for (const actor of scene.actors ?? []) {
      actor.keys.forEach((k, i) => {
        if (k.say) out.push({ key: sayKey(s, actor.id, i), text: k.say, role: actor.voice ?? narrator });
      });
    }
  });
  return out;
};

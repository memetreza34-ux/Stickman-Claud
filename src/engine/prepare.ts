import { captionKey, sayKey } from "../audio/lines";
import { VOICE_MANIFEST } from "../audio/manifest.generated";
import { MusicName, SfxName } from "../audio/sounds";
import { lightningFlashes } from "./Effects";
import { FPS } from "./constants";
import { SceneDef, StoryDef } from "./types";

export type AudioCue = { at: number; file: string; volume: number; loop?: boolean; duration?: number };

export type PreparedScene = SceneDef & { voice: AudioCue[]; sounds: AudioCue[] };
export type PreparedStory = Omit<StoryDef, "scenes"> & {
  scenes: PreparedScene[];
  musicFile: string | null;
};

const THEME_MUSIC: Record<StoryDef["theme"], MusicName> = {
  horror: "horror",
  psychologie: "calm",
  liebe: "love",
  comedy: "calm",
};

const sfx = (name: SfxName) => `sfx/${name}.wav`;
// Effekte etwas leiser als die Stimme, damit nichts übersteuert
const SFX_GAIN = 0.6;

// Passt die Story an die erzeugten Sprachaufnahmen an:
// Untertitel rücken nach, bis die vorige Aufnahme fertig ist,
// Sprechblasen bleiben so lange stehen wie gesprochen wird,
// und Szenen werden verlängert, wenn der Text länger dauert.
export const prepareStory = (story: StoryDef): PreparedStory => {
  const clips = VOICE_MANIFEST[story.id] ?? {};

  const scenes = story.scenes.map((scene, s): PreparedScene => {
    const voice: AudioCue[] = [];
    let end = 0;

    let cursor = 0;
    const raw = scene.captions ?? [];
    const captions = raw.map((c, i) => {
      const clip = c.voice === false ? undefined : clips[captionKey(s, i)];
      const at = Math.max(c.at, cursor);
      if (!clip) return { ...c, at };
      voice.push({ at, file: clip.file, volume: 1, duration: clip.duration });
      cursor = at + clip.duration + 0.25;
      end = Math.max(end, cursor);
      // Letzter gesprochener Untertitel verschwindet kurz nach dem Satz
      const last = i === raw.length - 1;
      return { ...c, at, dur: c.dur ?? (last ? clip.duration + 1.2 : undefined) };
    });

    const actors = (scene.actors ?? []).map((actor) => ({
      ...actor,
      look: actor.look ?? story.cast?.[actor.id],
      keys: actor.keys.map((k, i) => {
        const clip = k.say ? clips[sayKey(s, actor.id, i)] : undefined;
        if (!clip) return k;
        voice.push({ at: k.at, file: clip.file, volume: 1, duration: clip.duration });
        end = Math.max(end, k.at + clip.duration + 0.3);
        const next = actor.keys[i + 1];
        const natural = k.sayFor ?? (next ? next.at - k.at : Infinity);
        return natural < clip.duration + 0.3 ? { ...k, sayFor: clip.duration + 0.3 } : k;
      }),
    }));

    const duration = Math.max(scene.duration, end + 0.4);

    const sounds: AudioCue[] = (scene.sfx ?? []).map((c) => ({
      at: c.at,
      file: sfx(c.sound),
      volume: (c.volume ?? 0.8) * SFX_GAIN,
    }));
    const effects = scene.effects ?? [];
    if (effects.includes("rain")) sounds.push({ at: 0, file: "sfx/rain.wav", volume: 0.35, loop: true });
    if (effects.includes("lightning")) {
      for (const f of lightningFlashes(Math.round(duration * FPS))) {
        sounds.push({ at: f / FPS + 0.15, file: sfx("thunder"), volume: 0.7 });
      }
    }

    return { ...scene, duration, captions, actors, voice, sounds };
  });

  const music = story.music ?? THEME_MUSIC[story.theme];
  return { ...story, scenes, musicFile: music === "none" ? null : `music/${music}.wav` };
};

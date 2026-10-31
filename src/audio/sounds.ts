// Namen der synthetisch erzeugten Sounds (scripts/generate-audio.ts)
export const SFX_NAMES = [
  "knock",
  "thunder",
  "heartbeat",
  "whoosh",
  "stinger",
  "boom",
  "creak",
  "ding",
  "pop",
  "chime",
] as const;
export type SfxName = (typeof SFX_NAMES)[number];

export const MUSIC_NAMES = ["horror", "calm", "love"] as const;
export type MusicName = (typeof MUSIC_NAMES)[number];

// Sprecher-Rollen. Welche echte Stimme dahinter steckt: scripts/voices.config.ts
export type VoiceRole = "erzaehler" | "mann" | "frau" | "monster" | "kind";

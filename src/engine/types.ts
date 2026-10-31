import type { MusicName, SfxName, VoiceRole } from "../audio/sounds";
import type { Emotion, HandItem } from "../stickman/Stickman";
import type { PoseName } from "../stickman/poses";
import type { ThemeName } from "./themes";

export type BackgroundName =
  | "void"
  | "room"
  | "bedroom"
  | "street"
  | "forest"
  | "park"
  | "bus";

export type EffectName =
  | "rain"
  | "flicker"
  | "lightning"
  | "fog"
  | "hearts"
  | "redPulse"
  | "sparkles"
  | "thoughts";

// Ein Schlüsselbild: ab Sekunde `at` gilt diese Pose/Emotion.
// x (0–100 % der Breite) bewegt sich linear zum nächsten Keyframe.
export type Keyframe = {
  at: number;
  x?: number;
  y?: number; // Höhe über dem Boden (Stickman-Einheiten), z.B. für Bett
  pose?: PoseName;
  emotion?: Emotion;
  facing?: "left" | "right";
  item?: HandItem;
  say?: string;
  sayFor?: number;
  hidden?: boolean;
};

export type ActorDef = {
  id: string;
  color?: string;
  size?: number;
  voice?: VoiceRole; // Stimme für Sprechblasen
  keys: Keyframe[];
};

// voice: false = nicht vorlesen
export type Caption = { at: number; text: string; dur?: number; voice?: VoiceRole | false };

export type SfxCue = { at: number; sound: SfxName; volume?: number };

export type SceneDef = {
  name: string;
  duration: number; // Sekunden
  background: BackgroundName;
  title?: string; // großer Text in der Mitte (Hook / Titelkarte)
  captions?: Caption[];
  actors?: ActorDef[];
  effects?: EffectName[];
  shake?: number[]; // Zeitpunkte (s) für Kamera-Wackeln
  zoom?: [number, number]; // Kamera-Zoom von → bis
  focus?: [number, number]; // Zoom-Mittelpunkt in % (x, y)
  thoughts?: string[]; // Wörter für den "thoughts"-Effekt
  sfx?: SfxCue[];
};

export type StoryDef = {
  id: string;
  title: string;
  theme: ThemeName;
  format: "short" | "long";
  narrator?: VoiceRole; // Standard: "erzaehler"
  music?: MusicName | "none"; // Standard: passend zum Theme
  scenes: SceneDef[];
};

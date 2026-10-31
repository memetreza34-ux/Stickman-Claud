import type { VoiceRole } from "../src/audio/sounds";

// Kostenlos, offline: macOS-Stimmen (Liste: `say -v '?' | grep de_DE`)
// pitch < 1 = tiefer und langsamer, echo = Hall
export const SAY_VOICES: Record<
  VoiceRole,
  { voice: string; rate: number; pitch?: number; echo?: boolean }
> = {
  erzaehler: { voice: "Anna", rate: 165 },
  mann: { voice: "Reed (Deutsch (Deutschland))", rate: 170 },
  frau: { voice: "Shelley (Deutsch (Deutschland))", rate: 175 },
  monster: { voice: "Grandpa (Deutsch (Deutschland))", rate: 125, pitch: 0.72, echo: true },
  kind: { voice: "Sandy (Deutsch (Deutschland))", rate: 185, pitch: 1.2 },
};

// Bessere Qualität: ElevenLabs. Wird automatisch genutzt, wenn
// ELEVENLABS_API_KEY in .env steht. Voice-IDs findest du in der ElevenLabs Voice Library.
export const ELEVEN_VOICES: Record<VoiceRole, string> = {
  erzaehler: "pNInz6obpgDQGcFmaJgB", // Adam
  mann: "TxGEqnHWrfWFTfGW9XjX", // Josh
  frau: "21m00Tcm4TlvDq8ikWAM", // Rachel
  monster: "N2lVS1w4EtoT3dr4eOWO", // Callum
  kind: "jBpfuIE2acCO8z3wKNLl", // Gigi
};
export const ELEVEN_MODEL = "eleven_multilingual_v2";

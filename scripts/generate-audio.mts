// Erzeugt Stimmen, Soundeffekte und Musik für alle Storys.
//   npm run audio            → nur was fehlt oder sich geändert hat
//   npm run audio -- --force → alles neu
//
// Stimme: ElevenLabs, wenn ELEVENLABS_API_KEY in .env steht, sonst macOS `say`.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { voiceLines } from "../src/audio/lines";
import { VOICE_MANIFEST, VoiceClip } from "../src/audio/manifest.generated";
import { MUSIC_NAMES, SFX_NAMES, VoiceRole } from "../src/audio/sounds";
import { STORIES } from "../src/stories";
import {
  makeMusic,
  makeSfx,
  MUSIC_RATE,
  pcmToWav,
  SFX_RATE,
  toWav,
  wavDuration,
} from "./synth";
import { ELEVEN_MODEL, ELEVEN_VOICES, SAY_VOICES } from "./voices.config";

const ROOT = join(import.meta.dirname, "..");
const PUBLIC = join(ROOT, "public");
const force = process.argv.includes("--force");

const envFile = join(ROOT, ".env");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
const provider = ELEVEN_KEY ? "elevenlabs" : "say";

const write = (file: string, data: Buffer) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
};

// --- Soundeffekte & Musik ---
for (const name of [...SFX_NAMES, "rain" as const]) {
  const file = join(PUBLIC, "sfx", `${name}.wav`);
  if (force || !existsSync(file)) {
    write(file, toWav(makeSfx(name), SFX_RATE));
    console.log(`🔊 sfx/${name}.wav`);
  }
}
for (const name of MUSIC_NAMES) {
  const file = join(PUBLIC, "music", `${name}.wav`);
  if (force || !existsSync(file)) {
    write(file, toWav(makeMusic(name), MUSIC_RATE));
    console.log(`🎵 music/${name}.wav`);
  }
}

// --- Stimmen ---
const speakable = (text: string) => text.replace(/[„“”"]/g, "").replace(/\s+/g, " ").trim();

// Alle Stimmen gleich laut (Lautheit -16 LUFS, Spitzen max. -3 dB), Stille am Anfang weg
const finish = (tmp: string, out: string, extra: string[] = []) => {
  const filters = [
    ...extra,
    "silenceremove=start_periods=1:start_threshold=-50dB",
    "loudnorm=I=-16:TP=-3:LRA=11",
  ];
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", tmp, "-af", filters.join(","), "-ac", "1", "-ar", "22050", out]);
  rmSync(tmp);
};

const sayToWav = (text: string, role: VoiceRole, out: string) => {
  const v = SAY_VOICES[role];
  const tmp = `${out}.tmp.wav`;
  mkdirSync(dirname(out), { recursive: true });
  execFileSync("say", [
    "-v", v.voice, "-r", String(v.rate),
    "--file-format=WAVE", "--data-format=LEI16@22050",
    "-o", tmp, text,
  ]);
  finish(tmp, out, [
    ...(v.pitch ? [`asetrate=22050*${v.pitch}`, "aresample=22050"] : []),
    ...(v.echo ? ["aecho=0.8:0.6:70|140:0.35|0.2"] : []),
  ]);
};

const elevenToWav = async (text: string, role: VoiceRole, out: string) => {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICES[role]}?output_format=pcm_22050`,
    {
      method: "POST",
      headers: { "xi-api-key": ELEVEN_KEY!, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: ELEVEN_MODEL,
        voice_settings: { stability: 0.45, similarity_boost: 0.75, style: 0.35 },
      }),
    },
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  const tmp = `${out}.tmp.wav`;
  write(tmp, pcmToWav(Buffer.from(await res.arrayBuffer()), 22050));
  finish(tmp, out);
};

const manifest: Record<string, Record<string, VoiceClip>> = {};
let made = 0;

for (const story of STORIES) {
  manifest[story.id] = {};
  for (const line of voiceLines(story)) {
    const text = speakable(line.text);
    const voiceId = provider === "say" ? SAY_VOICES[line.role].voice : ELEVEN_VOICES[line.role];
    const hash = createHash("sha1").update(`v2|${provider}|${voiceId}|${line.role}|${text}`).digest("hex").slice(0, 12);
    const rel = `voice/${story.id}/${line.key}.wav`;
    const file = join(PUBLIC, rel);
    const old = VOICE_MANIFEST[story.id]?.[line.key];

    if (force || !old || old.hash !== hash || !existsSync(file)) {
      if (provider === "elevenlabs") await elevenToWav(text, line.role, file);
      else sayToWav(text, line.role, file);
      made++;
      console.log(`🗣️  ${rel}  (${line.role}) ${text}`);
    }
    manifest[story.id][line.key] = {
      file: rel,
      duration: Math.round(wavDuration(readFileSync(file)) * 100) / 100,
      hash,
    };
  }
}

writeFileSync(
  join(ROOT, "src/audio/manifest.generated.ts"),
  `// Automatisch erzeugt von scripts/generate-audio.mts – nicht von Hand bearbeiten.
export type VoiceClip = { file: string; duration: number; hash: string };
export const VOICE_MANIFEST: Record<string, Record<string, VoiceClip>> = ${JSON.stringify(manifest, null, 2)};
`,
);

console.log(`\n✅ Fertig. Stimme: ${provider}. ${made} neue Aufnahmen.`);

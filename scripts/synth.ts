// Synthetische Sounds und Musik – keine Downloads, keine Lizenzen, keine Kosten.
import type { MusicName, SfxName } from "../src/audio/sounds";

const TAU = Math.PI * 2;
const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

let seed = 12345;
const noise = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return (seed / 0x7fffffff) * 2 - 1;
};

const lowpass = (x: Float32Array, cutoff: number | ((i: number) => number), sr: number) => {
  const y = new Float32Array(x.length);
  let prev = 0;
  for (let i = 0; i < x.length; i++) {
    const fc = typeof cutoff === "number" ? cutoff : cutoff(i);
    const a = Math.exp((-TAU * fc) / sr);
    prev = (1 - a) * x[i] + a * prev;
    y[i] = prev;
  }
  return y;
};

const highpass = (x: Float32Array, cutoff: number, sr: number) => {
  const lp = lowpass(x, cutoff, sr);
  return x.map((v, i) => v - lp[i]);
};

const noiseBuf = (n: number) => Float32Array.from({ length: n }, noise);

const normalize = (x: Float32Array, peak: number) => {
  let m = 0;
  for (const v of x) m = Math.max(m, Math.abs(v));
  return m > 0 ? x.map((v) => (v / m) * peak) : x;
};

const render = (sec: number, sr: number, fn: (t: number, i: number) => number) => {
  const out = new Float32Array(Math.round(sec * sr));
  for (let i = 0; i < out.length; i++) out[i] = fn(i / sr, i);
  return out;
};

const env = (t: number, tau: number) => (t < 0 ? 0 : Math.exp(-t / tau));

export const SFX_RATE = 44100;

export const makeSfx = (name: SfxName | "rain"): Float32Array => {
  const sr = SFX_RATE;
  seed = name.length * 7919;
  switch (name) {
    case "knock": {
      const n = lowpass(noiseBuf(sr * 0.35), 1500, sr);
      return normalize(
        render(0.35, sr, (t, i) =>
          Math.sin(TAU * 95 * t) * env(t, 0.045) +
          0.5 * Math.sin(TAU * 190 * t) * env(t, 0.03) +
          n[i] * env(t, 0.015) * 2,
        ),
        0.95,
      );
    }
    case "thunder": {
      const crack = lowpass(noiseBuf(sr * 4), 3000, sr);
      const rumble = lowpass(lowpass(noiseBuf(sr * 4), 250, sr), 180, sr);
      return normalize(
        render(4, sr, (t, i) =>
          crack[i] * env(t, 0.12) * 0.5 +
          rumble[i] * (1 + 0.6 * Math.sin(TAU * 1.3 * t + 1)) * Math.min(1, t / 0.08) * env(t, 1.3) * 6,
        ),
        0.9,
      );
    }
    case "heartbeat":
      return normalize(
        lowpass(
          render(0.9, sr, (t) =>
            Math.sin(TAU * 55 * t) * env(t, 0.06) +
            0.8 * Math.sin(TAU * 48 * (t - 0.28)) * env(t - 0.28, 0.07),
          ),
          300,
          sr,
        ),
        0.95,
      );
    case "whoosh": {
      const d = 0.8;
      const n = noiseBuf(sr * d);
      const band = lowpass(n, (i) => 300 + 3500 * Math.sin((Math.PI * i) / n.length) ** 2, sr);
      const hp = highpass(band, 200, sr);
      return normalize(hp.map((v, i) => v * Math.sin((Math.PI * i) / n.length) ** 2), 0.8);
    }
    case "stinger": {
      const n = lowpass(noiseBuf(sr * 2.5), 2000, sr);
      return normalize(
        render(2.5, sr, (t, i) => {
          const boom = Math.sin(TAU * (45 + 40 * env(t, 0.1)) * t) * env(t, 0.8);
          const trem = 0.6 + 0.4 * Math.sin(TAU * 9 * t);
          const cluster =
            [1567, 1661, 1760, 1865].reduce((s, f) => s + Math.sin(TAU * f * t + f), 0) *
            0.12 * trem * Math.min(1, t / 0.02) * env(t, 0.9);
          return boom + cluster + n[i] * env(t, 0.08) * 0.6;
        }),
        0.95,
      );
    }
    case "boom": {
      const n = lowpass(noiseBuf(sr * 1.6), 800, sr);
      let phase = 0;
      return normalize(
        render(1.6, sr, (t, i) => {
          phase += (TAU * (35 + 35 * env(t, 0.15))) / sr;
          return Math.sin(phase) * env(t, 0.5) + n[i] * env(t, 0.1) * 1.5;
        }),
        0.95,
      );
    }
    case "creak": {
      let phase = 0;
      const raw = render(1.3, sr, (t) => {
        const f = 110 + 45 * Math.sin(TAU * 1.7 * t) + 15 * Math.sin(TAU * 7 * t);
        phase += f / sr;
        const saw = 2 * (phase % 1) - 1;
        const rough = 0.5 + 0.5 * Math.sin(TAU * 23 * t);
        return saw * rough * Math.min(1, t / 0.1) * Math.min(1, (1.3 - t) / 0.3);
      });
      return normalize(highpass(lowpass(raw, 2500, sr), 300, sr), 0.7);
    }
    case "ding":
      return normalize(
        render(1.5, sr, (t) =>
          Math.sin(TAU * 1046.5 * t) * env(t, 0.5) +
          0.4 * Math.sin(TAU * 2093 * t) * env(t, 0.3) +
          0.2 * Math.sin(TAU * 3140 * t) * env(t, 0.2),
        ),
        0.6,
      );
    case "pop": {
      let phase = 0;
      return normalize(
        render(0.15, sr, (t) => {
          phase += (TAU * (300 + 600 * env(t, 0.03))) / sr;
          return Math.sin(phase) * env(t, 0.04);
        }),
        0.7,
      );
    }
    case "chime":
      return normalize(
        render(2.2, sr, (t) =>
          [84, 88, 91, 96].reduce((s, n, k) => {
            const dt = t - k * 0.09;
            return s + (dt < 0 ? 0 : Math.sin(TAU * midi(n) * dt) * env(dt, 0.6));
          }, 0),
        ),
        0.55,
      );
    case "rain": {
      const n = noiseBuf(sr * 10);
      return normalize(lowpass(highpass(n, 700, sr), 5000, sr), 0.6);
    }
  }
};

export const MUSIC_RATE = 22050;
const LOOP = 32;
const XFADE = 2;

// Erzeugt LOOP + XFADE Sekunden und blendet das Ende in den Anfang → nahtloser Loop
const loopable = (fn: (t: number, i: number) => number, sr: number) => {
  const raw = render(LOOP + XFADE, sr, fn);
  const n = LOOP * sr;
  const x = XFADE * sr;
  const out = raw.slice(0, n);
  for (let i = 0; i < x; i++) {
    const a = i / x;
    out[i] = raw[i] * a + raw[n + i] * (1 - a);
  }
  return out;
};

const pad = (chords: number[][], t: number) => {
  const dur = LOOP / chords.length;
  const idx = Math.floor((t % LOOP) / dur);
  const local = (t % LOOP) - idx * dur;
  const fade = Math.min(1, local / 1.5, (dur - local) / 1.5);
  return chords[idx].reduce(
    (s, n) => s + Math.sin(TAU * midi(n) * t) + Math.sin(TAU * midi(n) * 1.003 * t),
    0,
  ) * fade * 0.12;
};

const pluck = (chords: number[][], t: number, step: number, octave: number, decay: number) => {
  const dur = LOOP / chords.length;
  const k = Math.floor(t / step);
  const dt = t - k * step;
  const chord = chords[Math.floor(((k * step) % LOOP) / dur)];
  const note = chord[[0, 1, 2, 3, 2, 1][k % 6] % chord.length] + octave;
  const f = midi(note);
  return (Math.sin(TAU * f * dt) + 0.3 * Math.sin(TAU * 2 * f * dt)) * env(dt, decay);
};

export const makeMusic = (name: MusicName): Float32Array => {
  const sr = MUSIC_RATE;
  seed = 999;
  switch (name) {
    case "horror": {
      const wind = lowpass(noiseBuf(sr * (LOOP + XFADE)), (i) => 250 + 200 * Math.sin((TAU * i) / sr / 9), sr);
      const swells = [5, 16, 26];
      return normalize(
        loopable((t, i) => {
          const drone =
            Math.sin(TAU * 55 * t) + Math.sin(TAU * 55.75 * t) + 0.5 * Math.sin(TAU * 77.75 * t);
          const screech = swells.reduce((s, at) => {
            const d = t - at;
            if (d < 0 || d > 4) return s;
            return s + Math.sin(TAU * (1244 + 6 * Math.sin(TAU * 5 * t)) * t) * Math.sin((Math.PI * d) / 4) ** 2 * 0.06;
          }, 0);
          return drone * 0.25 + wind[i] * 3 + screech;
        }, sr),
        0.8,
      );
    }
    case "calm": {
      const chords = [
        [48, 55, 64, 71],
        [45, 52, 60, 67],
        [41, 48, 57, 64],
        [43, 50, 59, 64],
      ];
      return normalize(
        loopable((t) => pad(chords, t) + pluck(chords, t, 0.5, 24, 0.4) * 0.12, sr),
        0.8,
      );
    }
    case "love": {
      const chords = [
        [41, 53, 57, 64],
        [40, 52, 55, 62],
        [38, 50, 57, 60],
        [36, 48, 55, 64],
      ];
      return normalize(
        loopable((t) => pad(chords, t) + pluck(chords, t, 0.25, 36, 0.5) * 0.1, sr),
        0.8,
      );
    }
  }
};

export const toWav = (samples: Float32Array, sr: number) => {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + samples.length * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sr, 24);
  buf.writeUInt32LE(sr * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), 44 + i * 2);
  }
  return buf;
};

export const pcmToWav = (pcm: Buffer, sr: number) => {
  const header = toWav(new Float32Array(0), sr);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
};

// Dauer einer WAV-Datei in Sekunden (liest die Chunks)
export const wavDuration = (buf: Buffer) => {
  let off = 12;
  let byteRate = 0;
  while (off < buf.length - 8) {
    const id = buf.toString("ascii", off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (id === "fmt ") byteRate = buf.readUInt32LE(off + 16);
    if (id === "data") return size / byteRate;
    off += 8 + size + (size % 2);
  }
  throw new Error("Keine gültige WAV-Datei");
};

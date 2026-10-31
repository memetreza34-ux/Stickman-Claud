# Stickman-Claud

Stickman-Storys mit [Remotion](https://remotion.dev) – Horror, Psychologie, Liebe und mehr.
Eine Story ist nur eine Datendatei. Die Engine macht daraus ein fertiges Video.

## Starten

```bash
npm i
npm run dev        # Remotion Studio (Vorschau)
npx remotion render Horror-DasKlopfen out/klopfen.mp4
```

## Ton (Stimme, Sounds, Musik)

```bash
npm run audio            # erzeugt nur was fehlt oder sich geändert hat
npm run audio -- --force # alles neu
```

- **Stimme:** Untertitel liest der Erzähler, Sprechblasen die Figur (`voice` am Actor).
  Ohne Key: kostenlose macOS-Stimmen. Mit `ELEVENLABS_API_KEY=...` in `.env`: ElevenLabs.
  Stimmen ändern: `scripts/voices.config.ts`.
- **Timing passt sich an:** Ist ein Satz länger, rücken Untertitel nach und die Szene wird länger.
- **Sounds:** `sfx: [{ at: 3, sound: "knock" }]` in einer Szene.
  Verfügbar: knock, thunder, heartbeat, whoosh, stinger, boom, creak, ding, pop, chime.
  Effekt `rain` bringt Regen-Geräusch, `lightning` Donner automatisch mit.
- **Musik:** passend zum Theme (horror, calm, love), wird leiser, wenn jemand spricht.
  Ändern mit `music: "calm"` oder `music: "none"` in der Story.

Nach jeder Text-Änderung in einer Story: `npm run audio` laufen lassen.

## Neue Story

1. Datei in `src/stories/` anlegen (Vorlage: eine der bestehenden Storys kopieren).
2. In `src/stories/index.ts` eintragen.

```ts
{
  id: "Horror-MeineStory",
  title: "Meine Story",
  theme: "horror",          // horror | psychologie | liebe | comedy
  format: "short",          // short = 1080x1920, long = 1920x1080
  scenes: [
    {
      name: "Hook",
      duration: 3,           // Sekunden
      background: "void",
      title: "Großer Text\nin der Mitte",
    },
    {
      name: "Szene 1",
      duration: 6,
      background: "room",
      effects: ["rain", "flicker"],
      shake: [3],            // Kamera wackelt bei 3 s
      zoom: [1, 1.5],        // langsamer Zoom
      actors: [
        {
          id: "ich",
          keys: [
            { at: 0, x: 10, pose: "walk", emotion: "neutral" },
            { at: 3, x: 60, pose: "scared", emotion: "scared", say: "Hallo?" },
          ],
        },
      ],
      captions: [{ at: 0.3, text: "Untertitel / Erzähler-Text" }],
    },
  ],
}
```

`x` ist in Prozent der Breite. Zwischen zwei Keyframes läuft der Stickman automatisch von A nach B.

## Bausteine

| | Optionen |
|---|---|
| **Posen** | stand, walk, run, sneak, wave, point, cheer, scared, sad, cry, think, angry, shrug, holdHead, phone, hug, holdHand, sit, sitSad, crouch, stumble, lie |
| **Gesichter** | neutral, happy, sad, scared, shocked, angry, love, thinking, crying, creepy, sleep |
| **Gegenstände** (`item`) | phone, flower, flashlight, candle, heart |
| **Hintergründe** | void, room, bedroom, street, forest, park, bus |
| **Effekte** | rain, flicker, lightning, fog, hearts, redPulse, sparkles, thoughts |

Alle Posen und Gesichter auf einen Blick: Komposition **Posen-Uebersicht** im Studio.

## Struktur

```
src/
  stickman/   Figur, Posen, Gesichter
  engine/     Szenen, Hintergründe, Effekte, Themes, Untertitel
  stories/    die einzelnen Videos (nur Daten)
```

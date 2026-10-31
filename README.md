# Stickman-Claud

Stickman-Storys mit [Remotion](https://remotion.dev) – Horror, Psychologie, Liebe und mehr.
Eine Story ist nur eine Datendatei. Die Engine macht daraus ein fertiges Video.

## Starten

```bash
npm i
npm run dev        # Remotion Studio (Vorschau)
npm run check      # TypeScript prüfen
npm run sheet -- Horror-DasKlopfen   # 12 Standbilder als Übersicht → out/sheets/
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

## Figuren

Jede Figur bekommt ein Aussehen: fertig (`look: "hexe"`) oder selbst gebaut.
Für die ganze Story auf einmal: `cast` in der Story.

```ts
cast: {
  ich: "teen",                                   // fertige Figur
  oma: { hair: "bun", hairColor: "#ccc", glasses: "round", top: "dress", topColor: "#7048e8" },
},
```

**Fertige Figuren:** klassisch, held, heldin, kind, maedchen, teen, oma, opa, nerd, boss, arzt, polizist,
koch, lehrer, rocker, sportler, koenig, koenigin, ritter, pirat, ninja, superheld, hexe, vampir, zombie,
geist, monster, teufel, engel, alien, roboter, astronaut, cowboy, party, schueler

**Selbst bauen** (`src/stickman/looks.ts`):

| | Optionen |
|---|---|
| hair | short, spiky, long, ponytail, bun, curly, mohawk, afro, slick |
| hat | cap, tophat, beanie, witch, crown, cowboy, chef, party, helmet, space, halo, horns, hood, pirate, antenna, headband |
| glasses | round, square, sun, eyepatch |
| beard | stubble, full, mustache |
| top | shirt, tshirt, hoodie, suit, dress, labcoat, robe, armor |
| bottom | pants, shorts, skirt |
| extra | tie, bowtie, scarf, backpack, wings, tail |
| sonst | `cape` (Farbe), `mask`, `head` (round/square/oval), `body: "ghost"`, `height`, `headSize`, `skin`, `color` |

Alle Figuren auf einen Blick: Komposition **Figuren-Galerie** im Studio.

## Welten

`background` einer Szene. Mit `time: "day" | "night" | "sunset"` (Standard: nach Theme).

**Welten:** city, rooftop, livingroom, kitchen, school, office, hospital, cafe, library, stage, castle,
beach, desert, mountains, jungle, farm, space, underwater, cave, subway, hauntedHouse, graveyard

**Stimmungs-Räume** (Farben vom Theme): void, room, bedroom, street, forest, park, bus

Alle Welten im Video: Story **Demo-WeltenTour**.

**Requisiten** frei platzieren: `props: [{ type: "tree", x: 20 }, { type: "sign", x: 70, text: "Ausgang" }]`
(tree, pine, palm, deadTree, bush, rock, cactus, lamp, bench, house, car, tombstone, fence, sign, table,
chair, bed, door, bookshelf, plant, tv, computer, campfire, crate, ufo, sofa, fridge, throne, torch, mic, umbrella).
`front: true` stellt sie vor die Figuren.

## Weitere Bausteine

| | Optionen |
|---|---|
| **Posen** | stand, walk, run, sneak, wave, point, cheer, scared, sad, cry, think, angry, shrug, holdHead, phone, hug, holdHand, sit, sitSad, crouch, stumble, lie |
| **Gesichter** | neutral, happy, sad, scared, shocked, angry, love, thinking, crying, creepy, sleep |
| **Gegenstände** (`item`) | phone, flower, flashlight, candle, heart |
| **Effekte** | rain, flicker, lightning, fog, hearts, redPulse, sparkles, thoughts, snow, bubbles, bats, confetti, embers |

## Mit Claude Code arbeiten

Das Repo bringt eigene Skills mit (`.claude/skills/`), die Claude automatisch nutzt:

- **neue-story**: aus einer Idee eine fertige Story machen, mit Skript, Figuren, Welten, Ton und Prüfbild
- **engine-erweitern**: neue Figuren, Welten, Requisiten, Posen, Effekte und Sounds bauen

Projektwissen für Claude steht in `CLAUDE.md`.

## Struktur

```
src/
  stickman/   Figur, Posen, Gesichter, Aussehen (looks.ts, Outfit.tsx)
  worlds/     Welten und Requisiten
  engine/     Szenen, Effekte, Themes, Untertitel, Timing
  audio/      Sound-Namen, Sprecher-Rollen, erzeugtes Manifest
  stories/    die einzelnen Videos (nur Daten)
scripts/      Audio-Generator (Stimmen, Sounds, Musik)
```

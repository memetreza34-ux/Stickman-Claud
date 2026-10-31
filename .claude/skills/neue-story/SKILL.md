---
name: neue-story
description: Macht aus einer Idee eine fertige Stickman-Story für den Kanal (Horror, Psychologie, Liebe, Comedy) – Skript, Figuren, Welten, Timing, Ton, Prüfbild. Nutzen bei „mach eine Story über …“, „neues Video“, „neue Folge“, „Short über …“.
---

# Neue Stickman-Story

Ziel: eine neue Datei `src/stories/<genre>-<titel>.ts`, eingetragen in `src/stories/index.ts`,
mit Ton erzeugt und per Prüfbild kontrolliert. Am Ende das Prüfbild zeigen.

## 1. Idee → Skript

Fehlt dem Nutzer etwas Wichtiges (Genre, Länge), sinnvoll annehmen statt fragen:
Standard ist ein Short (`format: "short"`, 25–45 s, 5–7 Szenen).

Aufbau, der auf Shorts funktioniert:

1. **Hook (2.5–3.5 s)**: `background: "void"`, großer `title`, 1 Sound (`stinger`, `whoosh`, `chime`).
   Frage oder Behauptung, die neugierig macht. Max. 8 Wörter, Zeilen mit `\n`.
2. **Aufbau (2–3 Szenen)**: Situation zeigen, Figuren einführen.
3. **Wendung**: Überraschung, Twist, Erkenntnis – mit `shake`, `zoom`, Effekt oder Sound betonen.
4. **Ende (3–5 s)**: Pointe, Auflösung oder Cliffhanger. Bei Psychologie: Begriff + eine konkrete Zahl/Studie, nur wenn sicher belegt.

Genre-Regeln:

| Genre | Theme | Typische Welten | Effekte / Sounds | Ton |
|---|---|---|---|---|
| Horror | `horror` | bedroom, room, hauntedHouse, graveyard, forest, cave, subway (night) | flicker, fog, lightning, redPulse, bats · knock, creak, heartbeat, stinger | kurze Sätze, Pausen, Twist am Ende |
| Psychologie | `psychologie` | void, city, school, office, cafe, livingroom | thoughts, sparkles · whoosh, ding, pop | „du“-Ansprache, ein Effekt pro Video erklärt |
| Liebe | `liebe` | park, bus, cafe, beach (sunset), city | hearts, sparkles, rain · chime, pop, ding | warm, einfach, ein Satz Pointe |
| Comedy | `comedy` | alle hellen Welten | confetti · boom, pop, whoosh | Timing, Überraschung, Sprechblasen |

Stil: Standard ist `sketch` (Tusche auf Papier, farbige Figuren). Nur auf Wunsch `style: "flat"` oder `"cinematic"`.
Im Sketch-Stil leben Szenen von farbigen Figuren und Requisiten vor grauer Welt – Farbe gezielt
für das Wichtige einsetzen (Kleidung, Gegenstände, Akzent-Requisiten mit `color`).

Untertitel = was der Erzähler sagt. Pro Untertitel ein kurzer Satz (max. ~12 Wörter).
Dialoge als Sprechblasen (`say`) an der Figur, nicht als Untertitel.

## 2. Figuren

- `cast` in der Story: Figuren-id → fertiger Look (`"held"`, `"hexe"` …) oder eigenes Objekt.
- Fertige Looks und alle Bausteine: `src/stickman/looks.ts`.
- Jede Story bekommt eigene Figuren – nicht immer `held`/`heldin`. Für Wiedererkennung
  Haarfarbe, Oberteil-Farbe oder Accessoire variieren.
- Stimmen: `voice` am Actor (`erzaehler`, `mann`, `frau`, `monster`, `kind`) für Sprechblasen.

## 3. Szenen bauen

Vorlage: eine bestehende Story in `src/stories/` kopieren. Wichtige Felder (`src/engine/types.ts`):

- `background`: Welt (`src/worlds/worlds.tsx`) oder Stimmungs-Raum (`void, room, bedroom, street, forest, park, bus`)
- `time`: `day | night | sunset`
- `props`: zusätzliche Requisiten, `x` in %, `front: true` vor den Figuren
- `actors[].keys`: Keyframes `{ at, x, pose, emotion, facing, item, say, y, hidden }`.
  Zwischen zwei Keyframes mit verschiedenem `x` läuft die Figur – dafür `pose: "walk" | "run" | "sneak"`.
- `captions`: `{ at, text }` – rücken automatisch nach, wenn die Stimme länger braucht
- `sfx`: `{ at, sound, volume }`, `effects`, `shake`, `zoom`, `focus`

Platz-Regeln:
- Figuren zwischen `x: 10` und `x: 90`; zwei Figuren im Gespräch ca. 20–30 % auseinander, einander zugewandt (`facing`).
- Sitzen nur auf Bänken: `bus` hat Bänke bei x 22 und 78, `park` bei 50.
- Liegen im Bett: `background: "bedroom"`, `x: 35, y: 50, pose: "lie"`.

## 4. Ton, prüfen, rendern

```bash
npm run check
npm run audio
npm run sheet -- <Story-ID>
```

Dann `out/sheets/<Story-ID>.jpg` mit dem Read-Tool ansehen und prüfen:
- Figuren im Bild, nicht abgeschnitten, nicht übereinander, Sprechblasen lesbar
- Untertitel passen zur Szene, kein Text über wichtigen Figuren
- Hook-Text gut lesbar

Probleme in der Story-Datei beheben, erneut prüfen. Erst wenn alles passt:

```bash
npx remotion render <Story-ID> out/<Story-ID>.mp4
```

Pegel prüfen (Spitzen sollten unter 0 dB bleiben):

```bash
ffmpeg -i out/<Story-ID>.mp4 -vn -af volumedetect -f null - 2>&1 | grep max_volume
```

Zum Schluss dem Nutzer das Prüfbild zeigen und kurz sagen, worum es in der Story geht.

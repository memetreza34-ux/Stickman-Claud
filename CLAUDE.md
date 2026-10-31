# Stickman-Claud

Deutscher YouTube-/Shorts-Kanal mit Stickman-Storys (Horror, Psychologie, Liebe, Comedy), gebaut mit Remotion.
Eine Story ist eine reine Datendatei – die Engine macht daraus Bild, Untertitel, Stimme, Sound und Musik.

## Befehle

```bash
npm run dev                          # Remotion Studio
npm run check                        # TypeScript prüfen
npm run audio                        # Stimmen/Sounds/Musik erzeugen (nach jeder Text-Änderung!)
npm run sheet -- <Story-ID>          # 12 Standbilder als Übersicht → out/sheets/<ID>.jpg
npx remotion render <Story-ID> out/<ID>.mp4
```

## Aufbau

- `src/stories/*.ts` – Storys (nur Daten, Typ `StoryDef`), eingetragen in `src/stories/index.ts`
- `src/engine/` – Szenen, Untertitel, Effekte, Themes; `prepare.ts` passt Timing an die Sprachaufnahmen an
- `src/stickman/` – Figur (`Stickman.tsx`), Posen (`poses.ts`), Aussehen (`looks.ts`, `Outfit.tsx`)
- `src/worlds/` – Welten (`worlds.tsx`) und Requisiten (`props.tsx`)
- `src/audio/` – Sound-Namen, Sprecher-Rollen, `manifest.generated.ts` (vom Audio-Skript erzeugt, nicht von Hand ändern)
- `scripts/` – `generate-audio.mts`, `synth.ts` (synthetische Sounds/Musik), `voices.config.ts`, `sheet.mts`

## Regeln

- Animation nur über `useCurrentFrame()` / `interpolate()` – keine CSS-Animationen.
- Zufall nur mit `random("seed")` aus Remotion (deterministisch).
- Größen immer relativ: `unit` (px pro Stickman-Einheit, Stickman ≈ 200 Einheiten hoch) und `font` aus `useLayout()`.
- Positionen in Storys: `x` in Prozent der Breite.
- Nach Änderungen an Story-Texten: `npm run audio`, dann `npm run sheet -- <ID>` und das Bild anschauen.
- Keine fremden Assets mit unklarer Lizenz einbauen; Sounds und Musik werden synthetisch erzeugt.
- Antworten an den Nutzer auf Deutsch, kurz und einfach.

## Skills

- `.claude/skills/neue-story` – aus einer Idee eine fertige Story machen
- `.claude/skills/engine-erweitern` – neue Figuren, Welten, Requisiten, Posen, Effekte, Sounds
- Offizielle Remotion-Skills (falls nicht global installiert): `npx skills add remotion-dev/skills`

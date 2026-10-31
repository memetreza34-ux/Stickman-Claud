---
name: engine-erweitern
description: Erweitert die Stickman-Engine um neue Figuren-Looks, Kleidung/Hüte/Frisuren, Welten, Requisiten, Posen, Gesichter, Effekte oder Sounds. Nutzen bei „mach eine neue Welt …“, „neue Figur“, „neue Pose“, „ich brauche einen Effekt für …“.
---

# Engine erweitern

Immer so bauen, dass Storys es nur über Daten nutzen (ein neuer Name in einer Union/Liste).
Nach jeder Erweiterung prüfen und das Ergebnis ansehen.

## Wo was liegt

| Was | Datei | Vorgehen |
|---|---|---|
| Fertige Figur | `src/stickman/looks.ts` | Eintrag in `LOOK_DATA` – nur vorhandene Bausteine kombinieren |
| Frisur, Hut, Brille, Bart | `src/stickman/Outfit.tsx` + Union in `looks.ts` | Kopf-Koordinaten: Mitte (0,0), Radius `R = 24`, Blick nach rechts (+x), Augen bei (-1,-4) und (13,-4) |
| Kleidung, Umhang, Extras | `src/stickman/Stickman.tsx` | Körper-Koordinaten: Hüfte (0,0), Hals (0,-62); Torso-Teile in `rotate(lean)`; Stoff mit `cloth()` |
| Pose | `src/stickman/poses.ts` | Winkel in Grad, 0 = nach unten, + = Blickrichtung; `[oberes, unteres relativ]`; Bewegung in `animatePose` |
| Gesicht | `Face` in `Stickman.tsx` + Typ `Emotion` | gleiche Kopf-Koordinaten |
| Gegenstand in der Hand | `Item` in `Stickman.tsx` + Typ `HandItem` | zeigt entlang des Unterarms (nach unten gezeichnet) |
| Welt | `src/worlds/worlds.tsx` | Eintrag in `WORLDS` mit `palettes` (day/night/sunset) und `draw(x)`; Bausteine `Sky, Stars, SunMoon, Ground, Hills, Skyline, Bricks, Wall, WindowFrame, P(...)` |
| Requisit | `src/worlds/props.tsx` | `case` in `drawProp` + Name in `PropName`; Fußpunkt (0,0), Maße in `u` |
| Effekt | `src/engine/Effects.tsx` + `EffectName` in `types.ts` | `Particles` für fallende/steigende Teilchen |
| Soundeffekt | `scripts/synth.ts` (`makeSfx`) + `SFX_NAMES` in `src/audio/sounds.ts` | synthetisch erzeugen, dann `npm run audio` |
| Musik | `makeMusic` in `scripts/synth.ts` + `MUSIC_NAMES` | nahtloser Loop über `loopable()` |
| Stimme | `scripts/voices.config.ts` | macOS-Stimme oder ElevenLabs-Voice-ID pro Rolle |

## Regeln

- Nur `useCurrentFrame()`/`frame` für Bewegung, `random("seed")` für Zufall.
- Größen in Stickman-Einheiten mal `u` bzw. `unit` – nie feste Pixel.
- Welten brauchen gute Lesbarkeit: Figuren stehen auf `x.g` (Bodenlinie); keine hellen Flächen
  direkt hinter dunklen Figuren und umgekehrt; Details eher im oberen Drittel.
- Neue Welten in die `TOUR`-Liste in `src/stories/demo-welten-tour.ts` eintragen (sonst Fehler beim Start).
- README-Tabellen in `README.md` mit aktualisieren.

## Prüfen

```bash
npm run check
npm run sheet -- Figuren-Galerie 1      # neue Figuren/Kleidung
npm run sheet -- Posen-Uebersicht 1     # neue Posen/Gesichter
npm run sheet -- Demo-WeltenTour 24     # neue Welten/Effekte
```

Bild in `out/sheets/` mit dem Read-Tool ansehen. Erst fertig, wenn es gut aussieht.

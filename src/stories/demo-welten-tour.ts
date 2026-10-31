import { LookName } from "../stickman/looks";
import { EffectName, SceneDef, StoryDef } from "../engine/types";
import { TimeOfDay, WORLD_NAMES, WorldName } from "../worlds/worlds";

// Showcase: alle Welten mit wechselnden Figuren
const TOUR: [WorldName, LookName, TimeOfDay, EffectName[]][] = [
  ["city", "held", "day", []],
  ["rooftop", "superheld", "night", []],
  ["livingroom", "opa", "day", []],
  ["kitchen", "koch", "day", []],
  ["school", "lehrer", "day", []],
  ["office", "boss", "sunset", []],
  ["hospital", "arzt", "day", []],
  ["cafe", "nerd", "day", []],
  ["library", "oma", "night", []],
  ["stage", "rocker", "night", ["confetti"]],
  ["castle", "ritter", "day", []],
  ["beach", "heldin", "sunset", []],
  ["desert", "cowboy", "day", []],
  ["mountains", "sportler", "day", ["snow"]],
  ["jungle", "pirat", "day", []],
  ["farm", "kind", "day", []],
  ["space", "astronaut", "night", []],
  ["underwater", "alien", "day", ["bubbles"]],
  ["cave", "ninja", "night", ["embers"]],
  ["subway", "schueler", "day", []],
  ["hauntedHouse", "hexe", "night", ["bats"]],
  ["graveyard", "geist", "night", ["fog"]],
];

const missing = WORLD_NAMES.filter((w) => !TOUR.some(([t]) => t === w));
if (missing.length) throw new Error(`Welten-Tour: fehlende Welten ${missing.join(", ")}`);

export const weltenTour: StoryDef = {
  id: "Demo-WeltenTour",
  title: "Welten-Tour",
  theme: "comedy",
  format: "short",
  music: "calm",
  scenes: TOUR.map(
    ([world, look, time, effects], i): SceneDef => ({
      name: world,
      duration: 2.2,
      background: world,
      time,
      effects,
      actors: [
        {
          id: `f${i}`,
          look,
          keys: [
            { at: 0, x: 30, pose: "walk", emotion: "happy" },
            { at: 1.2, x: 50, pose: "wave", emotion: "happy" },
          ],
        },
      ],
      captions: [{ at: 0, text: `${world} · ${look}`, voice: false }],
    }),
  ),
};

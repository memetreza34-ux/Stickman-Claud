import { ActorDef, StoryDef } from "../engine/types";

const zuschauer = (n: number): ActorDef[] =>
  new Array(n).fill(0).map((_, i) => {
    const x = i < n / 2 ? 8 + i * 9 : 92 - (i - n / 2) * 9;
    return {
      id: `z${i}`,
      size: 0.6,
      keys: [{ at: 0, x, pose: i % 2 ? "point" : "stand", emotion: "angry", facing: x < 50 ? "right" : "left" }],
    };
  });

export const spotlightEffekt: StoryDef = {
  id: "Psycho-SpotlightEffekt",
  title: "Der Spotlight-Effekt",
  theme: "psychologie",
  format: "short",
  scenes: [
    {
      name: "Hook",
      duration: 3.5,
      background: "void",
      title: "Warum du denkst,\ndass ALLE\ndich anschauen",
      sfx: [{ at: 0, sound: "whoosh" }],
    },
    {
      name: "Stolpern",
      duration: 5,
      background: "street",
      shake: [2.2],
      sfx: [{ at: 2.15, sound: "boom", volume: 0.6 }],
      actors: [
        {
          id: "du",
          keys: [
            { at: 0, x: 10, pose: "walk", emotion: "neutral" },
            { at: 2.1, x: 45, pose: "stumble", emotion: "shocked" },
            { at: 3.2, x: 45, pose: "holdHead", emotion: "sad", facing: "right" },
          ],
        },
      ],
      captions: [
        { at: 0.3, text: "Du stolperst. Nur ein bisschen." },
        { at: 3.2, text: "Und dein Kopf rastet aus." },
      ],
    },
    {
      name: "Im Kopf",
      duration: 5,
      background: "void",
      zoom: [1, 1.15],
      effects: ["thoughts"],
      sfx: [{ at: 0, sound: "whoosh" }, { at: 0.5, sound: "heartbeat", volume: 0.5 }, { at: 1.4, sound: "heartbeat", volume: 0.5 }],
      thoughts: ["Peinlich!", "Alle lachen", "Hat jeder gesehen", "Wie dumm", "Oh nein"],
      actors: [
        { id: "du", keys: [{ at: 0, x: 50, pose: "holdHead", emotion: "crying" }] },
        ...zuschauer(6),
      ],
      captions: [{ at: 0.5, text: "In deinem Kopf: Alle haben es gesehen." }],
    },
    {
      name: "Realität",
      duration: 5,
      sfx: [{ at: 0, sound: "pop" }],
      background: "street",
      actors: [
        { id: "du", keys: [{ at: 0, x: 45, pose: "shrug", emotion: "thinking" }] },
        { id: "a", size: 0.9, keys: [{ at: 0, x: 95, pose: "walk", item: "phone" }, { at: 5, x: 60, pose: "walk" }] },
        { id: "b", size: 0.9, keys: [{ at: 0, x: 15, pose: "phone", item: "phone", facing: "left" }] },
        { id: "c", size: 0.9, keys: [{ at: 0, x: 80, pose: "phone", item: "phone", facing: "right" }] },
      ],
      captions: [
        { at: 0.3, text: "In Wahrheit: Niemand hat es bemerkt." },
        { at: 2.8, text: "Alle sind mit sich selbst beschäftigt." },
      ],
    },
    {
      name: "Erklärung",
      duration: 6,
      sfx: [{ at: 0.2, sound: "ding" }],
      background: "void",
      actors: [{ id: "du", keys: [{ at: 0, x: 50, pose: "point", emotion: "happy" }] }],
      captions: [
        { at: 0.3, text: "Das nennt man den Spotlight-Effekt." },
        { at: 2.8, text: "Wir glauben, doppelt so viele Leute achten auf uns, wie es wirklich tun." },
      ],
    },
    {
      name: "Outro",
      duration: 3.5,
      background: "park",
      effects: ["sparkles"],
      sfx: [{ at: 0, sound: "chime" }],
      actors: [{ id: "du", keys: [{ at: 0, x: 30, pose: "wave", emotion: "happy" }] }],
      captions: [{ at: 0.3, text: "Also: Atme durch. Niemand schaut so genau hin." }],
    },
  ],
};

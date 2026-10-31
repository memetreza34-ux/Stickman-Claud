import { StoryDef } from "../engine/types";

export const dasKlopfen: StoryDef = {
  id: "Horror-DasKlopfen",
  title: "Das Klopfen",
  theme: "horror",
  format: "short",
  cast: {
    ich: { hair: "short", hairColor: "#3b2414", top: "hoodie", topColor: "#3b4252", bottom: "pants", bottomColor: "#1f2430" },
    es: "monster",
  },
  scenes: [
    {
      name: "Hook",
      duration: 3,
      background: "void",
      title: "Es klopfte\num 3:07 Uhr.",
      effects: ["flicker"],
      sfx: [{ at: 0, sound: "stinger" }],
    },
    {
      name: "Bett",
      duration: 6,
      background: "bedroom",
      effects: ["rain", "lightning"],
      shake: [3, 3.5, 4],
      sfx: [
        { at: 3, sound: "knock", volume: 0.75 },
        { at: 3.5, sound: "knock", volume: 0.75 },
        { at: 4, sound: "knock", volume: 0.75 },
        { at: 4.4, sound: "heartbeat" },
      ],
      actors: [
        {
          id: "ich",
          keys: [
            { at: 0, x: 35, y: 50, pose: "lie", emotion: "sleep" },
            { at: 3, emotion: "shocked" },
            { at: 4.3, x: 35, y: 0, pose: "scared", emotion: "scared" },
          ],
        },
      ],
      captions: [
        { at: 0.3, text: "Ich wohne allein. Seit drei Jahren." },
        { at: 3, text: "Klopf. Klopf. Klopf." },
      ],
    },
    {
      name: "Flur",
      duration: 6,
      background: "room",
      effects: ["flicker", "fog"],
      sfx: [
        { at: 0.5, sound: "creak", volume: 0.5 },
        { at: 2, sound: "heartbeat", volume: 0.6 },
        { at: 3, sound: "heartbeat", volume: 0.7 },
        { at: 3.4, sound: "knock", volume: 0.75 },
      ],
      actors: [
        {
          id: "ich",
          keys: [
            { at: 0, x: 15, pose: "sneak", emotion: "scared", item: "flashlight" },
            { at: 4.5, x: 65, pose: "point", emotion: "scared" },
          ],
        },
      ],
      captions: [
        { at: 0.3, text: "Das Geräusch kam von der Kellertür." },
        { at: 3.5, text: "Von innen." },
      ],
    },
    {
      name: "Erkenntnis",
      duration: 4.5,
      background: "room",
      zoom: [1, 1.6],
      focus: [55, 48],
      effects: ["redPulse"],
      sfx: [0, 0.8, 1.6, 2.4, 3.2].map((at) => ({ at, sound: "heartbeat" as const })),
      actors: [
        {
          id: "ich",
          keys: [{ at: 0, x: 55, pose: "scared", emotion: "scared", facing: "left" }],
        },
      ],
      captions: [{ at: 0.5, text: "Aber... ich habe gar keinen Keller." }],
    },
    {
      name: "Ende",
      duration: 4,
      background: "void",
      shake: [1.5],
      sfx: [{ at: 1.5, sound: "stinger", volume: 1 }],
      effects: ["flicker"],
      actors: [
        {
          id: "ich",
          keys: [{ at: 0, x: 40, pose: "scared", emotion: "scared", facing: "left" }],
        },
        {
          id: "es",
          color: "#c4161c",
          voice: "monster",
          size: 1.25,
          keys: [
            { at: 0, x: 72, hidden: true },
            { at: 1.5, x: 62, pose: "stand", emotion: "creepy", facing: "left", hidden: false },
          ],
        },
      ],
      captions: [{ at: 1.5, text: "„Du hast mich gehört, oder?“", voice: "monster" }],
    },
  ],
};

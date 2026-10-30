import { StoryDef } from "../engine/types";

export const dasKlopfen: StoryDef = {
  id: "Horror-DasKlopfen",
  title: "Das Klopfen",
  theme: "horror",
  format: "short",
  scenes: [
    {
      name: "Hook",
      duration: 3,
      background: "void",
      title: "Es klopfte\num 3:07 Uhr.",
      effects: ["flicker"],
    },
    {
      name: "Bett",
      duration: 6,
      background: "bedroom",
      effects: ["rain", "lightning"],
      shake: [3, 3.5, 4],
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
      zoom: [1, 1.9],
      focus: [55, 48],
      effects: ["redPulse"],
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
      effects: ["flicker"],
      actors: [
        {
          id: "ich",
          keys: [{ at: 0, x: 40, pose: "scared", emotion: "scared", facing: "left" }],
        },
        {
          id: "es",
          color: "#c4161c",
          size: 1.25,
          keys: [
            { at: 0, x: 72, hidden: true },
            { at: 1.5, x: 62, pose: "stand", emotion: "creepy", facing: "left", hidden: false },
          ],
        },
      ],
      captions: [{ at: 1.5, text: "„Du hast mich gehört, oder?“" }],
    },
  ],
};

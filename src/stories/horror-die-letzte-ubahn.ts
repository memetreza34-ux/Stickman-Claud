import { StoryDef } from "../engine/types";

export const dieLetzteUBahn: StoryDef = {
  id: "Horror-DieLetzteUBahn",
  title: "Die letzte U-Bahn",
  theme: "horror",
  format: "short",
  cast: {
    ich: {
      hair: "short",
      hairColor: "#7a4b1e",
      hat: "beanie",
      hatColor: "#2f9e44",
      top: "hoodie",
      topColor: "#364fc7",
      bottom: "pants",
      bottomColor: "#212529",
      extra: "backpack",
      extraColor: "#e8590c",
    },
    fremder: {
      height: 1.15,
      hat: "hood",
      hatColor: "#1a1a22",
      mask: true,
      maskColor: "#1a1a22",
      top: "robe",
      topColor: "#1a1a22",
    },
  },
  scenes: [
    {
      name: "Hook",
      duration: 3.5,
      background: "void",
      title: "Die letzte U-Bahn\nhatte einen Halt,\nden es nicht gibt.",
      effects: ["flicker"],
      sfx: [{ at: 0, sound: "stinger" }],
    },
    {
      name: "Bahnsteig",
      duration: 6,
      background: "subway",
      time: "night",
      sfx: [{ at: 0.3, sound: "whoosh", volume: 0.5 }],
      actors: [
        {
          id: "ich",
          keys: [
            { at: 0, x: 8, pose: "walk", emotion: "neutral", item: "phone" },
            { at: 3, x: 40, pose: "phone", emotion: "neutral" },
          ],
        },
      ],
      captions: [
        { at: 0.3, text: "Letzte Bahn. 0:47 Uhr." },
        { at: 2.5, text: "Der Bahnsteig war leer." },
      ],
    },
    {
      name: "Fremder",
      duration: 5,
      background: "subway",
      time: "night",
      effects: ["flicker"],
      sfx: [
        { at: 1.8, sound: "creak", volume: 0.6 },
        { at: 2.2, sound: "heartbeat" },
        { at: 3.1, sound: "heartbeat" },
      ],
      actors: [
        {
          id: "ich",
          keys: [
            { at: 0, x: 40, pose: "phone", emotion: "neutral", item: "phone" },
            { at: 2, pose: "scared", emotion: "shocked", facing: "right", item: "none" },
          ],
        },
        {
          id: "fremder",
          voice: "monster",
          keys: [
            { at: 0, x: 82, hidden: true },
            { at: 1.8, pose: "stand", emotion: "creepy", facing: "left", hidden: false },
          ],
        },
      ],
      captions: [{ at: 1.8, text: "Dachte ich." }],
    },
    {
      name: "Durchsage",
      duration: 6,
      background: "subway",
      time: "night",
      zoom: [1, 1.25],
      focus: [50, 62],
      effects: ["redPulse"],
      sfx: [{ at: 0.8, sound: "heartbeat" }, { at: 1.6, sound: "heartbeat" }, { at: 2.4, sound: "heartbeat" }],
      actors: [
        {
          id: "ich",
          keys: [{ at: 0, x: 40, pose: "scared", emotion: "scared", facing: "right" }],
        },
        {
          id: "fremder",
          voice: "monster",
          keys: [
            { at: 0, x: 82, pose: "sneak", emotion: "creepy", facing: "left" },
            { at: 2.6, x: 60, pose: "point", emotion: "creepy", say: "Nächster Halt: Friedhof." },
          ],
        },
      ],
      captions: [{ at: 0.3, text: "Er kam näher." }],
    },
    {
      name: "Flucht",
      duration: 5,
      background: "graveyard",
      time: "night",
      effects: ["fog", "bats"],
      sfx: [{ at: 3.6, sound: "heartbeat" }],
      actors: [
        {
          id: "ich",
          keys: [
            { at: 0, x: 5, pose: "run", emotion: "scared" },
            { at: 3.4, x: 62, pose: "scared", emotion: "scared", facing: "right" },
          ],
        },
      ],
      captions: [{ at: 0.3, text: "Ich rannte. Bis ich nicht mehr wusste, wo ich war." }],
    },
    {
      name: "Grabstein",
      duration: 5.5,
      background: "graveyard",
      time: "night",
      zoom: [1, 1.55],
      focus: [55, 62],
      effects: ["fog"],
      props: [{ type: "tombstone", x: 58, scale: 1.6, text: "0:47", color: "#868e96" }],
      sfx: [{ at: 3, sound: "boom", volume: 0.6 }],
      actors: [
        {
          id: "ich",
          keys: [{ at: 0, x: 34, pose: "crouch", emotion: "scared", facing: "right" }],
        },
      ],
      captions: [
        { at: 0.3, text: "Auf einem Grab stand nur eine Uhrzeit." },
        { at: 3, text: "0:47." },
      ],
    },
    {
      name: "Ende",
      duration: 4.5,
      background: "graveyard",
      time: "night",
      effects: ["flicker", "fog"],
      shake: [1.2],
      props: [{ type: "tombstone", x: 58, scale: 1.6, text: "0:47", color: "#868e96" }],
      sfx: [{ at: 1.2, sound: "stinger", volume: 0.55 }],
      actors: [
        {
          id: "ich",
          keys: [
            { at: 0, x: 40, pose: "stand", emotion: "scared", facing: "right" },
            { at: 1.2, pose: "scared", emotion: "shocked", facing: "left" },
          ],
        },
        {
          id: "fremder",
          voice: "monster",
          keys: [
            { at: 0, x: 18, hidden: true },
            { at: 1.2, pose: "stand", emotion: "creepy", facing: "right", hidden: false },
          ],
        },
      ],
      captions: [{ at: 1.2, text: "„Willkommen zu Hause.“", voice: "monster" }],
    },
  ],
};

import { StoryDef } from "../engine/types";

const ER = "#2b4c9b";
const SIE = "#c2255c";

export const derBus: StoryDef = {
  id: "Liebe-DerBus",
  title: "Der Bus",
  theme: "liebe",
  format: "short",
  scenes: [
    {
      name: "Hook",
      duration: 3,
      background: "void",
      title: "Jeden Tag\nderselbe Bus.\nDieselbe Person.",
      effects: ["hearts"],
    },
    {
      name: "Blicke",
      duration: 6,
      background: "bus",
      actors: [
        {
          id: "er",
          color: ER,
          keys: [
            { at: 0, x: 22, pose: "sit", emotion: "neutral", facing: "right" },
            { at: 2, emotion: "love" },
            { at: 4, emotion: "sad", pose: "sitSad" },
          ],
        },
        {
          id: "sie",
          color: SIE,
          keys: [{ at: 0, x: 78, pose: "sit", emotion: "neutral", facing: "left" }],
        },
      ],
      captions: [
        { at: 0.3, text: "Er sah sie jeden Morgen." },
        { at: 3.5, text: "Und sagte nie ein Wort." },
      ],
    },
    {
      name: "Leer",
      duration: 4.5,
      background: "bus",
      effects: ["rain"],
      actors: [
        {
          id: "er",
          color: ER,
          keys: [{ at: 0, x: 22, pose: "sitSad", emotion: "sad", facing: "right" }],
        },
      ],
      captions: [{ at: 0.3, text: "Eines Tages war ihr Platz leer." }],
    },
    {
      name: "Park",
      duration: 7,
      background: "park",
      actors: [
        {
          id: "er",
          color: ER,
          keys: [
            { at: 0, x: 5, pose: "walk", emotion: "sad" },
            { at: 2.5, x: 38, pose: "stand", emotion: "shocked" },
            { at: 5, emotion: "love", pose: "wave", say: "...Hi." },
          ],
        },
        {
          id: "sie",
          color: SIE,
          keys: [
            { at: 0, x: 70, pose: "stand", emotion: "neutral", facing: "left" },
            { at: 2.5, emotion: "happy", pose: "point", say: "Du bist doch der aus dem Bus!", sayFor: 2.4 },
          ],
        },
      ],
      captions: [{ at: 0.3, text: "Bis er sie im Park wiedersah." }],
    },
    {
      name: "Ende",
      duration: 4.5,
      background: "park",
      effects: ["hearts"],
      actors: [
        {
          id: "er",
          color: ER,
          keys: [{ at: 0, x: 45, pose: "holdHand", emotion: "love", item: "flower" }],
        },
        {
          id: "sie",
          color: SIE,
          keys: [{ at: 0, x: 58, pose: "holdHand", emotion: "love", facing: "left" }],
        },
      ],
      captions: [{ at: 0.3, text: "Manchmal braucht es nur ein „Hi“." }],
    },
  ],
};

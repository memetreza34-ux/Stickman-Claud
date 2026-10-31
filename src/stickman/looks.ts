// Aussehen einer Figur – alles optional. Ohne Angaben: klassischer Stickman.
export type Look = {
  color?: string; // Linienfarbe
  skin?: string; // Kopffarbe
  lineWidth?: number; // 1 = normal
  height?: number; // 1 = normal, Kind ~0.7
  headSize?: number; // 1 = normal, >1 = Chibi
  head?: "round" | "square" | "oval";
  body?: "stick" | "ghost";
  hair?: "none" | "short" | "spiky" | "long" | "ponytail" | "bun" | "curly" | "mohawk" | "afro" | "slick";
  hairColor?: string;
  hat?:
    | "none" | "cap" | "tophat" | "beanie" | "witch" | "crown" | "cowboy" | "chef"
    | "party" | "helmet" | "space" | "halo" | "horns" | "hood" | "pirate" | "antenna" | "headband";
  hatColor?: string;
  glasses?: "none" | "round" | "square" | "sun" | "eyepatch";
  beard?: "none" | "stubble" | "full" | "mustache";
  beardColor?: string;
  mask?: boolean; // Ninja-/Heldenmaske
  maskColor?: string;
  top?: "none" | "shirt" | "tshirt" | "hoodie" | "suit" | "dress" | "labcoat" | "robe" | "armor";
  topColor?: string;
  bottom?: "none" | "pants" | "shorts" | "skirt";
  bottomColor?: string;
  cape?: string; // Farbe des Umhangs
  extra?: "none" | "tie" | "bowtie" | "scarf" | "backpack" | "wings" | "tail";
  extraColor?: string;
};

const LOOK_DATA = {
  klassisch: {},
  held: { hair: "short", hairColor: "#5b3a1e", top: "tshirt", topColor: "#3d6fd8", bottom: "pants", bottomColor: "#2b2f3a" },
  heldin: { hair: "long", hairColor: "#8a4b22", top: "dress", topColor: "#e8506b" },
  kind: { height: 0.7, headSize: 1.2, hair: "spiky", hairColor: "#3b2414", hat: "cap", hatColor: "#e03131", top: "tshirt", topColor: "#ffd43b", bottom: "shorts", bottomColor: "#3d6fd8" },
  maedchen: { height: 0.7, headSize: 1.2, hair: "ponytail", hairColor: "#f0b429", top: "dress", topColor: "#9c36b5" },
  teen: { hair: "spiky", hairColor: "#222", top: "hoodie", topColor: "#495057", bottom: "pants", bottomColor: "#1c3f7a" },
  oma: { height: 0.92, hair: "bun", hairColor: "#ced4da", glasses: "round", top: "dress", topColor: "#7048e8" },
  opa: { height: 0.92, hair: "none", beard: "mustache", beardColor: "#e9ecef", glasses: "round", top: "shirt", topColor: "#8d6e63", bottom: "pants", bottomColor: "#5d4037" },
  nerd: { hair: "curly", hairColor: "#6b3e1f", glasses: "square", top: "shirt", topColor: "#e7f5ff", extra: "bowtie", extraColor: "#e03131", bottom: "pants", bottomColor: "#795548" },
  boss: { hair: "slick", hairColor: "#212529", top: "suit", topColor: "#212529", extra: "tie", extraColor: "#c92a2a", bottom: "pants", bottomColor: "#212529" },
  arzt: { hair: "short", hairColor: "#495057", glasses: "square", top: "labcoat", topColor: "#ffffff", bottom: "pants", bottomColor: "#4dabf7" },
  polizist: { hair: "short", hairColor: "#222", hat: "cap", hatColor: "#1c2e5c", top: "shirt", topColor: "#1c2e5c", bottom: "pants", bottomColor: "#1c2e5c" },
  koch: { hat: "chef", top: "labcoat", topColor: "#ffffff", extra: "scarf", extraColor: "#e03131", beard: "mustache", beardColor: "#222" },
  lehrer: { hair: "short", hairColor: "#868e96", glasses: "square", beard: "full", beardColor: "#868e96", top: "suit", topColor: "#8d6e63", bottom: "pants", bottomColor: "#5d4037" },
  rocker: { hair: "mohawk", hairColor: "#e64980", glasses: "sun", top: "tshirt", topColor: "#111", bottom: "pants", bottomColor: "#343a40" },
  sportler: { hair: "short", hairColor: "#222", hat: "headband", hatColor: "#e03131", top: "tshirt", topColor: "#ffffff", bottom: "shorts", bottomColor: "#e03131" },
  koenig: { hat: "crown", beard: "full", beardColor: "#a0522d", top: "robe", topColor: "#c92a2a", cape: "#862e9c" },
  koenigin: { hat: "crown", hair: "long", hairColor: "#f0b429", top: "dress", topColor: "#862e9c", cape: "#c92a2a" },
  ritter: { hat: "helmet", top: "armor", topColor: "#adb5bd", bottom: "pants", bottomColor: "#868e96", cape: "#1c7ed6" },
  pirat: { hat: "pirate", glasses: "eyepatch", beard: "full", beardColor: "#222", top: "shirt", topColor: "#f8f9fa", bottom: "pants", bottomColor: "#5c3d1e", extra: "scarf", extraColor: "#c92a2a" },
  ninja: { hat: "hood", hatColor: "#111", mask: true, maskColor: "#111", top: "hoodie", topColor: "#111", bottom: "pants", bottomColor: "#111", extra: "scarf", extraColor: "#c92a2a" },
  superheld: { hair: "short", hairColor: "#222", mask: true, maskColor: "#c92a2a", top: "shirt", topColor: "#1c7ed6", bottom: "pants", bottomColor: "#1c7ed6", cape: "#e03131" },
  hexe: { hat: "witch", hatColor: "#2b2135", hair: "long", hairColor: "#c92a2a", top: "robe", topColor: "#5f3dc4", skin: "#c3fac8" },
  vampir: { hair: "slick", hairColor: "#111", skin: "#f1f3f5", top: "suit", topColor: "#111", extra: "bowtie", extraColor: "#c92a2a", cape: "#7a0000" },
  zombie: { skin: "#94d82d", hair: "short", hairColor: "#3b2414", top: "tshirt", topColor: "#7a6a4f", bottom: "pants", bottomColor: "#3d4a5c" },
  geist: { body: "ghost", skin: "#f8f9fa", color: "#ced4da" },
  monster: { height: 1.3, color: "#c4161c", hat: "horns", hatColor: "#7a0000" },
  teufel: { color: "#c92a2a", skin: "#ff8787", hat: "horns", hatColor: "#5c0000", extra: "tail", extraColor: "#c92a2a" },
  engel: { hair: "curly", hairColor: "#ffe066", hat: "halo", top: "robe", topColor: "#ffffff", extra: "wings", extraColor: "#ffffff" },
  alien: { head: "oval", headSize: 1.15, skin: "#8ce99a", color: "#2b8a3e", hat: "antenna", hatColor: "#2b8a3e" },
  roboter: { head: "square", skin: "#ced4da", color: "#495057", hat: "antenna", hatColor: "#495057", top: "armor", topColor: "#adb5bd" },
  astronaut: { hat: "space", top: "armor", topColor: "#f1f3f5", bottom: "pants", bottomColor: "#dee2e6", extra: "backpack", extraColor: "#dee2e6" },
  cowboy: { hat: "cowboy", hatColor: "#8b5a2b", beard: "mustache", beardColor: "#5c3d1e", top: "shirt", topColor: "#c92a2a", bottom: "pants", bottomColor: "#364fc7", extra: "scarf", extraColor: "#ffd43b" },
  party: { hat: "party", hair: "curly", hairColor: "#e8590c", top: "tshirt", topColor: "#20c997", bottom: "pants", bottomColor: "#343a40" },
  schueler: { hair: "short", hairColor: "#7a4b1e", top: "hoodie", topColor: "#1c7ed6", bottom: "pants", bottomColor: "#343a40", extra: "backpack", extraColor: "#e8590c" },
} satisfies Record<string, Look>;

export type LookName = keyof typeof LOOK_DATA;
export const LOOKS: Record<LookName, Look> = LOOK_DATA;

export const resolveLook = (look: LookName | Look | undefined): Look =>
  look === undefined ? {} : typeof look === "string" ? LOOKS[look] : look;

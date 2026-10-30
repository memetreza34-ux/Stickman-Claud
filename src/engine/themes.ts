import { loadFont as loadCreepster } from "@remotion/google-fonts/Creepster";
import { loadFont as loadSpecialElite } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadPatrickHand } from "@remotion/google-fonts/PatrickHand";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";

const creepster = loadCreepster("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const specialElite = loadSpecialElite("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const patrickHand = loadPatrickHand("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const nunito = loadNunito("normal", { weights: ["800"], subsets: ["latin"] }).fontFamily;

export type Theme = {
  sky: [string, string];
  wall: string;
  floor: string;
  detail: string; // Möbel, Silhouetten
  accent: string;
  stroke: string; // Stickman-Linien
  headFill: string;
  night: boolean;
  titleFont: string;
  textFont: string;
  textColor: string;
  textBox: string; // Hintergrund der Untertitel
  vignette: number;
  grain: number;
};

export const THEMES = {
  horror: {
    sky: ["#05060a", "#141824"],
    wall: "#1a1d26",
    floor: "#0d0f14",
    detail: "#262a36",
    accent: "#c4161c",
    stroke: "#e8e6e1",
    headFill: "#0d0f14",
    night: true,
    titleFont: creepster,
    textFont: specialElite,
    textColor: "#f1ede4",
    textBox: "rgba(0,0,0,0.55)",
    vignette: 0.85,
    grain: 0.09,
  },
  psychologie: {
    sky: ["#e9f1f7", "#cfe0ec"],
    wall: "#eef2f5",
    floor: "#c9d3db",
    detail: "#a9b8c4",
    accent: "#3d6fd8",
    stroke: "#1d2330",
    headFill: "#ffffff",
    night: false,
    titleFont: nunito,
    textFont: patrickHand,
    textColor: "#1d2330",
    textBox: "rgba(255,255,255,0.85)",
    vignette: 0.25,
    grain: 0.03,
  },
  liebe: {
    sky: ["#ffe3ec", "#ffc4d6"],
    wall: "#fff0f4",
    floor: "#f4c6d3",
    detail: "#e8a3b8",
    accent: "#ff3b6b",
    stroke: "#3a1d2b",
    headFill: "#ffffff",
    night: false,
    titleFont: patrickHand,
    textFont: patrickHand,
    textColor: "#3a1d2b",
    textBox: "rgba(255,255,255,0.8)",
    vignette: 0.3,
    grain: 0.03,
  },
  comedy: {
    sky: ["#fff7d6", "#ffe48a"],
    wall: "#fffbe8",
    floor: "#f0d78a",
    detail: "#d9b85c",
    accent: "#ff7a00",
    stroke: "#1a1a1a",
    headFill: "#ffffff",
    night: false,
    titleFont: nunito,
    textFont: nunito,
    textColor: "#1a1a1a",
    textBox: "rgba(255,255,255,0.85)",
    vignette: 0.2,
    grain: 0.02,
  },
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof THEMES;

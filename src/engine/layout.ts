import { useVideoConfig } from "remotion";

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  return {
    W: width,
    H: height,
    portrait,
    groundY: height * (portrait ? 0.7 : 0.82),
    // Pixel pro Stickman-Einheit
    unit: (Math.min(width, height) / 1080) * (portrait ? 2.6 : 2.1),
    // Basis-Schriftgröße, skaliert mit der Breite (1080 px = 1)
    font: Math.min(width, height) / 1080,
  };
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

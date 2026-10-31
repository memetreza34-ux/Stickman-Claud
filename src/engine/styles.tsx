// Visuelle Stile: gleiche Story, anderer Look. Story wählt mit `style`.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useLayout } from "./layout";

export type StyleName = "flat" | "sketch" | "cinematic";

export type VisualStyle = {
  bgFilter: string; // CSS-Filter für Welt + Requisiten
  actorFilter: string; // CSS-Filter für Figuren
  boil: number; // Linien-Wackeln (Pixel), 0 = aus
  paper: boolean; // Papier-Struktur
  framing: number; // Kamera näher ran (1 = Totale)
  light: number; // Spotlicht: Abdunkeln außerhalb der Mitte (0–1)
  grade: string | null; // Farbstimmung als Overlay
  shadow: number; // Schatten unter Figuren (Deckkraft)
  ink: boolean; // Welt als Tuschezeichnung (Kanten → Linien, Farben → Grau-Lavierung)
  drift: number; // langsame Kamerafahrt pro Szene (0.05 = 5 % Zoom)
  captions: "box" | "ink"; // Untertitel im Kasten oder handgeschrieben
};

export const STYLES: Record<StyleName, VisualStyle> = {
  flat: {
    bgFilter: "none", actorFilter: "none", boil: 0, paper: false, framing: 1, light: 0, grade: null,
    shadow: 0.22, ink: false, drift: 0, captions: "box",
  },
  sketch: {
    bgFilter: "none",
    actorFilter: "saturate(1.15)",
    boil: 4,
    paper: true,
    framing: 1.2,
    light: 0,
    grade: null,
    shadow: 0.3,
    ink: true,
    drift: 0.06,
    captions: "ink",
  },
  cinematic: {
    bgFilter: "blur(3px) brightness(0.78) saturate(1.2)",
    actorFilter: "drop-shadow(0 0 6px rgba(255,232,190,0.55)) drop-shadow(0 10px 14px rgba(0,0,0,0.45))",
    boil: 0,
    paper: false,
    framing: 1.32,
    light: 0.62,
    grade: "linear-gradient(180deg, rgba(0,90,130,0.35) 0%, rgba(0,0,0,0) 50%, rgba(255,140,60,0.28) 100%)",
    shadow: 0.45,
    ink: false,
    drift: 0.04,
    captions: "box",
  },
};

// Macht aus der farbigen Welt eine Tuschezeichnung:
// Farbkanten werden zu dunklen Linien, Flächen zu heller Grau-Lavierung, dazu wackelnde Linien.
// dark = Nachtszene: Lavierung bleibt dunkel, Linien werden hell (wie Kreide)
export const InkFilter: React.FC<{ id: string; dark: boolean; boil: number }> = ({ id, dark, boil }) => {
  const frame = useCurrentFrame();
  const wash = dark ? { slope: 0.9, intercept: 0.04 } : { slope: 0.42, intercept: 0.6 };
  // Schwelle 0.08: weiche Farbverläufe erzeugen keine Linien, nur echte Kanten
  const ink = dark ? { slope: 6, intercept: -0.48 } : { slope: -6, intercept: 1.48 };
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="gray" />
        <feGaussianBlur in="gray" stdDeviation="0.7" result="soft" />
        <feConvolveMatrix in="soft" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" result="edge" />
        <feMorphology in="edge" operator="dilate" radius="1.2" result="thick" />
        <feComponentTransfer in="thick" result="lines">
          <feFuncR type="linear" slope={ink.slope} intercept={ink.intercept} />
          <feFuncG type="linear" slope={ink.slope} intercept={ink.intercept} />
          <feFuncB type="linear" slope={ink.slope} intercept={ink.intercept} />
        </feComponentTransfer>
        <feComponentTransfer in="gray" result="wash">
          <feFuncR type="linear" slope={wash.slope} intercept={wash.intercept} />
          <feFuncG type="linear" slope={wash.slope} intercept={wash.intercept} />
          <feFuncB type="linear" slope={wash.slope} intercept={wash.intercept} />
        </feComponentTransfer>
        <feBlend in="lines" in2="wash" mode={dark ? "screen" : "multiply"} result="drawn" />
        <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={Math.floor(frame / 4) % 50} result="noise" />
        <feDisplacementMap in="drawn" in2="noise" scale={boil} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
};

// SVG-Filter für handgezeichnete, „kochende“ Linien (alle 4 Frames neu)
export const BoilFilter: React.FC<{ id: string; amount: number }> = ({ id, amount }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={Math.floor(frame / 4) % 50} />
        <feDisplacementMap in="SourceGraphic" scale={amount} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
};

export const Paper: React.FC = () => {
  const { W, H } = useLayout();
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: "#efe4cc", mixBlendMode: "multiply", opacity: 0.5 }} />
      <svg width={W} height={H} style={{ position: "absolute", mixBlendMode: "multiply", opacity: 0.22 }}>
        <filter id="paper-fiber">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.32  0 0 0 0.9 0" />
        </filter>
        <rect width={W} height={H} filter="url(#paper-fiber)" />
      </svg>
    </>
  );
};

export const Light: React.FC<{ strength: number; focus: [number, number] }> = ({ strength, focus }) => (
  <>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 60% 45% at ${focus[0]}% ${focus[1]}%, rgba(0,0,0,0) 0%, rgba(0,0,0,${strength}) 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 35% 30% at ${focus[0]}% ${focus[1] - 8}%, rgba(255,226,170,0.22) 0%, rgba(255,226,170,0) 100%)`,
        mixBlendMode: "screen",
      }}
    />
  </>
);

export const Grade: React.FC<{ gradient: string }> = ({ gradient }) => (
  <AbsoluteFill style={{ background: gradient, mixBlendMode: "soft-light" }} />
);

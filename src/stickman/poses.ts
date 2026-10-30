// Winkel in Grad. 0 = gerade nach unten, positiv = in Blickrichtung.
// Limb = [oberes Glied, unteres Glied relativ zum oberen]
export type Limb = [number, number];

export type Pose = {
  lean: number;
  head: number;
  armB: Limb;
  armF: Limb;
  legB: Limb;
  legF: Limb;
  rotate: number;
  lift: number;
};

const base: Pose = {
  lean: 0,
  head: 0,
  armB: [-14, 4],
  armF: [14, -4],
  legB: [-9, 0],
  legF: [9, 0],
  rotate: 0,
  lift: 0,
};

const p = (o: Partial<Pose>): Pose => ({ ...base, ...o });

export const POSES = {
  stand: base,
  wave: p({ armF: [120, 45] }),
  point: p({ armF: [95, -5], lean: 4 }),
  cheer: p({ armB: [-125, -25], armF: [125, 25] }),
  scared: p({
    lean: -10,
    head: -8,
    armB: [-30, -150],
    armF: [30, 150],
    legB: [-16, 12],
    legF: [16, -12],
  }),
  sad: p({ lean: 10, head: 25, armB: [-4, 0], armF: [4, 0] }),
  cry: p({ lean: 12, head: 20, armB: [15, 150], armF: [-15, -150] }),
  think: p({ head: -10, armF: [25, 135], armB: [-40, -95] }),
  angry: p({ lean: 8, armB: [-30, -35], armF: [30, 35] }),
  shrug: p({ armB: [-70, -60], armF: [70, 60], head: 8 }),
  holdHead: p({ lean: 6, head: 15, armB: [-65, -125], armF: [65, 125] }),
  phone: p({ head: 22, armF: [35, 105], armB: [-10, 0] }),
  hug: p({ lean: 6, armB: [70, 30], armF: [85, 15] }),
  holdHand: p({ armF: [40, 0] }),
  sit: p({ legB: [80, -80], legF: [92, -92], armB: [20, 40], armF: [30, 40] }),
  sitSad: p({
    legB: [80, -80],
    legF: [92, -92],
    lean: 18,
    head: 25,
    armB: [10, 60],
    armF: [25, 60],
  }),
  crouch: p({
    legB: [55, -115],
    legF: [70, -125],
    lean: 25,
    armB: [-25, -130],
    armF: [25, 130],
  }),
  stumble: p({
    lean: 30,
    head: -10,
    armB: [-120, 10],
    armF: [110, 20],
    legB: [-35, 30],
    legF: [20, -10],
  }),
  lie: p({ rotate: -90, lift: -78, armB: [-8, 0], armF: [8, 0], legB: [-3, 0], legF: [3, 0] }),
  walk: base,
  run: base,
  sneak: base,
} satisfies Record<string, Pose>;

export type PoseName = keyof typeof POSES;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpLimb = (a: Limb, b: Limb, t: number): Limb => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
];

export const blendPose = (a: Pose, b: Pose, t: number): Pose => ({
  lean: lerp(a.lean, b.lean, t),
  head: lerp(a.head, b.head, t),
  armB: lerpLimb(a.armB, b.armB, t),
  armF: lerpLimb(a.armF, b.armF, t),
  legB: lerpLimb(a.legB, b.legB, t),
  legF: lerpLimb(a.legF, b.legF, t),
  rotate: lerp(a.rotate, b.rotate, t),
  lift: lerp(a.lift, b.lift, t),
});

// Lebendige Posen: Gehen, Rennen, Winken, Zittern, Atmen
export const animatePose = (name: PoseName, t: number): Pose => {
  const pose = POSES[name];
  const breathe = Math.sin(t * 2.2) * 1.5;

  if (name === "walk" || name === "run" || name === "sneak") {
    const speed = name === "run" ? 11 : name === "sneak" ? 4.5 : 7;
    const amp = name === "run" ? 42 : name === "sneak" ? 18 : 26;
    const ph = t * speed;
    const s = Math.sin(ph);
    const knee = (x: number) => -Math.max(0, Math.sin(x + Math.PI / 2)) * amp * 1.3;
    return {
      ...pose,
      lean: name === "run" ? 16 : name === "sneak" ? 20 : 3,
      head: name === "sneak" ? -15 : 0,
      legF: [amp * s, knee(ph)],
      legB: [-amp * s, knee(ph + Math.PI)],
      armF: name === "sneak" ? [40, 70] : [-amp * 0.8 * s, name === "run" ? 80 : 15],
      armB: name === "sneak" ? [20, 80] : [amp * 0.8 * s, name === "run" ? 80 : 15],
    };
  }
  if (name === "wave") {
    return { ...pose, armF: [120, 45 + Math.sin(t * 12) * 25] };
  }
  if (name === "scared") {
    const shiver = Math.sin(t * 60) * 2.5;
    return { ...pose, lean: pose.lean + shiver, head: pose.head + shiver };
  }
  if (name === "cry") {
    return { ...pose, lean: pose.lean + Math.sin(t * 14) * 2 };
  }
  if (name === "lie") return pose;
  return {
    ...pose,
    armB: [pose.armB[0] - breathe, pose.armB[1]],
    armF: [pose.armF[0] + breathe, pose.armF[1]],
    head: pose.head + breathe * 0.5,
  };
};

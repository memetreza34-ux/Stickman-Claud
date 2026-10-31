import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Theme } from "./themes";
import { BackgroundName } from "./types";
import { TimeOfDay, WORLDS, WorldName } from "../worlds/worlds";
import { useLayout } from "./layout";

type P = { theme: Theme };

const Sky: React.FC<P & { id: string }> = ({ theme, id }) => {
  const { W, H } = useLayout();
  return (
    <>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={theme.sky[0]} />
          <stop offset="1" stopColor={theme.sky[1]} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#sky-${id})`} />
    </>
  );
};

const Floor: React.FC<P> = ({ theme }) => {
  const { W, H, groundY } = useLayout();
  return (
    <>
      <rect y={groundY} width={W} height={H - groundY} fill={theme.floor} />
      <rect y={groundY - 4} width={W} height={8} fill={theme.detail} />
    </>
  );
};

const Moon: React.FC<P & { x: number; y: number; r: number }> = ({ theme, x, y, r }) =>
  theme.night ? (
    <g>
      <circle cx={x} cy={y} r={r * 2.2} fill="#fff" opacity={0.05} />
      <circle cx={x} cy={y} r={r} fill="#e9e4d4" />
      <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.18} fill="#cfc9b6" />
      <circle cx={x + r * 0.35} cy={y + r * 0.3} r={r * 0.12} fill="#cfc9b6" />
    </g>
  ) : (
    <g>
      <circle cx={x} cy={y} r={r * 1.8} fill="#fff6c8" opacity={0.5} />
      <circle cx={x} cy={y} r={r} fill="#ffd95a" />
    </g>
  );

const Window: React.FC<P & { x: number; y: number; w: number; h: number }> = ({
  theme,
  x,
  y,
  w,
  h,
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={theme.night ? "#0a1020" : "#bfe3ff"} />
    <Moon theme={theme} x={x + w * 0.65} y={y + h * 0.35} r={w * 0.12} />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={theme.detail} strokeWidth={14} />
    <line x1={x + w / 2} x2={x + w / 2} y1={y} y2={y + h} stroke={theme.detail} strokeWidth={8} />
    <line x1={x} x2={x + w} y1={y + h / 2} y2={y + h / 2} stroke={theme.detail} strokeWidth={8} />
  </g>
);

export const Bench: React.FC<P & { cx: number }> = ({ theme, cx }) => {
  const { groundY, unit } = useLayout();
  const seat = 44 * unit;
  const w = 110 * unit;
  return (
    <g>
      <rect x={cx - w / 2} y={groundY - seat} width={w} height={12 * unit} rx={4} fill={theme.detail} />
      <rect x={cx - w / 2 + 8 * unit} y={groundY - seat} width={8 * unit} height={seat} fill={theme.detail} />
      <rect x={cx + w / 2 - 16 * unit} y={groundY - seat} width={8 * unit} height={seat} fill={theme.detail} />
    </g>
  );
};

const Room: React.FC<P & { bed?: boolean }> = ({ theme, bed }) => {
  const { W, H, groundY, unit } = useLayout();
  const doorW = 100 * unit;
  const doorH = 215 * unit;
  return (
    <>
      <rect width={W} height={H} fill={theme.wall} />
      <Window theme={theme} x={W * 0.08} y={groundY - 300 * unit} w={110 * unit} h={130 * unit} />
      <rect
        x={W * 0.86 - doorW / 2}
        y={groundY - doorH}
        width={doorW}
        height={doorH}
        fill={theme.detail}
        stroke={theme.floor}
        strokeWidth={6}
      />
      <circle cx={W * 0.86 - doorW * 0.3} cy={groundY - doorH * 0.48} r={6 * unit} fill={theme.accent} />
      {!bed ? (
        <rect
          x={W * 0.45}
          y={groundY - 270 * unit}
          width={80 * unit}
          height={60 * unit}
          fill="none"
          stroke={theme.detail}
          strokeWidth={8}
        />
      ) : null}
      <Floor theme={theme} />
      {bed ? (
        <g>
          <rect x={W * 0.35 - 140 * unit} y={groundY - 50 * unit} width={260 * unit} height={30 * unit} rx={8} fill={theme.accent} opacity={0.85} />
          <rect x={W * 0.35 - 140 * unit} y={groundY - 20 * unit} width={260 * unit} height={20 * unit} fill={theme.detail} />
          <rect x={W * 0.35 - 150 * unit} y={groundY - 110 * unit} width={14 * unit} height={110 * unit} fill={theme.detail} />
          <rect x={W * 0.35 - 132 * unit} y={groundY - 70 * unit} width={55 * unit} height={22 * unit} rx={10} fill="#f4f1ea" />
        </g>
      ) : null}
    </>
  );
};

const Street: React.FC<P> = ({ theme }) => {
  const { W, H, groundY, unit } = useLayout();
  const houses = new Array(6).fill(0).map((_, i) => {
    const w = (W / 5) * (0.8 + random(`hw${i}`) * 0.4);
    const h = (140 + random(`hh${i}`) * 160) * unit;
    return { x: (i - 0.3) * (W / 5), w, h };
  });
  const lamp = W * 0.78;
  return (
    <>
      <Sky theme={theme} id="street" />
      <Moon theme={theme} x={W * 0.2} y={H * 0.15} r={45 * unit} />
      {houses.map((h, i) => (
        <g key={i}>
          <rect x={h.x} y={groundY - h.h} width={h.w * 0.92} height={h.h} fill={theme.detail} />
          {[0.25, 0.6].map((fx) =>
            [0.25, 0.55].map((fy) => (
              <rect
                key={`${fx}-${fy}`}
                x={h.x + h.w * fx}
                y={groundY - h.h + h.h * fy}
                width={h.w * 0.15}
                height={h.h * 0.15}
                fill={theme.night ? (random(`l${i}${fx}${fy}`) > 0.55 ? "#e6c36a" : "#11141b") : "#d7ecff"}
              />
            )),
          )}
        </g>
      ))}
      <rect x={lamp} y={groundY - 280 * unit} width={8 * unit} height={280 * unit} fill="#333" />
      <rect x={lamp - 25 * unit} y={groundY - 285 * unit} width={40 * unit} height={10 * unit} fill="#333" />
      {theme.night ? (
        <polygon
          points={`${lamp - 20 * unit},${groundY - 275 * unit} ${lamp - 120 * unit},${groundY} ${lamp + 80 * unit},${groundY}`}
          fill="#ffe9a8"
          opacity={0.12}
        />
      ) : null}
      <Floor theme={theme} />
    </>
  );
};

const Forest: React.FC<P> = ({ theme }) => {
  const { W, H, groundY, unit } = useLayout();
  const tree = (x: number, h: number, c: string, k: string) => (
    <g key={k}>
      <rect x={x - 6 * unit} y={groundY - h * 0.3} width={12 * unit} height={h * 0.3} fill={c} />
      <polygon points={`${x},${groundY - h} ${x - h * 0.28},${groundY - h * 0.25} ${x + h * 0.28},${groundY - h * 0.25}`} fill={c} />
    </g>
  );
  return (
    <>
      <Sky theme={theme} id="forest" />
      <Moon theme={theme} x={W * 0.75} y={H * 0.14} r={55 * unit} />
      {new Array(9).fill(0).map((_, i) =>
        tree((i / 8) * W + random(`fx${i}`) * 60, (260 + random(`fh${i}`) * 120) * unit, theme.detail, `b${i}`),
      )}
      {new Array(5).fill(0).map((_, i) =>
        tree((i / 4) * W + random(`gx${i}`) * 80 - 40, (330 + random(`gh${i}`) * 100) * unit, theme.floor, `f${i}`),
      )}
      <Floor theme={theme} />
    </>
  );
};

const Park: React.FC<P> = ({ theme }) => {
  const { W, H, groundY, unit } = useLayout();
  const tx = W * 0.15;
  return (
    <>
      <Sky theme={theme} id="park" />
      <Moon theme={theme} x={W * 0.82} y={H * 0.14} r={50 * unit} />
      <rect x={tx - 14 * unit} y={groundY - 230 * unit} width={28 * unit} height={230 * unit} fill="#8a5a3c" />
      {[
        [0, -270, 80],
        [-60, -230, 60],
        [60, -225, 65],
        [0, -330, 55],
      ].map(([dx, dy, r], i) => (
        <circle key={i} cx={tx + dx * unit} cy={groundY + dy * unit} r={r * unit} fill={theme.night ? "#1d3a2a" : "#7cc97f"} />
      ))}
      <rect y={groundY} width={W} height={H - groundY} fill={theme.night ? "#142019" : "#9ed69a"} />
      <rect y={groundY - 4} width={W} height={8} fill={theme.night ? "#1d3a2a" : "#7cc97f"} />
      <Bench theme={theme} cx={W * 0.5} />
    </>
  );
};

const Bus: React.FC<P> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { W, H, groundY, unit } = useLayout();
  const winY = groundY - 300 * unit;
  const winH = 140 * unit;
  const scroll = (frame * 9) % W;
  return (
    <>
      <rect width={W} height={H} fill={theme.wall} />
      <rect x={0} y={winY} width={W} height={winH} fill={theme.night ? "#0a1020" : "#bfe3ff"} />
      {new Array(12).fill(0).map((_, i) => {
        const bx = ((i * W) / 6 - scroll + W * 2) % (W * 2) - W * 0.2;
        const bh = (40 + random(`bus${i}`) * 80) * unit;
        return <rect key={i} x={bx} y={winY + winH - bh} width={W / 8} height={bh} fill={theme.detail} opacity={0.6} />;
      })}
      {new Array(5).fill(0).map((_, i) => (
        <rect key={i} x={(i * W) / 4 - 10 * unit} y={winY} width={20 * unit} height={winH} fill={theme.detail} />
      ))}
      <rect x={0} y={winY - 10 * unit} width={W} height={10 * unit} fill={theme.detail} />
      <rect x={0} y={winY + winH} width={W} height={10 * unit} fill={theme.detail} />
      <rect x={W * 0.5 - 5 * unit} y={0} width={10 * unit} height={groundY} fill="#b8b8b8" />
      <Floor theme={theme} />
      <Bench theme={theme} cx={W * 0.22} />
      <Bench theme={theme} cx={W * 0.78} />
    </>
  );
};

export const INK = "#22252b";

export const Background: React.FC<P & { name: BackgroundName; time: TimeOfDay }> = ({ name, theme, time }) => {
  const frame = useCurrentFrame();
  const { W, H, groundY, unit } = useLayout();
  if (name in WORLDS) {
    const world = WORLDS[name as WorldName];
    return (
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {world.draw({ W, H, g: groundY, u: unit, frame, time, night: time === "night", c: world.palettes[time], ink: INK })}
      </svg>
    );
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {name === "void" ? <Sky theme={theme} id="void" /> : null}
      {name === "room" ? <Room theme={theme} /> : null}
      {name === "bedroom" ? <Room theme={theme} bed /> : null}
      {name === "street" ? <Street theme={theme} /> : null}
      {name === "forest" ? <Forest theme={theme} /> : null}
      {name === "park" ? <Park theme={theme} /> : null}
      {name === "bus" ? <Bus theme={theme} /> : null}
    </svg>
  );
};

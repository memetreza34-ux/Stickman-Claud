// Szenen-Übersicht: rendert gleichmäßig verteilte Standbilder einer Komposition
// und klebt sie zu einem Bild zusammen – zum schnellen Prüfen ohne ganzes Video.
//   npm run sheet -- Horror-DasKlopfen        → out/sheets/Horror-DasKlopfen.jpg
//   npm run sheet -- Horror-DasKlopfen 18     → 18 Bilder statt 12
//   npm run sheet -- all                      → alle Kompositionen
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const [target, countArg] = process.argv.slice(2);
if (!target) {
  console.error("Bitte eine Komposition angeben, z.B.: npm run sheet -- Horror-DasKlopfen");
  process.exit(1);
}
const count = Number(countArg ?? 12);

const serveUrl = await bundle({ entryPoint: join(ROOT, "src/index.ts") });
const all = await getCompositions(serveUrl);
const comps = target === "all" ? all : all.filter((c) => c.id === target);
if (!comps.length) {
  console.error(`Nicht gefunden: ${target}. Verfügbar: ${all.map((c) => c.id).join(", ")}`);
  process.exit(1);
}

mkdirSync(join(ROOT, "out/sheets"), { recursive: true });

for (const comp of comps) {
  const dir = mkdtempSync(join(tmpdir(), "sheet-"));
  const scale = comp.height > comp.width ? 0.3 : 0.25;
  for (let i = 0; i < count; i++) {
    const frame = Math.min(comp.durationInFrames - 1, Math.round(((i + 0.5) / count) * comp.durationInFrames));
    await renderStill({
      composition: comp,
      serveUrl,
      frame,
      scale,
      imageFormat: "jpeg",
      output: join(dir, `${String(i).padStart(3, "0")}.jpeg`),
    });
  }
  const cols = comp.height > comp.width ? Math.min(6, count) : Math.min(4, count);
  const rows = Math.ceil(count / cols);
  const out = join(ROOT, "out/sheets", `${comp.id}.jpg`);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-i", join(dir, "%03d.jpeg"),
    "-vf", `tile=${cols}x${rows}:padding=6:color=white`,
    "-frames:v", "1", "-q:v", "3", out,
  ]);
  rmSync(dir, { recursive: true });
  console.log(`🖼️  ${out}`);
}

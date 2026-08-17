/**
 * generate-pcb-assets.mjs
 * ------------------------------------------------------------------
 * Pipeline reutilizable para las tarjetas 3D de PCBs (sostenible y liviano).
 *
 * Para CADA placa toma el .glb crudo exportado del CAD y produce:
 *   - model.glb       → modelo Draco comprimido (~1 MB) para el visor del modal
 *   - turntable.webm  → video del giro 360° (tarjeta, sin WebGL)
 *   - turntable.mp4   → fallback H.264 del mismo giro
 *   - poster.webp     → primer frame (poster del video / cover de la tarjeta)
 *
 * Por qué así: montar un <model-viewer> por tarjeta abre un contexto WebGL por
 * placa; el navegador corta a ~16 y el rendimiento se cae. El turntable es un
 * video: escala a placas ilimitadas. El modal usa UN solo modelo interactivo.
 *
 * Requisitos (una vez):
 *   - Node 18+, ffmpeg en el PATH.
 *   - En scripts/:  npm install
 *     (instala puppeteer-core; usa el Chrome ya instalado, no baja otro).
 *   - Chrome/Chromium instalado (se detecta o se pasa por CHROME_PATH).
 *   - Internet la primera vez (model-viewer baja su decoder Draco de un CDN).
 *
 * Uso:
 *   node scripts/generate-pcb-assets.mjs pcbs/Drivers-controller
 *   node scripts/generate-pcb-assets.mjs pcbs/PuenteH --elev 66 --frames 72
 *   node scripts/generate-pcb-assets.mjs --all           # todas las carpetas de pcbs/
 *
 * La carpeta debe contener un .glb crudo (cualquier nombre distinto de model.glb).
 * Después, en js/data.js referencia:
 *   model:  "pcbs/<Carpeta>/model.glb",
 *   spin:   "pcbs/<Carpeta>/turntable",
 *   poster: "pcbs/<Carpeta>/poster.webp",
 *   cover:  "pcbs/<Carpeta>/poster.webp",
 * ------------------------------------------------------------------
 */
import { createServer } from "node:http";
import { spawn, spawnSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync, statSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ---- args ----
const argv = process.argv.slice(2);
const VALUE_FLAGS = ["mode", "elev", "frames", "fps", "width", "amp", "loop", "ratio", "bg"];
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
};
// Movimiento: "spin" = giro 360° | "swing" = balanceo 0 → +amp → 0 → -amp → 0
const MODE = opt("mode", "spin");
const AMP = Number(opt("amp", "45")); // grados del balanceo (solo swing)
const LOOP = Number(opt("loop", "7")); // segundos por bucle (solo swing)
const FPS = Number(opt("fps", MODE === "swing" ? "30" : "12"));
const ELEV = `${opt("elev", "68")}deg`;
// frames: swing → loop×fps; spin → --frames (default 60)
const FRAMES = MODE === "swing" ? Math.round(LOOP * FPS) : Number(opt("frames", "60"));
const WIDTH = Number(opt("width", "800")); // salida del video (px de ancho)
// Proporción de la tarjeta (el feed usa el tamaño natural del video/poster,
// sin recorte — ver css .pin__media). "4:3" = comportamiento histórico de
// las PCBs (de frente, apaisado). Los proyectos de hardware usan algo más
// vertical (ver js/data.js / README de este script).
const [RATIO_W, RATIO_H] = opt("ratio", "4:3").split(":").map(Number);
const HEIGHT = Math.round((WIDTH * RATIO_H) / RATIO_W / 2) * 2; // par, para el encoder
// Fondo del canvas: presets "dark" (default, degradado gris oscuro de
// siempre) y "light" (gris claro). "blue" es el mismo azul que usa el
// modelBg de las PCBs en js/data.js — mantenerlo en sync si cambia ahí.
// También acepta dos colores propios separados por coma: --bg "c1,c2"
// (c1 = centro, c2 = borde).
const BG_PRESETS = {
  dark: ["#26262c", "#0a0a0a"],
  light: ["#f4f5f7", "#dcdfe4"],
  blue: ["#4d5eea", "#1c2570"],
};
const bgOpt = opt("bg", "dark");
const [BG_A, BG_B] = BG_PRESETS[bgOpt] || bgOpt.split(",");
const BG = `radial-gradient(circle at 50% 42%, ${BG_A}, ${BG_B} 82%)`;
const all = argv.includes("--all");
const folders = all
  ? readdirSync(path.join(PROJ, "pcbs"))
      .map((d) => path.join("pcbs", d))
      .filter((d) => statSync(path.join(PROJ, d)).isDirectory())
  : argv.filter((a, k) => !a.startsWith("--") && !VALUE_FLAGS.includes((argv[k - 1] || "").replace(/^--/, "")));

if (!folders.length) {
  console.error("Uso: node scripts/generate-pcb-assets.mjs pcbs/<Carpeta> [--all] [--mode spin|swing] [--elev N] [--amp N] [--loop N] [--fps N] [--frames N] [--ratio W:H] [--bg dark|light|blue|c1,c2]");
  process.exit(1);
}

// ---- helpers ----
const run = (cmd, args) => {
  // spawnSync con shell:true en Windows arma el comando concatenando los args
  // con espacios SIN comillas propias; si el repo vive bajo una ruta con
  // espacios (como esta), los argumentos se cortan mal. Los citamos a mano.
  const winArgs = process.platform === "win32" ? args.map((a) => (/[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a)) : args;
  const r = spawnSync(cmd, winArgs, { stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) throw new Error(`${cmd} falló (${r.status})`);
};

function findRawGlb(absFolder) {
  const glbs = readdirSync(absFolder).filter((f) => f.toLowerCase().endsWith(".glb") && f !== "model.glb");
  if (!glbs.length) return null;
  // el más reciente = el export que acabás de dejar (gana sobre versiones viejas)
  return glbs.sort((a, b) => statSync(path.join(absFolder, b)).mtimeMs - statSync(path.join(absFolder, a)).mtimeMs)[0];
}

function detectChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const guesses = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  return guesses.find((p) => existsSync(p)) || null;
}

// ---- servidor estático efímero (sirve la raíz del proyecto) ----
function startServer() {
  const types = { ".glb": "model/gltf-binary", ".html": "text/html", ".webp": "image/webp",
    ".png": "image/png", ".jpg": "image/jpeg", ".js": "text/javascript", ".css": "text/css" };
  const server = createServer((req, res) => {
    const rel = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "");
    const file = path.join(PROJ, rel);
    if (!file.startsWith(PROJ) || !existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404).end("nf");
      return;
    }
    res.writeHead(200, { "content-type": types[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port })));
}

async function captureTurntable(puppeteer, chrome, port, glbRel, framesDir) {
  const tmpHtml = path.join(PROJ, "_pcb_cap.html");
  const url = `http://127.0.0.1:${port}/${glbRel.split(path.sep).join("/")}`;
  const html = `<!doctype html><meta charset=utf-8>
<script type=module src="https://cdn.jsdelivr.net/npm/@google/model-viewer/dist/model-viewer.min.js"></script>
<style>html,body{margin:0}#mv{width:${WIDTH}px;height:${HEIGHT}px;background:${BG}}</style>
<model-viewer id=mv src="${url}" environment-image=neutral exposure=1.15 shadow-intensity=1 shadow-softness=1 camera-orbit="0deg ${ELEV} auto" interaction-prompt=none disable-zoom></model-viewer>
<script>window.__loaded=false;mv.addEventListener('load',()=>window.__loaded=true);</script>`;
  const { writeFileSync } = await import("node:fs");
  writeFileSync(tmpHtml, html);
  const browser = await puppeteer.launch({
    executablePath: chrome, headless: "new", protocolTimeout: 240000,
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu", "--hide-scrollbars"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${port}/_pcb_cap.html`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__loaded === true, { timeout: 60000 });
    await new Promise((r) => setTimeout(r, 600));
    for (let i = 0; i < FRAMES; i++) {
      // spin: 0→360 lineal · swing: 0 → +amp → 0 → -amp → 0 (seno = easing en extremos)
      const az = (MODE === "swing"
        ? AMP * Math.sin((2 * Math.PI * i) / FRAMES)
        : (i / FRAMES) * 360
      ).toFixed(3);
      await page.evaluate((az, elev) => { const m = document.getElementById("mv"); m.cameraOrbit = `${az}deg ${elev} auto`; m.jumpCameraToGoal(); }, az, ELEV);
      await new Promise((r) => setTimeout(r, 70));
      await page.screenshot({ path: path.join(framesDir, `f_${String(i).padStart(3, "0")}.png`) });
    }
  } finally {
    await browser.close();
    rmSync(tmpHtml, { force: true });
  }
}

// ---- main ----
const puppeteer = (await import("puppeteer-core")).default;
const chrome = detectChrome();
if (!chrome) { console.error("No encontré Chrome. Definí CHROME_PATH."); process.exit(1); }
const { server, port } = await startServer();

for (const folderRel of folders) {
  const absFolder = path.join(PROJ, folderRel);
  const raw = findRawGlb(absFolder);
  if (!raw) { console.log(`· ${folderRel}: sin .glb crudo, salto.`); continue; }
  console.log(`\n=== ${folderRel}  (crudo: ${raw}) ===`);

  // 1) comprimir
  console.log("· comprimiendo → model.glb");
  const optimizeArgs = (textureCompress) => ["--yes", "@gltf-transform/cli", "optimize", path.join(absFolder, raw), path.join(absFolder, "model.glb"),
    "--compress", "draco", "--simplify", "false", "--texture-compress", textureCompress, "--instance", "false"];
  try {
    run("npx", optimizeArgs("webp"));
  } catch (e) {
    // Algunas texturas (colorspace no-RGB, p.ej. exportes de ciertos CADs) hacen
    // fallar la recompresión a WebP en libvips; reintentamos sin tocar texturas.
    console.log("· webp falló para las texturas, reintento sin comprimirlas");
    run("npx", optimizeArgs("false"));
  }

  // 2) captura del movimiento
  const framesDir = mkdtempSync(path.join(tmpdir(), "pcbturn-"));
  const durationS = (FRAMES / FPS).toFixed(1);
  console.log(`· ${MODE} (${FRAMES} frames, ${durationS}s, elev ${ELEV}${MODE === "swing" ? `, ±${AMP}°` : ""}, ratio ${RATIO_W}:${RATIO_H}, bg ${opt("bg", "dark")})`);
  await captureTurntable(puppeteer, chrome, port, path.join(folderRel, "model.glb"), framesDir);

  // 3) encode
  console.log("· encode webm / mp4 / poster");
  const framePat = path.join(framesDir, "f_%03d.png");
  const scale = `scale=${WIDTH}:-2`;
  const webmCrf = MODE === "swing" ? "42" : "36"; // swing = más frames → CRF más alto
  run("ffmpeg", ["-y", "-framerate", String(FPS), "-i", framePat, "-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-crf", webmCrf, "-b:v", "0", "-vf", scale, "-an", path.join(absFolder, "turntable.webm")]);
  run("ffmpeg", ["-y", "-framerate", String(FPS), "-i", framePat, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "26", "-vf", scale, "-movflags", "+faststart", "-an", path.join(absFolder, "turntable.mp4")]);
  run("ffmpeg", ["-y", "-i", path.join(framesDir, "f_000.png"), "-vf", scale, "-frames:v", "1", "-q:v", "82", path.join(absFolder, "poster.webp")]);
  rmSync(framesDir, { recursive: true, force: true });
  console.log(`✓ ${folderRel} listo`);
}

server.close();
console.log("\nTerminado.");

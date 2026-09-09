/**
 * Exporta las placas de un carrusel de Instagram a PNG.
 *
 * Reusa el patron de captura.mjs (Chrome headless por CDP; `--screenshot` a
 * secas se cuelga en este repo por el humo del hero, pero ese problema no
 * existe en /carrusel: la ruta no anima nada). Cada [data-placa] se mide y se
 * recorta a 1080×1350 a deviceScaleFactor 2 — una imagen de carrusel de
 * Instagram, al doble para que no pierda nitidez al subirla.
 *
 * Requiere el server de dev andando (npm run dev).
 *
 * Uso: node scripts/carrusel.mjs [slug] [baseUrl]
 *   node scripts/carrusel.mjs 06
 *   node scripts/carrusel.mjs 06 http://localhost:3001
 */
import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [slug = "06", base = "http://localhost:3000"] = process.argv.slice(2);
const url = `${base}/carrusel/${slug}`;
const salidaDir = join("scripts", "salida", `carrusel-${slug}`);

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PUERTO = 9333 + Math.floor(Math.random() * 400);
const ESCALA = 2;
const PLACA_W = 1080;
const PLACA_H = 1350;
// El viewport va un poco mas alto que la placa a proposito: cuando el clip de
// `Page.captureScreenshot` mide EXACTO el alto del viewport, el headless
// duplica la ultima franja arriba de todo (el pie de la placa 1 salia
// pixelado en el borde superior). Con el viewport mas alto, el clip nunca
// coincide y el recorte sale limpio.
const VIEWPORT_H = PLACA_H + 80;

const args = [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
  "--no-first-run", "--disable-extensions", "--mute-audio",
  // La ruta no depende del movimiento, y asi las webp entran sin transicion.
  "--force-prefers-reduced-motion",
  `--remote-debugging-port=${PUERTO}`,
  `--window-size=${PLACA_W},${VIEWPORT_H}`,
  "--user-data-dir=" + process.env.TEMP + "/cdp-carrusel-" + PUERTO,
  "about:blank",
];

const chrome = spawn(CHROME, args, { stdio: "ignore" });
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function esperarDevTools() {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PUERTO}/json/version`);
      if (r.ok) return;
    } catch {}
    await dormir(250);
  }
  throw new Error("DevTools no respondio");
}

let id = 0;
function llamar(ws, method, params = {}) {
  return new Promise((res, rej) => {
    const propio = ++id;
    const alMensaje = (e) => {
      const m = JSON.parse(e.data);
      if (m.id !== propio) return;
      ws.removeEventListener("message", alMensaje);
      if (m.error) rej(new Error(method + ": " + m.error.message));
      else res(m.result);
    };
    ws.addEventListener("message", alMensaje);
    ws.send(JSON.stringify({ id: propio, method, params }));
  });
}

try {
  await esperarDevTools();
  const destino = await (
    await fetch(
      `http://127.0.0.1:${PUERTO}/json/new?${encodeURIComponent(url)}`,
      { method: "PUT" },
    )
  ).json();

  const ws = new WebSocket(destino.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  await llamar(ws, "Page.enable");
  await llamar(ws, "Emulation.setDeviceMetricsOverride", {
    width: PLACA_W, height: VIEWPORT_H, deviceScaleFactor: ESCALA, mobile: false,
  });

  // Esperar al load de verdad antes de tocar el DOM: evaluar apenas vuelve
  // Page.navigate corria contra un documento a medio parsear y `document.head`
  // salia null ("Cannot read properties of null (reading 'appendChild')").
  const cargada = new Promise((r) => {
    const alLoad = (e) => {
      if (JSON.parse(e.data).method === "Page.loadEventFired") {
        ws.removeEventListener("message", alLoad);
        r();
      }
    };
    ws.addEventListener("message", alLoad);
  });
  await llamar(ws, "Page.navigate", { url });
  await Promise.race([cargada, dormir(15000)]);

  // Lo unico asincrono de la ruta: las fuentes self-hosteadas y las webp de
  // los posters. Se espera a las dos antes de medir. De paso se esconde el
  // indicador de `next dev` (la "N" abajo a la izquierda), que si no sale en
  // la placa 1.
  const listo = await llamar(ws, "Runtime.evaluate", {
    expression: `(async () => {
      const s = document.createElement('style');
      s.textContent = 'nextjs-portal,[data-nextjs-toolbar],#__next-build-watcher,[data-next-badge-root]{display:none!important}';
      document.head.appendChild(s);
      await document.fonts.ready;
      await Promise.all([...document.images].map(
        (i) => i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }),
      ));
      return document.querySelectorAll('[data-placa]').length;
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  if (listo.exceptionDetails) {
    throw new Error("la ruta no cargo: " + listo.exceptionDetails.text);
  }
  if (!listo.result.value) {
    throw new Error(`no hay placas en ${url} — ¿existe el carrusel "${slug}"?`);
  }
  await dormir(400);

  const { result } = await llamar(ws, "Runtime.evaluate", {
    expression: `JSON.stringify(
      [...document.querySelectorAll('[data-placa]')].map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height, n: el.dataset.n };
      }),
    )`,
    returnByValue: true,
  });
  const placas = JSON.parse(result.value);

  rmSync(salidaDir, { recursive: true, force: true });
  mkdirSync(salidaDir, { recursive: true });

  for (const p of placas) {
    const tiro = await llamar(ws, "Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: { x: p.x, y: p.y, width: p.w, height: p.h, scale: 1 },
    });
    const archivo = join(salidaDir, `placa-${p.n}.png`);
    writeFileSync(archivo, Buffer.from(tiro.data, "base64"));
    console.log(`OK  ${archivo}  (${p.w}×${p.h} @${ESCALA}x)`);
  }

  console.log(`\n${placas.length} placas en ${salidaDir}`);
} finally {
  chrome.kill();
}

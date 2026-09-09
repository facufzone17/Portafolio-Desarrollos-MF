/**
 * Captura una franja de una web y la deja lista como poster (webp).
 *
 * Para las placas de carrusel que necesitan una vista que no es la portada del
 * sitio (por ejemplo el catalogo de la distribuidora, no su banner vacio).
 * Mismo Chrome-por-CDP que captura.mjs; despues sharp la baja a 1280×720 webp,
 * el mismo formato y tamaño que assets/proyectos/*-poster.webp.
 *
 * Uso: node scripts/captura-poster.mjs <url> <salida.webp> [scrollY] [esperaMs]
 *   node scripts/captura-poster.mjs https://sitio.app/x assets/proyectos/x.webp 900
 */
import { spawn } from "node:child_process";

import sharp from "sharp";

const [url, salida, scrollY = "0", espera = "4500"] = process.argv.slice(2);
if (!url || !salida) {
  console.error("faltan argumentos: <url> <salida.webp> [scrollY] [esperaMs]");
  process.exit(1);
}

const ANCHO = 1280;
const ALTO = 720;
const ESCALA = 2;
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PUERTO = 9333 + Math.floor(Math.random() * 400);

const chrome = spawn(
  CHROME,
  [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
    "--no-first-run", "--disable-extensions", "--mute-audio",
    "--force-prefers-reduced-motion",
    `--remote-debugging-port=${PUERTO}`,
    `--window-size=${ANCHO},${ALTO}`,
    "--user-data-dir=" + process.env.TEMP + "/cdp-poster-" + PUERTO,
    "about:blank",
  ],
  { stdio: "ignore" },
);

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
    width: ANCHO, height: ALTO, deviceScaleFactor: ESCALA, mobile: false,
  });
  await llamar(ws, "Page.navigate", { url });
  await dormir(Number(espera));

  await llamar(ws, "Runtime.evaluate", {
    expression: `(async () => {
      await document.fonts.ready;
      window.scrollTo(0, ${Number(scrollY)});
      await new Promise((r) => setTimeout(r, 900));
    })()`,
    awaitPromise: true,
  });

  const tiro = await llamar(ws, "Page.captureScreenshot", { format: "png" });
  const png = Buffer.from(tiro.data, "base64");

  await sharp(png)
    .resize(ANCHO, ALTO, { fit: "cover", position: "top" })
    .webp({ quality: 88 })
    .toFile(salida);

  console.log(`OK  ${salida}  (${ANCHO}×${ALTO} webp)`);
} finally {
  chrome.kill();
}

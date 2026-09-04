/**
 * Capturador por CDP.
 *
 * Chrome headless con --screenshot se cuelga en este sitio: el humo del hero
 * corre un requestAnimationFrame infinito y --virtual-time-budget nunca da la
 * pagina por quieta. Con CDP se espera un tiempo de reloj y se captura.
 *
 * Uso: node captura.mjs <url> <salida.png> [ancho] [alto] [esperaMs] [full] [reducirMovimiento]
 */
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const [url, salida, ancho = "1440", alto = "900", espera = "4000", full = "1", rm = "0"] =
  process.argv.slice(2);

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PUERTO = 9333 + Math.floor(Math.random() * 400);

const args = [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
  "--no-first-run", "--disable-extensions", "--mute-audio",
  `--remote-debugging-port=${PUERTO}`,
  `--window-size=${ancho},${alto}`,
  "--user-data-dir=" + process.env.TEMP + "/cdp-" + PUERTO,
  "about:blank",
];
if (rm === "1") args.unshift("--force-prefers-reduced-motion");

const chrome = spawn(CHROME, args, { stdio: "ignore" });

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function esperarDevTools() {
  for (let i = 0; i < 60; i++) {
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
    await fetch(`http://127.0.0.1:${PUERTO}/json/new?${encodeURIComponent(url)}`, { method: "PUT" })
  ).json();

  const ws = new WebSocket(destino.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  await llamar(ws, "Page.enable");
  const esMobile = Number(ancho) < 768;
  await llamar(ws, "Emulation.setDeviceMetricsOverride", {
    width: Number(ancho), height: Number(alto), deviceScaleFactor: 1,
    mobile: esMobile,
  });
  // Sin emulacion tactil, Chrome sigue reportando (hover: hover) y las reglas
  // pensadas para pantallas sin cursor no se evaluan.
  if (esMobile) {
    await llamar(ws, "Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  }
  await llamar(ws, "Page.navigate", { url });
  await dormir(Number(espera));

  // Recorrer la pagina antes de capturar. Los reveals y la carga de videos
  // cuelgan de IntersectionObserver: lo que nunca entro en viewport se queda
  // en opacity-0 y saldria en negro en la captura.
  await llamar(ws, "Runtime.evaluate", {
    expression: `(async () => {
      const paso = Math.round(innerHeight * 0.7);
      for (let y = 0; y < document.body.scrollHeight; y += paso) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 400));
    })()`,
    awaitPromise: true,
  });
  await dormir(900);

  const tiro = await llamar(ws, "Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: full === "1",
    ...(full === "1"
      ? { clip: await medirPagina(ws) }
      : {}),
  });

  writeFileSync(salida, Buffer.from(tiro.data, "base64"));
  console.log("OK " + salida);
} finally {
  chrome.kill();
}

async function medirPagina(ws) {
  const { result } = await llamar(ws, "Runtime.evaluate", {
    expression: "JSON.stringify({w:document.documentElement.scrollWidth,h:document.body.scrollHeight})",
    returnByValue: true,
  });
  const { w, h } = JSON.parse(result.value);
  return { x: 0, y: 0, width: w, height: Math.min(h, 20000), scale: 1 };
}

/**
 * Captura la seccion "Como trabajamos" a lo largo de su pin.
 *
 * A diferencia de estados.mjs, las posiciones no son fracciones de la pagina
 * entera sino del recorrido propio de la seccion: 0 = el pin recien se pega,
 * 1 = se suelta. Es la unica forma de ver las cinco etapas pasar.
 *
 * Uso: node mirar-proceso.mjs <url> <carpeta> [ancho] [alto] [f1,f2,...] [movimiento]
 *   movimiento: "no-preference" (por defecto) o "reduce", para mirar el respaldo.
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const [
  url = "http://localhost:3111/",
  salida = "capturas/proceso",
  ancho = "1440",
  alto = "900",
  fracciones = "0,0.12,0.25,0.375,0.5,0.625,0.75,0.875,1",
  movimiento = "no-preference",
] = process.argv.slice(2);

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PUERTO = 9600 + Math.floor(Math.random() * 300);

const chrome = spawn(
  CHROME,
  [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
    "--no-first-run", "--disable-extensions", "--mute-audio",
    `--remote-debugging-port=${PUERTO}`,
    `--window-size=${ancho},${alto}`,
    "--user-data-dir=" + process.env.TEMP + "/cdp-proceso-" + PUERTO,
    "about:blank",
  ],
  { stdio: "ignore" },
);

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
  mkdirSync(salida, { recursive: true });

  const destino = await (
    await fetch(`http://127.0.0.1:${PUERTO}/json/new?about:blank`, { method: "PUT" })
  ).json();
  const ws = new WebSocket(destino.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  await llamar(ws, "Page.enable");
  await llamar(ws, "Emulation.setDeviceMetricsOverride", {
    width: Number(ancho), height: Number(alto), deviceScaleFactor: 1, mobile: false,
  });
  await llamar(ws, "Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: movimiento }],
  });
  await llamar(ws, "Page.addScriptToEvaluateOnNewDocument", {
    source: `try{sessionStorage.setItem("trevoo-entrada-vista","1")}catch(e){}`,
  });

  await llamar(ws, "Page.navigate", { url });
  await dormir(3500);

  // Pasada completa: las apariciones cuelgan de IntersectionObserver.
  await llamar(ws, "Runtime.evaluate", {
    expression: `(async () => {
      const paso = Math.round(innerHeight * 0.6);
      for (let y = 0; y < document.body.scrollHeight; y += paso) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 300));
    })()`,
    awaitPromise: true,
  });

  const caja = await llamar(ws, "Runtime.evaluate", {
    expression: `(() => {
      const s = document.querySelector("#como-trabajamos > div:last-child > div") ||
                document.querySelector("#como-trabajamos");
      const r = s.getBoundingClientRect();
      return JSON.stringify({ top: Math.round(r.top + scrollY), alto: Math.round(r.height) });
    })()`,
    returnByValue: true,
  });
  const { top, alto: altoSeccion } = JSON.parse(caja.result.value);
  const recorrido = altoSeccion - Number(alto);
  console.log("seccion:", { top, altoSeccion, recorrido });

  for (const frac of fracciones.split(",").map(Number)) {
    const y = Math.round(top + recorrido * frac);
    await llamar(ws, "Runtime.evaluate", {
      expression: `(async () => {
        window.scrollTo(0, ${y});
        await new Promise(r => setTimeout(r, 1800));
      })()`,
      awaitPromise: true,
    });
    const tiro = await llamar(ws, "Page.captureScreenshot", { format: "png" });
    const nombre = `${salida}/f${String(Math.round(frac * 1000)).padStart(4, "0")}.png`;
    writeFileSync(nombre, Buffer.from(tiro.data, "base64"));
    console.log(nombre);
  }
} finally {
  chrome.kill();
}

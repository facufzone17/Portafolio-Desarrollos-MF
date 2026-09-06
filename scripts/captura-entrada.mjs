/**
 * Capturador de la pantalla de entrada (components/preloader/Preloader.tsx).
 *
 * captura.mjs no sirve para esto: espera un tiempo fijo y saca una sola foto.
 * Aca lo que hay que ver es la secuencia, asi que este saca cuadros seguidos
 * mientras corre y estampa cada uno con el tiempo real transcurrido — no con
 * el que uno esperaba, que es la unica forma de saber si la animacion cae
 * donde tiene que caer.
 *
 * OJO con dos cosas de Chrome headless, las dos ya nos costaron tiempo:
 *
 *  - Reporta `prefers-reduced-motion: reduce`. Sin `Emulation.setEmulatedMedia`
 *    la entrada directamente no se monta y se captura el sitio pelado.
 *  - Hay que abrir la pestaña en about:blank y navegar DESPUES. Abrirla ya en
 *    la url y despues navegar son dos cargas, y la segunda ya trae el
 *    sessionStorage escrito: la entrada no se ve.
 *
 * Uso: node captura-entrada.mjs <url> <carpetaSalida> [ancho] [alto] [cuadros]
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const [
  url = "http://localhost:3000/",
  salida = "capturas/entrada",
  ancho = "1440",
  alto = "900",
  cuadros = "18",
] = process.argv.slice(2);

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PUERTO = 9500 + Math.floor(Math.random() * 400);

const chrome = spawn(
  CHROME,
  [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
    "--no-first-run", "--disable-extensions", "--mute-audio",
    `--remote-debugging-port=${PUERTO}`,
    `--window-size=${ancho},${alto}`,
    "--user-data-dir=" + process.env.TEMP + "/cdp-entrada-" + PUERTO,
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
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });

  // Marca el arranque en la propia pagina, para poder estampar cada cuadro con
  // el tiempo real y no con el que uno supone.
  await llamar(ws, "Page.addScriptToEvaluateOnNewDocument", {
    source: "window.__t0 = performance.now();",
  });

  await llamar(ws, "Page.navigate", { url });

  const total = Number(cuadros);
  for (let i = 0; i < total; i++) {
    const { result } = await llamar(ws, "Runtime.evaluate", {
      expression: "Math.round(performance.now() - (window.__t0 ?? 0))",
      returnByValue: true,
    });
    const t = result.value;
    const tiro = await llamar(ws, "Page.captureScreenshot", { format: "png" });
    const nombre = `${salida}/${String(i).padStart(2, "0")}-${String(t).padStart(4, "0")}ms.png`;
    writeFileSync(nombre, Buffer.from(tiro.data, "base64"));
    console.log(nombre);
    if (t > 4600) break;
  }
} finally {
  chrome.kill();
}

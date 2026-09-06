/**
 * Capturador de estados de scroll.
 *
 * captura.mjs saca la pagina entera de una: sirve para ver el ritmo general,
 * pero miente con todo lo que es `sticky` o depende de donde este el scroll —
 * la pista horizontal de proyectos y el camino de "Como trabajamos" se ven mal
 * ahi y bien en el navegador, o al reves.
 *
 * Este saca una foto del VIEWPORT en cada posicion de scroll que se le pida, y
 * antes de cada una deja pasar unos cuadros para que las apariciones y la
 * pista terminen de acomodarse.
 *
 * Emula `prefers-reduced-motion: no-preference` porque Chrome headless reporta
 * `reduce`: sin eso no se ve ni una aparicion ni la pista.
 *
 * Uso: node estados.mjs <url> <carpeta> [ancho] [alto] [pos1,pos2,...]
 *   Las posiciones son fracciones del alto scrolleable (0 a 1).
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const [
  url = "http://localhost:3000/",
  salida = "capturas/estados",
  ancho = "1440",
  alto = "900",
  posiciones = "0,0.06,0.12,0.2,0.3,0.42,0.55,0.68,0.8,0.92,1",
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
    "--user-data-dir=" + process.env.TEMP + "/cdp-estados-" + PUERTO,
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
  const esMobile = Number(ancho) < 768;
  await llamar(ws, "Emulation.setDeviceMetricsOverride", {
    width: Number(ancho), height: Number(alto), deviceScaleFactor: 1, mobile: esMobile,
  });
  if (esMobile) {
    await llamar(ws, "Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  }
  await llamar(ws, "Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });

  // La entrada ya vista: lo que se quiere mirar es el sitio, no la animacion.
  await llamar(ws, "Page.addScriptToEvaluateOnNewDocument", {
    source: `try{sessionStorage.setItem("trevoo-entrada-vista","1")}catch(e){}`,
  });

  await llamar(ws, "Page.navigate", { url });
  await dormir(3500);

  // Una pasada completa primero: las apariciones cuelgan de
  // IntersectionObserver y se disparan una sola vez, asi que lo que nunca
  // entro en viewport saldria en opacity 0.
  await llamar(ws, "Runtime.evaluate", {
    expression: `(async () => {
      const paso = Math.round(innerHeight * 0.6);
      for (let y = 0; y < document.body.scrollHeight; y += paso) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 160));
      }
    })()`,
    awaitPromise: true,
  });

  for (const frac of posiciones.split(",").map(Number)) {
    await llamar(ws, "Runtime.evaluate", {
      expression: `(async () => {
        const max = document.body.scrollHeight - innerHeight;
        window.scrollTo(0, Math.round(max * ${frac}));
        await new Promise(r => setTimeout(r, 900));
      })()`,
      awaitPromise: true,
    });
    const tiro = await llamar(ws, "Page.captureScreenshot", { format: "png" });
    const nombre = `${salida}/p${String(Math.round(frac * 100)).padStart(3, "0")}.png`;
    writeFileSync(nombre, Buffer.from(tiro.data, "base64"));
    console.log(nombre);
  }
} finally {
  chrome.kill();
}

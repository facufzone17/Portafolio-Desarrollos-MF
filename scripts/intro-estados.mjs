/**
 * Compone la pantalla de entrada en progresos exactos.
 *
 * Chrome headless corre requestAnimationFrame con reloj virtual: la intro
 * entera pasa en dos capturas y no se puede revisar cuadro a cuadro. Aca no se
 * mide tiempo — se pisan las custom properties con !important (le ganan
 * al estilo inline que escribe el rAF) y se saca una foto de cada estado.
 *
 * Las formulas son las mismas que components/intro/Intro.tsx; si aquellas
 * cambian, estas tambien.
 *
 * Uso: node intro-estados.mjs <url> <carpetaSalida> [ancho] [alto]
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const [
  url = "http://localhost:3000/",
  salida = "capturas/intro-estados",
  ancho = "1200",
  alto = "750",
] = process.argv.slice(2);

const FIN_ZOOM = 0.6;
const EXPONENTE_ZOOM = 5.9;
const VELO_DESDE = 0.44;
const VELO_HASTA = 0.62;
const APERTURA = 0.68;

const recortar = (v) => Math.min(1, Math.max(0, v));
const suavizar = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const entradaCamara = (t) => t * t * (3 - 2 * t);

const PROGRESOS = [0, 0.15, 0.3, 0.42, 0.52, 0.66, 0.74, 0.82, 0.9, 0.97];

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PUERTO = 9600 + Math.floor(Math.random() * 300);

const chrome = spawn(
  CHROME,
  [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
    "--no-first-run", "--disable-extensions", "--mute-audio",
    `--remote-debugging-port=${PUERTO}`,
    `--window-size=${ancho},${alto}`,
    "--user-data-dir=" + process.env.TEMP + "/cdp-est-" + PUERTO,
    "about:blank",
  ],
  { stdio: "ignore" },
);

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

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
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(`http://127.0.0.1:${PUERTO}/json/version`)).ok) break;
    } catch {}
    await dormir(250);
  }

  const destino = await (
    await fetch(`http://127.0.0.1:${PUERTO}/json/new?about:blank`, { method: "PUT" })
  ).json();
  const ws = new WebSocket(destino.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  await llamar(ws, "Page.enable");
  await llamar(ws, "Emulation.setDeviceMetricsOverride", {
    width: Number(ancho), height: Number(alto), deviceScaleFactor: 1,
    mobile: Number(ancho) < 768,
  });
  await llamar(ws, "Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await llamar(ws, "Page.navigate", { url });
  await dormir(9000);

  mkdirSync(salida, { recursive: true });

  for (const p of PROGRESOS) {
    const escala = Math.pow(
      2,
      entradaCamara(recortar(p / FIN_ZOOM)) * EXPONENTE_ZOOM,
    );
    const velo = recortar((p - VELO_DESDE) / (VELO_HASTA - VELO_DESDE));
    const abrir = suavizar(recortar((p - APERTURA) / (1 - APERTURA)));
    const fondo = abrir > 0 ? 0 : velo;

    const css = `[data-intro]{--intro-escala:${escala}!important;--intro-velo:${velo}!important;--intro-abrir:${abrir}!important;--intro-fondo:${fondo}!important}`;

    const { result } = await llamar(ws, "Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const raiz = document.querySelector("[data-intro]");
        if (!raiz) return "SIN INTRO";
        let hoja = document.getElementById("intro-estado");
        if (!hoja) { hoja = document.createElement("style"); hoja.id = "intro-estado"; document.head.appendChild(hoja); }
        hoja.textContent = ${JSON.stringify(css)};
        return "ok";
      })()`,
    });
    if (result.value !== "ok") throw new Error(String(result.value));

    await dormir(120);
    const tiro = await llamar(ws, "Page.captureScreenshot", { format: "png" });
    const nombre = String(Math.round(p * 100)).padStart(3, "0");
    writeFileSync(`${salida}/p${nombre}.png`, Buffer.from(tiro.data, "base64"));
  }

  console.log("OK " + salida);
} finally {
  chrome.kill();
}

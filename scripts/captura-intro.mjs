/**
 * Capturador de la pantalla de entrada (components/intro/Intro.tsx).
 *
 * captura.mjs no sirve para esto: espera un tiempo fijo y saca una sola foto.
 * Aca lo que hay que ver es la secuencia, asi que este manda una rueda de
 * mouse real por CDP y saca cuadros seguidos mientras corre.
 *
 * Para revisar estados exactos sin depender del reloj esta intro-estados.mjs.
 *
 * Uso: node captura-intro.mjs <url> <carpetaSalida> [ancho] [alto] [cuadros] [pasoMs]
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const [
  url = "http://localhost:3000/",
  salida = "capturas/intro",
  ancho = "1200",
  alto = "750",
  cuadros = "16",
  paso = "190",
] = process.argv.slice(2);

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PUERTO = 9800 + Math.floor(Math.random() * 400);

const chrome = spawn(
  CHROME,
  [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
    "--no-first-run", "--disable-extensions", "--mute-audio",
    `--remote-debugging-port=${PUERTO}`,
    `--window-size=${ancho},${alto}`,
    "--user-data-dir=" + process.env.TEMP + "/cdp-intro-" + PUERTO,
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

  /*
   * La pestaña se abre en blanco y recien despues se navega. Abrirla ya en la
   * url y despues navegar de nuevo son DOS cargas en la misma pestaña: la
   * primera deja la marca en sessionStorage y la segunda entra sin intro.
   */
  const destino = await (
    await fetch(`http://127.0.0.1:${PUERTO}/json/new?about:blank`, { method: "PUT" })
  ).json();

  const ws = new WebSocket(destino.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  await llamar(ws, "Page.enable");
  await llamar(ws, "Emulation.setDeviceMetricsOverride", {
    width: Number(ancho),
    height: Number(alto),
    deviceScaleFactor: 1,
    mobile: Number(ancho) < 768,
  });
  /*
   * Chrome headless reporta prefers-reduced-motion: reduce, y con eso la
   * intro no aparece — que es exactamente lo que tiene que pasar, pero
   * impide verla. Se emula la preferencia de un visitante comun.
   */
  await llamar(ws, "Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await llamar(ws, "Page.navigate", { url });
  // El dev server compila a demanda: la primera carga tarda.
  await dormir(9000);

  mkdirSync(salida, { recursive: true });

  const sacar = async (nombre) => {
    const tiro = await llamar(ws, "Page.captureScreenshot", { format: "png" });
    writeFileSync(`${salida}/${nombre}.png`, Buffer.from(tiro.data, "base64"));
  };

  // Cuadro 00: la pantalla de entrada quieta, antes de tocar nada.
  await sacar("00-reposo");

  // Una rueda de mouse de verdad, no un evento sintetico: tiene que pasar por
  // el mismo listener que un visitante.
  await llamar(ws, "Input.dispatchMouseEvent", {
    type: "mouseWheel",
    x: Math.round(Number(ancho) / 2),
    y: Math.round(Number(alto) / 2),
    deltaX: 0,
    deltaY: 120,
  });

  for (let i = 1; i <= Number(cuadros); i++) {
    await dormir(Number(paso));
    await sacar(String(i).padStart(2, "0"));
  }

  const { result } = await llamar(ws, "Runtime.evaluate", {
    expression:
      "JSON.stringify({intro:!!document.querySelector('[data-intro]'),bloqueada:document.documentElement.classList.contains('intro-bloqueada'),scrollY:window.scrollY})",
    returnByValue: true,
  });
  console.log("estado final:", result.value);
  console.log("OK " + salida);
} finally {
  chrome.kill();
}

/**
 * Compone las cintas de iconos de la intro en desplazamientos exactos.
 *
 * Hermano de intro-estados.mjs: aquel revisa el zoom y la apertura, este
 * revisa el bucle de las cintas. La intro queda congelada en reposo y lo que
 * barre son --intro-cinta-a/b/c/d, para poder mirar si la junta entre las dos
 * copias de la tira se nota en algun punto del recorrido.
 *
 * Chrome headless corre requestAnimationFrame con reloj virtual, asi que aca
 * no se mide tiempo: se pisan las custom properties con !important, que le
 * ganan al estilo inline que escribe el rAF.
 *
 * Uso: node cinta-estados.mjs <url> <carpetaSalida> [ancho] [alto]
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const [
  url = "http://localhost:3000/",
  salida = "capturas/intro-cintas",
  ancho = "1200",
  alto = "750",
] = process.argv.slice(2);

/** Desplazamientos de la cinta `a`; las otras dos salen desfasadas. */
const PROGRESOS = [0, 0.18, 0.36, 0.54, 0.72, 0.9];

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
    const css = `[data-intro]{--intro-escala:1!important;--intro-velo:0!important;--intro-abrir:0!important;--intro-fondo:0!important;--intro-cinta-a:${p}!important;--intro-cinta-b:${(p + 0.33) % 1}!important;--intro-cinta-c:${(p + 0.5) % 1}!important;--intro-cinta-d:${(p + 0.75) % 1}!important}`;

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

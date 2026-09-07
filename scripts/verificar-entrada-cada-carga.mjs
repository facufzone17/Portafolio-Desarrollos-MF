/**
 * La entrada tiene que verse en CADA carga de pagina (pedido del 05/09/2026):
 * ya no hay marca de "ya la vio" en sessionStorage.
 *
 * Esto lo verifica cargando el home dos veces seguidas en la misma pestaña y
 * mirando, apenas arranca cada carga, si el overlay esta puesto. Es la
 * contracara de verificar-arreglos.mjs, que comprueba lo opuesto para la
 * navegacion cliente (volver al home por <Link> NO debe rearmarla).
 *
 * Uso: node scripts/verificar-entrada-cada-carga.mjs [url-base]
 */
import { spawn } from "node:child_process";

const BASE = process.argv[2] ?? "http://localhost:3000";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PUERTO = 9300 + Math.floor(Math.random() * 300);

const chrome = spawn(
  CHROME,
  [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
    "--no-first-run", "--disable-extensions", "--mute-audio",
    `--remote-debugging-port=${PUERTO}`,
    "--window-size=1440,900",
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

let fallas = 0;
function comprobar(ok, titulo, detalle) {
  if (!ok) fallas++;
  console.log(`${ok ? "OK   " : "FALLA"} ${titulo}  — ${detalle}`);
}

try {
  await esperarDevTools();
  const destino = await (
    await fetch(`http://127.0.0.1:${PUERTO}/json/new?about:blank`, { method: "PUT" })
  ).json();
  const ws = new WebSocket(destino.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  await llamar(ws, "Page.enable");
  await llamar(ws, "Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });

  for (const vuelta of [1, 2, 3]) {
    await llamar(ws, "Page.navigate", { url: BASE + "/" });
    // A los 1200ms la entrada (3,6s) tiene que estar corriendo todavia.
    await dormir(1200);
    const r = await llamar(ws, "Runtime.evaluate", {
      expression: `JSON.stringify({
        overlay: !!document.querySelector("[data-preloader]"),
        corriendo: document.documentElement.classList.contains("preloader-corriendo"),
      })`,
      returnByValue: true,
    });
    const { overlay, corriendo } = JSON.parse(r.result.value);
    comprobar(
      overlay && corriendo,
      `carga #${vuelta}: la entrada se ve`,
      `overlay=${overlay} corriendo=${corriendo}`,
    );
    // Dejarla terminar antes de la proxima carga.
    await dormir(3200);
  }

  console.log(`\n${fallas === 0 ? "todo OK" : fallas + " fallas"}`);
} finally {
  chrome.kill();
}
process.exit(fallas === 0 ? 0 : 1);

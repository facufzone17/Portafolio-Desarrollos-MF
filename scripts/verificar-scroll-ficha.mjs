/**
 * Abrir una ficha de proyecto SIEMPRE deja la pagina arriba de todo.
 *
 * El bug que fija este script: algunas fichas abrian al final de la pagina, y
 * parecia al azar. No lo era. Dependia de si el visitante clickeaba la tarjeta
 * con la rueda todavia planeando: la inercia de Lenis dura hasta 1,2 s y sigue
 * escribiendo SU numero cuadro a cuadro DESPUES de la navegacion. Recortado al
 * alto de la ficha —mucho mas corta que la home— ese numero es el final.
 *
 * Por eso cada pasada baja con la rueda de verdad (`Input.dispatchMouseEvent`
 * type mouseWheel, no `window.scrollTo`) y clickea EN PLENA INERCIA: con
 * `scrollTo` no hay inercia que reproducir y el bug no aparece nunca.
 *
 * La segunda pasada comprueba lo contrario: que la insistencia se aparta:
 * apenas el visitante mueve la rueda en la ficha, la pagina lo obedece.
 *
 * Uso: node scripts/verificar-scroll-ficha.mjs [url-base]
 */
import { spawn } from "node:child_process";

const BASE = process.argv[2] || "http://localhost:3000";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PUERTO = 9200 + Math.floor(Math.random() * 300);
const SLUGS = ["duo-administracion", "tienda-mates", "distribuidora", "inmobiliaria"];

const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
  "--no-first-run", "--disable-extensions", "--mute-audio",
  `--remote-debugging-port=${PUERTO}`, "--window-size=1440,900",
  "--user-data-dir=" + process.env.TEMP + "/cdp-ficha-" + PUERTO, "about:blank",
], { stdio: "ignore" });

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

let fallos = 0;
function verificar(bien, texto) {
  console.log(`${bien ? "OK  " : "MAL "} ${texto}`);
  if (!bien) fallos++;
}

async function esperarDevTools() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(`http://127.0.0.1:${PUERTO}/json/version`)).ok) return; } catch {}
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
    await fetch(`http://127.0.0.1:${PUERTO}/json/new?about:blank`, { method: "PUT" })
  ).json();
  const ws = new WebSocket(destino.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  const evaluar = (expr) =>
    llamar(ws, "Runtime.evaluate", { expression: expr, returnByValue: true })
      .then((r) => r.result?.value);
  // El scroll se lee por CDP y no por `scrollY`: Lenis puede estar a mitad de
  // cuadro y el numero del layout es el que se ve.
  const scroll = async () =>
    Math.round((await llamar(ws, "Page.getLayoutMetrics")).cssVisualViewport.pageY);
  const altoDoc = async () =>
    Math.round((await llamar(ws, "Page.getLayoutMetrics")).cssContentSize.height);
  const rueda = (veces, delta = 150) =>
    (async () => {
      for (let i = 0; i < veces; i++) {
        await llamar(ws, "Input.dispatchMouseEvent", {
          type: "mouseWheel", x: 200, y: 400, deltaX: 0, deltaY: delta,
        });
        await dormir(30);
      }
    })();

  await llamar(ws, "Page.enable");
  await llamar(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  });
  // Chrome headless reporta `reduce`, y con movimiento reducido no hay Lenis:
  // sin esto se estaria probando justo el camino que no tiene el bug.
  await llamar(ws, "Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });

  for (const slug of SLUGS) {
    await llamar(ws, "Page.navigate", { url: BASE + "/" });
    for (let i = 0; i < 80; i++) {
      if (await evaluar(`document.documentElement.classList.contains("preloader-visto")`)) break;
      await dormir(200);
    }
    await dormir(900);

    // El click se reintenta: en `next dev` la primera vez que se toca una
    // ficha la ruta se compila al vuelo y el click a veces no llega a nada.
    // Lo que se esta probando es el scroll de llegada, no la compilacion.
    let ruta = "/";
    let antes = 0;
    for (let intento = 0; intento < 3 && ruta === "/"; intento++) {
      await rueda(22);
      antes = await scroll();
      await evaluar(`document.querySelector('a[href="/proyectos/${slug}"]').click()`);
      for (let i = 0; i < 20; i++) {
        ruta = (await evaluar(`location.pathname`)) || "/";
        if (ruta !== "/") break;
        await dormir(150);
      }
    }
    verificar(ruta === `/proyectos/${slug}`, `${slug}: abre la ficha (venia de ${antes}px)`);

    // Mas que la ventana de insistencia (1,3 s) y que la inercia de Lenis.
    await dormir(2500);
    const y = await scroll();
    verificar(y === 0, `${slug}: abre arriba de todo (y = ${y})`);

    // Y la pagina sigue siendo del visitante: una rueda y baja. Solo tiene
    // sentido si la ficha da para scrollear: en `next dev` headless la demo
    // embebida a veces no llega a montar y la ficha entra entera en pantalla.
    const alto = await altoDoc();
    if (alto <= 910) {
      console.log(`    (${slug}: la ficha entra en pantalla, ${alto}px — sin rueda que probar)`);
    } else {
      await rueda(3);
      await dormir(500);
      const despues = await scroll();
      verificar(despues > 0, `${slug}: la rueda del visitante manda (y = ${despues})`);
    }
  }
} finally {
  chrome.kill();
}

console.log(fallos === 0 ? "\nTodo bien." : `\n${fallos} fallo(s).`);
process.exit(fallos === 0 ? 0 : 1);

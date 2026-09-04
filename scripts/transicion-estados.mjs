/**
 * Compone la transicion de "Nuestros proyectos" a "Que hacemos" en posiciones
 * exactas de scroll.
 *
 * Hermano de intro-estados.mjs, misma idea: no se mide tiempo (Chrome headless
 * corre requestAnimationFrame con reloj virtual y no se puede confiar en el),
 * se pone el scroll donde uno quiere y se saca la foto. El progreso va sobre
 * la seccion de la pista, que es la que lleva el pin: 0 es el arranque del pin
 * y 1 el final, con la retraccion viviendo en el ultimo tramo.
 *
 * Dos cosas que hay que forzar para que esto sirva:
 *  - `prefers-reduced-motion: no-preference`, porque headless miente y dice
 *    `reduce`, y con reduce la pista no se monta.
 *  - WebGL por software (swiftshader), o el fondo de madera no dibuja nada.
 *
 * Uso: node transicion-estados.mjs <url> <carpetaSalida> [ancho] [alto]
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const [
  url = "http://localhost:3000/",
  salida = "capturas/transicion",
  ancho = "1440",
  alto = "900",
] = process.argv.slice(2);

/** Progresos del pin a fotografiar. La retraccion arranca cerca de 0,75. */
const PROGRESOS = [1.0, 1.3];

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PUERTO = 9500 + Math.floor(Math.random() * 300);

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--hide-scrollbars",
    "--no-sandbox",
    "--no-first-run",
    "--disable-extensions",
    "--mute-audio",
    // WebGL por software: sin esto el canvas del fondo sale vacio.
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    `--remote-debugging-port=${PUERTO}`,
    `--window-size=${ancho},${alto}`,
    "--user-data-dir=" + process.env.TEMP + "/cdp-trans-" + PUERTO,
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

async function evaluar(ws, expresion) {
  const r = await llamar(ws, "Runtime.evaluate", {
    expression: expresion,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
  return r.result.value;
}

try {
  mkdirSync(salida, { recursive: true });

  let objetivo = null;
  for (let i = 0; i < 60 && !objetivo; i++) {
    await dormir(250);
    try {
      const lista = await (await fetch(`http://127.0.0.1:${PUERTO}/json/list`)).json();
      objetivo = lista.find((t) => t.type === "page");
    } catch {}
  }
  if (!objetivo) throw new Error("Chrome no levanto");

  const ws = new WebSocket(objetivo.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));

  await llamar(ws, "Page.enable");
  await llamar(ws, "Runtime.enable");
  await llamar(ws, "Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  // La pantalla de entrada se marca como vista antes del primer pintado: aca
  // se viene a mirar la transicion, no la intro.
  await llamar(ws, "Page.addScriptToEvaluateOnNewDocument", {
    source: `try{sessionStorage.setItem("mf-intro-vista","1")}catch(e){}`,
  });

  await llamar(ws, "Page.navigate", { url });
  await dormir(6000);

  // La pista es la unica seccion con pin: se la ubica por el hijo sticky.
  const medida = await evaluar(
    ws,
    `(() => {
      const sticky = [...document.querySelectorAll("div.sticky")]
        .find((n) => n.closest("#proyectos"));
      const seccion = sticky?.parentElement;
      if (!seccion) return null;
      const arriba = seccion.getBoundingClientRect().top + window.scrollY;
      return { arriba, recorrido: seccion.offsetHeight - window.innerHeight };
    })()`,
  );
  if (!medida) throw new Error("no se encontro la seccion de la pista");
  console.log("pin desde", Math.round(medida.arriba), "px, largo", Math.round(medida.recorrido));

  for (const p of PROGRESOS) {
    const y = Math.round(medida.arriba + medida.recorrido * p);
    await evaluar(ws, `window.scrollTo(0, ${y})`);
    await dormir(1400);
    const foto = await llamar(ws, "Page.captureScreenshot", { format: "png" });
    const nombre = `${salida}/p${String(Math.round(p * 100)).padStart(3, "0")}.png`;
    writeFileSync(nombre, Buffer.from(foto.data, "base64"));
    console.log(nombre, "y =", y);
  }

  ws.close();
} finally {
  chrome.kill();
}

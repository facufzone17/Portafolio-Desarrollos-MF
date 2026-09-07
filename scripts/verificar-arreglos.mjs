/**
 * Verificacion de los dos arreglos de rendimiento (07/09/2026):
 *
 *  1. Las flechas del carrusel de servicios pasan en ~480ms (antes 2s), y el
 *     avance automatico sigue en 2s.
 *  2. Volver al home tocando el logo del header desde una ficha de proyecto NO
 *     vuelve a montar la pantalla de entrada: nada de `preloader-bloqueado`,
 *     scroll libre al instante.
 *
 * Uso: node scripts/verificar-arreglos.mjs [url-base]
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
    "--user-data-dir=" + process.env.TEMP + "/cdp-verif-" + PUERTO,
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

async function evaluar(ws, expression) {
  const r = await llamar(ws, "Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (r.exceptionDetails) {
    throw new Error(r.exceptionDetails.exception?.description ?? "eval fallo");
  }
  return r.result.value;
}

const resultados = [];
function checar(nombre, ok, detalle) {
  resultados.push({ nombre, ok, detalle });
  console.log(`${ok ? "OK  " : "FALLA"}  ${nombre}${detalle ? `  — ${detalle}` : ""}`);
}

try {
  await esperarDevTools();
  const destino = await (
    await fetch(`http://127.0.0.1:${PUERTO}/json/new?about:blank`, { method: "PUT" })
  ).json();
  const ws = new WebSocket(destino.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  await llamar(ws, "Page.enable");
  await llamar(ws, "Runtime.enable");
  await llamar(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  });
  await llamar(ws, "Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });

  // --- Carga inicial: la entrada corre una vez ---
  await llamar(ws, "Page.navigate", { url: `${BASE}/` });
  await dormir(6000); // 3,6s de entrada + aire

  const claseTrasEntrada = await evaluar(ws, `document.documentElement.className`);
  checar(
    "la entrada termino (sin preloader-corriendo/bloqueado)",
    !/preloader-(corriendo|bloqueado)/.test(claseTrasEntrada),
    claseTrasEntrada.trim() || "(sin clases)",
  );

  // --- Problema 1: velocidad del carrusel ---
  // Llevar el primer carrusel a viewport y leer su transitionDuration ANTES de
  // tocar nada (modo automatico) y DESPUES de tocar la flecha (modo manual).
  const infoCarrusel = await evaluar(ws, `(async () => {
    const marco = document.querySelector('[aria-roledescription="carrusel"]');
    if (!marco) return { error: "no encontre el carrusel" };
    marco.scrollIntoView({ block: "center" });
    await new Promise(r => setTimeout(r, 400));
    const p = marco.querySelector('.transition-transform');
    if (!p) return { error: "no encontre la pista del carrusel" };
    // getComputedStyle devuelve un objeto VIVO: hay que congelar cada lectura
    // en un string en el momento, no guardar la referencia.
    const auto = String(getComputedStyle(p).transitionDuration);
    const flecha = document.querySelector('[aria-label^="Imagen siguiente"]');
    if (!flecha) return { error: "no encontre la flecha" };
    flecha.click();
    await new Promise(r => setTimeout(r, 60));
    const manual = String(getComputedStyle(p).transitionDuration);
    const curvaManual = String(getComputedStyle(p).transitionTimingFunction);
    await new Promise(r => setTimeout(r, 700));
    const t = String(p.style.transform);
    return { auto, manual, curvaManual, transform: t };
  })()`);

  if (infoCarrusel.error) {
    checar("carrusel: medicion", false, infoCarrusel.error);
  } else {
    checar(
      "carrusel automatico sigue lento (2s)",
      infoCarrusel.auto === "2s",
      `transitionDuration=${infoCarrusel.auto}`,
    );
    checar(
      "carrusel manual es agil (~0.48s)",
      infoCarrusel.manual === "0.48s",
      `transitionDuration=${infoCarrusel.manual}`,
    );
    checar(
      "carrusel manual usa ease-out del sistema",
      infoCarrusel.curvaManual.replace(/\s/g, "") === "cubic-bezier(0.16,1,0.3,1)",
      infoCarrusel.curvaManual,
    );
    checar(
      "carrusel manual efectivamente avanzo",
      /-100%|translate3d\(-100%/.test(infoCarrusel.transform),
      `transform=${infoCarrusel.transform}`,
    );
  }

  // --- Problema 2: volver al home por el logo ---
  // SPA nav a una ficha de proyecto (en dev, Turbopack compila la ruta a
  // demanda: hay que darle tiempo).
  const urlProyecto = await evaluar(ws, `(async () => {
    const link = [...document.querySelectorAll('a[href^="/proyectos/"]')]
      .find(a => a.offsetParent !== null) || document.querySelector('a[href^="/proyectos/"]');
    link.scrollIntoView({ block: "center" });
    await new Promise(r => setTimeout(r, 200));
    link.click();
    for (let i = 0; i < 60; i++) {
      if (location.pathname.startsWith("/proyectos/")) break;
      await new Promise(r => setTimeout(r, 100));
    }
    await new Promise(r => setTimeout(r, 400));
    return location.pathname;
  })()`);
  checar(
    "SPA nav a una ficha de proyecto",
    urlProyecto.startsWith("/proyectos/"),
    urlProyecto,
  );

  // Tocar el logo del header -> SPA nav al home. Medir si la pagina se traba.
  const trasLogo = await evaluar(ws, `(async () => {
    const logo = document.querySelector('a[data-logo-marca]');
    logo.click();
    const muestras = [];
    const t0 = performance.now();
    // muestrear 1,2s: si el bug existe, aca aparece preloader-bloqueado
    for (let i = 0; i < 24; i++) {
      await new Promise(r => setTimeout(r, 50));
      muestras.push(document.documentElement.className);
    }
    const bloqueadoAlgunaVez = muestras.some(c => /preloader-(bloqueado|corriendo)/.test(c));
    const overlayMontado = !!document.querySelector('[data-preloader]');
    const bodyOverflow = getComputedStyle(document.body).overflow;
    const htmlOverflow = getComputedStyle(document.documentElement).overflow;
    const logoVisible = (() => {
      const l = document.querySelector('a[data-logo-marca]');
      return l ? getComputedStyle(l).opacity : "n/a";
    })();
    return {
      pathname: location.pathname,
      bloqueadoAlgunaVez,
      overlayMontado,
      bodyOverflow,
      htmlOverflow,
      logoVisible,
      claseFinal: document.documentElement.className.trim(),
    };
  })()`);

  checar("volver al home: llego a /", trasLogo.pathname === "/", trasLogo.pathname);
  checar(
    "volver al home: NO se rearma la pantalla de entrada",
    !trasLogo.bloqueadoAlgunaVez && !trasLogo.overlayMontado,
    `bloqueado=${trasLogo.bloqueadoAlgunaVez} overlay=${trasLogo.overlayMontado} clase="${trasLogo.claseFinal}"`,
  );
  checar(
    "volver al home: scroll libre al instante",
    trasLogo.bodyOverflow !== "hidden" && trasLogo.htmlOverflow !== "hidden",
    `body=${trasLogo.bodyOverflow} html=${trasLogo.htmlOverflow}`,
  );
  checar(
    "volver al home: el logo del header se ve",
    trasLogo.logoVisible === "1",
    `opacity=${trasLogo.logoVisible}`,
  );
} finally {
  chrome.kill();
}

const fallas = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - fallas.length}/${resultados.length} OK`);
process.exit(fallas.length ? 1 : 0);

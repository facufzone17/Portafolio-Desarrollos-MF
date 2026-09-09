/**
 * Verificacion del reparto de scroll de la demo embebida (08/09/2026).
 *
 * Lo que se fija, que es el pedido textual de Facundo:
 *
 *   Bajando por la ficha con el cursor QUIETO, en el instante en que el
 *   recuadro de la demo le pasa por debajo, la rueda tiene que entrar a la
 *   demo. Sin estacionar el cursor, sin esperar a que la pagina se asiente.
 *
 * Por que hace falta un script y no alcanza con leer el CSS: el traspaso lo
 * decide el hit-test del navegador. Por eso las ruedas se mandan con
 * `Input.dispatchMouseEvent` —entrada real, pasa por el hit-test de verdad— y
 * siempre en el MISMO punto: el cursor no se mueve en todo el recorrido, igual
 * que en el reporte.
 *
 * SON DOS PASADAS, y la primera no es un atajo:
 *
 *  1. BANCO. Al iframe se le cambia el contenido por una tira lisa de 20000px
 *     servida por `srcdoc`, que es del mismo origen que la pagina. Recien ahi
 *     se puede LEER `iframe.contentWindow.scrollY` y demostrar que la rueda
 *     entro a la demo, en vez de deducirlo de que la pagina no se movio. Con
 *     la demo de verdad —otro origen— eso no se puede leer, y ademas, cuando
 *     el sitio embebido llega a su propio fondo, el navegador encadena lo que
 *     sobra a la pagina de afuera: la pagina vuelve a bajar por un motivo que
 *     no tiene nada que ver con lo que se esta midiendo.
 *  2. LA DEMO DE VERDAD. Misma pagina, iframe real y de otro origen: que el
 *     traspaso pase en pleno scroll y que la rueda deje de ser de la pagina.
 *
 * Uso: node scripts/verificar-scroll-demo.mjs [url-base]
 */
import { spawn } from "node:child_process";

const BASE = process.argv[2] ?? "http://localhost:3000";
const RUTA = "/proyectos/inmobiliaria";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PUERTO = 9300 + Math.floor(Math.random() * 300);

/** Cuanto baja cada rueda y cada cuanto se manda. */
const DELTA = 120;
const CADENCIA = 90;

/**
 * Donde se apoya el cursor y NO SE MUEVE MAS. La altura es a proposito mas
 * arriba que el recuadro: asi hay varias ruedas de pagina ANTES del traspaso y
 * el traspaso se mide llegando, que es el caso del reporte.
 */
const PX = 720;
const PY = 300;

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-sandbox",
    "--no-first-run",
    "--disable-extensions",
    "--mute-audio",
    `--remote-debugging-port=${PUERTO}`,
    "--window-size=1440,900",
    "--user-data-dir=" + process.env.TEMP + "/cdp-demo-" + PUERTO,
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

/** Una rueda de verdad en (x, y). No mueve el cursor: solo gira la rueda. */
function rueda(ws, x, y, deltaY) {
  return llamar(ws, "Input.dispatchMouseEvent", {
    type: "mouseWheel",
    x,
    y,
    deltaX: 0,
    deltaY,
    pointerType: "mouse",
  });
}

/**
 * Foto del estado en el punto donde esta apoyado el cursor.
 *
 * `bajoCursor` sale de `elementFromPoint`, que respeta `pointer-events`: si
 * dice IFRAME es porque el iframe esta vivo para el puntero, que es lo que se
 * quiere medir. `adentro` solo se puede leer en la pasada del banco.
 */
const FOTO = `(() => {
  const iframe = document.querySelector('[data-demo-capa] iframe');
  const el = document.elementFromPoint(window.__px, window.__py);
  let adentro = null;
  try { adentro = Math.round(iframe.contentWindow.scrollY); } catch {}
  return {
    scrollY: Math.round(window.scrollY),
    adentro,
    lenisScrolling: document.documentElement.classList.contains('lenis-scrolling'),
    bajoCursor: el ? el.tagName : null,
    enLaDemo: !!(el && el.closest('[data-demo-marco]')),
    peIframe: iframe ? String(getComputedStyle(iframe).pointerEvents) : null,
  };
})()`;

const resultados = [];
function checar(nombre, ok, detalle) {
  resultados.push({ nombre, ok, detalle });
  console.log(
    `${ok ? "OK  " : "FALLA"}  ${nombre}${detalle ? `  — ${detalle}` : ""}`,
  );
}

let ws;

/** Deja la ficha cargada, con la entrada terminada y el cursor apoyado. */
async function abrirFicha() {
  await llamar(ws, "Page.navigate", { url: BASE + RUTA });
  await dormir(6000); // 3,6s de entrada + aire
  await evaluar(ws, `(window.__px = ${PX}, window.__py = ${PY}, 0)`);
  await llamar(ws, "Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: PX,
    y: PY,
  });
}

/** Baja con el cursor quieto hasta que el recuadro le pasa por debajo. */
async function bajarHastaElTraspaso() {
  const recorrido = [];
  for (let i = 0; i < 60; i++) {
    await rueda(ws, PX, PY, DELTA);
    await dormir(CADENCIA);
    const f = await evaluar(ws, FOTO);
    recorrido.push(f);
    if (f.enLaDemo) return { traspaso: { ...f, paso: i }, recorrido };
  }
  return { traspaso: null, recorrido };
}

try {
  await esperarDevTools();
  const destino = await (
    await fetch(`http://127.0.0.1:${PUERTO}/json/new?about:blank`, {
      method: "PUT",
    })
  ).json();
  ws = new WebSocket(destino.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  await llamar(ws, "Page.enable");
  await llamar(ws, "Runtime.enable");
  await llamar(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  // Chrome headless reporta `reduce`, y con eso Lenis NI SIQUIERA MONTA: sin
  // esto se estaria midiendo una pagina sin scroll suave, que es otra cosa.
  await llamar(ws, "Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });

  /* ===================================================================
   * PASADA 1 — BANCO: el iframe es una tira lisa del mismo origen.
   * =================================================================== */
  await abrirFicha();

  checar(
    "Lenis monto (si no, la prueba no vale)",
    await evaluar(ws, `document.documentElement.classList.contains('lenis')`),
    await evaluar(ws, `document.documentElement.className.trim()`),
  );

  const bancoListo = await evaluar(
    ws,
    `(async () => {
      const iframe = document.querySelector('[data-demo-capa] iframe');
      if (!iframe) return false;
      iframe.removeAttribute('src');
      iframe.srcdoc =
        '<body style="margin:0"><div style="height:20000px;' +
        'background:linear-gradient(#111,#666)"></div></body>';
      await new Promise(r => iframe.addEventListener('load', r, { once: true }));
      // El poster tapa hasta que carga; con srcdoc el onLoad de React ya corrio.
      await new Promise(r => setTimeout(r, 300));
      return iframe.contentWindow.document.body.scrollHeight > 19000;
    })()`,
  );
  checar("banco: el iframe quedo con 20000px adentro", bancoListo === true);

  const { traspaso, recorrido } = await bajarHastaElTraspaso();

  checar(
    "banco: mientras el cursor no esta sobre el recuadro, scrollea la pagina",
    recorrido.length >= 2 && recorrido[1].scrollY > 0,
    `a la 2da rueda scrollY=${recorrido[1]?.scrollY} (traspaso recien en la ${
      (traspaso?.paso ?? -1) + 1
    })`,
  );

  if (!traspaso) {
    checar("banco: el recuadro llego a pasar bajo el cursor", false);
  } else {
    checar(
      "banco: el iframe esta VIVO en el instante en que entra bajo el cursor",
      traspaso.bajoCursor === "IFRAME" && traspaso.peIframe === "auto",
      `elementFromPoint=${traspaso.bajoCursor}, pointer-events=${traspaso.peIframe}`,
    );
    // El corazon del arreglo. Con la regla vieja, `lenis-scrolling` en true era
    // EXACTAMENTE la condicion que apagaba el iframe: llegando en movimiento no
    // habia traspaso posible.
    checar(
      "banco: el traspaso ocurre en pleno scroll, no en una pausa",
      traspaso.lenisScrolling === true,
      `lenis-scrolling=${traspaso.lenisScrolling} al traspasar`,
    );

    // LA MEDICION QUE IMPORTA: la rueda siguiente, sin ninguna pausa en el
    // medio y con la pagina todavia en movimiento, ya scrollea ADENTRO.
    await rueda(ws, PX, PY, DELTA);
    await dormir(CADENCIA);
    const siguiente = await evaluar(ws, FOTO);
    checar(
      "banco: la PRIMERA rueda despues del traspaso ya scrollea adentro de la demo",
      siguiente.adentro > traspaso.adentro,
      `adentro ${traspaso.adentro}px -> ${siguiente.adentro}px, sin pausa` +
        `${siguiente.lenisScrolling ? " y con la pagina todavia en movimiento" : ""}`,
    );
  }

  // Con la inercia ya muerta, la pagina no se mueve mas y todo va adentro.
  await dormir(1500);
  const base = await evaluar(ws, FOTO);
  for (let i = 0; i < 12; i++) {
    await rueda(ws, PX, PY, DELTA);
    await dormir(CADENCIA);
  }
  await dormir(600);
  const tras12 = await evaluar(ws, FOTO);
  checar(
    "banco: 12 ruedas mas sobre la demo no mueven la pagina ni un pixel",
    tras12.scrollY === base.scrollY,
    `pagina ${base.scrollY} -> ${tras12.scrollY}, adentro ${base.adentro} -> ${tras12.adentro}`,
  );
  checar(
    "banco: esas 12 ruedas se las llevo la demo",
    tras12.adentro - base.adentro >= 12 * DELTA * 0.5,
    `la demo bajo ${tras12.adentro - base.adentro}px`,
  );

  // Las flechas rojas del reporte: al costado del recuadro manda la pagina.
  const izqMarco = await evaluar(
    ws,
    `Math.round(document.querySelector('[data-demo-marco]').getBoundingClientRect().left)`,
  );
  const CANALETA = Math.max(12, Math.round(izqMarco / 2));
  await llamar(ws, "Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: CANALETA,
    y: PY,
  });
  await evaluar(ws, `(window.__px = ${CANALETA}, 0)`);
  const antesCanaleta = (await evaluar(ws, FOTO)).scrollY;
  for (let i = 0; i < 8; i++) {
    await rueda(ws, CANALETA, PY, -DELTA);
    await dormir(CADENCIA);
  }
  await dormir(700);
  const trasCanaleta = await evaluar(ws, FOTO);
  checar(
    "banco: al costado del recuadro la rueda sigue siendo de la pagina",
    trasCanaleta.scrollY < antesCanaleta - 50,
    `x=${CANALETA}px: la pagina subio de ${antesCanaleta} a ${trasCanaleta.scrollY}`,
  );

  /* ===================================================================
   * PASADA 2 — LA DEMO DE VERDAD (otro origen, red de por medio).
   * =================================================================== */
  await abrirFicha();

  let cargada = false;
  for (let i = 0; i < 40 && !cargada; i++) {
    cargada = await evaluar(
      ws,
      `(() => {
        const c = document.querySelector('[data-demo-capa]');
        const img = document.querySelector('[data-demo-marco] img');
        return !!(c && c.querySelector('iframe')) && !!img
          && getComputedStyle(img).opacity === '0';
      })()`,
    ).catch(() => false);
    if (!cargada) await dormir(500);
  }
  checar(
    "demo real: cargo (el poster se fue)",
    cargada,
    cargada ? "" : "sin red o demo caida: lo que sigue no vale",
  );

  const real = await bajarHastaElTraspaso();
  if (!real.traspaso) {
    checar("demo real: el recuadro llego a pasar bajo el cursor", false);
  } else {
    checar(
      "demo real: el iframe esta VIVO en el instante en que entra bajo el cursor",
      real.traspaso.bajoCursor === "IFRAME" && real.traspaso.peIframe === "auto",
      `elementFromPoint=${real.traspaso.bajoCursor}, pointer-events=${real.traspaso.peIframe}, ` +
        `lenis-scrolling=${real.traspaso.lenisScrolling}`,
    );
  }

  await dormir(1500);
  const baseReal = await evaluar(ws, FOTO);
  for (let i = 0; i < 8; i++) {
    await rueda(ws, PX, PY, DELTA);
    await dormir(CADENCIA);
  }
  await dormir(600);
  const trasReal = await evaluar(ws, FOTO);
  checar(
    "demo real: la rueda sobre el recuadro no mueve la pagina",
    trasReal.scrollY === baseReal.scrollY,
    `pagina ${baseReal.scrollY} -> ${trasReal.scrollY}`,
  );

  /* ===================================================================
   * PASADA 3 — TACTIL: nada de lo de arriba se aplica.
   *
   * Sin cursor que sacar del recuadro, un iframe siempre vivo se come el gesto
   * y deja la pagina trabada. Es el invariante mas facil de romper "limpiando"
   * el CSS, asi que queda fijado aca.
   * =================================================================== */
  await llamar(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });
  await llamar(ws, "Emulation.setTouchEmulationEnabled", {
    enabled: true,
    maxTouchPoints: 5,
  });
  await abrirFicha();

  const tactil = await evaluar(
    ws,
    `(() => {
      const capa = document.querySelector('[data-demo-capa]');
      const iframe = capa && capa.querySelector('iframe');
      return {
        esTactil: !matchMedia('(hover: hover) and (pointer: fine)').matches,
        peCapa: capa ? String(getComputedStyle(capa).pointerEvents) : null,
        peIframe: iframe ? String(getComputedStyle(iframe).pointerEvents) : null,
      };
    })()`,
  );
  checar(
    "tactil: el navegador se hace pasar por tactil (si no, no se probo nada)",
    tactil.esTactil === true,
    `(hover:hover) and (pointer:fine) = ${!tactil.esTactil}`,
  );
  checar(
    "tactil: la demo arranca inerte, hasta que se la toca",
    tactil.peCapa === "none",
    `pointer-events de la capa = ${tactil.peCapa}, del iframe = ${tactil.peIframe}`,
  );

  ws.close();
} finally {
  chrome.kill();
}

const fallas = resultados.filter((r) => !r.ok);
console.log(
  `\n${resultados.length - fallas.length}/${resultados.length} en verde`,
);
process.exit(fallas.length ? 1 : 0);

/**
 * Verificacion de la seccion de contacto de dos canales (07/09/2026).
 *
 * Lo que fija en codigo:
 *
 *  1. El globo flotante de WhatsApp ya no existe en ningun lado.
 *  2. El compositor es un <a> a wa.me que abre en pestaña nueva, y su href
 *     REFLEJA lo que el visitante escribio (reemplaza la frase enlatada, no la
 *     combina).
 *  3. El compositor va primero en el DOM y a la derecha en escritorio; primero
 *     de arriba a abajo en mobile.
 *  4. Las reglas del sistema que un rediseño rompe sin querer: nada de
 *     pastillas, nada de verde de WhatsApp, targets de 44px, sin scroll
 *     horizontal, y todo visible con movimiento reducido.
 *  5. El endpoint valida y, sin RESEND_API_KEY, sigue devolviendo 200 en local.
 *  6. El honeypot esta escondido de verdad y, lleno, responde 200 sin delatar
 *     la deteccion. El limite por IP corta al sexto envio y no salpica a otras.
 *
 * Cada assert que toca el endpoint manda su propia `x-forwarded-for` al azar:
 * el limitador cuenta por IP y en memoria, asi que sin eso el conteo se
 * arrastra entre corridas y los asserts empiezan a dar 429 solos. En local no
 * hay proxy adelante y la cabecera llega tal cual; en Vercel la pone la
 * plataforma y esto no cambia nada.
 *
 * Uso: node scripts/verificar-contacto.mjs [url-base]
 */
import { spawn } from "node:child_process";

const BASE = process.argv[2] ?? "http://localhost:3000";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PUERTO = 9600 + Math.floor(Math.random() * 300);

/** Tiene que quedar igual que `mensajes.general` en lib/site.ts. */
const GENERAL =
  "Hola, vi el portafolio de Trevoo y quiero consultarles por un proyecto.";
/** La primera linea de `mensajes.compuesto`. */
const ENCABEZADO = "Hola, les escribo desde el sitio de Trevoo.";

const chrome = spawn(
  CHROME,
  [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
    "--no-first-run", "--disable-extensions", "--mute-audio",
    `--remote-debugging-port=${PUERTO}`,
    "--window-size=1440,900",
    "--user-data-dir=" + process.env.TEMP + "/cdp-contacto-" + PUERTO,
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

/** Baja hasta contacto y espera a que las apariciones hayan corrido. */
const IR_A_CONTACTO = `(async () => {
  document.querySelector('#contacto').scrollIntoView();
  await new Promise(r => setTimeout(r, 1200));
  return true;
})()`;

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
  // Chrome headless reporta `reduce`: sin esto no aparece nada.
  await llamar(ws, "Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });

  await llamar(ws, "Page.navigate", { url: `${BASE}/` });
  await dormir(6000); // 3,6s de entrada + aire
  await evaluar(ws, IR_A_CONTACTO);

  // --- 1. El globo no existe ---
  const globo = await evaluar(
    ws,
    `document.querySelectorAll("[data-wa-flotante], [data-analytics='cta-flotante']").length`,
  );
  checar("el globo flotante no existe", globo === 0, `encontrados: ${globo}`);

  // --- 2. El CTA del compositor es un <a> que abre afuera ---
  const cta = await evaluar(ws, `(() => {
    const n = document.querySelectorAll('#contacto [data-analytics="cta-compositor"]');
    if (n.length !== 1) return { cantidad: n.length };
    const a = n[0];
    return {
      cantidad: 1,
      etiqueta: a.tagName,
      target: a.target,
      rel: a.rel,
      href: a.href,
    };
  })()`);
  checar(
    "hay exactamente un CTA de compositor, <a>, target=_blank y rel noopener",
    cta.cantidad === 1 &&
      cta.etiqueta === "A" &&
      cta.target === "_blank" &&
      /noopener/.test(cta.rel),
    JSON.stringify({ ...cta, href: undefined }),
  );

  const textoDe = (href) =>
    decodeURIComponent(new URL(href).searchParams.get("text") ?? "");

  // --- 3. Vacio manda la frase de siempre ---
  checar(
    "con el campo vacio manda mensajes.general",
    textoDe(cta.href) === GENERAL,
    JSON.stringify(textoDe(cta.href)),
  );

  // --- 4. Con texto, el href se actualiza y REEMPLAZA la frase enlatada ---
  // Asignar `.value` en un campo controlado por React no dispara su onChange:
  // hay que pasar por el setter nativo y emitir el evento a mano. Sin esto el
  // assert pasa sin probar nada.
  const conTexto = await evaluar(ws, `(async () => {
    const ta = document.querySelector('#mensaje-whatsapp');
    const set = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype, 'value').set;
    set.call(ta, 'probando 123');
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 200));
    return document.querySelector('#contacto [data-analytics="cta-compositor"]').href;
  })()`);
  const t = textoDe(conTexto);
  checar(
    "con texto: encabeza con la linea de origen y termina con lo escrito",
    t.startsWith(ENCABEZADO) && t.endsWith("probando 123"),
    JSON.stringify(t),
  );
  checar(
    "el texto del visitante REEMPLAZA la frase enlatada (no la combina)",
    !t.includes(GENERAL),
    t.includes(GENERAL) ? "aparece mensajes.general pegado adelante" : "",
  );

  // --- 5. Orden a 1440: primero en el DOM, a la derecha en pantalla ---
  const orden = await evaluar(ws, `(() => {
    const comp = document.querySelector('#contacto [data-analytics="cta-compositor"]')
      .closest('[data-revelar]');
    const form = document.querySelector('#contacto form').closest('[data-revelar]');
    const rel = comp.compareDocumentPosition(form);
    return {
      compPrimeroEnDom: Boolean(rel & Node.DOCUMENT_POSITION_FOLLOWING),
      compLeft: Math.round(comp.getBoundingClientRect().left),
      formLeft: Math.round(form.getBoundingClientRect().left),
    };
  })()`);
  checar(
    "1440: el compositor va primero en el DOM y a la derecha en pantalla",
    orden.compPrimeroEnDom && orden.compLeft > orden.formLeft,
    JSON.stringify(orden),
  );

  // --- 6. Sin pastillas ---
  const radios = await evaluar(ws, `(() => {
    const malos = [];
    for (const el of document.querySelectorAll('#contacto *')) {
      const r = getComputedStyle(el).borderRadius;
      if (!/^(0px|3px|10px)$/.test(r)) malos.push(el.tagName + ':' + r);
    }
    return malos.slice(0, 6);
  })()`);
  checar("un solo radio: 0, 3 o 10px", radios.length === 0, radios.join(", "));

  // --- 7. Nada de verde de WhatsApp ---
  const verdes = await evaluar(ws, `(() => {
    const cerca = (s) => {
      const m = String(s).match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
      if (!m) return false;
      const [r, g, b] = [+m[1], +m[2], +m[3]];
      return Math.abs(r - 37) < 40 && Math.abs(g - 211) < 40 && Math.abs(b - 102) < 40;
    };
    const malos = [];
    for (const el of document.querySelectorAll('#contacto *')) {
      const s = getComputedStyle(el);
      for (const p of ['color', 'backgroundColor', 'borderTopColor', 'fill']) {
        if (cerca(s[p])) malos.push(el.tagName + '.' + p + '=' + s[p]);
      }
    }
    return malos.slice(0, 6);
  })()`);
  checar("sin verde de WhatsApp", verdes.length === 0, verdes.join(", "));

  // --- 8. Targets de 44px ---
  const chicos = await evaluar(ws, `(() => {
    const malos = [];
    for (const el of document.querySelectorAll('#contacto a, #contacto button, #contacto input, #contacto textarea')) {
      // Lo que no esta expuesto no es un target: el honeypot es aria-hidden,
      // tabIndex -1 y vive fuera de pantalla justamente para que nadie lo
      // toque. Medirle el alto seria exigirle 44px a un campo invisible.
      if (el.closest('[aria-hidden]')) continue;
      const h = el.getBoundingClientRect().height;
      if (h > 0 && h < 44) malos.push(el.tagName + ':' + Math.round(h) + 'px');
    }
    return malos;
  })()`);
  checar("todo lo tocable mide 44px o mas", chicos.length === 0, chicos.join(", "));

  // --- 9. Mobile: 390px, el compositor arriba y sin scroll horizontal ---
  await llamar(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390, height: 844, deviceScaleFactor: 2, mobile: true,
  });
  await evaluar(ws, IR_A_CONTACTO);

  const movil = await evaluar(ws, `(() => {
    const comp = document.querySelector('#contacto [data-analytics="cta-compositor"]')
      .closest('[data-revelar]');
    const form = document.querySelector('#contacto form').closest('[data-revelar]');
    return {
      compTop: Math.round(comp.getBoundingClientRect().top),
      formTop: Math.round(form.getBoundingClientRect().top),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  })()`);
  checar(
    "390: el compositor va arriba del formulario",
    movil.compTop < movil.formTop,
    JSON.stringify({ compTop: movil.compTop, formTop: movil.formTop }),
  );
  checar(
    "390: sin scroll horizontal",
    movil.scrollWidth <= movil.innerWidth,
    `${movil.scrollWidth} > ${movil.innerWidth}`,
  );

  // --- 10. Movimiento reducido: todo visible sin scrollear ---
  await llamar(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  });
  await llamar(ws, "Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await llamar(ws, "Page.navigate", { url: `${BASE}/` });
  await dormir(3000);

  const opacidades = await evaluar(ws, `(() => {
    const n = [...document.querySelectorAll('#contacto [data-revelar]')];
    return {
      cantidad: n.length,
      opacos: n.filter(e => getComputedStyle(e).opacity === '1').length,
    };
  })()`);
  checar(
    "con movimiento reducido todo el contenido esta visible sin scrollear",
    opacidades.cantidad > 0 && opacidades.cantidad === opacidades.opacos,
    JSON.stringify(opacidades),
  );

  // --- 11. El endpoint ---
  const endpoint = await evaluar(ws, `(async () => {
    // IP propia por corrida: si no, el conteo del limitador se arrastra entre
    // corridas y a la tercera estos dos asserts empiezan a dar 429.
    const ip = '198.51.100.' + (10 + Math.floor(Math.random() * 200));
    const post = (cuerpo) => fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify(cuerpo),
    }).then(r => r.status);
    return {
      valido: await post({
        nombre: 'Prueba', negocio: 'Prueba SA',
        necesita: 'Quiero una tienda online para vender mates.',
        contacto: 'prueba@ejemplo.com',
      }),
      incompleto: await post({ nombre: 'Prueba', negocio: 'x', contacto: 'y' }),
    };
  })()`);
  checar(
    "POST valido -> 200 (sin RESEND_API_KEY en local igual responde ok)",
    endpoint.valido === 200,
    `status ${endpoint.valido}`,
  );
  checar(
    "POST sin `necesita` -> 400",
    endpoint.incompleto === 400,
    `status ${endpoint.incompleto}`,
  );

  // --- 12. Honeypot: el campo esta, escondido y fuera del alcance ---
  const trampa = await evaluar(ws, `(() => {
    const i = document.querySelector('#contacto input[name="apodo"]');
    if (!i) return { existe: false };
    const caja = i.getBoundingClientRect();
    return {
      existe: true,
      tabIndex: i.tabIndex,
      autoComplete: i.getAttribute('autocomplete'),
      escondido: Boolean(i.closest('[aria-hidden="true"], [aria-hidden]')),
      // Fuera de pantalla por la izquierda, no por display:none.
      fueraDePantalla: caja.right < 0,
    };
  })()`);
  checar(
    "honeypot: existe, aria-hidden, tabIndex -1, autocomplete off y fuera de pantalla",
    trampa.existe &&
      trampa.tabIndex === -1 &&
      trampa.autoComplete === "off" &&
      trampa.escondido &&
      trampa.fueraDePantalla,
    JSON.stringify(trampa),
  );

  // Con la trampa llena responde 200 (a un bot no se le avisa que lo pescamos)
  // pero NO entrega. Que no entregue solo se ve del lado del server; desde aca
  // lo comprobable es que no filtre la deteccion.
  const conTrampa = await evaluar(ws, `fetch('/api/contacto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '198.51.100.' + (10 + Math.floor(Math.random() * 200)),
    },
    body: JSON.stringify({
      nombre: 'Bot', negocio: 'Bot SA',
      necesita: 'Comprá seguidores baratos ahora mismo.',
      contacto: 'bot@ejemplo.com', apodo: 'me llene solo',
    }),
  }).then(r => r.status)`);
  checar(
    "honeypot lleno -> 200 en silencio (no delata la deteccion)",
    conTrampa === 200,
    `status ${conTrampa}`,
  );

  // --- 13. Limite por IP ---
  // Cada corrida usa una IP propia (203.0.113.x al azar) para no arrastrar el
  // conteo de la corrida anterior. En local no hay proxy adelante, asi que la
  // cabecera llega tal cual; en Vercel la pone la plataforma.
  const limite = await evaluar(ws, `(async () => {
    const ip = '203.0.113.' + (10 + Math.floor(Math.random() * 200));
    const post = (cual) => fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': cual },
      body: JSON.stringify({
        nombre: 'Prueba', negocio: 'Prueba SA',
        necesita: 'Quiero una tienda online para vender mates.',
        contacto: 'prueba@ejemplo.com',
      }),
    });
    const codigos = [];
    // El tope es 5 por ventana: al sexto tiene que cortar.
    for (let i = 0; i < 6; i++) codigos.push((await post(ip)).status);
    const ultima = await post(ip);
    // Otra IP no tiene por que pagar el limite de esta.
    const otra = await post('203.0.113.250');
    return {
      codigos,
      retryAfter: ultima.headers.get('Retry-After'),
      otraIp: otra.status,
    };
  })()`);
  checar(
    "limite por IP: los primeros 5 pasan y el sexto es 429",
    limite.codigos.slice(0, 5).every((c) => c === 200) &&
      limite.codigos[5] === 429,
    JSON.stringify(limite.codigos),
  );
  checar(
    "el 429 trae Retry-After en segundos",
    Number(limite.retryAfter) > 0,
    `Retry-After: ${limite.retryAfter}`,
  );
  checar(
    "el limite es por IP: otra IP sigue pasando",
    limite.otraIp === 200,
    `status ${limite.otraIp}`,
  );
} finally {
  chrome.kill();
}

const fallas = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - fallas.length}/${resultados.length} OK`);
process.exit(fallas.length ? 1 : 0);

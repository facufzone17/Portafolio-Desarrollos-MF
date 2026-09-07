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
 *  5. Las cuatro vias miden lo mismo y apuntan a donde dicen: el mail al mail
 *     real, la llamada a un tel: con el numero del sitio, y el bloque de
 *     WhatsApp NO a wa.me sino al campo del compositor.
 *  6. Instagram no se dibuja mientras no haya usuario (§9.1), y el formulario
 *     con su ruta /api/contacto se fueron del todo.
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
    const form = document.querySelector('#contacto [data-analytics="via-mail"]').closest('[data-revelar]');
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
    const form = document.querySelector('#contacto [data-analytics="via-mail"]').closest('[data-revelar]');
    return {
      compTop: Math.round(comp.getBoundingClientRect().top),
      formTop: Math.round(form.getBoundingClientRect().top),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  })()`);
  checar(
    "390: el compositor va arriba de las vias",
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

  // --- 11. Las vias: cuatro bloques, del mismo alto y con destino real ---
  await llamar(ws, "Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await llamar(ws, "Page.navigate", { url: `${BASE}/` });
  await dormir(6000);
  await evaluar(ws, IR_A_CONTACTO);

  const vias = await evaluar(ws, `(() => {
    const items = [...document.querySelectorAll('#contacto ul > li')];
    return items.map(li => {
      const a = li.querySelector('a[data-analytics]') || li.querySelector('a');
      const b = li.matches('[data-analytics]') ? li : li.querySelector('button[type="button"]');
      const caja = li.getBoundingClientRect();
      return {
        alto: Math.round(caja.height),
        href: a ? a.getAttribute('href') : null,
        tieneBoton: Boolean(li.querySelector('button')),
        texto: li.innerText.replace(/\s+/g, ' ').trim().slice(0, 60),
      };
    });
  })()`);
  checar(
    "hay bloques de vias y todos miden lo mismo",
    vias.length >= 3 &&
      new Set(vias.map((v) => v.alto)).size === 1 &&
      vias[0].alto >= 92,
    JSON.stringify(vias.map((v) => v.alto)),
  );

  const hrefs = vias.map((v) => v.href);
  checar(
    "el bloque de mail apunta al mail real",
    hrefs.includes("mailto:desarrollosmf00@gmail.com"),
    JSON.stringify(hrefs),
  );
  checar(
    "el bloque de llamada es un tel: con el numero del sitio",
    hrefs.includes("tel:+5491122728576"),
    JSON.stringify(hrefs),
  );

  // El primer bloque NO puede ser un link a wa.me: tiene que llevar al
  // compositor. Si algun dia vuelve a ser <a href="wa.me">, esto lo caza.
  const primeroEsBoton = await evaluar(ws, `(() => {
    const li = document.querySelector('#contacto ul > li');
    return {
      etiqueta: li.firstElementChild.tagName,
      llevaAWaMe: /wa\.me/.test(li.innerHTML),
    };
  })()`);
  checar(
    "el bloque de WhatsApp es un boton y no una salida a wa.me",
    primeroEsBoton.etiqueta === "BUTTON" && !primeroEsBoton.llevaAWaMe,
    JSON.stringify(primeroEsBoton),
  );

  // --- 12. El boton de WhatsApp deja el foco en el campo del compositor ---
  const foco = await evaluar(ws, `(async () => {
    document.querySelector('#contacto ul > li button').click();
    await new Promise(r => setTimeout(r, 400));
    return document.activeElement ? document.activeElement.id : '(ninguno)';
  })()`);
  checar(
    "el bloque de WhatsApp enfoca el campo del compositor",
    foco === "mensaje-whatsapp",
    `foco en: ${foco}`,
  );

  // --- 12b. El boton de copiar deja el mail en el portapapeles de verdad ---
  // Sin el permiso, writeText tira y el componente se lo traga en silencio (a
  // proposito: el mailto sigue estando). Se lo damos para poder comprobarlo.
  await llamar(ws, "Browser.grantPermissions", {
    origin: BASE,
    permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
  });
  // Sin esto la pestaña headless no cuenta como enfocada y readText tira
  // "Document is not focused", que no dice nada sobre nuestro codigo.
  await llamar(ws, "Emulation.setFocusEmulationEnabled", { enabled: true });
  const copiado = await evaluar(ws, `(async () => {
    const b = document.querySelector('#contacto [data-analytics="via-mail"]')
      .closest('li').querySelector('button');
    b.click();
    await new Promise(r => setTimeout(r, 300));
    return {
      portapapeles: await navigator.clipboard.readText(),
      avisa: document.querySelector('#contacto [role="status"]').textContent.trim(),
    };
  })()`);
  checar(
    "copiar deja el mail en el portapapeles y lo anuncia",
    copiado.portapapeles === "desarrollosmf00@gmail.com" &&
      /copiada/i.test(copiado.avisa),
    JSON.stringify(copiado),
  );

  // --- 13. Instagram no se dibuja mientras no haya usuario (§9.1) ---
  const insta = await evaluar(
    ws,
    `document.querySelectorAll('#contacto [data-analytics="via-instagram"]').length`,
  );
  checar(
    "sin usuario de Instagram, el bloque no se dibuja",
    insta === 0,
    `bloques: ${insta}`,
  );

  // --- 14. El formulario y su endpoint se fueron del todo ---
  const formulario = await evaluar(
    ws,
    `document.querySelectorAll('#contacto form, #contacto input[name="apodo"]').length`,
  );
  checar("no quedo ningun formulario en la seccion", formulario === 0, `nodos: ${formulario}`);

  const rutaMuerta = await evaluar(
    ws,
    `fetch('/api/contacto', { method: 'POST', body: '{}' }).then(r => r.status).catch(() => 0)`,
  );
  checar(
    "la ruta /api/contacto ya no existe (404)",
    rutaMuerta === 404,
    `status ${rutaMuerta}`,
  );
} finally {
  chrome.kill();
}

const fallas = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - fallas.length}/${resultados.length} OK`);
process.exit(fallas.length ? 1 : 0);

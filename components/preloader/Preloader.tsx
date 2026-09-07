"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Isotipo } from "@/components/ui/Isotipo";
import { Logotipo } from "@/components/ui/Logotipo";
import { LETRAS, LOGOTIPO } from "@/lib/marca";
import { lenisActual } from "@/lib/useLenis";

/**
 * Pantalla de carga de Trevoo.
 *
 * Sobre negro se escribe TREVOO letra por letra; el conjunto se corre a la
 * izquierda, REVOO se desvanece mientras la T empieza a girar sobre su eje; a
 * maxima velocidad la T se transforma en el isotipo; el giro frena, la pieza
 * se asienta con un rebote corto y despues se achica y viaja hasta calzar
 * exactamente encima del logo del header. Recien ahi el negro se va.
 *
 * Cinco decisiones que explican como esta armado:
 *
 * 1. La transformacion NO es un morph de paths. Son dos dibujos apilados y
 *    centrados en el mismo punto, girando juntos: la T se va con blur y el
 *    isotipo entra perdiendolo. Es la "opcion B" del pedido, y a seis vueltas
 *    por segundo es indistinguible de interpolar geometria — sin sumar GSAP ni
 *    Flubber al bundle por tres segundos de animacion.
 *
 * 2. El aterrizaje no esta calculado a mano: se MIDE. Al empezar el viaje se
 *    leen las cajas reales del isotipo que vuela y del isotipo del header, y
 *    de ahi salen el desplazamiento y la escala. Por eso calza en pixeles en
 *    cualquier pantalla, y sigue calzando si mañana cambia el tamaño del logo.
 *
 * 3. Las seis letras usan el mismo path que el logotipo del header, recortado
 *    por viewBox (ver components/ui/Logotipo.tsx). No hay seis archivos sueltos
 *    que puedan quedar desalineados entre si.
 *
 * 4. El tiempo lo lleva el reloj, no el contador de cuadros: un lerp por frame
 *    ata la duracion al refresco de la pantalla, y la misma animacion duraria
 *    la mitad en un monitor de 144Hz.
 *
 * 5. La maquina de escribir es la unica parte que NO pasa por el rAF: son seis
 *    transiciones CSS con su propio retardo. El navegador ya sabe repartirlas,
 *    y asi el reloj de JavaScript solo se ocupa de lo que de verdad necesita un
 *    valor por cuadro.
 */

/** Marca de "ya la vio" en esta pestaña. */
const CLAVE = "trevoo-entrada-vista";

const CLASE_VISTO = "preloader-visto";
const CLASE_BLOQUEO = "preloader-bloqueado";
const CLASE_CORRIENDO = "preloader-corriendo";
/** Marca "hay JavaScript vivo": la pone el <script> inline apenas parsea. */
const CLASE_JS = "js";
/** La clase con la que Lenis bloquea el scroll (ver globals.css). */
const CLASE_LENIS_STOP = "lenis-stopped";

declare global {
  interface Window {
    /** La pone el failsafe inline: "ya limpie el preloader a mano". */
    __trevooFailsafe?: 1;
  }
}

/* --- La linea de tiempo, en milisegundos --- */
/** Fin de la escritura (la ultima letra cierra en ~800ms; el resto es aire). */
const ESCRITURA = 900;
/** El conjunto termina de correrse a la izquierda. */
const DESPLAZAMIENTO = 1200;
/** Empieza el giro y la salida de REVOO. */
const GIRO_INICIO = 1200;
/** Arranca el cruce T -> isotipo, con el giro en su punto mas rapido. */
const MORPH = 1900;
/** El giro se detiene. */
const GIRO_FIN = 2600;
/** Fin del rebote de asentamiento. */
const ASENTADO = 2900;
/** La pieza termino de viajar a la esquina. */
const VIAJE = 3400;
/** Fin del fundido del overlay. */
const TOTAL = 3600;

/**
 * Red de seguridad, en milisegundos.
 *
 * El overlay negro lo saca el JS: `terminar()` desmonta el nodo. Si el bundle
 * no llega a hidratar —browser viejo, un chunk que no baja, un error de
 * runtime— sin esto la pagina queda tapada de negro y sin scroll para siempre.
 * Eso es lo que se veia en mobile.
 *
 * A los FAILSAFE ms un <script> inline (que corre en el parseo, sin depender
 * de React) limpia todo a mano: saca el overlay, el bloqueo de scroll y revela
 * el contenido. El efecto de abajo tambien se rinde si arranca pasado este
 * plazo: a esa altura el momento de la entrada ya paso.
 *
 * Con una carga sana nunca se alcanza —la entrada termina a los TOTAL (3,6s)—
 * y deja aire para hidratar en un telefono lento sin cortar la animacion.
 */
const FAILSAFE = 5000;

/** Retardo entre letra y letra de la maquina de escribir. */
const RETARDO_LETRA = 130;

/**
 * Vueltas entre que arranca el giro y que frena.
 *
 * Con 5 el pico de velocidad queda en 6,7 vueltas por segundo: suficiente para
 * que la forma no se lea durante el cruce (que es lo que hace creible la
 * transformacion) y no tanto como para que quede un borron.
 */
const VUELTAS = 5;

/** Cuanto se corre el conjunto a la izquierda, en anchos de palabra. */
const CORRIMIENTO = 0.06;

const recortar = (v: number) => Math.min(1, Math.max(0, v));

/** Tramo normalizado entre dos instantes de la linea de tiempo. */
const tramo = (t: number, desde: number, hasta: number) =>
  recortar((t - desde) / (hasta - desde));

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * smootherstep: velocidad 0 en los dos extremos y maxima en el medio.
 *
 * Es exactamente el giro que se pidio —acelera al arrancar, frena al final— en
 * una sola funcion, sin partirlo en dos tramos que despues no empalman.
 */
const suavisimo = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/**
 * Rebote de asentamiento. Sobrepasa apenas y vuelve: es el "encastre".
 *
 * Va sobre el 10% que la pieza crecio durante el cruce, asi que el sobrepaso
 * efectivo ronda el 1% del tamaño. Sutil, que es lo que se pidio.
 */
const elastico = (t: number) =>
  t >= 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;

/** Centro de la letra i dentro del viewBox del logotipo, en fraccion de ancho. */
const centroLetra = (i: number) =>
  (LETRAS[i][0] + LETRAS[i][1] + 1) / 2 / LOGOTIPO.w;

function noSuscribir() {
  return () => {};
}

/**
 * La decision se toma una sola vez por carga y despues queda congelada.
 *
 * useSyncExternalStore exige que getSnapshot devuelva siempre lo mismo mientras
 * no avise la suscripcion, y aca no da igual: al terminar, la entrada escribe
 * la marca en sessionStorage, y si el snapshot se recalculara pasaria de true a
 * false en pleno render. Sin este cache, el primer render posterior a la
 * hidratacion desmonta la pantalla antes de que llegue a verse.
 */
let decision: boolean | null = null;

function leerDebeMostrar(): boolean {
  if (decision !== null) return decision;
  let vista = false;
  try {
    vista = sessionStorage.getItem(CLAVE) === "1";
  } catch {
    // Modo privado o storage bloqueado: la entrada se vuelve a ver, nada mas.
  }
  decision =
    !vista &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    // Si el bundle tardo tanto en hidratar que el failsafe inline ya corrio (o
    // que el momento de la entrada ya paso), no montar el overlay: entrar
    // directo al sitio, que a esta altura ya se esta viendo.
    !window.__trevooFailsafe &&
    performance.now() < FAILSAFE;
  return decision;
}

/** Caja de una letra dentro del lienzo, en porcentaje del ancho. */
function caja(i: number) {
  return {
    left: `${(LETRAS[i][0] / LOGOTIPO.w) * 100}%`,
    width: `${((LETRAS[i][1] - LETRAS[i][0] + 1) / LOGOTIPO.w) * 100}%`,
  };
}

export function Preloader() {
  const debeMostrar = useSyncExternalStore(
    noSuscribir,
    leerDebeMostrar,
    () => true,
  );
  const [terminada, setTerminada] = useState(false);
  const raizRef = useRef<HTMLDivElement>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);
  const isoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    const lienzo = lienzoRef.current;
    const iso = isoRef.current;
    // Si `debeMostrar` dio false (ya vista, movimiento reducido, o el failsafe
    // inline ya limpio todo) el overlay no se renderiza y no hay nada que hacer.
    if (!raiz || !lienzo || !iso) return;

    const html = document.documentElement;
    html.classList.add(CLASE_BLOQUEO, CLASE_CORRIENDO);
    window.scrollTo(0, 0);
    lenisActual()?.stop();

    // Dispara las seis transiciones de la maquina de escribir en el cuadro
    // siguiente: en el mismo, el navegador todavia no pinto el estado inicial y
    // la transicion no arranca (las letras aparecerian todas de golpe).
    const arranque = requestAnimationFrame(() => {
      raiz.dataset.escrito = "";
    });

    const inicio = performance.now();
    let raf = 0;
    let terminado = false;

    // Si el rAF se cuelga (pestaña que estuvo en segundo plano y despierta mal,
    // un throttle agresivo del navegador), un timer igual cierra la entrada.
    const parada = window.setTimeout(() => terminar(), TOTAL + 2000);
    /** Se completa al empezar el viaje, midiendo las dos cajas reales. */
    let destino: { dx: number; dy: number; escala: number } | null = null;
    let logoRevelado = false;

    function medirDestino() {
      const marca = document.querySelector("[data-logo-isotipo]");
      const desde = iso!.getBoundingClientRect();
      if (!marca || !desde.height) return null;
      const hasta = marca.getBoundingClientRect();
      if (!hasta.height) return null;
      return {
        dx: hasta.left + hasta.width / 2 - (desde.left + desde.width / 2),
        dy: hasta.top + hasta.height / 2 - (desde.top + desde.height / 2),
        escala: hasta.height / desde.height,
      };
    }

    /**
     * Todo el estado del cuadro viaja en custom properties heredadas: una sola
     * escritura al nodo raiz mueve la palabra, las cinco letras de REVOO, la
     * pieza que gira y el overlay.
     */
    function aplicar(t: number) {
      const estilo = raiz!.style;
      const ancho = lienzo!.getBoundingClientRect().width;
      const poner = (clave: string, valor: number, unidad = "") =>
        estilo.setProperty(`--pre-${clave}`, valor.toFixed(4) + unidad);

      // Cursor: aparece con la ultima letra y se va antes del desplazamiento.
      poner("cursor-op", t >= 780 && t < ESCRITURA ? 1 : 0);

      // Fase 2: el conjunto se corre a la izquierda.
      const corrido =
        -CORRIMIENTO * ancho * easeOut(tramo(t, ESCRITURA, DESPLAZAMIENTO));
      poner("dx", corrido, "px");

      // Fase 3: REVOO se va y la T se corre al centro de la pantalla.
      const salida = easeOut(tramo(t, GIRO_INICIO, GIRO_INICIO + 560));
      poner("revoo-op", 1 - salida);
      poner("revoo-x", -0.22 * ancho * salida, "px");

      // El centro de la pantalla, medido dentro del lienzo: la mitad del lienzo
      // menos lo que el lienzo ya se corrio, menos donde esta la T.
      const aCentro =
        (0.5 * ancho - corrido - centroLetra(0) * ancho) *
        easeInOut(tramo(t, GIRO_INICIO + 50, MORPH));

      // Fases 3 y 4: el giro, de arranque a frenada, en una sola curva.
      poner(
        "giro",
        VUELTAS * 360 * suavisimo(tramo(t, GIRO_INICIO, GIRO_FIN)),
        "deg",
      );

      // Fase 4: el cruce. La T se va con blur mientras el isotipo lo pierde.
      const seVa = tramo(t, MORPH, MORPH + 330);
      poner("t-op", 1 - seVa);
      poner("t-blur", 12 * seVa, "px");
      const entra = tramo(t, MORPH + 180, MORPH + 560);
      poner("iso-op", entra);
      poner("iso-blur", 14 * (1 - entra), "px");

      // Fase 5: crece durante el cruce y se asienta con un rebote corto.
      const crece = 1 + 0.1 * tramo(t, MORPH, GIRO_FIN);
      let escala = crece + (1 - crece) * elastico(tramo(t, GIRO_FIN, ASENTADO));

      // Fase 6: el viaje a la esquina. Las dos cajas se miden una sola vez, en
      // el primer cuadro del tramo — ahi el aporte del viaje todavia es cero,
      // asi que lo que se lee es exactamente el punto de partida.
      let viajeX = 0;
      let viajeY = 0;
      if (t >= ASENTADO) {
        destino ??= medirDestino();
        if (destino) {
          const p = easeInOut(tramo(t, ASENTADO, VIAJE));
          viajeX = destino.dx * p;
          viajeY = destino.dy * p;
          escala *= 1 + (destino.escala - 1) * p;
        }
      }

      poner("pieza-x", aCentro + viajeX, "px");
      poner("pieza-y", viajeY, "px");
      poner("escala", escala);

      // Fase 7: el negro se va. El logo del header aparece justo al empezar,
      // cuando la pieza que volo ya esta encima: el cambio no se ve.
      if (t >= VIAJE && !logoRevelado) {
        logoRevelado = true;
        html.classList.remove(CLASE_CORRIENDO);
      }
      poner("fondo", 1 - tramo(t, VIAJE, TOTAL));
    }

    function terminar() {
      if (terminado) return;
      terminado = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(parada);
      html.classList.remove(CLASE_BLOQUEO, CLASE_CORRIENDO);
      html.classList.add(CLASE_VISTO);
      // `decision` es de modulo y sobrevive a la navegacion cliente. Recien
      // aca es seguro pasarlo a false: la entrada ya termino, asi que ningun
      // snapshot en curso se va a dar vuelta en pleno render (que es lo que
      // este cache evita). Sin esto, cada vuelta al home por <Link> —tocar el
      // logo del header desde una ficha de proyecto— remonta el Preloader,
      // `leerDebeMostrar()` devuelve el true viejo y el efecto vuelve a correr:
      // bloquea el scroll, esconde el logo y pausa la entrada del hero durante
      // los 3,6s de la linea de tiempo. Eso es el "se queda congelado al
      // volver al inicio".
      decision = false;
      // La marca va aca y no al arrancar: quien recarga a mitad de la entrada
      // nunca llego a ver el sitio, y merece verla otra vez.
      try {
        sessionStorage.setItem(CLAVE, "1");
      } catch {
        // Sin storage la entrada se repite en cada carga. Degradacion
        // aceptable, ya contemplada en leerDebeMostrar.
      }
      const lenis = lenisActual();
      lenis?.start();
      // Volver arriba solo si la entrada corrio de verdad. Si ya salto el
      // failsafe inline, el visitante pudo haber scrolleado: no tironearlo.
      if (!window.__trevooFailsafe) {
        window.scrollTo(0, 0);
        lenis?.scrollTo(0, { immediate: true });
      }
      setTerminada(true);
    }

    function cuadro(ahora: number) {
      try {
        // El failsafe inline gano la carrera (bundle lento): soltar y entrar.
        if (window.__trevooFailsafe) {
          terminar();
          return;
        }
        const t = ahora - inicio;
        aplicar(Math.min(t, TOTAL));
        if (t >= TOTAL) {
          terminar();
          return;
        }
        raf = requestAnimationFrame(cuadro);
      } catch {
        // Un cuadro que tira no puede dejar el overlay puesto: cerrar y entrar.
        terminar();
      }
    }

    /** Salida de emergencia: Escape o un click cortan y entran al sitio. */
    const alSaltar = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      terminar();
    };

    window.addEventListener("keydown", alSaltar);
    raiz.addEventListener("click", alSaltar);

    aplicar(0);
    raf = requestAnimationFrame(cuadro);

    return () => {
      cancelAnimationFrame(arranque);
      cancelAnimationFrame(raf);
      window.clearTimeout(parada);
      window.removeEventListener("keydown", alSaltar);
      raiz.removeEventListener("click", alSaltar);
      html.classList.remove(CLASE_BLOQUEO, CLASE_CORRIENDO);
      lenisActual()?.start();
    };
  }, [debeMostrar]);

  return (
    <>
      {/*
        Corre en el parseo, antes de que se pinte la entrada y sin depender del
        bundle. Hace tres cosas:

        1. Marca `html.js`. El CSS usa `html:not(.js)` para no renderizar
           siquiera el overlay cuando no hay JavaScript: sin esto la pagina
           seria una pantalla negra para un browser con JS apagado.
        2. Si la entrada ya se vio en esta pestaña, esconde el overlay de una
           (evita el parpadeo negro del que vuelve al home antes de que monte
           React).
        3. Failsafe: si a los FAILSAFE ms el overlay sigue en el DOM, el bundle
           no hidrato (chunk que no baja, error de runtime, browser viejo).
           Saca el bloqueo de scroll a mano y revela el contenido que espera al
           IntersectionObserver. Esto es lo que evita el "todo negro" de mobile.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            `(function(){var h=document.documentElement;` +
            `h.classList.add(${JSON.stringify(CLASE_JS)});` +
            `try{if(sessionStorage.getItem(${JSON.stringify(CLAVE)})==="1")` +
            `h.classList.add(${JSON.stringify(CLASE_VISTO)})}catch(e){}` +
            `setTimeout(function(){` +
            `if(!document.querySelector("[data-preloader]"))return;` +
            `window.__trevooFailsafe=1;` +
            `h.classList.remove(${JSON.stringify(CLASE_BLOQUEO)},${JSON.stringify(
              CLASE_CORRIENDO,
            )},${JSON.stringify(CLASE_LENIS_STOP)});` +
            `h.classList.add(${JSON.stringify(CLASE_VISTO)});` +
            `var r=document.querySelectorAll("[data-revelar]"),i=0;` +
            `for(;i<r.length;i++)r[i].setAttribute("data-visible","")` +
            `},${FAILSAFE})})();`,
        }}
      />
      {debeMostrar && !terminada && (
        <div
          ref={raizRef}
          data-preloader
          aria-hidden="true"
          className="fixed inset-0 z-[100] grid place-items-center bg-bg text-text"
        >
          <div ref={lienzoRef} data-pre-lienzo>
            {/* REVOO: se escribe letra por letra y despues se va como grupo. */}
            <div data-pre-revoo>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  data-pre-letra
                  style={
                    {
                      ...caja(i),
                      "--pre-retardo": `${i * RETARDO_LETRA}ms`,
                    } as unknown as React.CSSProperties
                  }
                >
                  <Logotipo desde={i} hasta={i} className="h-full w-auto" />
                </span>
              ))}

              {/* El cursor, apenas a la derecha de la ultima letra. */}
              <span
                data-pre-cursor
                style={{ left: `${((LETRAS[5][1] + 14) / LOGOTIPO.w) * 100}%` }}
              />
            </div>

            {/*
              La T y el isotipo, apilados y centrados en el mismo punto: esta es
              la caja que gira, se asienta y despues vuela a la esquina.
            */}
            <div data-pre-pieza style={caja(0)}>
              <span
                data-pre-letra
                style={
                  {
                    left: 0,
                    width: "100%",
                    "--pre-retardo": "0ms",
                  } as unknown as React.CSSProperties
                }
              >
                <Logotipo desde={0} hasta={0} data-pre-t className="h-full w-auto" />
              </span>

              <Isotipo ref={isoRef} data-pre-iso />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

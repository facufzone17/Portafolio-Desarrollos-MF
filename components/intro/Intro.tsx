"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Cintas } from "@/components/intro/Cintas";
import { Logo } from "@/components/ui/Logo";
import { lenisActual } from "@/lib/useLenis";

/**
 * Pantalla de entrada.
 *
 * Al abrir el portafolio no se cae directo en el hero: primero hay una
 * pantalla crema con el monograma MF en el centro. Al scrollear, la camara
 * entra al negro macizo que hay entre los dos trazos del logo hasta que ese
 * negro es toda la pantalla, y ahi la pantalla se abre en dos — el borde de
 * arriba sube, el de abajo baja — y aparece el hero.
 *
 * El scroll dispara y despues no hace falta seguir moviendo nada: la secuencia
 * corre sola por reloj, en cuatro tiempos — la camara sale del reposo y entra
 * al negro, el negro termina de cerrarse, la pantalla se queda quieta medio
 * segundo, y recien ahi se abre.
 *
 * Cuatro decisiones que explican como esta armado:
 *
 * 1. La pantalla se construye desde el primer cuadro como DOS MITADES, cada
 *    una recortando su copia del mismo escenario del tamaño exacto del
 *    viewport (una anclada arriba, la otra abajo). Mientras estan juntas se
 *    ven como una sola pantalla; cuando se separan, la costura aparece sola.
 *    Armarlo recien al final obligaria a duplicar el render a mitad de la
 *    animacion, justo en el cuadro que tiene que ser perfecto.
 *
 * 2. El punto de zoom no es el centro geometrico del logo. Sobre el viewBox
 *    917x964, el centro exacto cae a 12 unidades de un borde y al escalar se
 *    colaria crema por la derecha. El negro macizo con margen en las cuatro
 *    direcciones esta en (350, 552) — de ahi el 38% / 57% del CSS.
 *
 * 3. El tiempo lo lleva el reloj, no el contador de cuadros. Un lerp por
 *    cuadro ata la duracion al refresco de la pantalla: la misma animacion
 *    duraria la mitad en un monitor de 144Hz.
 *
 * 4. Nada de `will-change` adentro de las mitades. Promueve el elemento a su
 *    propia capa y se escapa del `overflow: hidden` que las recorta, que es
 *    justamente lo que hace posible la apertura (ya nos costo una hora de
 *    diagnostico en la palabra rotativa del hero).
 */

/** Marca de "ya la vio" en esta pestaña. */
const CLAVE = "mf-intro-vista";

/** Clase que pone el script inline cuando la intro ya se vio. */
const CLASE_VISTA = "intro-vista";

/** Clase que bloquea el scroll de la pagina mientras la intro corre. */
const CLASE_BLOQUEO = "intro-bloqueada";

/**
 * Cuanto dura la entrada, de punta a punta.
 *
 * El scroll es el gatillo, no el volante: una vez disparada, la secuencia
 * corre por tiempo. Atarla al scroll obliga a seguir moviendo la rueda para
 * que la animacion avance, y lo que se pidio es poder mirarla.
 *
 * 2,8 segundos es lo que tarda en leerse como movimiento y no como un corte.
 */
const DURACION = 2800;

/** Px de scroll acumulado que disparan la secuencia. */
const UMBRAL = 40;

/*
 * No hay forma de saltearla. Antes un click, Escape, Tab o Enter la cortaban;
 * ahora la unica manera de pasar es scrollear y mirarla hasta el final. El
 * scroll sigue siendo solo el gatillo: una vez disparada corre sola, asi que
 * "mirarla" no cuesta mas que soltar la rueda. Las teclas de scroll
 * (ArrowDown, PageDown, espacio) disparan igual que la rueda, para que quien
 * navega con teclado no quede encerrado.
 */

/**
 * Cuanto tarda cada cinta de iconos en dar una vuelta completa, en ms.
 *
 * Son cuatro numeros distintos y sin multiplos entre si a proposito: con el
 * mismo periodo las cuatro vuelven a coincidir todo el tiempo y el conjunto se
 * lee como un unico bloque deslizando. Cada una ademas va al reves de la de al
 * lado.
 *
 * Las cintas corren desde el primer cuadro, antes del disparo: la pantalla de
 * espera tiene que estar viva mientras el logo espera el scroll.
 */
const PERIODOS = { a: 15000, b: 20500, c: 26000, d: 33000 };

/**
 * Progreso en el que las cintas terminan de apagarse.
 *
 * Viven en la espera: mientras el logo espera el scroll son lo unico que se
 * mueve. En cuanto la camara arranca sobran — quedarse quietas mientras el
 * monograma se viene encima delata que son un fondo pegado, y ademas le roban
 * el ojo al unico movimiento que importa ahi.
 */
const FIN_CINTAS = 0.22;

/** Progreso en el que el zoom llega a su escala maxima. */
const FIN_ZOOM = 0.6;

/** Exponente del zoom: la escala va de 1 a 2^EXPONENTE_ZOOM. */
const EXPONENTE_ZOOM = 5.9;

/** Ventana en la que entra el velo negro que remata el llenado. */
const VELO_DESDE = 0.44;
const VELO_HASTA = 0.62;

/**
 * Progreso en el que la pantalla — ya negra — empieza a abrirse.
 *
 * Medido en vivo, el negro se completa cerca de la mitad del recorrido: entre
 * la geometria del logo y el velo no queda crema pasado el 0,50. Eso deja
 * medio segundo de pantalla quieta antes de la apertura, y esa quietud es lo
 * que hace que abrirse se lea como un segundo tiempo y no como la inercia del
 * zoom. El resto — casi novecientos milisegundos — es la apertura sola: es el
 * momento que se mira, y es el que mas tiempo se lleva.
 */
const APERTURA = 0.68;

const recortar = (v: number) => Math.min(1, Math.max(0, v));

/** easeInOutCubic: la apertura arranca contenida y termina soltando. */
const suavizar = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * smoothstep sobre el exponente del zoom.
 *
 * Sin esto la camara arranca a velocidad de crucero desde el cuadro cero, que
 * es exactamente la sensacion de corte. Con esto sale del reposo.
 */
const entradaCamara = (t: number) => t * t * (3 - 2 * t);

/**
 * Si la intro va o no, resuelto en el render y no en un efecto.
 *
 * Es la misma forma que useMovimientoReducido: sessionStorage y matchMedia son
 * estado que vive fuera de React, y leerlos con useSyncExternalStore evita el
 * render intermedio con el valor equivocado. En el servidor no hay forma de
 * saberlo, asi que se asume que si — el HTML sale con la intro puesta y quien
 * ya la vio la tiene escondida por CSS desde antes del primer pintado.
 */
function noSuscribir() {
  return () => {};
}

/**
 * La decision se toma una sola vez por carga y despues queda congelada.
 *
 * useSyncExternalStore exige que getSnapshot devuelva siempre lo mismo
 * mientras no avise la suscripcion, y aca no da igual: al terminar, la intro
 * escribe la marca en sessionStorage, y si el snapshot se recalculara pasaria
 * de true a false en pleno render. Sin este cache, el primer render posterior
 * a la hidratacion desmonta la intro antes de que llegue a verse.
 */
let decision: boolean | null = null;

function leerDebeMostrar(): boolean {
  if (decision !== null) return decision;
  let vista = false;
  try {
    vista = sessionStorage.getItem(CLAVE) === "1";
  } catch {
    // Modo privado o storage bloqueado: la intro se vuelve a ver, nada mas.
  }
  decision =
    !vista && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return decision;
}

export function Intro() {
  const debeMostrar = useSyncExternalStore(
    noSuscribir,
    leerDebeMostrar,
    () => true,
  );
  const [terminada, setTerminada] = useState(false);
  const raizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;

    const html = document.documentElement;

    // La pagina existe debajo, pero no se toca hasta que la intro termine.
    html.classList.add(CLASE_BLOQUEO);
    window.scrollTo(0, 0);
    lenisActual()?.stop();

    let inicio = 0;
    const montaje = performance.now();
    let acumulado = 0;
    let raf = 0;
    let terminado = false;

    /**
     * Todo el estado del cuadro viaja en custom properties heredadas. Una sola
     * escritura al nodo raiz mueve las dos mitades, las dos copias del logo y
     * los dos velos — sin un render de React por cuadro ni seis refs que
     * mantener sincronizados.
     */
    function aplicar(p: number) {
      const escala = Math.pow(
        2,
        entradaCamara(recortar(p / FIN_ZOOM)) * EXPONENTE_ZOOM,
      );
      const velo = recortar((p - VELO_DESDE) / (VELO_HASTA - VELO_DESDE));
      const abrir = suavizar(recortar((p - APERTURA) / (1 - APERTURA)));
      const estilo = raiz!.style;

      estilo.setProperty("--intro-escala", escala.toFixed(3));
      estilo.setProperty(
        "--intro-cintas-op",
        (1 - recortar(p / FIN_CINTAS)).toFixed(3),
      );
      estilo.setProperty("--intro-velo", velo.toFixed(3));
      estilo.setProperty("--intro-abrir", abrir.toFixed(4));
      // El fondo negro detras de las mitades solo tapa la costura de medio
      // pixel mientras estan juntas. En cuanto se abren tiene que irse, o
      // oscureceria el hero que aparece por el medio.
      estilo.setProperty("--intro-fondo", abrir > 0 ? "0" : velo.toFixed(3));
    }

    /**
     * Las cuatro cintas, en su propio reloj: 0 -> 1 en bucle, independiente del
     * progreso de la intro. El mapeo a transform vive en globals.css.
     */
    function moverCintas(ahora: number) {
      const t = ahora - montaje;
      const estilo = raiz!.style;
      for (const [cinta, periodo] of Object.entries(PERIODOS)) {
        estilo.setProperty(
          `--intro-cinta-${cinta}`,
          ((t % periodo) / periodo).toFixed(4),
        );
      }
    }

    function terminar() {
      if (terminado) return;
      terminado = true;
      cancelAnimationFrame(raf);
      html.classList.remove(CLASE_BLOQUEO);
      html.classList.add(CLASE_VISTA);
      // La marca va aca y no al arrancar: quien recarga a mitad de la intro
      // nunca llego a entrar al sitio, y merece verla otra vez.
      try {
        sessionStorage.setItem(CLAVE, "1");
      } catch {
        // Sin storage la intro se repite en cada carga. Es la degradacion
        // aceptable; ya esta contemplado en leerDebeMostrar.
      }
      window.scrollTo(0, 0);
      const lenis = lenisActual();
      lenis?.start();
      lenis?.scrollTo(0, { immediate: true });
      setTerminada(true);
    }

    function cuadro(ahora: number) {
      // Antes del disparo la pantalla esta quieta: el logo espera.
      const p = inicio ? recortar((ahora - inicio) / DURACION) : 0;
      moverCintas(ahora);
      aplicar(p);
      if (p >= 1) {
        terminar();
        return;
      }
      raf = requestAnimationFrame(cuadro);
    }

    function disparar() {
      if (!inicio) inicio = performance.now();
    }

    function avanzar(delta: number) {
      acumulado = Math.max(0, acumulado + delta);
      if (acumulado >= UMBRAL) disparar();
    }

    const alRodar = (e: WheelEvent) => {
      e.preventDefault();
      avanzar(e.deltaY);
    };

    let ultimoY = 0;
    const alTocar = (e: TouchEvent) => {
      ultimoY = e.touches[0]?.clientY ?? 0;
    };
    const alArrastrar = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0]?.clientY ?? ultimoY;
      avanzar(ultimoY - y);
      ultimoY = y;
    };

    const alTeclear = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key)) {
        e.preventDefault();
        avanzar(120);
      }
    };

    window.addEventListener("wheel", alRodar, { passive: false });
    window.addEventListener("touchstart", alTocar, { passive: true });
    window.addEventListener("touchmove", alArrastrar, { passive: false });
    window.addEventListener("keydown", alTeclear);

    aplicar(0);
    raf = requestAnimationFrame(cuadro);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", alRodar);
      window.removeEventListener("touchstart", alTocar);
      window.removeEventListener("touchmove", alArrastrar);
      window.removeEventListener("keydown", alTeclear);
      html.classList.remove(CLASE_BLOQUEO);
      lenisActual()?.start();
    };
  }, [debeMostrar]);

  return (
    <>
      {/*
        Corre antes de que la intro se pinte: si ya se vio en esta pestaña,
        marca el <html> y el CSS la esconde de entrada. Sin esto, el que vuelve
        al home ve un parpadeo de pantalla crema antes de que React monte.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem(${JSON.stringify(
            CLAVE,
          )})==="1")document.documentElement.classList.add(${JSON.stringify(
            CLASE_VISTA,
          )})}catch(e){}`,
        }}
      />
      {debeMostrar && !terminada && (
        <div
          ref={raizRef}
          data-intro
          aria-hidden="true"
          className="fixed inset-0 z-[100] overflow-hidden"
        >
          {/* Tapa la costura de medio pixel entre las dos mitades. */}
          <div data-intro-fondo className="absolute inset-0 bg-text" />

          <div
            data-intro-mitad="arriba"
            className="absolute inset-x-0 top-0 h-1/2 overflow-hidden"
          >
            <Escenario className="absolute inset-x-0 top-0 h-[200%]" />
          </div>

          <div
            data-intro-mitad="abajo"
            className="absolute inset-x-0 top-1/2 h-1/2 overflow-hidden"
          >
            <Escenario className="absolute inset-x-0 bottom-0 h-[200%]" />
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Una pantalla entera de la intro: crema, logo y velo.
 *
 * Se renderiza dos veces, identica, una por mitad. Como cada copia mide
 * exactamente el viewport y esta anclada al borde que le toca, las dos juntas
 * reconstruyen una sola imagen continua.
 */
function Escenario({ className }: { className: string }) {
  return (
    <div className={`${className} flex items-center justify-center bg-bg`}>
      {/* Antes del logo: las cintas quedan detras del monograma, no encima. */}
      <Cintas />

      <div data-intro-logo className="relative z-[1] inline-flex text-text">
        <Logo className="h-[clamp(150px,32vmin,340px)] w-auto" />
      </div>

      <div data-intro-velo className="absolute inset-0 bg-text" />
    </div>
  );
}

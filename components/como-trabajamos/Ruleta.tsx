"use client";

import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { etapas } from "@/lib/comoTrabajamos";

/**
 * Las cinco etapas montadas sobre dos arcos que giran con el scroll.
 *
 * A la IZQUIERDA los titulos, a la DERECHA la tarjeta con el contenido. Cada
 * columna es un circulo distinto cuyo centro cae fuera de pantalla, uno de cada
 * lado: el punto de foco de la izquierda es el extremo derecho de su circulo y
 * el de la derecha el extremo izquierdo del suyo. Por eso las dos columnas
 * giran en sentidos opuestos y las piezas entran desde los bordes y convergen
 * al centro. Es una sola figura partida al medio, no dos carruseles.
 *
 * OJO: esto fija la seccion a pantalla mientras pasan las cinco etapas, igual
 * que la pista de proyectos, y el §3.5 del brief pide que el scroll sea siempre
 * el del navegador. Lo sigue siendo — la rueda nunca deja de mandar ni se le
 * cambia la velocidad —, pero la seccion queda quieta mientras dura su propio
 * recorrido. Es la misma deuda que ya tiene `ProyectosPista`.
 *
 * PASA DE TARJETA, NO SE QUEDA EN EL MEDIO. El paso entre etapa y etapa no es
 * lineal: cada tramo de scroll arranca y termina con la tarjeta parada en su
 * lugar (los dos extremos del tramo son mesetas) y el viaje ocurre en el medio.
 * Al soltar la rueda en cualquier punto lo mas probable es quedar sobre una
 * etapa entera y no a mitad de camino. Se hace asi y no con `scroll-snap` ni
 * con un `scrollTo` al terminar el gesto porque las dos cosas pelean con Lenis,
 * que ya mueve el scroll a mano cuadro a cuadro (ver lib/useLenis.ts).
 *
 * No hay render de React por cuadro: el efecto escribe `translate`, `scale`,
 * `opacity` y `filter` directo sobre los nodos.
 *
 * Este componente NO se monta en mobile/tablet ni con prefers-reduced-motion:
 * ahi va el camino apilado de `Camino.tsx`, que es scroll nativo.
 */

const N = etapas.length;

/** Cuanto scroll (en vh) cuesta pasar de una etapa a la siguiente. */
const PASO_VH = 70;
/** Aire antes de que la primera etapa empiece a moverse. */
const ENTRADA_VH = 25;
/** Aire despues de la ultima, para que no se vaya en el mismo pixel que llega. */
const COLA_VH = 35;
const RECORRIDO_VH = (N - 1) * PASO_VH + ENTRADA_VH + COLA_VH;

/**
 * Fraccion de cada paso en la que la tarjeta esta QUIETA, repartida mitad al
 * principio y mitad al final. Con 0,46 el 23% inicial y el 23% final del tramo
 * son meseta pura y el viaje se hace en el 54% del medio.
 */
const MESETA = 0.46;

/** Angulo entre etapa y etapa. Fija la curvatura: dx/dy = tan(angulo/2). */
const ANGULO = 0.46;
/**
 * UN radio para las dos columnas, y no uno por columna: el radio es lo que fija
 * la separacion vertical, asi que con radios distintos el titulo de una etapa y
 * su tarjeta quedan a alturas distintas y dejan de leerse como un par. Lo unico
 * que se espeja es la x.
 */
const RADIO = 660;

function limitar(v: number, min: number, max: number): number {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

/**
 * Progreso continuo -> progreso escalonado. Ver el parrafo de "pasa de
 * tarjeta" arriba. La curva del tramo es smootherstep: velocidad Y aceleracion
 * cero en los dos extremos, que es lo que alarga la sensacion de meseta mas
 * alla de la meseta real.
 */
function escalonar(v: number): number {
  const entero = Math.floor(v);
  const t = v - entero;
  const u = limitar((t - MESETA / 2) / (1 - MESETA), 0, 1);
  return entero + u * u * u * (u * (u * 6 - 15) + 10);
}

export function Ruleta() {
  const seccionRef = useRef<HTMLDivElement>(null);
  const titulosRef = useRef<(HTMLDivElement | null)[]>([]);
  const tarjetasRef = useRef<(HTMLDivElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    target: seccionRef,
    offset: ["start start", "end end"],
  });

  function pintar(p: number) {
    // p (0..1 sobre el recorrido del pin) -> posicion continua entre etapas.
    const crudo = (p * RECORRIDO_VH - ENTRADA_VH) / PASO_VH;
    const pos = escalonar(limitar(crudo, 0, N - 1));

    for (let i = 0; i < N; i++) {
      const angulo = (i - pos) * ANGULO;
      const cos = Math.cos(angulo);
      const sen = Math.sin(angulo);

      // 1 en foco, 0 cuando la etapa ya salio del arco util. El corte en 0,34
      // deja dos vecinas a cada lado y apaga del todo la tercera.
      const foco = Math.max(0, (cos - 0.34) / 0.66);
      // Curva dura: sin esto la vecina inmediata compite con la enfocada.
      const nitidez = foco * foco * foco;

      const opacidad = (0.08 + 0.92 * nitidez).toFixed(3);
      const z = String(1 + Math.round(nitidez * 20));

      const titulo = titulosRef.current[i];
      if (titulo) {
        // Centro del circulo a la izquierda: el foco es su extremo derecho, o
        // sea x = 0, y todo lo demas queda a la izquierda.
        const x = RADIO * (cos - 1);
        const y = RADIO * sen;
        titulo.style.translate = `calc(-50% + ${x.toFixed(1)}px) calc(-50% + ${y.toFixed(1)}px)`;
        titulo.style.scale = (0.62 + 0.38 * nitidez).toFixed(3);
        titulo.style.opacity = opacidad;
        titulo.style.filter = `blur(${((1 - nitidez) * 5).toFixed(1)}px)`;
        titulo.style.zIndex = z;
      }

      const tarjeta = tarjetasRef.current[i];
      if (tarjeta) {
        // Espejo del anterior: centro a la derecha, foco en su extremo izquierdo.
        const x = -RADIO * (cos - 1);
        const y = RADIO * sen;
        tarjeta.style.translate = `calc(-50% + ${x.toFixed(1)}px) calc(-50% + ${y.toFixed(1)}px)`;
        tarjeta.style.scale = (0.8 + 0.2 * nitidez).toFixed(3);
        tarjeta.style.opacity = opacidad;
        tarjeta.style.filter = `blur(${((1 - nitidez) * 6).toFixed(1)}px)`;
        tarjeta.style.zIndex = z;
      }
    }
  }

  // Primer cuadro. Si se entra a la pagina con el scroll ya dentro de la
  // seccion (recarga, ancla), `change` no dispara hasta que alguien mueva algo.
  useEffect(() => {
    pintar(scrollYProgress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(scrollYProgress, "change", pintar);

  return (
    <div ref={seccionRef} style={{ height: `calc(100vh + ${RECORRIDO_VH}vh)` }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/*
          El encabezado va DENTRO del pin, igual que en la pista de proyectos:
          si fuera antes de la seccion se iria de pantalla en el primer pixel y
          las cinco etapas pasarian sin nombre. Va solo el titulo — la bajada no
          entra sin comerse el alto que necesitan las tarjetas.
        */}
        <div className="shrink-0 pt-28">
          <div className="mx-auto max-w-[1400px] px-5 text-center sm:px-8">
            <h2 className="text-[clamp(2rem,4.6vw,3.5rem)]">Cómo trabajamos</h2>
          </div>
        </div>

        {/*
          El escenario se recorta a si mismo con una mascara, no con
          `overflow: hidden`. Las etapas vecinas llegan mucho mas arriba y mas
          abajo que su caja: sin esto la de arriba se sube encima del titulo de
          la seccion y hasta de la barra de navegacion (tienen z-index propio),
          y con un recorte duro se cortarian de un hachazo a media palabra. El
          degradado las apaga antes de que lleguen al filo.
        */}
        <div
          className="relative mx-auto w-full max-w-[1400px] flex-1 px-5 sm:px-8"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
          }}
        >
          <ol className="absolute inset-0">
            {etapas.map((etapa, i) => (
              <li key={etapa.numero} className="absolute inset-0">
                {/*
                  Sin clases `translate-*` de Tailwind en estos dos nodos: en v4
                  escriben la propiedad `translate`, la misma que usa la
                  animacion. El centrado va dentro del calc() que escribe el JS.
                */}
                {/*
                  El titulo va alineado a la derecha y la tarjeta empieza justo
                  despues: los dos filos que se miran quedan a un canal de
                  distancia y el par se lee como una sola linea partida. Con el
                  titulo centrado en su mitad quedaba un hueco muerto en el
                  medio de la pantalla.
                */}
                <h3
                  ref={(n) => {
                    titulosRef.current[i] = n;
                  }}
                  className="absolute left-[25%] top-1/2 w-[40%] text-right text-[clamp(1.5rem,2.6vw,2.6rem)] opacity-0"
                >
                  {etapa.titulo}
                </h3>

                <div
                  ref={(n) => {
                    tarjetasRef.current[i] = n;
                  }}
                  className="absolute left-[72%] top-1/2 w-[44%] max-w-[520px] opacity-0"
                >
                  <div className="rounded-card border border-line-alto bg-bg-elev p-6 sm:p-8">
                    <p className="text-[17px] font-light leading-relaxed text-text-muted">
                      {etapa.texto}
                    </p>
                    <p className="mt-5 border-t border-line pt-4 text-sm text-text-muted">
                      <span className="text-text">Qué necesitamos de vos: </span>
                      {etapa.necesitamos}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

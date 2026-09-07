"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
 * EL AVANCE ES LINEAL, no escalonado. La primera version metia una meseta en
 * cada punta del tramo para que al soltar la rueda quedaras siempre sobre una
 * etapa entera. Se saco (pedido de Facundo, 07/09/2026): esas mesetas son
 * tramos donde la pagina sigue scrolleando y en pantalla no se mueve nada, y
 * eso se siente como si el scroll de toda la pagina se trabara. Ahora el
 * angulo sigue al scroll uno a uno y lo suaviza Lenis, que es como funciona el
 * componente original.
 *
 * No hay render de React por cuadro: el efecto escribe `translate`, `scale`,
 * `opacity`, `filter` y `rotate` directo sobre los nodos.
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

export function Ruleta() {
  const seccionRef = useRef<HTMLDivElement>(null);
  const ruedaRef = useRef<HTMLDivElement>(null);
  const titulosRef = useRef<(HTMLDivElement | null)[]>([]);
  const tarjetasRef = useRef<(HTMLDivElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    target: seccionRef,
    offset: ["start start", "end end"],
  });

  function pintar(p: number) {
    // p (0..1 sobre el recorrido del pin) -> posicion continua entre etapas.
    const pos = limitar((p * RECORRIDO_VH - ENTRADA_VH) / PASO_VH, 0, N - 1);

    // La rueda gira lo mismo que avanzan las etapas: es la misma pieza. Va en
    // grados porque `rotate` de CSS no entiende radianes.
    const rueda = ruedaRef.current;
    if (rueda) {
      rueda.style.rotate = `${((-pos * ANGULO * 180) / Math.PI).toFixed(2)}deg`;
    }

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
        {/*
          El escenario ocupa el ANCHO COMPLETO y el limite de 1400px se lo pone
          la lista de adentro. La rueda tiene que salirse por el borde de la
          pantalla, no por el del contenedor: si viviera dentro de los 1400px,
          en un monitor ancho quedaria una franja negra a su izquierda y el
          disco se leeria como un circulo flotando, no como una rueda que entra
          desde afuera.
        */}
        <div
          className="relative w-full flex-1"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
          }}
        >
          {/*
            Rueda y aguja van en un contenedor con las MISMAS medidas que la
            lista de etapas (mx-auto max-w-1400 + padding). Si se posicionaran
            sobre el ancho completo, arriba de 1400px de ventana la aguja se
            despegaria del titulo: los titulos se corren con el contenedor y
            ella no. Asi la distancia aguja->primera letra es la misma en toda
            ventana.

            Este contenedor NO lleva mascara ni `overflow`, a proposito: el
            disco tiene que poder pintarse fuera de el y salirse por el borde
            de la pantalla. El unico que recorta es el div de afuera, que ocupa
            el ancho completo (`mask-clip` es `border-box`, o sea que la
            mascara TAMBIEN recorta: por eso el escenario no puede estar
            limitado a 1400px).
          */}
          <div className="pointer-events-none absolute inset-0 mx-auto max-w-[1400px] px-5 sm:px-8">
          {/*
            La rueda. Un disco enorme del que solo se ve el filo derecho: el
            resto se va por el costado izquierdo y lo recorta el `overflow` del
            pin. Gira exactamente lo que avanzan las etapas (ANGULO por etapa),
            asi que es la pieza que las mueve y no un adorno que gira al lado.

            Va rellena con la MISMA imagen del hero, que es de donde sale el
            azul. No es un degradado inventado: es la unica superficie azul que
            tiene la pagina, y el disco la trae de vuelta una vez mas.

            El velo encima no es cosmetico: esa imagen tiene zonas claras y el
            titulo enfocado le pasa por arriba con texto blanco. El hero lleva
            su propio velo por la misma razon.
          */}
          <div
            ref={ruedaRef}
            aria-hidden
            className="absolute left-[13.5%] top-1/2 z-0 size-[1320px] overflow-hidden rounded-full"
            // `translate` y `rotate` son propiedades separadas y se aplican en
            // ese orden: primero se coloca el disco (su filo derecho queda en
            // el 13,5% del contenedor) y despues gira sobre su propio centro.
            style={{ translate: "-100% -50%" }}
          >
            <Image
              src="/images/hero-bg.jpg"
              alt=""
              fill
              // 750px para un disco de 1320: la textura es suave y va debajo de
              // un velo, asi que el reescalado no se ve y baja ~5x el peso.
              sizes="700px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[rgba(6,7,12,0.45)]" />
          </div>

          {/*
            La aguja. Marca cual de los cinco titulos hay que leer: sin esto la
            unica pista es que uno esta mas nitido que el resto, y en el medio
            de un tramo hay dos a media nitidez y no se entiende cual manda.

            NO va adentro del disco, va al lado: si fuera hija de la rueda
            giraria con ella y solo apuntaria al titulo correcto en un unico
            momento. Es fija, como la aguja de una ruleta de feria — se queda
            en el vertice y la rueda pasa por debajo.

            Ese vertice es el punto mas a la derecha del disco, que cae a la
            misma altura que el titulo enfocado porque los dos estan en el
            centro vertical del escenario. De ahi que apunte siempre bien sin
            que nadie calcule nada.
          */}
          <svg
            aria-hidden
            viewBox="0 0 13 22"
            fill="currentColor"
            // 30px de alto contra un titulo de ~37px. A 22 se leia como una
            // viñeta de lista pegada a la palabra, no como una aguja.
            className="absolute left-[13.5%] top-1/2 z-0 h-[30px] w-[18px] text-text"
            style={{ translate: "-100% -50%" }}
          >
            <path d="M0 0 L13 11 L0 22 Z" />
          </svg>
          </div>

          <ol className="absolute inset-0 mx-auto max-w-[1400px] px-5 sm:px-8">
            {etapas.map((etapa, i) => (
              <li key={etapa.numero} className="absolute inset-0">
                {/*
                  Sin clases `translate-*` de Tailwind en estos dos nodos: en v4
                  escriben la propiedad `translate`, la misma que usa la
                  animacion. El centrado va dentro del calc() que escribe el JS.
                */}
                {/*
                  Alineado a la IZQUIERDA, y eso cambio cuando entro la aguja.
                  Antes iba a la derecha, para que su filo quedara a un canal de
                  la tarjeta y el par se leyera como una linea partida. Pero con
                  el titulo a la derecha la primera letra se mueve segun el
                  largo del texto, y la aguja —que es fija— quedaba a 35px de
                  "Diseñar propuesta a medida" y a 330px de "Entrega": ahi ya
                  no se entiende que esta senalando. A la izquierda todos los
                  titulos arrancan en la misma linea. El costo es un hueco mas
                  grande entre los titulos cortos y su tarjeta, que se nota
                  mucho menos que una flecha flotando en el aire.
                */}
                <h3
                  ref={(n) => {
                    titulosRef.current[i] = n;
                  }}
                  className="absolute left-[34%] top-1/2 w-[36%] text-left text-[clamp(1.5rem,2.6vw,2.6rem)] opacity-0"
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

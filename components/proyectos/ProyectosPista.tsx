"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { proyectos } from "@/lib/proyectos";
import { CintasTransicion } from "./CintasTransicion";
import { TarjetaProyecto } from "./TarjetaProyecto";

/**
 * Vitrina de proyectos en scroll horizontal (escritorio, con movimiento
 * permitido), y la transicion que la entrega a "Que hacemos".
 *
 * Al llegar a esta seccion, el scroll vertical de la pagina la fija a pantalla
 * completa y hace avanzar las piezas hacia la derecha. Cuando se termina la
 * tira, el panel NO se suelta enseguida: sigue fijo y se retrae —se achica, se
 * le redondean las esquinas y aparece una sombra— hasta quedar como una
 * ventana flotando sobre la piedra del tramo siguiente. Eso deja a la vista una
 * franja a cada lado por la que entran las hileras de iconos
 * (`CintasTransicion`), y recien ahi el pin se suelta y la ventana se va
 * scrolleando hacia arriba con el resto de la pagina.
 *
 * El efecto es el de landonorris.com: lo que se estaba mirando se congela y
 * pasa a ser una capa de atras, mientras el scroll sigue en la pagina que
 * estaba arriba. Aca lo que se retrae es el panel entero de proyectos, con su
 * crema incluido: por eso lee como "la pagina" y no como un recuadro mas.
 *
 * OJO: esto es scroll-jacking, exactamente lo que el §3.5 del brief prohibe
 * ("el scroll siempre es el del navegador"). Se hace por pedido explicito de
 * Facundo, igual que Lenis (ver lib/useLenis.ts): la regla del brief queda
 * contradicha a proposito y alguien tiene que elegir conscientemente cual gana.
 *
 * En mobile/tablet y con prefers-reduced-motion este componente NO se monta:
 * ahi va `ProyectosApilado`, que es scroll nativo y del todo accesible.
 *
 * La distancia del pin sale de medir el ancho real de la tira: 1px de scroll
 * vertical = 1px de avance horizontal, asi el gesto se siente parejo con la
 * inercia de Lenis. El alto de la seccion se ajusta a esa medida (no es un
 * `300vh` inventado que quede corto o sobre con 3 piezas o con 6).
 */

/**
 * Cuanto scroll dura la retraccion, en pantallas.
 *
 * 0,9 de pantalla: con menos se siente como un tiron, con mas el visitante
 * scrollea un rato mirando algo que ya termino de moverse.
 */
const RETRACCION_VH = 0.9;

/**
 * A cuanto se achica el panel.
 *
 * 0,76 deja 12% de pantalla libre a cada lado y 12% arriba y abajo. Es lo que
 * hace que la ventana se lea como una ventana y no como la pagina con un
 * marco: con menos aire, el fondo de piedra no llega a existir.
 */
const ESCALA = 0.76;

/**
 * Las cuatro filas de iconos: dos arriba y dos abajo, cada par corriendo en
 * sentidos opuestos.
 *
 * Las alturas estan elegidas para que las cuatro caigan dentro del alto de la
 * ventana retraida (que va del 12% al 88% de la pantalla): asi cada fila entra
 * por un costado, pasa por atras del panel y sale por el otro. Una fila que
 * cayera afuera se veria entera y perderia justamente eso.
 *
 * Los tiempos son todos distintos y no redondos: con dos filas al mismo ritmo,
 * el ojo las lee como un solo bloque.
 */
const FILAS = [
  { altura: "23%", arriba: true, lado: "izquierda", desde: 0, segundos: 26 },
  { altura: "36%", arriba: true, lado: "derecha", desde: 2, segundos: 33 },
  { altura: "65%", arriba: false, lado: "izquierda", desde: 1, segundos: 30 },
  { altura: "77%", arriba: false, lado: "derecha", desde: 3, segundos: 23 },
] as const;

export function ProyectosPista() {
  const seccionRef = useRef<HTMLDivElement>(null);
  const tiraRef = useRef<HTMLOListElement>(null);

  // px horizontales por recorrer = lo que la tira sobresale del viewport. Se
  // mide al montar. Arranca en 0 (igual en servidor y en cliente, si no hay
  // desajuste de hidratacion): hasta que se mide, el alto lo pone la clase
  // `min-h-[240vh]`, una estimacion para que el resto de la pagina no pegue un
  // salto grande cuando entra la medida real.
  const [recorrido, setRecorrido] = useState(0);
  const [alto, setAlto] = useState(0);

  useEffect(() => {
    const tira = tiraRef.current;
    if (!tira) return;

    const medir = () => {
      setRecorrido(Math.max(0, tira.scrollWidth - window.innerWidth));
      setAlto(window.innerHeight);
    };
    medir();

    const ro = new ResizeObserver(medir);
    ro.observe(tira);
    window.addEventListener("resize", medir);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: seccionRef,
    offset: ["start start", "end end"],
  });

  /**
   * Donde termina el tramo horizontal y arranca la retraccion, medido en
   * progreso del pin. El recorrido total del pin es `recorrido + retraccion`,
   * asi que el corte cae en la proporcion que ocupa la tira.
   *
   * Antes de la primera medida (recorrido 0) el corte vale 0,7: un numero
   * cualquiera que solo vive un cuadro, y que mantiene crecientes las escalas
   * de useTransform (con 0 se romperian).
   */
  const retraccion = alto * RETRACCION_VH;
  const corte = useMemo(() => {
    if (!recorrido || !retraccion) return 0.7;
    return recorrido / (recorrido + retraccion);
  }, [recorrido, retraccion]);

  const x = useTransform(scrollYProgress, [0, corte], [0, -recorrido]);

  /**
   * El avance de la retraccion, de 0 a 1, aparte del progreso del pin.
   *
   * Todo lo que se mueve en la retraccion cuelga de aca y no de
   * `scrollYProgress` directo, y no es un rodeo: `corte` cambia una vez, al
   * llegar la medida de la tira, y useTransform con rangos calculados se queda
   * con los viejos. Se veia como una opacidad que subia y despues bajaba sola.
   * Con esto los rangos de mas abajo son constantes y el unico que mira el
   * corte es este, que lo recibe como MotionValue: asi se recalcula tanto
   * cuando cambia el scroll como cuando cambia el corte.
   */
  const corteVivo = useMotionValue(corte);
  useEffect(() => {
    corteVivo.set(corte);
  }, [corte, corteVivo]);

  const avance = useTransform([scrollYProgress, corteVivo], ([p, c]: number[]) => {
    if (c >= 1) return 0;
    return Math.min(1, Math.max(0, (p - c) / (1 - c)));
  });

  /**
   * La retraccion termina en el 78% del tramo, no al final: los ultimos
   * milimetros de scroll son para que las hileras de iconos terminen de entrar
   * con el panel ya quieto. Si todo llegara junto, el momento en que la
   * ventana queda flotando —que es lo que hay que mirar— no existiria.
   */
  const escala = useTransform(avance, [0, 0.78], [1, ESCALA]);
  const radio = useTransform(avance, [0, 0.78], [0, 22]);
  const sombra = useTransform(
    avance,
    [0, 0.78],
    ["0px 0px 0px rgba(22,20,18,0)", "0px 30px 80px rgba(22,20,18,0.38)"],
  );

  /**
   * Los iconos entran despues de que el panel ya empezo a achicarse. Entran
   * cayendo hacia su altura, cada fila desde el lado contrario: el
   * desplazamiento horizontal ya lo tienen (corren solas), asi que lo que
   * marca la entrada es el aterrizaje vertical, no otro movimiento lateral.
   */
  const cintas = useTransform(avance, [0.2, 0.78], [0, 1]);
  const entradaArriba = useTransform(cintas, [0, 1], [-70, 0]);
  const entradaAbajo = useTransform(cintas, [0, 1], [70, 0]);

  return (
    <div
      ref={seccionRef}
      className="relative min-h-[240vh]"
      style={
        recorrido
          ? { height: `calc(100vh + ${recorrido}px + ${RETRACCION_VH * 100}vh)` }
          : undefined
      }
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/*
          Las cuatro filas van ANTES del panel en el DOM y sin z-index propio:
          por eso el panel las tapa. Cruzan la pantalla entera, asi que lo que
          se ve de ellas es lo que asoma a los costados de la ventana — el resto
          pasa por atras, que es de donde sale la sensacion de profundidad.
        */}
        {FILAS.map((fila) => (
          <motion.div
            key={fila.altura}
            style={{
              opacity: cintas,
              // Las de arriba bajan a su lugar y las de abajo suben: el
              // movimiento lateral ya lo tienen, la entrada es el aterrizaje.
              y: fila.arriba ? entradaArriba : entradaAbajo,
              top: fila.altura,
            }}
            className="absolute left-0"
          >
            {/*
              El centrado va en un div aparte y no junto al `y`: framer escribe
              el transform inline y se comeria la clase de Tailwind.
            */}
            <div className="-translate-y-1/2">
              <CintasTransicion
                lado={fila.lado}
                desde={fila.desde}
                segundos={fila.segundos}
              />
            </div>
          </motion.div>
        ))}

        {/*
          El panel: esto es "la pagina" que se retrae. Lleva su propio crema
          porque detras ya no hay crema sino piedra, y el overflow es el que
          recorta la tira horizontal y, al final, el que hace valer las esquinas
          redondeadas.
        */}
        <motion.div
          // La marca la lee CabeceraSobrePiedra: mientras este panel tape el
          // borde de arriba de la pantalla, la barra del sitio se queda.
          data-tapa-piedra
          style={{ scale: escala, borderRadius: radio, boxShadow: sombra }}
          className="relative h-full w-full overflow-hidden bg-bg"
        >
          <div className="flex h-full items-center pt-16">
            {/*
              El padding lateral es el mismo a ambos lados y coincide con la
              canaleta del sitio (contenedor de 1400px + 2rem). Asi la primera
              pieza arranca alineada con el resto de la pagina y, sobre todo, el
              recorrido termina justo cuando la ultima pieza queda entera a la
              vista: sin `pr` grande no sobra pantalla vacia despues.
            */}
            <motion.ol
              ref={tiraRef}
              style={{ x }}
              className="flex items-center gap-[5vw] px-[calc((100vw-min(100vw,1400px))/2+2rem)]"
            >
              {proyectos.map((p) => (
                <li
                  key={p.slug}
                  className={`shrink-0 ${p.pista.alto} ${p.pista.aspecto} ${p.pista.carril}`}
                >
                  <TarjetaProyecto
                    proyecto={p}
                    forma="h-full w-full"
                    sizes="(min-width: 1024px) 72vw, 90vw"
                  />
                </li>
              ))}
            </motion.ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

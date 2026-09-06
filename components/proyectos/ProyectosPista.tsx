"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { proyectos } from "@/lib/proyectos";
import { TarjetaProyecto } from "./TarjetaProyecto";

/**
 * Vitrina de proyectos en scroll horizontal (escritorio, con movimiento
 * permitido).
 *
 * Al llegar a esta seccion, el scroll vertical de la pagina la fija a pantalla
 * completa y hace avanzar las piezas hacia la derecha. Cuando se termina la
 * tira, el pin se suelta y la pagina sigue de largo.
 *
 * Antes esto no terminaba asi: el panel se retraia hasta quedar como una
 * ventana flotando sobre un fondo de piedra, con cuatro filas de iconos
 * cruzando por atras, y recien ahi soltaba. Eso se saco entero por pedido de
 * Facundo (04/09/2026) junto con la piedra: la transicion a la seccion
 * siguiente vuelve a ser scroll normal.
 *
 * OJO: esto sigue siendo scroll-jacking, lo que el §3.5 del brief prohibe
 * ("el scroll siempre es el del navegador"). Se mantiene por pedido explicito,
 * igual que Lenis (ver lib/useLenis.ts).
 *
 * En mobile/tablet y con prefers-reduced-motion este componente NO se monta:
 * ahi va `ProyectosApilado`, que es scroll nativo y del todo accesible.
 *
 * La distancia del pin sale de medir el ancho real de la tira: 1px de scroll
 * vertical = 1px de avance horizontal, asi el gesto se siente parejo con la
 * inercia de Lenis. El alto de la seccion se ajusta a esa medida (no es un
 * `300vh` inventado que quede corto o sobre segun cuantas piezas haya).
 */

/**
 * Cuanto scroll de sobra queda despues de que la ultima pieza llego.
 *
 * Sin esto el pin se suelta en el mismo pixel en que la tira termina de
 * moverse, y la ultima pieza se va de pantalla sin que nadie la mire.
 */
const RESPIRO_VH = 0.35;

export function ProyectosPista() {
  const seccionRef = useRef<HTMLDivElement>(null);
  const tiraRef = useRef<HTMLOListElement>(null);

  // px horizontales por recorrer = lo que la tira sobresale del viewport. Se
  // mide al montar. Arranca en 0 (igual en servidor y en cliente, si no hay
  // desajuste de hidratacion): hasta que se mide, el alto lo pone la clase
  // `min-h-[240vh]`, una estimacion para que el resto de la pagina no pegue un
  // salto grande cuando entra la medida real.
  const [recorrido, setRecorrido] = useState(0);
  // El alto del viewport tambien va en estado y no leido en el render:
  // `window` no existe en el servidor y el render corre en los dos lados.
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
   * Donde termina el tramo horizontal, medido en progreso del pin. El
   * recorrido total es `recorrido + respiro`, asi que el corte cae en la
   * proporcion que ocupa la tira. Sin medida todavia vale 0,8: un numero
   * cualquiera que vive un cuadro y mantiene creciente la escala de
   * useTransform (con 0 se romperia).
   */
  const corte =
    recorrido && alto ? recorrido / (recorrido + alto * RESPIRO_VH) : 0.8;
  const x = useTransform(scrollYProgress, [0, corte], [0, -recorrido]);

  return (
    <div
      ref={seccionRef}
      className="relative min-h-[240vh]"
      style={
        recorrido
          ? { height: `calc(100vh + ${recorrido}px + ${RESPIRO_VH * 100}vh)` }
          : undefined
      }
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/*
          El encabezado va DENTRO del pin y no arriba de la seccion: si fuera
          antes, se iria de pantalla en el primer pixel de scroll y la tira
          quedaria corriendo sin nombre.
        */}
        <div className="shrink-0 pt-24 sm:pt-28">
          <div className="mx-auto max-w-[1400px] px-5 text-center sm:px-8">
            <h2 className="text-[clamp(1.75rem,3.4vw,3rem)]">
              Cosas que ya están funcionando
            </h2>
          </div>
        </div>

        <motion.ol
          ref={tiraRef}
          style={{ x }}
          className="flex flex-1 items-center gap-[5vw] px-[calc((100vw-min(100vw,1400px))/2+2rem)]"
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
    </div>
  );
}

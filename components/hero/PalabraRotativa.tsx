"use client";

import { useEffect, useState } from "react";
import { useMovimientoReducido } from "@/lib/useMovimientoReducido";

/** El orden es el del §4.2 del brief. */
const PALABRAS = [
  "Landing pages",
  "Tiendas",
  "Automatizaciones",
  "Sistemas de gestión",
  "Sitios web",
] as const;

/**
 * La mas ancha. Reserva el ancho del bloque para que no salte al cambiar de
 * palabra: un salto ahi es CLS, y el brief lo marca como criterio de
 * "terminado" (CLS = 0 en este bloque).
 */
const MAS_ANCHA = "Sistemas de gestión";

const VISIBLE_MS = 2200;
const TRANSICION_MS = 500;

const N = PALABRAS.length;
const MITAD = Math.floor(N / 2);

/**
 * Posicion de una palabra respecto de la activa, en "alturas de renglon",
 * normalizada al camino mas corto: 0 es la visible, -1 la que acaba de salir
 * por arriba, +1 la que va a entrar por abajo.
 *
 * Sin normalizar, al volver de la ultima a la primera la palabra recorreria
 * las cinco posiciones de un saque.
 */
function posicion(indice: number, activo: number): number {
  return ((indice - activo + N + MITAD) % N) - MITAD;
}

/**
 * La animacion va con transiciones CSS, no con framer-motion.
 *
 * Es un translateY entre valores discretos: CSS lo hace nativo, no puede
 * quedar en un estado intermedio trabado y no cuesta JavaScript por frame.
 * framer-motion 13 con React 19 dejo de aplicar el prop `animate` en este
 * caso y las palabras quedaban congeladas a mitad de camino.
 */
export function PalabraRotativa() {
  const reducirMovimiento = useMovimientoReducido();
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    if (reducirMovimiento) return;
    const id = window.setInterval(
      () => setActivo((prev) => (prev + 1) % N),
      VISIBLE_MS + TRANSICION_MS,
    );
    return () => window.clearInterval(id);
  }, [reducirMovimiento]);

  // Con movimiento reducido no rota: queda "Sitios web" fija (§3.5).
  if (reducirMovimiento) {
    return <span className="block whitespace-nowrap">Sitios web</span>;
  }

  // El padding compensa los descendentes ("pages", "gestión"). Va tanto en el
  // medidor como en cada palabra para que todas midan exactamente lo mismo:
  // asi un desplazamiento de 100% es exactamente un renglon y no queda una
  // franja de la palabra entrante asomando.
  //
  // whitespace-nowrap no es opcional: la mascara supone un renglon. Si en una
  // pantalla angosta "Sistemas de gestión" se parte en dos, el medidor mide
  // dos renglones, el 100% deja de ser un renglon y las palabras se pisan.
  const alto = "pb-[0.14em] whitespace-nowrap";

  return (
    // `contain: paint` no es decorativo y no se puede sacar: sin el, la
    // mascara pierde el recorte a mitad de la transicion. Chrome promueve la
    // palabra a su propia capa mientras el transform anima, y una capa
    // compuesta no queda recortada por el `overflow: hidden` de un ancestro
    // que no es, el mismo, un contexto de recorte. El resultado es que la
    // palabra que sale y la que entra se pintan las dos encima de
    // "Desarrollando" durante ~300ms.
    //
    // Se veia solo a densidad de pixel 1 y solo en cuadros intermedios, asi
    // que no aparece en una captura suelta: se encontro sacando diez cuadros
    // seguidos por CDP a dPR 1. `contain: paint` le promete al navegador que
    // nada se dibuja fuera de la caja, y eso el compositor si lo respeta.
    <span className="relative mt-[0.06em] block overflow-hidden [contain:paint] -mb-[0.14em]">
      <span className={`invisible block ${alto}`} aria-hidden>
        {MAS_ANCHA}
      </span>

      {PALABRAS.map((palabra, i) => {
        const pos = posicion(i, activo);
        // A dos renglones o mas ya quedo fuera de la mascara: se reacomoda sin
        // transicion, para que el salto al dar la vuelta no se vea.
        const fueraDeVista = Math.abs(pos) >= 2;

        return (
          // Sin will-change: promueve la palabra a su propia capa y ahi se escapa
          // del overflow-hidden del contenedor, pisando el renglon de arriba.
          <span
            key={palabra}
            aria-hidden={pos !== 0}
            className={`absolute inset-x-0 top-0 block ${alto}`}
            style={{
              transform: `translateY(${pos * 100}%)`,
              transition: fueraDeVista
                ? "none"
                : `transform ${TRANSICION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            {palabra}
          </span>
        );
      })}
    </span>
  );
}

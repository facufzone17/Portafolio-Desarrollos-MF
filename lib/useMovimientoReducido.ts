"use client";

import { useSyncExternalStore } from "react";

const CONSULTA = "(prefers-reduced-motion: reduce)";

function suscribir(alCambiar: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", alCambiar);
  return () => mq.removeEventListener("change", alCambiar);
}

/**
 * true si el visitante pidio menos movimiento.
 *
 * Va con useSyncExternalStore y no con useState + useEffect: matchMedia es
 * exactamente eso, un estado que vive fuera de React. Asi no hay un render
 * intermedio con el valor equivocado ni desajuste con la hidratacion — en el
 * servidor no hay forma de saber la preferencia, y ahi se asume false.
 */
export function useMovimientoReducido(): boolean {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}

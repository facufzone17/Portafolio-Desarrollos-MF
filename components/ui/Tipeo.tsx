"use client";

import { useEffect, useRef, useState } from "react";
import { useMovimientoReducido } from "@/lib/useMovimientoReducido";

/**
 * Máquina de escribir: el texto entra letra por letra cuando el bloque aparece
 * en pantalla, con un cursor que parpadea mientras escribe.
 *
 * Es la única parte de la página con este gesto y va por pedido explícito: el
 * "Somos Facundo y Mateo" de la sección "Nosotros". El resto del sitio aparece
 * con `Revelar`.
 *
 *  - Antes de entrar en pantalla (SSR incluido) se pinta el texto COMPLETO:
 *    nada de lo que se lee depende de que corra la animación, y no hay desajuste
 *    de hidratación.
 *  - Con `prefers-reduced-motion` no tipea: muestra el texto entero de una.
 *  - El texto real va en un `sr-only` estable; la copia animada es
 *    `aria-hidden`, igual que el titular del hero.
 */
export function Tipeo({
  texto,
  velocidad = 55,
  alTerminar,
  id,
  className = "",
  as: Etiqueta = "span",
}: {
  texto: string;
  /** Milisegundos por caracter. Más alto = más lento y marcado. */
  velocidad?: number;
  alTerminar?: () => void;
  id?: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}) {
  const reducirMovimiento = useMovimientoReducido();
  const ref = useRef<HTMLElement>(null);
  const [enVista, setEnVista] = useState(false);
  const [n, setN] = useState(0);
  const avisado = useRef(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setEnVista(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.2 },
    );
    io.observe(nodo);
    return () => io.disconnect();
  }, []);

  const animar = enVista && !reducirMovimiento;
  const listo = !animar || n >= texto.length;

  // Un tic por caracter mientras haya texto por escribir.
  useEffect(() => {
    if (!animar || n >= texto.length) return;
    const t = window.setTimeout(() => setN((v) => v + 1), velocidad);
    return () => window.clearTimeout(t);
  }, [animar, n, texto.length, velocidad]);

  // Aviso cuando termina de escribir (o de una, si no se anima).
  useEffect(() => {
    if (!enVista || avisado.current) return;
    if (reducirMovimiento || n >= texto.length) {
      avisado.current = true;
      alTerminar?.();
    }
  }, [enVista, reducirMovimiento, n, texto.length, alTerminar]);

  const visible = listo ? texto : texto.slice(0, n);
  const escribiendo = animar && n < texto.length;

  return (
    <Etiqueta
      // @ts-expect-error -- ref polimórfico: el elemento cambia con `as`.
      ref={ref}
      id={id}
      className={className}
    >
      <span className="sr-only">{texto}</span>
      <span aria-hidden>
        {visible}
        {escribiendo && <span data-tipeo-cursor />}
      </span>
    </Etiqueta>
  );
}

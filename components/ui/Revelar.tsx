"use client";

import { useEffect, useRef } from "react";

/**
 * Aparicion al entrar en pantalla.
 *
 * Un solo IntersectionObserver por instancia marca `data-visible` en el nodo y
 * el resto lo hace CSS (ver el bloque `[data-revelar]` en globals.css). No hay
 * estado de React ni una libreria de animacion para lo que son dos
 * propiedades y una transicion.
 *
 * Es UN gesto para toda la pagina: sube unos pixeles y aparece. La version
 * anterior tenia tres variantes (una escalaba los recuadros desde 0,97) y el
 * resultado era que cada seccion entraba distinto, que es ruido disfrazado de
 * riqueza. La variedad la ponen los layouts.
 *
 * El observer se desconecta al primer cruce: la aparicion pasa una sola vez.
 * Un elemento que se desvanece cada vez que sale de pantalla convierte el
 * scroll de vuelta en un parpadeo.
 */
export function Revelar({
  children,
  demora = 0,
  className = "",
  as: Etiqueta = "div",
}: {
  children: React.ReactNode;
  /** Milisegundos de retraso: sirve para escalonar una fila de piezas. */
  demora?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        nodo.dataset.visible = "";
        io.disconnect();
      },
      // El margen negativo abajo pide que entre de verdad, no que asome un
      // pixel: si no, en un scroll rapido todo aparece ya revelado.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
    io.observe(nodo);
    return () => io.disconnect();
  }, []);

  return (
    <Etiqueta
      // @ts-expect-error -- ref polimorfico: el elemento cambia con `as`.
      ref={ref}
      data-revelar
      className={className}
      style={{ "--revelar-delay": `${demora}ms` } as unknown as React.CSSProperties}
    >
      {children}
    </Etiqueta>
  );
}

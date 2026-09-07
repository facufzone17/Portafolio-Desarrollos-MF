"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Titulo que se escribe con una ola: las letras entran desde abajo una detras
 * de otra, con un rebote corto, y un cursor azul parpadea al final como si lo
 * acabaran de tipear. El escalonado (--i por letra) es lo que se lee como ola;
 * la animacion en si vive en globals.css (`[data-ola]`).
 *
 * Reemplaza a `Tipeo`, el typewriter plano que antes escribia "Somos Facundo y
 * Mateo". Sigue siendo el unico gesto de este tipo fuera del preloader.
 *
 * Igual que `Revelar`: el atributo `data-ola` va siempre (server incluido) y el
 * CSS resuelve los casos sin animacion —
 *   - `html:not(.js) [data-ola]`  -> sin JS, letras quietas y visibles
 *   - `@media (prefers-reduced-motion: reduce)` -> lo mismo
 * asi no hay estado "montado" ni un `setState` sincronico en un efecto.
 *
 * El texto real va en un `sr-only`; las letras y el cursor son `aria-hidden`
 * para que un lector de pantalla no deletree la palabra.
 */
export function Ola({
  texto,
  id,
  className = "",
  as: Etiqueta = "span",
}: {
  texto: string;
  id?: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const [enVista, setEnVista] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setEnVista(true);
        io.disconnect();
      },
      // threshold bajo como en `Revelar`: en un scroll rapido el titulo puede
      // cruzar la ventana en un cuadro y con 0.2 el observer no llega a verlo.
      { rootMargin: "0px 0px -15% 0px", threshold: 0.01 },
    );
    io.observe(nodo);
    return () => io.disconnect();
  }, []);

  const letras = [...texto];

  return (
    <Etiqueta
      // @ts-expect-error -- ref polimorfico: el elemento cambia con `as`.
      ref={ref}
      id={id}
      className={className}
      data-ola=""
      style={{ "--n": letras.length } as React.CSSProperties}
      {...(enVista ? { "data-visible": "" } : {})}
    >
      <span className="sr-only">{texto}</span>
      <span aria-hidden>
        {letras.map((c, i) => (
          <span
            key={i}
            data-ola-letra
            style={{ "--i": i } as React.CSSProperties}
          >
            {c}
          </span>
        ))}
        <span data-ola-cursor />
      </span>
    </Etiqueta>
  );
}

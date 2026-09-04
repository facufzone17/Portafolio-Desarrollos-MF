"use client";

import { useMovimientoReducido } from "@/lib/useMovimientoReducido";
import { ProyectosApilado } from "./ProyectosApilado";
import { ProyectosPista } from "./ProyectosPista";

/**
 * Vitrina de proyectos. Elige entre dos layouts:
 *
 *  - `ProyectosPista`: scroll horizontal fijado a pantalla. Solo en escritorio
 *    (lg+) y con movimiento permitido.
 *  - `ProyectosApilado`: scroll vertical nativo. En mobile/tablet y con
 *    prefers-reduced-motion, en cualquier ancho.
 *
 * El corte por ancho se hace con CSS (`lg:hidden` / `hidden lg:block`) y no con
 * JS: asi el servidor manda las dos y no hay parpadeo de una a otra al hidratar.
 * Las dos viven dentro del mismo `<section id="proyectos">`, que es el ancla y
 * el que compensa el header sticky — nunca la que esta `display:none`.
 *
 * prefers-reduced-motion si es JS (no hay media query de Tailwind para "y
 * ademas quiere movimiento"): el servidor asume que si, y si el visitante pidio
 * menos, al hidratar se queda solo con la apilada.
 */
export function Proyectos() {
  const reducirMovimiento = useMovimientoReducido();

  return (
    <section id="proyectos" aria-label="Nuestros proyectos" className="scroll-mt-20">
      {reducirMovimiento ? (
        <ProyectosApilado />
      ) : (
        <>
          <ProyectosApilado className="lg:hidden" />
          <div className="hidden lg:block">
            <ProyectosPista />
          </div>
        </>
      )}
    </section>
  );
}

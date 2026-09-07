"use client";

import { Seccion } from "@/components/ui/Seccion";
import { useMovimientoReducido } from "@/lib/useMovimientoReducido";
import { Camino } from "./Camino";
import { Ruleta } from "./Ruleta";

/**
 * Cómo trabajamos. Elige entre dos layouts, igual que la vitrina de proyectos:
 *
 *  - `Ruleta`: los dos arcos que giran con el scroll, con la seccion fijada a
 *    pantalla. Solo en escritorio (lg+) y con movimiento permitido.
 *  - `Camino`: el camino dibujado y las tarjetas apiladas, scroll nativo. En
 *    mobile/tablet y con prefers-reduced-motion, en cualquier ancho.
 *
 * El corte por ancho se hace con CSS (`lg:hidden` / `hidden lg:block`) y no con
 * JS: asi el servidor manda las dos y no hay parpadeo al hidratar. Las dos
 * viven dentro del mismo `<section id="como-trabajamos">`, que es el ancla y el
 * que compensa el header sticky — nunca la que esta `display:none`.
 */
export function ComoTrabajamos() {
  const reducirMovimiento = useMovimientoReducido();

  return (
    <section
      id="como-trabajamos"
      aria-label="Cómo trabajamos"
      className="scroll-mt-24"
    >
      {reducirMovimiento ? (
        <Apilado />
      ) : (
        <>
          <Apilado className="lg:hidden" />
          <div className="hidden lg:block">
            <Ruleta />
          </div>
        </>
      )}
    </section>
  );
}

/**
 * `Seccion` sin `id`: el ancla ya la puso el `<section>` de arriba y dos nodos
 * con el mismo id seria un id duplicado.
 */
function Apilado({ className = "" }: { className?: string }) {
  return (
    <Seccion
      titulo="Cómo trabajamos"
      bajada="Cinco pasos, siempre los mismos. Sabés en qué punto está tu proyecto en todo momento."
      className={className}
    >
      <Camino />
    </Seccion>
  );
}

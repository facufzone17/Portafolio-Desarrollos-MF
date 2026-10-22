"use client";

import { irASeccion } from "@/lib/irASeccion";
import type { IdPlan } from "@/lib/planes";

/** Evento con el que un boton de plan le avisa al formulario cual eligio. */
export const EVENTO_PLAN = "turnos:elegir-plan";

/**
 * Link a una seccion de la misma pagina. Va por `irASeccion` y no por el salto
 * nativo del ancla, que pelea con Lenis por el mismo numero.
 *
 * Con `plan`, ademas deja ese plan elegido en el formulario: el que toca
 * "Quiero Vidriera" no tiene que volver a decirlo abajo.
 */
export function IrA({
  id,
  plan,
  children,
  className = "",
  ...resto
}: {
  id: string;
  plan?: IdPlan;
  children: React.ReactNode;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  return (
    <a
      href={`#${id}`}
      className={className}
      onClick={(e) => {
        if (plan) window.dispatchEvent(new CustomEvent(EVENTO_PLAN, { detail: plan }));
        if (!irASeccion(id)) return;
        e.preventDefault();
        window.history.replaceState(null, "", `#${id}`);
      }}
      {...resto}
    >
      {children}
    </a>
  );
}

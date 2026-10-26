import { Check } from "lucide-react";
import { descuento, pesos, type Plan } from "@/lib/planes";

/*
  Piezas chicas que comparten /turnos y la pagina de cada plan
  (/turnos/[plan]): la lista con tildes y las partes del precio.
*/

export function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm text-text-muted">{titulo}</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((t) => (
          <li key={t} className="flex gap-3 text-[15px] leading-snug text-text sm:text-base">
            <Check className="mt-0.5 size-4 shrink-0 text-azul" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Destacado({ texto }: { texto: string }) {
  return (
    <span className="whitespace-nowrap rounded-card bg-azul px-2.5 py-1 text-sm font-medium text-[#04121f]">
      {texto}
    </span>
  );
}

/**
 * El precio de un plan: el mensual grande (es lo que el cliente compara con
 * las apps de turnos) y debajo el armado, con el de lista tachado y el
 * descuento de lanzamiento. Agenda no tiene armado: muestra su condicion.
 */
export function Precio({ plan, className = "" }: { plan: Plan; className?: string }) {
  return (
    <div className={className}>
      <p className="flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-medium leading-none tracking-[-0.04em] text-text">
          {pesos(plan.mensual)}
        </span>
        <span className="text-text-muted">/mes</span>
      </p>
      {plan.armado > 0 && (
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-text-muted">
          Armado:
          <ArmadoLista plan={plan} />
          <span className="text-text">{pesos(plan.armado)}</span>
          <EtiquetaDescuento plan={plan} />
        </p>
      )}
      <p className="mt-2 text-sm text-text-muted">{plan.condicion}</p>
    </div>
  );
}

/**
 * Armado de lista tachado. El `<s>` solo no lo anuncia ningun lector de
 * pantalla, asi que lleva el rotulo escondido.
 */
export function ArmadoLista({ plan, className = "" }: { plan: Plan; className?: string }) {
  return (
    <span className={`text-text-muted ${className}`}>
      <span className="sr-only">Precio de lista: </span>
      <s>{pesos(plan.armadoLista)}</s>
      <span className="sr-only">. Precio de lanzamiento:</span>
    </span>
  );
}

export function EtiquetaDescuento({ plan }: { plan: Plan }) {
  return (
    <span className="self-center whitespace-nowrap rounded-card border border-azul/50 px-2 py-0.5 text-sm text-azul">
      −{descuento(plan)}%
    </span>
  );
}

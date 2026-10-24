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
 * La etiqueta del tercer plan (`plan.etiqueta`): llena como Destacado pero en
 * verde, para que lo distinga y lo venda sin pisarse con el azul del medio.
 */
export function Etiqueta({ texto }: { texto: string }) {
  return (
    <span className="whitespace-nowrap rounded-card bg-verde px-2.5 py-1 text-sm font-medium text-[#04170c]">
      {texto}
    </span>
  );
}

/**
 * Precio de lista tachado. El `<s>` solo no lo anuncia ningun lector de
 * pantalla, asi que lleva el rotulo escondido.
 */
export function PrecioLista({ plan, className = "" }: { plan: Plan; className?: string }) {
  return (
    <span className={`text-text-muted ${className}`}>
      <span className="sr-only">Precio de lista: </span>
      <s>{pesos(plan.precioLista)}</s>
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

import { Check } from "lucide-react";
import { Revelar } from "@/components/ui/Revelar";
import { Seccion } from "@/components/ui/Seccion";
import { planes, type IdPlan } from "@/lib/planes";

/**
 * Escenarios de ejemplo: un rubro por plan, contado como "hoy" y "con Trevoo".
 *
 * Ocupan el lugar que tendrian los casos de exito, pero todavia no hay
 * clientes de estos planes, y presentar un caso inventado como real seria
 * publicidad engañosa (y una mentira que el rubro descubre rapido). Por eso
 * van rotulados como ejemplo en cada tarjeta y en la nota del final. Cuando
 * haya clientes de verdad, esta seccion se convierte en la de resultados.
 */

type Escenario = {
  rubro: string;
  plan: IdPlan;
  hoy: string;
  conTrevoo: string;
  logros: string[];
};

const ESCENARIOS: Escenario[] = [
  {
    rubro: "Una barbería con dos sillas",
    plan: "agenda",
    hoy: "Los dos barberos contestan WhatsApp entre corte y corte, y más de una vez le dieron el mismo horario a dos clientes.",
    conTrevoo:
      "Ponen el link en la bio de Instagram. Cada cliente elige con quién y a qué hora, y sólo ve los horarios libres de ese barbero.",
    logros: ["Cero turnos superpuestos", "Atienden sin soltar la máquina para contestar"],
  },
  {
    rubro: "Un centro de estética",
    plan: "vidriera",
    hoy: "La mitad de las consultas son siempre las mismas: cuánto sale, dónde están, qué tratamientos hacen. Todo se responde a mano.",
    conTrevoo:
      "Una web propia con tratamientos, precios, fotos de trabajos y mapa, y el botón de reservar en cada servicio. La duda y la reserva se resuelven en el mismo lugar.",
    logros: ["Una dirección propia para compartir en todos lados", "Menos preguntas repetidas"],
  },
  {
    rubro: "Un consultorio de kinesiología",
    plan: "piloto",
    hoy: "Mientras atiende no puede mirar el celular, y entre sesión y sesión tiene veinte chats esperando. Encima, algunos pacientes se olvidan del turno.",
    conTrevoo:
      "El bot contesta al instante, ofrece horarios y agenda en la conversación. Antes del turno manda el recordatorio y el paciente confirma con un 1.",
    logros: ["Nadie queda esperando respuesta", "Menos ausencias: cada turno se confirma antes"],
  },
];

export function Ejemplos() {
  return (
    <Seccion
      id="ejemplos"
      titulo="Cómo se usa en negocios como el tuyo"
      bajada="Un ejemplo por plan, para que te imagines el tuyo funcionando."
    >
      <ul className="mx-auto grid max-w-[1180px] gap-4 lg:grid-cols-3">
        {ESCENARIOS.map((e, i) => {
          const plan = planes.find((p) => p.id === e.plan)!;
          return (
            <Revelar as="li" key={e.rubro} demora={i * 90} className="flex flex-col rounded-card border border-line bg-bg-elev p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-card border border-dashed border-line-alto px-2.5 py-1 text-sm text-text-muted">
                  Escenario de ejemplo
                </span>
                <span className="text-sm text-azul">Plan {plan.nombre}</span>
              </div>
              <h3 className="mt-5 text-2xl text-text">{e.rubro}</h3>

              <p className="mt-5 text-sm text-text-muted">Hoy</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-text-muted">{e.hoy}</p>

              <p className="mt-5 text-sm text-text">Con Trevoo</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-text">{e.conTrevoo}</p>

              <ul className="mt-6 flex flex-1 flex-col justify-end gap-2.5 border-t border-line pt-5">
                {e.logros.map((l) => (
                  <li key={l} className="flex gap-3 text-[15px] leading-snug text-text">
                    <Check className="mt-0.5 size-4 shrink-0 text-azul" aria-hidden />
                    {l}
                  </li>
                ))}
              </ul>
            </Revelar>
          );
        })}
      </ul>

      <p className="mx-auto mt-6 max-w-[64ch] text-center text-sm leading-relaxed text-text-muted">
        Son escenarios de ejemplo, no clientes reales: estamos sumando los primeros negocios con el
        precio de lanzamiento.
      </p>
    </Seccion>
  );
}

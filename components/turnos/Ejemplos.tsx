import { Check } from "lucide-react";
import { Revelar } from "@/components/ui/Revelar";
import { Seccion } from "@/components/ui/Seccion";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { DemoEnVivo } from "@/components/turnos/DemoEnVivo";
import { IrA } from "@/components/turnos/IrA";
import { planes } from "@/lib/planes";

/**
 * Un negocio de ejemplo, contado como "hoy" y "con Trevoo": un centro de
 * estetica con el plan Vidriera, y al lado su web de verdad, la misma demo que
 * se abre en /turnos/vidriera, para recorrerla y probar la reserva.
 *
 * Ocupa el lugar que tendrian los casos de exito, pero todavia no hay clientes
 * de estos planes, y presentar un caso inventado como real seria publicidad
 * engañosa (y una mentira que el rubro descubre rapido). Por eso va rotulado
 * como ejemplo en la tarjeta y en la nota del final. Cuando haya clientes de
 * verdad, esta seccion se convierte en la de resultados.
 *
 * Eran tres escenarios, uno por plan, solo con texto. Se dejo uno, el de
 * Vidriera, porque es el unico que se puede mostrar funcionando: Agenda ya es
 * el hero y el bot de Piloto no tiene una demo que se pueda abrir.
 */

const PLAN = planes.find((p) => p.id === "vidriera")!;

const CONSULTAS = ["¿Cuánto sale la limpieza facial?", "¿Dónde están?", "¿Qué tratamientos hacen?"];

const LOGROS = [
  "Una dirección propia para compartir en todos lados",
  "Menos preguntas repetidas",
  "Las reservas de la web llegan a la misma agenda",
];

export function Ejemplos() {
  return (
    <Seccion
      id="ejemplos"
      ancho="max-w-[1100px]"
      titulo="Cómo se usa en negocios como el tuyo"
      bajada="Un ejemplo, para que te imagines el tuyo funcionando."
    >
      <Revelar className="mx-auto grid max-w-[1100px] items-center gap-12 rounded-card border border-line bg-bg-elev p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,auto)] lg:gap-16">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="rounded-card border border-dashed border-line-alto px-2.5 py-1 text-sm text-text-muted">
              Escenario de ejemplo
            </span>
            <span className="text-sm text-azul">Plan {PLAN.nombre}</span>
          </div>
          <h3 className="mt-5 text-[clamp(1.75rem,3vw,2.25rem)] text-text">Un centro de estética</h3>

          <p className="mt-6 text-sm text-text-muted">Hoy</p>
          <p className="mt-1.5 max-w-[48ch] text-[15px] leading-relaxed text-text-muted">
            La mitad de las consultas son siempre las mismas, y todas se responden a mano.
          </p>
          <ul className="mt-3 flex flex-col items-start gap-1.5" aria-label="Consultas que se repiten">
            {CONSULTAS.map((c) => (
              <li
                key={c}
                className="rounded-[12px] rounded-bl-[4px] bg-bg-alto px-3 py-2 text-[15px] leading-snug text-text"
              >
                {c}
              </li>
            ))}
          </ul>

          <p className="mt-7 text-sm text-azul">Con Trevoo</p>
          <p className="mt-1.5 max-w-[48ch] text-[15px] leading-relaxed text-text">
            Una web propia con tratamientos, precios, fotos de trabajos y mapa, y el botón de reservar
            en cada servicio. La duda y la reserva se resuelven en el mismo lugar.
          </p>

          <ul className="mt-6 flex flex-col gap-2.5 border-t border-line pt-5">
            {LOGROS.map((l) => (
              <li key={l} className="flex gap-3 text-[15px] leading-snug text-text">
                <Check className="mt-0.5 size-4 shrink-0 text-azul" aria-hidden />
                {l}
              </li>
            ))}
          </ul>

          <IrA
            id="formulario"
            plan={PLAN.id}
            data-boton="claro"
            data-analytics="turnos-ejemplo"
            className="group mt-8 min-h-[52px] w-full px-6 text-base sm:w-auto"
          >
            <TextoDeslizante>Quiero una web así</TextoDeslizante>
          </IrA>
        </div>

        {/* Su web, funcionando: se recorre y se prueba la reserva. */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[300px] rounded-[22px] bg-[linear-gradient(160deg,rgba(0,153,255,0.16),rgba(0,153,255,0)_60%)] px-6 pt-8 sm:max-w-[340px]">
            <DemoEnVivo
              url={PLAN.demo!}
              video={PLAN.video}
              poster={PLAN.poster}
              etiqueta="Demo en vivo de la web de un centro de estética"
              analytics="turnos-ejemplo-demo"
              diferida
            />
          </div>
          <p className="mt-4 max-w-[34ch] text-center text-sm text-text-muted">
            Es su web de verdad, con un negocio de ejemplo: recorrela y probá reservar.
            {/* En tactil ya esta el boton sobre el celular. */}
            <span className="[@media(hover:none)]:hidden">
              {" "}
              <a
                href={PLAN.demo}
                target="_blank"
                rel="noopener"
                className="text-text underline decoration-line-alto underline-offset-4 transition-colors hover:decoration-text"
              >
                Abrir en pantalla completa
              </a>
            </span>
          </p>
        </div>
      </Revelar>

      <p className="mx-auto mt-6 max-w-[64ch] text-center text-sm leading-relaxed text-text-muted">
        Es un escenario de ejemplo, no un cliente real: estamos sumando los primeros negocios con el
        precio de lanzamiento.
      </p>
    </Seccion>
  );
}

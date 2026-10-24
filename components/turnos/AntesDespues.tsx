import { Check, Link2 } from "lucide-react";
import { Revelar } from "@/components/ui/Revelar";
import { Seccion } from "@/components/ui/Seccion";

/**
 * El mismo turno, sacado de dos maneras. Reemplaza a las tres tarjetas de
 * "dolores", que contaban el problema con texto y no mostraban la solucion.
 *
 * A la izquierda, el ida y vuelta de WhatsApp que todo dueño reconoce; a la
 * derecha, la misma clienta reservando por el link. Los horarios del chat son
 * los que hacen el trabajo: se ve pasar la mañana entera para cerrar un turno.
 * Todo rotulado como ejemplo.
 */

type Mensaje = { de: "cliente" | "vos"; texto: string; hora: string };

const CHAT: Mensaje[] = [
  { de: "cliente", texto: "Hola! ¿Tenés turno para limpieza facial esta semana?", hora: "10:14" },
  { de: "vos", texto: "Hola! Sí, ¿qué día te queda bien?", hora: "11:02" },
  { de: "cliente", texto: "¿El jueves puede ser?", hora: "11:40" },
  { de: "vos", texto: "El jueves tengo a las 10 o a las 16", hora: "12:15" },
  { de: "cliente", texto: "Uh, a las 16 no llego. ¿17:30?", hora: "12:58" },
  { de: "vos", texto: "17:30 ya está tomado 😕 ¿El viernes a las 17?", hora: "13:31" },
  { de: "cliente", texto: "Dale, viernes 17", hora: "14:10" },
  { de: "vos", texto: "Listo, te anoto!", hora: "14:12" },
];

const RESERVA = [
  { campo: "Servicio", valor: "Limpieza facial" },
  { campo: "Día", valor: "Viernes 31" },
  { campo: "Horario", valor: "17:00" },
];

export function AntesDespues() {
  return (
    <Seccion
      ancho="max-w-[1000px]"
      titulo="Un turno, de dos maneras"
      bajada="Así se coordina hoy por mensaje, y así lo reserva tu cliente con un link."
    >
      <div className="mx-auto grid max-w-[1000px] gap-4 md:grid-cols-2">
        {/* Hoy */}
        <Revelar className="flex flex-col rounded-card border border-line bg-bg-elev p-5 sm:p-6">
          <p className="text-sm text-text-muted">Hoy, por WhatsApp</p>
          <ol className="mt-5 flex flex-1 flex-col gap-2">
            {CHAT.map((m, i) => (
              <li
                key={i}
                className={`max-w-[85%] rounded-[12px] px-3 py-2 text-[15px] leading-snug ${
                  m.de === "vos"
                    ? "self-end rounded-br-[4px] bg-[#1f3a2c] text-[#e6f4ea]"
                    : "self-start rounded-bl-[4px] bg-bg-alto text-text"
                }`}
              >
                {m.texto}
                <span className="ml-2 align-bottom text-[11px] tabular-nums opacity-55">{m.hora}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 border-t border-line pt-5 text-lg text-text">
            8 mensajes y 4 horas <span className="text-text-muted">para cerrar un turno</span>
          </p>
        </Revelar>

        {/* Con Trevoo */}
        <Revelar demora={120} className="flex flex-col rounded-card border border-azul/40 bg-azul/[0.06] p-5 sm:p-6">
          <p className="text-sm text-azul">Con Trevoo, por el link de tu Instagram</p>

          <div className="mt-5 flex flex-1 flex-col justify-center gap-4">
            <div className="flex items-center gap-2.5 self-start rounded-[12px] bg-bg-alto px-3 py-2 text-[15px] text-text">
              <Link2 className="size-4 shrink-0 text-azul" aria-hidden />
              estudionacar.com.ar/reservar
            </div>

            <ul className="flex flex-col gap-2">
              {RESERVA.map((r) => (
                <li
                  key={r.campo}
                  className="flex items-center justify-between gap-3 rounded-[12px] border border-line bg-bg-elev px-4 py-3"
                >
                  <span className="text-sm text-text-muted">{r.campo}</span>
                  <span className="flex items-center gap-2 text-[15px] text-text">
                    {r.valor}
                    <Check className="size-4 text-azul" aria-hidden />
                  </span>
                </li>
              ))}
            </ul>

            <div className="rounded-[12px] bg-text px-4 py-3 text-bg">
              <p className="text-[15px] font-medium">Turno confirmado ✓</p>
              <p className="mt-0.5 text-sm opacity-70">
                Le llega la confirmación por WhatsApp y a vos te aparece en la agenda.
              </p>
            </div>
          </div>

          <p className="mt-6 border-t border-azul/25 pt-5 text-lg text-text">
            3 toques y menos de un minuto. <span className="text-text-muted">Vos no escribiste nada.</span>
          </p>
        </Revelar>
      </div>

      <p className="mt-6 text-center text-sm text-text-muted">Ejemplo ilustrativo: no es un cliente real.</p>
    </Seccion>
  );
}

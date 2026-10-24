/**
 * La agenda de la semana de un negocio de ejemplo, llenandose sola. Es la
 * pieza del hero de /turnos y reemplaza a los tres celulares.
 *
 * Cuenta la promesa entera sin leer nada: los turnos entran uno por uno, cada
 * uno marcado con el canal por el que llego (la web, el link de la bio de
 * Instagram o el bot de WhatsApp), y todos caen en la misma agenda. Los tres
 * canales son los tres planes.
 *
 * Esta hecha con HTML y no con un video: carga al instante, se ve nitida en
 * cualquier pantalla y el texto es texto. Los colores son los del negocio de
 * ejemplo (Estudio Nacar, crema y marron), no los de Trevoo: es SU agenda.
 *
 * En mobile entran tres dias; el resto de la semana aparece desde sm.
 */

type Canal = "web" | "instagram" | "whatsapp";

type Turno = {
  /** 0 = lunes. */
  dia: number;
  hora: string;
  /** En medias horas. */
  dura: 1 | 2;
  nombre: string;
  servicio: string;
  canal: Canal;
};

const DIAS = ["Lun 27", "Mar 28", "Mié 29", "Jue 30", "Vie 31", "Sáb 1"];
const PRIMERA_HORA = 9;
const MEDIAS_HORAS = 18; // de 9 a 18

const TURNOS: Turno[] = [
  { dia: 0, hora: "9:30", dura: 2, nombre: "Martina R.", servicio: "Limpieza facial", canal: "web" },
  { dia: 0, hora: "11:00", dura: 1, nombre: "Lucas P.", servicio: "Perfilado de cejas", canal: "instagram" },
  { dia: 0, hora: "15:00", dura: 2, nombre: "Sofía M.", servicio: "Esmaltado", canal: "whatsapp" },
  { dia: 1, hora: "10:00", dura: 2, nombre: "Camila S.", servicio: "Lifting de pestañas", canal: "instagram" },
  { dia: 1, hora: "12:30", dura: 2, nombre: "Julieta F.", servicio: "Limpieza facial", canal: "web" },
  { dia: 1, hora: "16:30", dura: 1, nombre: "Agus T.", servicio: "Perfilado de cejas", canal: "whatsapp" },
  { dia: 2, hora: "9:00", dura: 2, nombre: "Valentina V.", servicio: "Esmaltado", canal: "web" },
  { dia: 2, hora: "11:30", dura: 2, nombre: "Flor L.", servicio: "Lifting de pestañas", canal: "whatsapp" },
  { dia: 2, hora: "14:00", dura: 2, nombre: "Mica B.", servicio: "Limpieza facial", canal: "instagram" },
  { dia: 2, hora: "17:00", dura: 1, nombre: "Paula G.", servicio: "Perfilado de cejas", canal: "web" },
  { dia: 3, hora: "10:30", dura: 2, nombre: "Lucía B.", servicio: "Limpieza facial", canal: "whatsapp" },
  { dia: 3, hora: "13:00", dura: 2, nombre: "Carla D.", servicio: "Esmaltado", canal: "web" },
  { dia: 3, hora: "16:00", dura: 2, nombre: "Sofi R.", servicio: "Lifting de pestañas", canal: "instagram" },
  { dia: 4, hora: "9:30", dura: 1, nombre: "Ana K.", servicio: "Perfilado de cejas", canal: "instagram" },
  { dia: 4, hora: "11:00", dura: 2, nombre: "Martina L.", servicio: "Limpieza facial", canal: "web" },
  { dia: 4, hora: "15:30", dura: 2, nombre: "Romi C.", servicio: "Esmaltado", canal: "whatsapp" },
  { dia: 4, hora: "17:30", dura: 1, nombre: "Belu N.", servicio: "Lifting de pestañas", canal: "web" },
  { dia: 5, hora: "9:00", dura: 2, nombre: "Nati P.", servicio: "Limpieza facial", canal: "whatsapp" },
  { dia: 5, hora: "11:00", dura: 2, nombre: "Gime S.", servicio: "Esmaltado", canal: "web" },
];

const CANALES: Record<Canal, { nombre: string; bloque: string; punto: string }> = {
  web: { nombre: "Tu web", bloque: "border-[#cdb69b] bg-[#efe5d8]", punto: "bg-[#8a6440]" },
  instagram: { nombre: "Link de Instagram", bloque: "border-[#e2aec1] bg-[#f7e4eb]", punto: "bg-[#c2547c]" },
  whatsapp: { nombre: "Bot de WhatsApp", bloque: "border-[#a6d4b0] bg-[#e3f2e6]", punto: "bg-[#2f9a4f]" },
};

/** Fila de la grilla (1 = 9:00) para una hora como "10:30". */
function fila(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return (h - PRIMERA_HORA) * 2 + (m >= 30 ? 1 : 0) + 1;
}

/*
 * Orden de entrada salteado por la semana, para que se lea como turnos que
 * llegan y no como una grilla que se pinta de arriba abajo. 5 y 19 son
 * coprimos, asi que la cuenta recorre a todos sin repetir.
 */
const SALTO = 5;
const RETARDO_BASE = 750;
const RETARDO_PASO = 130;

export function AgendaViva({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label={`Agenda de ejemplo de un centro de estética: ${TURNOS.length} turnos en la semana, reservados por la web, por el link de Instagram y por el bot de WhatsApp.`}
      className={`overflow-hidden rounded-[18px] border border-black/10 bg-[#f8f5f0] text-[#2b2520] shadow-[0_40px_100px_rgba(0,0,0,0.55)] ${className}`}
    >
      {/* Encabezado: el negocio, la semana y la cuenta. */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.07] px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-[9px] bg-[#7a5634] text-sm font-medium text-[#f8f5f0]">
            EN
          </span>
          <div className="leading-tight">
            <p className="text-[15px] font-medium">Estudio Nácar</p>
            <p className="text-[13px] text-[#2b2520]/60">Semana del 27 de octubre</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#2b2520] px-3 py-1 text-[13px] text-[#f8f5f0]">
            {TURNOS.length} turnos esta semana
          </span>
          <span className="hidden rounded-full border border-dashed border-[#2b2520]/25 px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-[#2b2520]/55 sm:inline">
            Datos de ejemplo
          </span>
        </div>
      </div>

      {/* Grilla: columna de horas + un carril por dia. */}
      <div className="grid grid-cols-[38px_repeat(3,minmax(0,1fr))] px-2 pb-3 pt-2 [--fila:17px] sm:grid-cols-[46px_repeat(6,minmax(0,1fr))] sm:px-3 sm:[--fila:24px]">
        <div />
        {DIAS.map((d, i) => (
          <p
            key={d}
            className={`pb-2 text-center text-[12px] font-medium text-[#2b2520]/70 sm:text-[13px] ${i >= 3 ? "max-sm:hidden" : ""}`}
          >
            {d}
          </p>
        ))}

        <div className="relative" style={{ height: `calc(var(--fila) * ${MEDIAS_HORAS})` }}>
          {Array.from({ length: MEDIAS_HORAS / 2 }, (_, i) => (
            <span
              key={i}
              className="absolute right-2 -translate-y-1/2 text-[11px] tabular-nums text-[#2b2520]/45"
              style={{ top: `calc(var(--fila) * ${i * 2})` }}
            >
              {PRIMERA_HORA + i}
            </span>
          ))}
        </div>

        {DIAS.map((d, dia) => (
          <div
            key={d}
            className={`relative grid border-l border-black/[0.06] px-[3px] ${dia >= 3 ? "max-sm:hidden" : ""}`}
            style={{ gridTemplateRows: `repeat(${MEDIAS_HORAS}, var(--fila))` }}
          >
            {/* Lineas de cada hora. */}
            {Array.from({ length: MEDIAS_HORAS / 2 }, (_, i) => (
              <span
                key={i}
                aria-hidden
                className="pointer-events-none absolute inset-x-0 border-t border-black/[0.05]"
                style={{ top: `calc(var(--fila) * ${i * 2})` }}
              />
            ))}

            {TURNOS.map((t, i) =>
              t.dia !== dia ? null : (
                <div
                  key={`${t.hora}-${t.nombre}`}
                  data-turno
                  className={`relative z-10 my-[1.5px] flex min-w-0 flex-col justify-center overflow-hidden rounded-[6px] border px-1.5 leading-tight ${CANALES[t.canal].bloque}`}
                  style={
                    {
                      gridRow: `${fila(t.hora)} / span ${t.dura}`,
                      "--turno-retardo": `${RETARDO_BASE + ((i * SALTO) % TURNOS.length) * RETARDO_PASO}ms`,
                    } as React.CSSProperties
                  }
                >
                  <p className="flex items-center gap-1 truncate text-[11px] font-medium sm:text-[12px]">
                    <span className={`size-1.5 shrink-0 rounded-full ${CANALES[t.canal].punto}`} />
                    <span className="truncate">
                      <span className="max-sm:hidden">{t.hora} </span>
                      {t.nombre}
                    </span>
                  </p>
                  {t.dura > 1 && (
                    <p className="truncate pl-2.5 text-[11px] text-[#2b2520]/60 max-sm:hidden">{t.servicio}</p>
                  )}
                </div>
              ),
            )}
          </div>
        ))}
      </div>

      {/* Referencia de canales. */}
      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-black/[0.07] px-3 py-2.5 text-[11px] sm:gap-x-5 sm:px-4 sm:py-3 text-[#2b2520]/70 sm:text-[13px]">
        {(Object.keys(CANALES) as Canal[]).map((c) => (
          <li key={c} className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${CANALES[c].punto}`} />
            {CANALES[c].nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}

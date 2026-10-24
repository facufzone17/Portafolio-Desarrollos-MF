"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Link2 } from "lucide-react";
import { lenisActual } from "@/lib/useLenis";

/**
 * "Como funciona" contado como la vida de un turno: una clienta, desde que ve
 * la historia de Instagram hasta que se sienta en la silla. Reemplaza a los
 * tres pasos con video, que repetian lo que ya mostraban el hero y el antes y
 * despues (un cliente eligiendo horario) y no contaban lo que pasa despues de
 * reservar: la confirmacion, el recordatorio y el lado del dueño.
 *
 * Cada momento tiene su pantalla, lo que hace la clienta y una linea "Vos:"
 * con lo que hace el dueño, que casi siempre es nada.
 *
 * Escritorio: la seccion queda fija (sticky) mientras se scrollea la pista, y
 * el momento activo sale de cuanto se recorrio de ella: el recorrido se parte
 * en cinco tramos iguales. Sale de la posicion y no de eventos de entrada, asi
 * que saltar hacia atras desde la linea de tiempo deja marcado el correcto.
 * Mobile: un carrusel horizontal con snap, una tarjeta por momento.
 *
 * Las pantallas son HTML con los colores del negocio de ejemplo (Estudio
 * Nacar) y los de WhatsApp; los tamaños chicos son los de esa interfaz en
 * miniatura, no los del sitio.
 */

type Momento = {
  hora: string;
  rotulo: string;
  titulo: string;
  texto: string;
  vos: string;
  /** Si no esta en los tres planes. */
  plan?: string;
  Pantalla: () => React.ReactElement;
};

const MOMENTOS: Momento[] = [
  {
    hora: "Lunes, 21:40",
    rotulo: "Ve tu historia",
    titulo: "Martina ve tu historia y toca el link",
    texto: "Subís una historia con el link de reservas. Ella la ve a la noche, desde el sillón, y toca el link.",
    vos: "Nada. Estás en tu casa.",
    Pantalla: PantallaHistoria,
  },
  {
    hora: "21:41",
    rotulo: "Reserva sola",
    titulo: "Reserva en tres toques",
    texto: "Elige el servicio, un horario libre del jueves y deja su nombre y celular. Menos de un minuto.",
    vos: "Seguís sin hacer nada.",
    Pantalla: PantallaReserva,
  },
  {
    hora: "Al instante",
    rotulo: "Les llega a los dos",
    titulo: "A ella la confirmación, a vos el turno",
    texto: "Le llega la confirmación por WhatsApp, y en tu panel aparece el turno nuevo sin que nadie te escriba.",
    vos: "Lo ves cuando quieras: ya está en tu agenda.",
    Pantalla: PantallaConfirmacion,
  },
  {
    hora: "Miércoles, 15:30",
    rotulo: "Recordatorio",
    titulo: "Un día antes, el recordatorio",
    texto: "Le llega el recordatorio y confirma respondiendo 1. Si no puede, reprograma y el horario vuelve a quedar libre.",
    vos: "Sabés que viene, sin perseguir a nadie. Menos ausencias.",
    plan: "En Piloto automático",
    Pantalla: PantallaRecordatorio,
  },
  {
    hora: "Jueves, 15:30",
    rotulo: "Llega",
    titulo: "Llega. Vos la atendés",
    texto: "Martina llega a horario. En la agenda del día ya figura confirmada, y con un toque marcás que vino.",
    vos: "Atendiste. Cero mensajes para coordinar.",
    Pantalla: PantallaAgenda,
  },
];

export function VidaDeUnTurno() {
  const [activo, setActivo] = useState(0);
  const pista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cuadro = 0;
    const medir = () => {
      cuadro = 0;
      const el = pista.current;
      if (!el || el.offsetHeight === 0) return; // en mobile la pista no se muestra
      const recorrido = el.offsetHeight - window.innerHeight;
      const avance = Math.min(Math.max(-el.getBoundingClientRect().top / recorrido, 0), 0.9999);
      setActivo(Math.floor(avance * MOMENTOS.length));
    };
    const alScrollear = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
    };
  }, []);

  /** Lleva la pagina a la mitad del tramo de ese momento. */
  const irAMomento = (i: number) => {
    const el = pista.current;
    if (!el) return;
    const recorrido = el.offsetHeight - window.innerHeight;
    const y = el.getBoundingClientRect().top + window.scrollY + (recorrido * (i + 0.5)) / MOMENTOS.length;
    const lenis = lenisActual();
    if (lenis) lenis.scrollTo(y, { duration: 1.1, force: true });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      {/* Escritorio: pista alta con el panel fijo adentro. */}
      <div ref={pista} className="relative hidden lg:block" style={{ height: `${MOMENTOS.length * 70}svh` }}>
        <div className="sticky top-0 flex h-svh flex-col justify-center pt-20">
          <LineaDeTiempo activo={activo} alElegir={irAMomento} />
          <div className="mx-auto mt-12 grid w-full max-w-[980px] grid-cols-[auto_minmax(0,1fr)] items-center gap-16">
            <Celular>
              {MOMENTOS.map((m, i) => (
                <div
                  key={m.hora}
                  aria-hidden={i !== activo}
                  className="absolute inset-0 transition-[opacity,transform] duration-[var(--duration-state)] ease-[var(--ease-out-soft)]"
                  style={{
                    opacity: i === activo ? 1 : 0,
                    transform: i === activo ? "none" : `translateY(${i < activo ? -12 : 12}px)`,
                  }}
                >
                  <m.Pantalla />
                </div>
              ))}
            </Celular>
            <div className="relative min-h-[260px]">
              {MOMENTOS.map((m, i) => (
                <div
                  key={m.hora}
                  aria-hidden={i !== activo}
                  className="absolute inset-0 transition-[opacity,transform] duration-[var(--duration-state)] ease-[var(--ease-out-soft)]"
                  style={{
                    opacity: i === activo ? 1 : 0,
                    transform: i === activo ? "none" : `translateY(${i < activo ? -10 : 10}px)`,
                    pointerEvents: i === activo ? "auto" : "none",
                  }}
                >
                  <Texto momento={m} grande />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: carrusel horizontal con snap. */}
      <div className="-mx-5 lg:hidden">
        <p className="px-5 text-center text-sm text-text-muted">Deslizá para seguir el turno →</p>
        <ol className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none]">
          {MOMENTOS.map((m, i) => (
            <li key={m.hora} className="w-[82vw] max-w-[340px] shrink-0 snap-center">
              <p className="mb-3 flex items-center gap-2 text-sm text-text-muted">
                <span className="grid size-6 place-items-center rounded-full border border-azul/60 text-xs text-azul">
                  {i + 1}
                </span>
                {m.rotulo}
              </p>
              <Celular chico>
                <m.Pantalla />
              </Celular>
              <div className="mt-5">
                <Texto momento={m} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function LineaDeTiempo({ activo, alElegir }: { activo: number; alElegir: (i: number) => void }) {
  const ultimo = MOMENTOS.length - 1;
  return (
    <ol className="relative mx-auto grid w-full max-w-[980px] grid-cols-5">
      <span aria-hidden className="absolute inset-x-[10%] top-[13px] h-0.5 rounded-full bg-line-alto" />
      <span
        aria-hidden
        className="absolute left-[10%] top-[13px] h-0.5 rounded-full bg-azul transition-[width] duration-[var(--duration-state)] ease-[var(--ease-out-soft)]"
        style={{ width: `${(80 * activo) / ultimo}%` }}
      />
      {MOMENTOS.map((m, i) => (
        <li key={m.hora} className="relative">
          <button
            type="button"
            onClick={() => alElegir(i)}
            aria-current={i === activo ? "step" : undefined}
            className="group flex w-full flex-col items-center text-center"
          >
            <span
              className={`grid size-7 place-items-center rounded-full border-2 text-xs transition-colors duration-[var(--duration-micro)] ${
                i === activo
                  ? "border-azul bg-azul text-[#04121f]"
                  : i < activo
                    ? "border-azul bg-bg text-azul"
                    : "border-line-alto bg-bg text-text-muted group-hover:border-text-muted"
              }`}
            >
              {i + 1}
            </span>
            <span className={`mt-2 text-sm ${i === activo ? "text-text" : "text-text-muted"}`}>{m.hora}</span>
            <span className="text-sm text-text-muted">{m.rotulo}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function Texto({ momento: m, grande = false }: { momento: Momento; grande?: boolean }) {
  return (
    <div>
      <p className="text-sm text-azul">
        {m.hora}
        {m.plan && <span className="ml-2 text-text-muted">· {m.plan}</span>}
      </p>
      <h3 className={`mt-2 text-text ${grande ? "text-[clamp(1.75rem,2.6vw,2.5rem)]" : "text-2xl"}`}>{m.titulo}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-text-muted sm:text-base">{m.texto}</p>
      <p className="mt-5 border-t border-line pt-4 text-[15px] text-text sm:text-base">
        <span className="text-text-muted">Vos: </span>
        {m.vos}
      </p>
    </div>
  );
}

function Celular({ children, chico = false }: { children: React.ReactNode; chico?: boolean }) {
  return (
    <div
      className={`mx-auto rounded-[2.4rem] border border-line-alto bg-[#0c0c0c] p-[0.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.55)] ${
        chico ? "w-[240px]" : "w-[min(300px,calc((100svh-250px)*0.54))]"
      }`}
    >
      <div className="relative aspect-[390/720] overflow-hidden rounded-[2rem] bg-[#f6f2ec]">{children}</div>
    </div>
  );
}

/* --- Pantallas ------------------------------------------------------------ */

const MARRON = "#7a5634";

function PantallaHistoria() {
  return (
    <div className="absolute inset-0 bg-[#6b4a33] text-white">
      <div className="absolute inset-x-3 top-3 h-0.5 rounded-full bg-white/35">
        <div className="h-full w-3/5 rounded-full bg-white" />
      </div>
      <div className="absolute left-3 top-6 flex items-center gap-2 text-[12px]">
        <span className="grid size-7 place-items-center rounded-full bg-[#f6f2ec] text-[10px] font-medium text-[#6b4a33]">EN</span>
        estudionacar · 2 h
      </div>
      <p className="absolute inset-x-0 top-[34%] px-6 text-center text-[24px] leading-tight">
        Hay turnos para esta semana
      </p>
      <span className="absolute bottom-[18%] left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-4 py-2 text-[13px] text-[#2b2520]">
        <Link2 className="size-3.5" aria-hidden />
        Reservá tu turno
      </span>
    </div>
  );
}

function PantallaReserva() {
  const horas = ["10:00", "11:30", "13:00", "14:00", "15:30", "17:00"];
  return (
    <div className="absolute inset-0 flex flex-col px-4 pb-4 pt-6 text-[#2b2520]">
      <p className="text-[17px] font-medium">Elegí el horario</p>
      <p className="mt-1 text-[11px] text-[#8a7f72]">Jueves 30 · Limpieza facial</p>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {horas.map((h) => (
          <span
            key={h}
            className="rounded-[8px] border py-2 text-center text-[12px]"
            style={
              h === "15:30"
                ? { background: MARRON, borderColor: MARRON, color: "#f6f2ec" }
                : { background: "#fff", borderColor: "#e1d8cb" }
            }
          >
            {h}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-[8px] border border-[#e1d8cb] bg-white px-3 py-2 text-[12px]">
        Martina Gómez
        <span className="block text-[#8a7f72]">11 2345 6789</span>
      </div>
      <span className="mt-auto rounded-[10px] py-2.5 text-center text-[13px] text-[#f6f2ec]" style={{ background: MARRON }}>
        Confirmar turno
      </span>
    </div>
  );
}

function PantallaConfirmacion() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#ece5dd] px-3 pb-4 pt-5 text-[#111]">
      <p className="text-center text-[11px] text-[#666]">WhatsApp de Martina</p>
      <p className="mt-2 w-[88%] rounded-[10px] bg-white px-3 py-2 text-[12px] leading-snug">
        Hola Martina! Tu turno en Estudio Nácar quedó confirmado: <span className="font-medium">jueves 30 a las 15:30</span>,
        limpieza facial.
        <span className="block text-right text-[10px] text-[#888]">21:41</span>
      </p>
      <p className="mt-auto text-center text-[11px] text-[#666]">Tu celular</p>
      <div className="mt-2 flex items-start gap-2 rounded-[12px] bg-[#2b2520] px-3 py-2.5 text-[12px] text-[#f6f2ec]">
        <Bell className="mt-px size-4 shrink-0" aria-hidden />
        <span>
          <span className="block font-medium">Nuevo turno</span>
          Martina G. · jueves 30, 15:30
        </span>
      </div>
    </div>
  );
}

function PantallaRecordatorio() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#ece5dd] px-3 pt-5 text-[#111]">
      <p className="text-center text-[11px] text-[#666]">WhatsApp de Martina</p>
      <p className="mt-2 w-[88%] rounded-[10px] bg-white px-3 py-2 text-[12px] leading-snug">
        Hola Martina! Te recordamos tu turno de mañana a las 15:30 en Estudio Nácar. Respondé 1 para confirmar o 2 para
        reprogramar.
        <span className="block text-right text-[10px] text-[#888]">15:30</span>
      </p>
      <p className="ml-auto mt-2 rounded-[10px] bg-[#d9fdd3] px-3 py-2 text-[13px]">
        1<span className="ml-2 text-[10px] text-[#888]">15:34</span>
      </p>
      <p className="mt-2 w-fit rounded-[10px] bg-white px-3 py-2 text-[12px]">Listo, te esperamos!</p>
    </div>
  );
}

function PantallaAgenda() {
  const turnos: [string, string, boolean][] = [
    ["13:00", "Lucía B.", false],
    ["14:00", "Carla D.", false],
    ["15:30", "Martina G.", true],
    ["17:00", "Sofi R.", false],
  ];
  return (
    <div className="absolute inset-0 px-3 pt-5 text-[#2b2520]">
      <p className="text-[17px] font-medium">Hoy, jueves 30</p>
      <p className="mt-0.5 text-[11px] text-[#8a7f72]">6 turnos · 5 confirmados</p>
      <ul className="mt-3 flex flex-col gap-1.5">
        {turnos.map(([h, n, vino]) => (
          <li
            key={h}
            className="flex items-center gap-2 rounded-[10px] border bg-white px-2.5 py-2 text-[12px]"
            style={{ borderColor: vino ? MARRON : "#e7dfd3" }}
          >
            <span className="w-9 font-medium">{h}</span>
            <span className="flex-1">{n}</span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px]"
              style={vino ? { background: MARRON, color: "#f6f2ec" } : { background: "#e3f2e6", color: "#2f6a3f" }}
            >
              {vino ? "Vino ✓" : "Confirmado"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

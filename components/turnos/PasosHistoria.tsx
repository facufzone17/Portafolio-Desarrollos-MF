"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useMovimientoReducido } from "@/lib/useMovimientoReducido";

/**
 * "Como funciona" en tres pasos que avanzan solos, con las barritas de
 * progreso de las historias de Instagram: el formato que el dueño de un
 * negocio ya usa todos los dias.
 *
 * Reemplaza al video de un minuto con controles, que casi nadie terminaba.
 * Cada paso es un clip de 10 a 14 s cortado de ese mismo video (los rotulos
 * de arriba vienen grabados en el clip); el completo queda a un link.
 *
 * Solo corre mientras esta en pantalla. Con movimiento reducido no arranca
 * solo: queda el poster y el video lleva controles para darle play a mano.
 */

type Paso = {
  titulo: string;
  texto: string;
  /** En que planes esta. */
  planes: string;
  video: string;
  poster: string;
};

const PASOS: Paso[] = [
  {
    titulo: "Tu cliente reserva solo",
    texto:
      "Toca el link de tu Instagram o entra a tu web, elige servicio, día y un horario libre, y deja su nombre y celular. Sin escribirte.",
    planes: "En los tres planes",
    video: "/turnos/paso-reserva.mp4",
    poster: "/turnos/paso-reserva.webp",
  },
  {
    titulo: "O te escribe, y el bot le agenda",
    texto:
      "Le contesta al instante, le ofrece los horarios libres y le reserva el turno en la misma charla. Antes del turno le manda el recordatorio.",
    planes: "En Piloto automático",
    video: "/turnos/paso-bot.mp4",
    poster: "/turnos/paso-bot.webp",
  },
  {
    titulo: "Todo cae en tu agenda",
    texto:
      "Los turnos del link, de la web y del bot aparecen solos en tu panel. Lo abrís desde el celular: ves el día y la semana, bloqueás horarios y marcás quién vino.",
    planes: "En los tres planes",
    video: "/turnos/paso-agenda.mp4",
    poster: "/turnos/paso-agenda.webp",
  },
];

export function PasosHistoria() {
  const [paso, setPaso] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const quieto = useMovimientoReducido();
  const caja = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const visible = useRef(false);

  // Play mientras se ve, pausa cuando no.
  useEffect(() => {
    const el = caja.current;
    if (!el || quieto) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        const v = video.current;
        if (!v) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [quieto]);

  const elegir = (i: number) => {
    setPaso(i);
    setProgreso(0);
  };

  const actual = PASOS[paso];

  return (
    <div className="mx-auto grid max-w-[980px] items-center gap-10 md:grid-cols-[minmax(0,330px)_minmax(0,1fr)] md:gap-16">
      <div ref={caja} className="relative mx-auto w-full max-w-[330px]">
        <div className="relative overflow-hidden rounded-card border border-line bg-bg-elev shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          <video
            // La key rearma el video en cada paso: arranca de cero y con su poster.
            key={actual.video}
            ref={video}
            src={actual.video}
            poster={actual.poster}
            muted
            playsInline
            preload="metadata"
            controls={quieto}
            aria-label={`Demo de ejemplo: ${actual.titulo}`}
            onLoadedData={(e) => {
              if (!quieto && visible.current) e.currentTarget.play().catch(() => {});
            }}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProgreso(v.currentTime / v.duration);
            }}
            onEnded={() => elegir((paso + 1) % PASOS.length)}
            className="aspect-[9/16] w-full bg-black object-cover"
          />

          {/* Barritas de historia. */}
          <div className="absolute inset-x-3 top-3 flex gap-1.5" aria-hidden>
            {PASOS.map((p, i) => (
              <span key={p.video} className="h-[3px] flex-1 overflow-hidden rounded-full bg-black/15">
                <span
                  className="block h-full rounded-full bg-[#2b2520]/70 transition-[width] duration-300 ease-linear"
                  style={{ width: `${i < paso ? 100 : i === paso ? progreso * 100 : 0}%` }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <ol className="flex flex-col gap-3">
          {PASOS.map((p, i) => (
            <li key={p.video}>
              <button
                type="button"
                onClick={() => elegir(i)}
                aria-current={i === paso ? "step" : undefined}
                className={`w-full rounded-card border p-5 text-left transition-colors duration-[var(--duration-micro)] ${
                  i === paso
                    ? "border-azul/50 bg-azul/[0.06]"
                    : "border-line bg-bg-elev hover:bg-bg-alto"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className={`text-xl ${i === paso ? "text-text" : "text-text/80"}`}>{p.titulo}</span>
                  {i !== paso && <Play className="size-4 shrink-0 text-text-muted" aria-hidden />}
                </span>
                <span className="mt-2 block text-[15px] leading-relaxed text-text-muted">{p.texto}</span>
                <span className={`mt-3 block text-sm ${i === paso ? "text-azul" : "text-text-muted"}`}>
                  {p.planes}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-sm leading-relaxed text-text-muted">
          Así es la demo personalizada que te mandamos, pero con tu marca, tus servicios y tus precios.{" "}
          <a
            href="/turnos/recorrido.mp4"
            target="_blank"
            rel="noopener"
            className="text-text underline decoration-line-alto underline-offset-4 transition-colors hover:decoration-text"
          >
            Ver el recorrido completo (1 min)
          </a>
        </p>
      </div>
    </div>
  );
}

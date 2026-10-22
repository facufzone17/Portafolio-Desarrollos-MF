"use client";

import { useEffect, useRef } from "react";

/**
 * Celular con un clip de la demo adentro.
 *
 * Los clips son la pantalla cruda (390 x 844, sin rotulos): el marco y los
 * textos los pone la pagina. Se reproducen solo mientras estan en pantalla —
 * cuatro videos en loop a la vez se comen la bateria de un celular — y con
 * movimiento reducido queda el poster quieto.
 */
export function Telefono({
  video,
  poster,
  etiqueta,
  className = "",
  prioridad = false,
}: {
  video?: string;
  poster: string;
  /** Lo que muestra, para lectores de pantalla. */
  etiqueta: string;
  className?: string;
  /** El del hero: el poster carga ya, no cuando se acerca. */
  prioridad?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div
      // Sin `relative` propio: quien lo usa decide el posicionamiento (en el
      // hero van `absolute`, y dos utilidades de posicion se pisan).
      className={`aspect-[390/844] rounded-[2.6rem] border border-line-alto bg-[#0c0c0c] p-[0.55rem] shadow-[0_30px_80px_rgba(0,0,0,0.55)] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-bg-alto">
        {video ? (
          <video
            ref={ref}
            src={video}
            poster={poster}
            muted
            loop
            playsInline
            preload={prioridad ? "auto" : "none"}
            aria-label={etiqueta}
            className="h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={etiqueta}
            loading={prioridad ? "eager" : "lazy"}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}

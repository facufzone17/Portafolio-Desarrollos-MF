"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarCheck, X } from "lucide-react";

/**
 * Aviso de la home que lleva a /turnos (pedido de Facundo, 22/10/2026): una
 * notificacion chica abajo a la derecha que pregunta si el negocio trabaja con
 * turnos.
 *
 * Cuando aparece, y por que:
 *  - Recien despues de que el visitante pasa el hero. Si saltara apenas carga,
 *    competiria con el titular y con la pantalla de entrada, que es lo primero
 *    que tiene que ver.
 *  - Nunca mientras corre la entrada (`html.preloader-corriendo`).
 *  - Se esconde mientras el contacto esta en pantalla: ahi abajo vive el
 *    compositor de WhatsApp y el aviso le taparia el boton.
 *  - Cerrado, no vuelve por una semana en ese navegador. Un aviso que reaparece
 *    en cada visita es un popup, y Facundo ya saco el globo flotante de
 *    WhatsApp por romper la estetica.
 */
const CLAVE = "trevoo-aviso-turnos-cerrado";
const SEMANA = 7 * 24 * 60 * 60 * 1000;

function cerradoHacePoco(): boolean {
  try {
    const t = Number(localStorage.getItem(CLAVE));
    return Number.isFinite(t) && Date.now() - t < SEMANA;
  } catch {
    return false;
  }
}

export function AvisoTurnos() {
  const [pasoElHero, setPasoElHero] = useState(false);
  const [contactoVisible, setContactoVisible] = useState(false);
  const [cerrado, setCerrado] = useState(false);

  useEffect(() => {
    // Cerrado hace poco: nunca se engancha al scroll y queda escondido.
    if (cerradoHacePoco()) return;

    const alScroll = () => {
      const corriendo = document.documentElement.classList.contains("preloader-corriendo");
      if (!corriendo && window.scrollY > window.innerHeight * 0.85) setPasoElHero(true);
    };
    // Si se recarga ya scrolleado, se evalua en el primer cuadro.
    const raf = requestAnimationFrame(alScroll);
    window.addEventListener("scroll", alScroll, { passive: true });

    const contacto = document.getElementById("contacto");
    const io = contacto
      ? new IntersectionObserver(([e]) => setContactoVisible(e.isIntersecting), {
          threshold: 0.05,
        })
      : null;
    if (contacto) io?.observe(contacto);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", alScroll);
      io?.disconnect();
    };
  }, []);

  const cerrar = () => {
    setCerrado(true);
    try {
      localStorage.setItem(CLAVE, String(Date.now()));
    } catch {}
  };

  const visible = pasoElHero && !contactoVisible && !cerrado;

  return (
    <aside
      aria-label="Planes para negocios con turnos"
      data-aviso-turnos
      data-visible={visible ? "" : undefined}
      // Fuera de pantalla no se puede enfocar ni anunciar.
      inert={!visible}
      className="fixed inset-x-4 bottom-4 z-40 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px]"
    >
      <div className="relative rounded-card border border-line-alto bg-bg-elev/95 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-[6px]">
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar aviso"
          className="absolute top-2.5 right-2.5 grid size-10 place-items-center rounded-card text-text-muted transition-colors hover:bg-bg-alto hover:text-text"
        >
          <X className="size-4" aria-hidden />
        </button>

        <div className="flex gap-4 pr-8">
          <span className="grid size-11 shrink-0 place-items-center rounded-card bg-azul text-[#04121f]">
            <CalendarCheck className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-display text-lg leading-tight font-medium tracking-[-0.03em] text-text">
              ¿Tenés un negocio que trabaja con turnos?
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
              Mirá cómo tus clientes pueden sacar turno solos, sin escribirte.
            </p>
          </div>
        </div>

        <Link
          href="/turnos"
          data-boton="claro"
          data-analytics="aviso-turnos"
          className="mt-4 w-full"
        >
          Ver planes y precios
        </Link>
      </div>
    </aside>
  );
}

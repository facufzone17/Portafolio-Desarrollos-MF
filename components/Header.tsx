"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { site, whatsappUrl } from "@/lib/site";

/**
 * Barra del sitio. Transparente arriba de todo; en cuanto se scrollea aparece
 * el negro con desenfoque para que el logo no se pierda sobre una captura.
 *
 * La marca va a la izquierda y no centrada, como en la referencia
 * (markiqsaas.framer.website): isotipo y palabra juntos, el isotipo un punto
 * mas grande. A la derecha, la unica accion del sitio.
 *
 * El logo es, en la ficha de proyecto, la salida permanente al portafolio: que
 * nadie quede atrapado dentro del iframe.
 *
 * `data-logo-marca` lo lee el preloader: es el destino exacto al que vuela el
 * isotipo antes de que el overlay se desvanezca. Mientras la entrada corre,
 * este logo esta invisible (regla `html.preloader-corriendo` en globals.css) —
 * si no, se verian dos isotipos a la vez en el ultimo cuadro.
 */
export function Header() {
  const [scrolleado, setScrolleado] = useState(false);

  useEffect(() => {
    const alScroll = () => setScrolleado(window.scrollY > 24);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-[var(--duration-state)] ease-[var(--ease-out-soft)]
        ${scrolleado ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"}`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 sm:h-18 sm:px-8">
        <Link
          href="/"
          data-logo-marca
          className="flex items-center text-text"
          aria-label={`${site.name}, ir al inicio`}
        >
          <Logo className="text-[19px] sm:text-[21px]" />
        </Link>

        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics="cta-header"
          className="inline-flex min-h-10 items-center rounded-card border border-line bg-bg-elev px-4 text-sm
            text-text transition-colors duration-[var(--duration-micro)]
            hover:border-line-alto hover:bg-bg-alto sm:min-h-11 sm:px-5"
        >
          Contactanos
        </a>
      </div>
    </header>
  );
}

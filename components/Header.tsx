"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";

/**
 * Header sticky. Transparente arriba de todo, para no competir con el humo del
 * hero; en cuanto se scrollea aparece una barra crema con desenfoque.
 *
 * Ese cambio no es decorativo: con la paleta clara, el contenido que pasa por
 * debajo son fotos y capturas claras, y sobre ellas el nombre se perdia. Antes
 * el fondo negro del sitio lo resolvia solo.
 *
 * Logo y nombre centrados — no hay navegacion de secciones ni CTA, el contacto
 * vive en los iconos del hero y en la seccion "Contacto".
 *
 * El logo sigue siendo, en la ficha de proyecto, la salida permanente al
 * portafolio: que nadie quede atrapado dentro del iframe (§2, control y
 * libertad).
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
      // La marca la usa la zona de piedra para apagarla: sobre el marron, la
      // barra crema con su linea abajo es una banda que no tiene que estar.
      data-barra-sitio
      className={`sticky top-0 z-50 transition-colors duration-[var(--duration-state)] ease-[var(--ease-out-soft)]
        ${scrolleado ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent"}`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-center px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-text"
          aria-label={`${site.name} — ir al inicio`}
        >
          <Logo className="h-6 w-auto" />
          <span className="text-[15px] tracking-tight">{site.name}</span>
        </Link>
      </div>
    </header>
  );
}

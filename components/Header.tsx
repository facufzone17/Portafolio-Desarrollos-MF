"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { lenisActual } from "@/lib/useLenis";
import { irASeccion } from "@/lib/irASeccion";
import { secciones, site, whatsappUrl } from "@/lib/site";

/**
 * Barra del sitio, copiada de la referencia (applio.framer.website) y medida
 * en vivo sobre ella a 1440px de ancho:
 *
 *              en reposo            scrolleada
 *   ancho      1220px               818px
 *   alto       67px                 67px  (no cambia)
 *   radio      22px                 22px
 *   fondo      blanco al 10%        blanco al 80%
 *   blur       5px                  5px
 *   sombra     transparente         0 16px 40px negro al 5%
 *
 * Lo unico que se aparta de la referencia es el color del estado scrolleado:
 * alla el sitio es claro y la pastilla se va a blanco; aca la pagina es negra,
 * asi que se va al tono de la pagina (bg-elev). Facundo lo pidio asi.
 *
 * El alto NO cambia, y eso importa: la pastilla se angosta, no se achica. Si
 * tambien bajara de alto, el logo y los links tendrian que reacomodarse a
 * mitad del scroll y se veria el salto.
 */

/** Px de scroll a partir de los cuales la barra se contrae. */
const UMBRAL = 40;

export function Header() {
  const [contraida, setContraida] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const alScroll = () => setContraida(window.scrollY > UMBRAL);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  /**
   * El logo lleva al inicio. Si ya estamos en la home, un `<Link href="/">` no
   * hace nada (misma ruta) y encima Lenis maneja el scroll: hay que llevarlo
   * arriba a mano. Fuera de la home, se deja navegar normal.
   */
  const alClicLogo = (e: React.MouseEvent) => {
    if (pathname !== "/") return;
    e.preventDefault();
    const lenis = lenisActual();
    if (lenis) lenis.scrollTo(0, { duration: 1.1, force: true });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "/");
  };

  /**
   * Los links de seccion apuntan a `/#id`, no a `#id` a secas.
   *
   * Con `#id` el ancla se resuelve contra la pagina actual: parado en
   * /aviso-legal o /privacidad ese elemento no existe y el click no hacia
   * nada. Con `/#id` el `<Link>` navega a la home y el scroll lo termina
   * `ScrollAlNavegar`.
   *
   * Estando ya en la home no dejamos navegar: el salto nativo del ancla pelea
   * con Lenis por el mismo numero. Lo hacemos nosotros, suave y descontando el
   * alto de la barra, y la URL se actualiza igual para que se pueda copiar.
   */
  const alClicSeccion = (e: React.MouseEvent, id: string) => {
    if (pathname !== "/") return;
    if (!irASeccion(id)) return;
    e.preventDefault();
    window.history.replaceState(null, "", `/#${id}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-6">
      <div
        className={`flex h-[67px] w-full items-center justify-between gap-6 rounded-[22px]
          px-3 backdrop-blur-[5px] transition-[max-width,background-color,box-shadow,border-color]
          duration-[520ms] ease-[var(--ease-out-soft)] sm:px-4
          ${
            contraida
              ? "max-w-[818px] border border-line bg-bg-elev/85 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
              : "max-w-[1220px] border border-white/12 bg-white/10 shadow-[0_16px_40px_rgba(0,0,0,0)]"
          }`}
      >
        <Link
          href="/"
          onClick={alClicLogo}
          data-logo-marca
          className="flex shrink-0 items-center pl-2 text-white"
          aria-label={`${site.name}, ir al inicio`}
        >
          <Logo className="text-[18px]" />
        </Link>

        {/*
          Los links del medio se esconden abajo de lg: cinco secciones no
          entran en la pastilla sin partirse en dos renglones, y una barra de
          dos renglones en escritorio es diseño roto.
        */}
        <nav
          aria-label="Secciones"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {secciones.map((s) => (
            <Link
              key={s.id}
              href={`/#${s.id}`}
              onClick={(e) => alClicSeccion(e, s.id)}
              className="group rounded-card px-3 py-2 text-[15px] whitespace-nowrap text-white/75 transition-colors duration-[var(--duration-micro)] hover:text-white"
            >
              <TextoDeslizante>{s.label}</TextoDeslizante>
            </Link>
          ))}
        </nav>

        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics="cta-header"
          data-boton="oscuro"
          className="group shrink-0"
        >
          <TextoDeslizante>Contactanos</TextoDeslizante>
        </a>
      </div>
    </header>
  );
}

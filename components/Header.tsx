"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

/**
 * La barra se estaciona arriba de la demo embebida en vez de taparla.
 *
 * Fija, la barra le caia encima al header del sitio que corre adentro del
 * iframe y no se podia navegar (pedido de Facundo, 13/10/2026). Ahora:
 *
 *  - Bajando, cuando el borde de arriba del recuadro llega a `PEGADA` px del
 *    filo de la pantalla, la barra se engancha a el y sube con la pagina,
 *    como si estuviera apoyada encima. Atada al scroll, sin transicion: se
 *    frena justo donde no tapa y se va con el recuadro.
 *  - Mientras el recuadro ocupa la franja de la barra, la barra queda afuera.
 *  - Cuando el recuadro termina de pasar por arriba, la barra vuelve a entrar
 *    deslizandose. Subiendo es el camino inverso: se va al aparecer el
 *    recuadro por arriba y se vuelve a enganchar al borde de arriba.
 *
 * La entrada de abajo es una transicion y no va atada al scroll a proposito:
 * engancharla al borde de abajo del recuadro la haria subir desde el medio de
 * la pantalla, y bajarla mientras la pagina sube la cruzaria con la demo.
 */
const TOPE = 24; // pt-6 del <header>
const ALTO = 67;
/** Distancia entre la barra estacionada y el recuadro (medida en la captura). */
const SEPARACION = 14;
/** Linea donde se estaciona el borde de arriba del recuadro. */
const PEGADA = TOPE + ALTO + SEPARACION;
/** Cuanto subir la barra para sacarla de pantalla, sombra incluida. */
const FUERA = TOPE + ALTO + 60;

export function Header() {
  const [contraida, setContraida] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let actual = 0;

    const ubicar = () => {
      // Se busca en cada cuadro: el recuadro vive en la pagina, no en el
      // layout, y aparece o desaparece al navegar sin que el header remonte.
      const marco = document.querySelector("[data-demo-marco]");
      let destino = 0;
      if (marco) {
        const r = marco.getBoundingClientRect();
        if (r.top < PEGADA && r.bottom > TOPE - SEPARACION) {
          destino = Math.max(r.top - PEGADA, -FUERA);
        }
      }
      if (destino === actual) return;
      // Un salto (entrar o salir con el recuadro ya pasado) se anima; el
      // enganche al borde de arriba va cuadro a cuadro con el scroll.
      const salto = Math.abs(destino - actual) > 40;
      header.style.transition = salto
        ? "transform 520ms var(--ease-out-soft)"
        : "none";
      header.style.transform = destino ? `translateY(${destino}px)` : "";
      actual = destino;
    };

    ubicar();
    window.addEventListener("scroll", ubicar, { passive: true });
    window.addEventListener("resize", ubicar);
    return () => {
      window.removeEventListener("scroll", ubicar);
      window.removeEventListener("resize", ubicar);
      header.style.transform = "";
      header.style.transition = "";
    };
  }, [pathname]);

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
    <header
      ref={headerRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-6"
    >
      <div
        className={`pointer-events-auto flex h-[67px] w-full items-center justify-between gap-6 rounded-[22px]
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

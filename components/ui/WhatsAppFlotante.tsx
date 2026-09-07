"use client";

import { useEffect, useState } from "react";
import { IconWhatsApp } from "@/components/ui/IconWhatsApp";
import { mensajes, whatsappUrl } from "@/lib/site";

/**
 * Boton flotante de WhatsApp, abajo a la derecha.
 *
 * Coherente con el resto del sitio y no con el globo verde de siempre:
 *
 *  - Fondo blanco y el glifo de WhatsApp en el negro del boton. Se reconoce la
 *    marca por la forma; el verde no entra a la paleta (regla del sistema).
 *  - Radio 10px, el unico de la pagina. No es una pastilla ni un circulo.
 *  - Aparece recien despues del hero (300px de scroll), con un fundido corto y
 *    la misma curva que usa todo el sitio; antes molestaria al CTA del hero.
 *  - En reposo respira apenas (3px, propiedad `translate`) para que se note que
 *    es tocable; al pasar el cursor crece igual que cualquier boton (propiedad
 *    `scale`, asi no pelea con el `translate` del respiro).
 *  - En escritorio, al pasar el cursor asoma la etiqueta "Escribinos".
 *
 * Con `prefers-reduced-motion` no respira ni se desplaza al entrar: aparece y
 * queda quieto.
 */
export function WhatsAppFlotante() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > 300);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  return (
    <a
      href={whatsappUrl(mensajes.general)}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics="cta-flotante"
      aria-label="Escribinos por WhatsApp"
      data-wa-flotante
      data-visible={visible ? "" : undefined}
      className="group fixed right-5 bottom-5 z-40 flex items-center gap-3 sm:right-6 sm:bottom-6"
    >
      <span
        data-wa-etiqueta
        className="pointer-events-none hidden rounded-card border border-line bg-bg-elev/90 px-3 py-2 text-sm text-text shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-[5px] lg:block"
      >
        Escribinos
      </span>

      <span
        data-wa-nucleo
        className="grid size-14 place-items-center rounded-card bg-white text-[#0c0c0c] shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
      >
        <IconWhatsApp className="size-7" />
      </span>
    </a>
  );
}

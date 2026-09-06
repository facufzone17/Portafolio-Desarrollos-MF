import { MessageCircle } from "lucide-react";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { whatsappUrl } from "@/lib/site";

/**
 * La accion primaria del sitio. Boton blanco con texto negro: es lo que mas
 * contrasta sobre fondo oscuro (19,9:1) y deja el azul libre para la
 * atmosfera. El verde de WhatsApp iria solo en el icono, nunca en el boton.
 *
 * La forma, el color y el gesto NO se escriben aca: salen de `data-boton`, que
 * es el unico lugar del proyecto donde vive el aspecto de un boton. Antes esta
 * tarjeta traia su propio radio, su propio hover y su propia escala, y por eso
 * el CTA del contacto se veia distinto del CTA del hero.
 *
 * `children` es string y no ReactNode a proposito: el texto se parte letra por
 * letra para el efecto de deslizamiento, y eso solo se puede hacer sobre
 * texto plano.
 */
export function CtaWhatsApp({
  mensaje,
  children = "Contactanos",
  size = "md",
  className = "",
}: {
  mensaje?: string;
  children?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <a
      href={whatsappUrl(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics="cta-whatsapp"
      data-boton="claro"
      className={`group ${size === "md" ? "min-h-[52px] px-6 text-base" : ""} ${className}`}
    >
      <MessageCircle className="size-[1.15em] shrink-0" aria-hidden />
      <TextoDeslizante>{children}</TextoDeslizante>
    </a>
  );
}

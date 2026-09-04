import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

/**
 * La accion primaria del sitio (§1). Boton blanco con texto negro: es lo que
 * mas contrasta sobre fondo oscuro (19,9:1) y deja el azul libre para la
 * atmosfera. El verde de WhatsApp iria solo en el icono, nunca en el boton.
 */
export function CtaWhatsApp({
  mensaje,
  children = "Hablemos por WhatsApp",
  size = "md",
  className = "",
}: {
  mensaje?: string;
  children?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  // min-h-11 = 44px: el minimo tocable del §2 (B1).
  const sizes = {
    sm: "min-h-11 px-4 text-sm",
    md: "min-h-[52px] px-6 text-base",
  };

  return (
    <a
      href={whatsappUrl(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics="cta-whatsapp"
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-btn)]
        bg-text font-medium text-bg transition-transform duration-[var(--duration-micro)]
        ease-out hover:scale-[1.02] active:scale-[0.99] ${sizes[size]} ${className}`}
    >
      <MessageCircle className="size-[1.15em] shrink-0" aria-hidden />
      {children}
    </a>
  );
}

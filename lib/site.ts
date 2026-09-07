/**
 * Datos de marca y contacto. Fuente unica.
 *
 * Ningun componente hardcodea nombre, telefono, mail ni dominio: todo sale de
 * aca. El cambio de "Desarrollos MF" a "Trevoo" (04/09/2026) se hizo tocando
 * este archivo y la marca en lib/marca.ts, no buscando el nombre por el arbol.
 */

export const site = {
  name: "Trevoo",
  title: "Trevoo: sitios, tiendas, paneles y automatizaciones",
  description:
    "Construimos sitios web, tiendas online, paneles de gestión y automatizaciones para negocios. Mirá nuestros proyectos funcionando.",

  /** Formato internacional sin signos, para wa.me: 54 + 9 + 11 + numero. */
  whatsapp: "5491122728576",
  /** Formato local, para mostrar. */
  whatsappDisplay: "+54 9 11 2272-8576",

  email: "desarrollosmf00@gmail.com",

  /**
   * FALTA: usuario de Instagram. Mientras sea null el icono no se renderiza.
   * Un icono que lleva a ningun lado es peor que no tenerlo (§9.1).
   */
  instagram: null as string | null,

  /** Se reemplaza cuando se compre el dominio. */
  url: "http://localhost:3000",
} as const;

/** Mensajes prellenados de WhatsApp (§10.7). */
export const mensajes = {
  general:
    "Hola, vi el portafolio de Trevoo y quiero consultarles por un proyecto.",
  proyecto: (proyecto: string) =>
    `Hola, vi la demo de ${proyecto} en el portafolio y quiero algo así para mi negocio.`,
  servicio: (servicio: string) =>
    `Hola, vi la sección de ${servicio} en el portafolio de Trevoo y quiero algo así para mi negocio.`,

  /**
   * Lo que se manda cuando el visitante escribio el mensaje en el sitio
   * (components/contacto/MensajeWhatsApp.tsx).
   *
   * Su texto va solo, SIN el "Hola, vi el portafolio" de `general`: pegarle
   * adelante una frase que el no escribio le convierte el mensaje en el de un
   * formulario, que es justo lo contrario de por que existe el compositor. La
   * unica linea que agregamos dice de donde salio la consulta, porque si no
   * llegan todas sin origen.
   */
  compuesto: (texto: string) =>
    `Hola, les escribo desde el sitio de Trevoo.\n\n${texto.trim()}`,
} as const;

/** Link a WhatsApp con mensaje prellenado. */
export function whatsappUrl(mensaje: string = mensajes.general): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Link de mail. */
export const mailtoUrl = `mailto:${site.email}`;

/** Instagram, o null si todavia no se sabe el usuario. */
export function instagramUrl(): string | null {
  return site.instagram ? `https://instagram.com/${site.instagram}` : null;
}

/**
 * Secciones de la home, en orden. Los ids son los anclas reales de cada
 * bloque y las etiquetas son las que se dibujan en la barra.
 *
 * Son cortas de una palabra a proposito: la barra se contrae a 818px al
 * scrollear (medido sobre la referencia) y con etiquetas como "Que
 * construimos" los cinco links se parten en dos renglones. Una barra de dos
 * renglones en escritorio es diseño roto.
 */
export const secciones = [
  { id: "proyectos", label: "Proyectos" },
  { id: "servicios", label: "Servicios" },
  { id: "como-trabajamos", label: "Proceso" },
  { id: "quienes-somos", label: "Nosotros" },
  { id: "contacto", label: "Contacto" },
] as const;

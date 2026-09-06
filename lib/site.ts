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
 * Secciones de la home, en orden. Los `id` son los anclas reales de cada
 * bloque. Hoy no alimenta ninguna barra de navegacion: la home se recorre
 * scrolleando, por decision de Facundo.
 */
export const secciones = [
  { id: "proyectos", label: "Proyectos" },
  { id: "servicios", label: "Qué construimos" },
  { id: "como-trabajamos", label: "Cómo trabajamos" },
  { id: "quienes-somos", label: "Quiénes somos" },
  { id: "contacto", label: "Contacto" },
] as const;

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

  email: "trevoo.proyectos@gmail.com",

  /**
   * Usuario de Instagram (08/09/2026). Mientras fue null el icono no se
   * renderizaba: un icono que lleva a ningun lado es peor que no tenerlo
   * (§9.1). Con el usuario puesto, el bloque aparece solo en el contacto y en
   * el pie.
   *
   * Son TRES guiones bajos al final, no dos ni cuatro. Es facil equivocarse
   * copiandolo a mano.
   */
  instagram: "trevoo___" as string | null,

  /** Se reemplaza cuando se compre el dominio. */
  url: "http://localhost:3000",
} as const;

/** Mensajes prellenados de WhatsApp (§10.7). */
export const mensajes = {
  general:
    "Hola, vi el portafolio de Trevoo y quiero consultarles por un proyecto.",
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

  /**
   * Con lo que arranca el compositor cuando se llega desde la ficha de un
   * proyecto (`/?proyecto=<nombre>#contacto`).
   *
   * NO empieza con "Hola" a proposito: esto entra dentro de `compuesto()`, que
   * ya pone el saludo y la linea de origen. Empezando con "Hola" el mensaje
   * final saludaba dos veces.
   *
   * Es una semilla, no un texto fijo: el visitante la puede editar o borrar.
   */
  desdeProyecto: (proyecto: string) =>
    `Vi la demo de ${proyecto} y quiero algo así para mi negocio.`,
} as const;

/** Link a WhatsApp con mensaje prellenado. */
export function whatsappUrl(mensaje: string = mensajes.general): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Link de mail para quien SI tiene cliente de correo: el celular, sobre todo,
 * donde `mailto:` abre Gmail o Mail y anda perfecto.
 */
export const mailtoUrl = `mailto:${site.email}`;

/**
 * Compositor de Gmail en el navegador, con el destinatario ya puesto.
 *
 * En escritorio `mailto:` es una trampa: Chrome sin handler de correo
 * registrado abre una pestaña en blanco de Google y el visitante se queda sin
 * escribir nada, sin ningun error que se lo explique. No hay forma de detectar
 * desde la web si hay cliente configurado, asi que la decision se toma por el
 * tipo de dispositivo (ver components/ui/LinkMail.tsx).
 *
 * `view=cm&fs=1` es "compose, pantalla completa". Si la persona no tiene sesion
 * abierta, Gmail la manda a entrar y vuelve al compositor con el `to` intacto.
 */
export const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  site.email,
)}`;

/**
 * Link de llamada. Es el MISMO telefono que el de WhatsApp, por eso sale de la
 * misma constante y no de un numero suelto que despues se desincroniza.
 *
 * OJO CON EL 9: en formato internacional los celulares argentinos llevan un 9
 * despues del +54, y asi esta guardado (`5491122728576`). Desde afuera del
 * pais es lo correcto; adentro, algunos discadores lo toleran y otros no.
 * ESTO HAY QUE PROBARLO EN UN TELEFONO DE VERDAD antes de darlo por bueno: si
 * falla, la version sin el 9 es `tel:+541122728576`.
 */
export const telUrl = `tel:+${site.whatsapp}`;

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

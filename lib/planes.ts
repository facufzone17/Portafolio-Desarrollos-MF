/**
 * Planes de la landing de turnos (/turnos). Fuente unica de nombres, precios y
 * que incluye cada uno: la seccion de planes, el formulario y el mensaje de
 * WhatsApp leen de aca.
 *
 * Precios que paso Facundo el 22/10/2026. Pago unico por armarlo, mas el
 * mensual, que es el mismo para los tres.
 *
 * Precio de lanzamiento (23/10/2026): `precio` es lo que se cobra hoy y
 * `precioLista` lo que se cobra cuando termina el lanzamiento, y se muestra
 * tachado. Los $345.000 de Agenda son un precio que ya se cobro; los de
 * Vidriera y Piloto salen de aplicarles el mismo ~20% y redondear a un 20%
 * justo. El tachado solo es honesto si despues del lanzamiento esos pasan a
 * ser los precios de verdad.
 */

export type IdPlan = "agenda" | "vidriera" | "piloto";

export type Plan = {
  id: IdPlan;
  nombre: string;
  /** Lo que es, en una linea y en idioma de comerciante. */
  resumen: string;
  /** Para quien conviene. */
  paraQuien: string;
  precio: number;
  /** Precio despues del lanzamiento; va tachado al lado de `precio`. */
  precioLista: number;
  /** Lo que suma respecto del plan anterior (o todo, en el primero). */
  incluye: string[];
  /** Lo que gana el dueño. */
  vos: string[];
  /** Clip vertical de la demo (public/turnos). */
  video: string;
  poster: string;
  /** Resalta la tarjeta y lleva esta etiqueta llena. Uno solo: el del medio. */
  destacado?: string;
  /** Etiqueta verde y resalte suave de la tarjeta: distingue sin competir con el destacado. */
  etiqueta?: string;
};

export const MENSUAL = 38600;

export const incluyeMensual = [
  "Hosting y dominio",
  "Mantenimiento y actualizaciones",
  "Rondas de cambios: servicios, precios, textos y fotos",
];

export const planes: Plan[] = [
  {
    id: "agenda",
    nombre: "Agenda",
    resumen: "Tu link de reservas: tus clientes sacan turno online, a cualquier hora.",
    paraQuien:
      "Para el que ya se mueve por Instagram y WhatsApp y quiere dejar de coordinar turnos mensaje por mensaje.",
    precio: 275000,
    precioLista: 345000,
    incluye: [
      "Página de reservas con tu marca, tus servicios y tus precios",
      "Sólo se ven los horarios libres: cero turnos superpuestos",
      "Tu cliente cancela o reprograma solo, sin escribirte",
      "Panel en el celular con tu agenda del día y de la semana",
    ],
    vos: [
      "El turno aparece solo en tu agenda",
      "Bloqueás horarios y marcás asistencia desde el celular",
    ],
    video: "/turnos/agenda.mp4",
    poster: "/turnos/agenda.webp",
  },
  {
    id: "vidriera",
    nombre: "Vidriera",
    resumen: "Reservas más la página web completa de tu negocio.",
    paraQuien:
      "Para el que quiere una dirección propia que mostrar: lo que hacés, cuánto sale, dónde estás y el botón para reservar.",
    precio: 450000,
    precioLista: 562500,
    incluye: [
      "Todo lo de Agenda",
      "Web propia con tu marca y tu dominio",
      "Servicios y precios, horarios y ubicación con mapa",
      "Galería de tus trabajos y botón directo a tu WhatsApp",
    ],
    vos: [
      "Tenés una web que vende por vos y la compartís en todos lados",
      "Las reservas de la web llegan a la misma agenda",
    ],
    video: "/turnos/vidriera.mp4",
    poster: "/turnos/vidriera.webp",
    destacado: "Recomendado",
  },
  {
    id: "piloto",
    nombre: "Piloto automático",
    resumen: "Reservas, web y un bot de WhatsApp que responde y agenda por vos.",
    paraQuien:
      "Para el que recibe muchas consultas por WhatsApp y no quiere contestar lo mismo veinte veces por día.",
    precio: 700000,
    precioLista: 875000,
    incluye: [
      "Todo lo de Vidriera",
      "Bot de WhatsApp que responde al instante, de día y de noche",
      "Ofrece horarios libres y agenda el turno en la conversación",
      "Recordatorio antes del turno: el cliente confirma con un 1",
      "Responde precios, horarios y dirección, y te pasa la charla cuando hace falta",
    ],
    vos: [
      "No contestás más «¿tenés lugar mañana?»",
      "Menos ausencias: cada turno se confirma antes",
    ],
    video: "/turnos/piloto.mp4",
    poster: "/turnos/piloto.webp",
    etiqueta: "El más completo",
  },
];

/**
 * Porcentaje de descuento sobre el precio de lista, redondeado para abajo:
 * Agenda baja un 20,3% y se anuncia 20, nunca mas de lo que es.
 */
export function descuento(p: Plan): number {
  // Con enteros: `1 - 0.8` en flotante da 0.1999… y el floor diria 19.
  return Math.floor(((p.precioLista - p.precio) * 100) / p.precioLista);
}

/** El descuento que se anuncia para todos: el menor de los tres. */
export const DESCUENTO = Math.min(...planes.map(descuento));

/** $275.000, con punto de miles como se escribe aca. */
export function pesos(n: number): string {
  return `$${n.toLocaleString("es-AR")}`;
}

/** El plan de una pagina /turnos/[plan], o undefined si el id no existe. */
export function planPorId(id: string): Plan | undefined {
  return planes.find((p) => p.id === id);
}

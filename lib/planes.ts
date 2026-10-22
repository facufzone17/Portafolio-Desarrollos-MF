/**
 * Planes de la landing de turnos (/turnos). Fuente unica de nombres, precios y
 * que incluye cada uno: la tarjeta de precios, el detalle de cada plan, el
 * formulario y el mensaje de WhatsApp leen de aca.
 *
 * Precios que paso Facundo el 22/10/2026. Pago unico por armarlo, mas el
 * mensual, que es el mismo para los tres.
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
  /** Lo que suma respecto del plan anterior (o todo, en el primero). */
  incluye: string[];
  /** Lo que ve el cliente del negocio. */
  tuCliente: string[];
  /** Lo que ve el dueño. */
  vos: string[];
  /** Clip vertical de la demo (public/turnos). */
  video: string;
  poster: string;
  destacado?: string;
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
    incluye: [
      "Página de reservas con tu marca, tus servicios y tus precios",
      "Sólo se ven los horarios libres: cero turnos superpuestos",
      "Tu cliente cancela o reprograma solo, sin escribirte",
      "Panel en el celular con tu agenda del día y de la semana",
    ],
    tuCliente: [
      "Toca el link de tu bio o de tu estado de WhatsApp",
      "Elige servicio, día y un horario libre",
      "Deja nombre y celular, confirma y lo agrega a su calendario",
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
    incluye: [
      "Todo lo de Agenda",
      "Web propia con tu marca y tu dominio",
      "Servicios y precios, horarios y ubicación con mapa",
      "Galería de tus trabajos y botón directo a tu WhatsApp",
    ],
    tuCliente: [
      "Entra a tu web y ve tus servicios, precios y trabajos",
      "Mira tus horarios y cómo llegar",
      "Reserva desde la misma página, sin escribirte",
    ],
    vos: [
      "Tenés una web que vende por vos y la compartís en todos lados",
      "Las reservas de la web llegan a la misma agenda",
    ],
    video: "/turnos/vidriera.mp4",
    poster: "/turnos/vidriera.webp",
  },
  {
    id: "piloto",
    nombre: "Piloto automático",
    resumen: "Reservas, web y un bot de WhatsApp que responde y agenda por vos.",
    paraQuien:
      "Para el que recibe muchas consultas por WhatsApp y no quiere contestar lo mismo veinte veces por día.",
    precio: 700000,
    incluye: [
      "Todo lo de Vidriera",
      "Bot de WhatsApp que responde al instante, de día y de noche",
      "Ofrece horarios libres y agenda el turno en la conversación",
      "Recordatorio antes del turno: el cliente confirma con un 1",
      "Responde precios, horarios y dirección, y te pasa la charla cuando hace falta",
    ],
    tuCliente: [
      "Escribe a tu WhatsApp a la hora que sea",
      "El bot le ofrece horarios libres y le reserva el turno",
      "Le llega un recordatorio y confirma con un toque",
    ],
    vos: [
      "No contestás más «¿tenés lugar mañana?»",
      "Menos ausencias: cada turno se confirma antes",
    ],
    video: "/turnos/piloto.mp4",
    poster: "/turnos/piloto.webp",
    destacado: "El más completo",
  },
];

/** $275.000, con punto de miles como se escribe aca. */
export function pesos(n: number): string {
  return `$${n.toLocaleString("es-AR")}`;
}

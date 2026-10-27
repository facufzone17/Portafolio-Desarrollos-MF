/**
 * Planes de la landing de turnos (/turnos). Fuente unica de nombres, precios y
 * que incluye cada uno: la seccion de planes, las paginas de cada plan, el
 * formulario y el mensaje de WhatsApp leen de aca.
 *
 * Precios aprobados por los dos socios el 24/10/2026, despues de comparar con
 * Agora y AgendaPro (apps de turnos de ~$12.000 a ~$45.000 por mes). Cada plan
 * tiene su mensual; Vidriera y Piloto ademas un armado, el mismo para los dos,
 * asi la diferencia entre ellos es solo el bot: $20.000 mas por mes. Agenda no
 * tiene armado (va incluido, con permanencia de 12 meses) para competir con
 * las apps desde la entrada. Los tres incluyen hasta 3 profesionales.
 *
 * Precio de lanzamiento: `armado` es lo que se cobra hoy y `armadoLista` lo que
 * se cobra cuando termina el lanzamiento, y va tachado. Solo es honesto si
 * despues esos pasan a ser los precios de verdad.
 */

export type IdPlan = "agenda" | "vidriera" | "piloto";

export type Plan = {
  id: IdPlan;
  nombre: string;
  /** Lo que es, en una linea y en idioma de comerciante. */
  resumen: string;
  /** Para quien conviene. */
  paraQuien: string;
  mensual: number;
  /** Armado con el precio de lanzamiento; 0 = sin armado. */
  armado: number;
  /** Armado despues del lanzamiento; va tachado al lado de `armado`. */
  armadoLista: number;
  /** La condicion que acompaña al precio (permanencia, oferta). */
  condicion: string;
  /** Lo que suma respecto del plan anterior (o todo, en el primero). */
  incluye: string[];
  /** Lo que gana el dueño. */
  vos: string[];
  /** Clip vertical de la demo (public/turnos). */
  video: string;
  poster: string;
  /** El sistema real con el negocio de ejemplo, para probarlo en vivo. Sin esto, solo el video. */
  demo?: string;
  /** Resalta la tarjeta y lleva esta etiqueta. Uno solo: el que se vende. */
  destacado?: string;
};

/**
 * Donde vive Trevoo Turnos. Estudio Nacar es su negocio de ejemplo: las
 * reservas se completan pero no ocupan el horario ni mandan avisos.
 */
export const DEMO_TURNOS = process.env.NEXT_PUBLIC_DEMO_TURNOS ?? "https://turnos.trevoo.com.ar";

export const PROFESIONALES = "Hasta 3 profesionales";

/** Recordatorios por WhatsApp sin el bot, para Agenda y Vidriera. */
export const ADICIONAL_WHATSAPP = { precio: 7900, recordatorios: 100 };

export const incluyeMensual = [
  "Hosting y dominio",
  "Mantenimiento y actualizaciones",
  "Rondas de cambios: servicios, precios, textos y fotos",
];

export const planes: Plan[] = [
  {
    id: "agenda",
    nombre: "Agenda",
    resumen: "Tu link de reservas: tus clientes sacan turno solos, sin escribirte.",
    paraQuien:
      "Para el que ya se mueve por Instagram y WhatsApp y quiere dejar de coordinar turnos mensaje por mensaje.",
    mensual: 14900,
    armado: 0,
    armadoLista: 0,
    condicion: "Sin armado · Permanencia de 12 meses · Primer mes gratis",
    incluye: [
      "Página de reservas con tu marca, tus servicios y tus precios",
      "Sólo se ven los horarios libres: cero turnos superpuestos",
      "Tu cliente cancela o reprograma solo, sin escribirte",
      "Confirmación y recordatorio por mail para tu cliente",
      "Panel en el celular con tu agenda del día y de la semana",
    ],
    vos: [
      "El turno aparece solo en tu agenda",
      "Bloqueás horarios y marcás asistencia desde el celular",
    ],
    video: "/turnos/agenda.mp4",
    poster: "/turnos/agenda.webp",
    demo: `${DEMO_TURNOS}/estudio-nacar`,
  },
  {
    id: "vidriera",
    nombre: "Vidriera",
    resumen: "Reservas más la página web completa de tu negocio.",
    paraQuien:
      "Para el que quiere una dirección propia que mostrar: lo que hacés, cuánto sale, dónde estás y el botón para reservar.",
    mensual: 29900,
    armado: 240000,
    armadoLista: 300000,
    condicion: "Seña del 30% para arrancar, 70% a la entrega",
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
    demo: `${DEMO_TURNOS}/estudio-nacar/vidriera`,
  },
  {
    id: "piloto",
    nombre: "Piloto automático",
    resumen: "Tu WhatsApp atendido: un bot que responde y agenda por vos, con tu web y tus reservas.",
    paraQuien:
      "Para el que recibe muchas consultas por WhatsApp y no quiere contestar lo mismo veinte veces por día.",
    mensual: 49900,
    armado: 240000,
    armadoLista: 300000,
    condicion: "Seña del 30% para arrancar, 70% a la entrega",
    incluye: [
      "Todo lo de Vidriera",
      "Bot de WhatsApp que responde al instante",
      "Ofrece horarios libres y agenda el turno en la conversación",
      "Recordatorio por WhatsApp: el cliente confirma con un 1",
      "Responde precios, horarios y dirección, y te pasa la charla cuando hace falta",
    ],
    vos: [
      "No contestás más «¿tenés lugar mañana?»",
      "Menos ausencias: cada turno se confirma antes",
    ],
    video: "/turnos/piloto.mp4",
    poster: "/turnos/piloto.webp",
    destacado: "Recomendado",
  },
];

/**
 * Porcentaje de descuento sobre el armado de lista, redondeado para abajo
 * (nunca se anuncia mas de lo que es). 0 en un plan sin armado.
 */
export function descuento(p: Plan): number {
  if (!p.armadoLista) return 0;
  // Con enteros: `1 - 0.8` en flotante da 0.1999… y el floor diria 19.
  return Math.floor(((p.armadoLista - p.armado) * 100) / p.armadoLista);
}

/** El descuento que se anuncia: el menor entre los planes con armado. */
export const DESCUENTO = Math.min(...planes.filter((p) => p.armadoLista).map(descuento));

/** El mensual mas bajo, para los "desde". */
export const DESDE = Math.min(...planes.map((p) => p.mensual));

/** $14.900, con punto de miles como se escribe aca. */
export function pesos(n: number): string {
  return `$${n.toLocaleString("es-AR")}`;
}

/** El plan de una pagina /turnos/[plan], o undefined si el id no existe. */
export function planPorId(id: string): Plan | undefined {
  return planes.find((p) => p.id === id);
}

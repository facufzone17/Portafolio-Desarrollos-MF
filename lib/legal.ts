/**
 * Datos que se repiten en las páginas legales. Fuente única: si cambia el mail
 * de contacto legal, la ciudad o los responsables, se toca acá y nada más.
 */
export const legal = {
  /** Personas físicas que operan el sitio. Sin razón social ni CUIT. */
  responsables: "Mateo Joaquín Orlando Leban y Facundo Fernández Zone",
  ciudad: "Villa Devoto, Ciudad Autónoma de Buenos Aires, República Argentina",
  /** Mail para consultas legales y ejercicio de derechos sobre datos. */
  email: "trevoo.proyectos@gmail.com",
  /** Fecha de la última revisión de los textos legales. */
  actualizado: "7 de septiembre de 2026",
} as const;

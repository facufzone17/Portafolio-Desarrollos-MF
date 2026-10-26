import { ADICIONAL_WHATSAPP, planes, pesos, type IdPlan } from "@/lib/planes";

const [agenda, vidriera, piloto] = planes;

/**
 * Preguntas frecuentes de /turnos y de la pagina de cada plan. Cada pregunta
 * se escribe una sola vez y las listas eligen cuales mostrar, asi una
 * respuesta (el mensual, la seña) no queda distinta en dos lugares.
 *
 * Las condiciones comerciales (seña 30/70, que pasa sin el mensual, cambio
 * de plan) son las que confirmo Facundo el 23/10/2026; los precios y la
 * permanencia de Agenda, los que aprobaron los dos socios el 24/10/2026.
 */

export type Pregunta = { p: string; r: string };

const P = {
  rubro: {
    p: "¿Me sirve para mi rubro?",
    r: "Si trabajás con turnos, sí: peluquerías y barberías, uñas y pestañas, estética, masajes, consultorios, entrenadores, canchas. Los servicios, las duraciones y los horarios se arman a la medida de tu negocio.",
  },
  app: {
    p: "¿Mis clientes tienen que bajarse una app?",
    r: "No. Reservan desde un link que se abre en el navegador del celular: eligen servicio, día y horario, y dejan su nombre y celular. No instalan nada ni se crean una cuenta.",
  },
  otraApp: {
    p: "Ya uso otra app de turnos, ¿me conviene cambiar?",
    r: "Si la que tenés te resuelve, capaz que no. Lo que cambia con Trevoo es que la página de reservas tiene tu marca y no la de una app, la armamos nosotros con tus servicios y horarios, y sobre la misma agenda podés sumar tu web y el bot de WhatsApp.",
  },
  tiempo: {
    p: "¿En cuánto tiempo está listo?",
    r: "Depende del plan y de que tengamos tus servicios, precios y fotos. Antes de arrancar te damos una fecha de entrega concreta.",
  },
  demo: {
    p: "¿Qué es la demo personalizada?",
    r: "Nos contás de tu negocio y te mandamos por WhatsApp un video de cómo quedaría el sistema con tu marca, tus servicios y tus precios. Es gratis y no te compromete a nada.",
  },
  pago: {
    p: "¿Cómo pago?",
    r: "En Vidriera y Piloto, el armado se paga en dos partes: una seña del 30% para arrancar y el 70% restante cuando te entregamos todo terminado. Agenda no tiene armado: pagás el primer mes por adelantado. Después, cada mes, el mensual de tu plan.",
  },
  mensual: {
    p: "¿Qué incluye el mensual?",
    r: `${pesos(agenda.mensual)} en Agenda, ${pesos(vidriera.mensual)} en Vidriera y ${pesos(piloto.mensual)} en Piloto automático. Incluye hosting y dominio, mantenimiento y actualizaciones, y rondas de cambios para tus servicios, precios, textos y fotos.`,
  },
  permanencia: {
    p: "¿Hay permanencia mínima?",
    r: "Sólo en Agenda: 12 meses, porque el armado va incluido y no se cobra aparte. Vidriera y Piloto no tienen permanencia: el armado se paga una vez y el mensual, mientras lo uses.",
  },
  confirmacion: {
    p: "¿Mis clientes reciben confirmación y recordatorio?",
    r: `Sí. En Agenda y Vidriera les llegan por mail. En Piloto automático, por WhatsApp, y el cliente confirma el turno respondiendo 1. Si querés recordatorios por WhatsApp sin el bot, en Agenda y Vidriera se suman por ${pesos(ADICIONAL_WHATSAPP.precio)} más por mes, hasta ${ADICIONAL_WHATSAPP.recordatorios} recordatorios.`,
  },
  sinMensual: {
    p: "¿Qué pasa si dejo de pagar el mensual?",
    r: "La web y el sistema de turnos se dan de baja, porque el mensual es lo que los mantiene andando. El dominio sigue siendo tuyo.",
  },
  cambioPlan: {
    p: "¿Puedo empezar con un plan y pasarme a otro después?",
    r: "Sí, y sumamos lo que falta sobre lo que ya tenés. De Agenda a Vidriera o Piloto pagás el armado y pasás al mensual del plan nuevo. De Vidriera a Piloto no hay armado nuevo: sólo cambia el mensual.",
  },
  cambios: {
    p: "¿Puedo cambiar servicios, precios u horarios después?",
    r: "Sí. Los horarios en los que no atendés los bloqueás vos desde el panel. Los cambios de servicios, precios, textos y fotos entran en el mensual: nos los pedís y los cargamos.",
  },
  cancela: {
    p: "¿Qué pasa si un cliente cancela?",
    r: "Cancela o reprograma solo, sin escribirte. El horario vuelve a quedar libre para otro cliente y vos lo ves en el panel.",
  },
  tecnologia: {
    p: "¿Tengo que saber de tecnología?",
    r: "No. Lo dejamos funcionando y te mostramos cómo usar el panel. Si sabés usar WhatsApp, sabés usar esto.",
  },
  botNumero: {
    p: "¿El bot contesta desde mi WhatsApp?",
    r: "Funciona con la API oficial de WhatsApp Business. Antes de arrancar vemos juntos con qué número conviene hacerlo. Cuando una consulta necesita a una persona, el bot te pasa la conversación.",
  },
  // Propias de un plan.
  link: {
    p: "¿Dónde pongo el link de reservas?",
    r: "En la bio de tu Instagram, en tu estado o tu perfil de WhatsApp, o donde quieras compartirlo. Es un link común: se abre en el navegador del celular.",
  },
  profesional: {
    p: "Si somos varios, ¿el cliente elige con quién?",
    r: "Sí. Elige con quién o deja que le asignen el primero libre, y sólo ve los horarios libres de esa persona.",
  },
  queVaEnLaWeb: {
    p: "¿Qué va en la web?",
    r: "Tus servicios con precios, tus horarios, la ubicación con mapa, una galería con tus trabajos y el botón directo a tu WhatsApp. Y en cada servicio, el botón para reservar.",
  },
  dominio: {
    p: "¿El dominio es mío?",
    r: "Sí. La web va con tu dominio, y si algún día dejás el mensual, el dominio sigue siendo tuyo.",
  },
  queContesta: {
    p: "¿Qué contesta el bot?",
    r: "Precios, horarios y dirección. Ofrece los horarios libres y reserva el turno en la conversación, y antes del turno manda el recordatorio para que el cliente confirme con un 1. Cuando hace falta una persona, te pasa la charla.",
  },
  costoMensajes: {
    p: "¿Los mensajes de WhatsApp tienen costo?",
    r: "Sí. Los cobra Meta aparte, por mensaje y a nombre de tu negocio, porque el bot usa la API oficial de WhatsApp Business. No están incluidos en el mensual. Antes de arrancar te explicamos cómo se cobran y cuánto suele salir según tus turnos.",
  },
} satisfies Record<string, Pregunta>;

export const preguntasLanding: Pregunta[] = [
  P.rubro,
  P.app,
  P.otraApp,
  P.tiempo,
  P.demo,
  P.pago,
  P.mensual,
  P.permanencia,
  P.confirmacion,
  P.sinMensual,
  P.cambioPlan,
  P.cambios,
  P.cancela,
  P.tecnologia,
  P.botNumero,
  P.costoMensajes,
];

export const preguntasPorPlan: Record<IdPlan, Pregunta[]> = {
  agenda: [P.link, P.profesional, P.permanencia, P.confirmacion, P.app, P.cancela, P.pago, P.mensual, P.cambioPlan],
  vidriera: [P.queVaEnLaWeb, P.dominio, P.confirmacion, P.cambios, P.app, P.tiempo, P.pago, P.mensual, P.cambioPlan],
  piloto: [P.queContesta, P.botNumero, P.costoMensajes, P.cancela, P.tiempo, P.pago, P.mensual, P.sinMensual],
};

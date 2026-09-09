import type { StaticImageData } from "next/image";

import distribuidoraCarrusel from "@/assets/proyectos/distribuidora-carrusel.webp";
import panelDistribuidora from "@/assets/servicios/paneles-distribuidora.webp";
import automatizacionPedido from "@/assets/automatizaciones/iphone-2.webp";
import { proyectoPorSlug } from "@/lib/proyectos";

/**
 * Los carruseles de Instagram, como datos.
 *
 * Misma idea que lib/proyectos.ts: sumar un carrusel es agregar una entrada
 * aca, sin tocar el layout de la ruta /carrusel/[slug] ni el script que las
 * exporta a PNG (scripts/carrusel.mjs).
 *
 * Por que se produce desde el repo y no en Canva (Parte 6d del plan de
 * contenido): las capturas ya viven en assets/ y no hay que re-exportarlas, la
 * tipografia es la Inter Tight / Inter que ya self-hostea next/font, y una
 * correccion de texto es un commit y no rehacer la pieza. El texto sale de
 * lib/proyectos.ts y lib/servicios.ts, acortado a la voz del dueño del negocio
 * para que entre en una placa (ese acortado es el unico lugar del carrusel
 * donde se uso IA: quince versiones, elige una persona).
 */

/** El texto de arriba y la captura de una placa de proyecto salen del proyecto real. */
function delProyecto(slug: string): { poster: StaticImageData; alt: string } {
  const proyecto = proyectoPorSlug(slug);
  if (!proyecto) {
    throw new Error(`carruseles: no existe el proyecto "${slug}"`);
  }
  return {
    poster: proyecto.poster,
    alt: `Sitio de ${proyecto.nombre}`,
  };
}

export type Placa =
  /** Placa 1: fondo plano, isotipo chico, el titular. Sin imagen (Parte 6d). */
  | { tipo: "portada"; titulo: readonly string[]; bajada: string; pie: string }
  /** Placas 2–5 del 06: un proyecto por placa, el problema arriba y la captura abajo. */
  | {
      tipo: "proyecto";
      /** "Cliente real" o "Demo". Las demos van marcadas, igual que en el sitio. */
      marca: "Cliente real" | "Demo";
      rubro: string;
      lugar: string;
      /** El problema, en la voz del dueño. Va arriba, entre comillas. */
      cita: string;
      /** Lo que tiene el sitio ahora. Va abajo de la captura. */
      tiene: string;
      poster: StaticImageData;
      alt: string;
    }
  /**
   * Placas 2–5 del C7: un servicio por placa. La traduccion en tres lineas —
   * como lo decis vos (sintoma), como se llama (nombre) y que te deja
   * (promesa, textual de lib/servicios.ts)— y una captura de prueba.
   */
  | {
      tipo: "servicio";
      /** Como lo diria el dueño que no sabe el nombre. Va arriba, entre comillas. */
      sintoma: string;
      /** El nombre del servicio. Es la palabra que no sabia pedir. */
      nombre: string;
      /** Lo que ese servicio le deja, en sus palabras. Sale de lib/servicios.ts. */
      promesa: string;
      poster: StaticImageData;
      alt: string;
      /** "Demo" si la captura es de un proyecto de ejemplo. Igual que en el sitio. */
      marca?: "Demo";
      /** true si la captura es un telefono (vertical, sobre fondo transparente). */
      retrato?: boolean;
    }
  /**
   * Placas 2–4 del C1: un error del catálogo por WhatsApp por placa. Sin imagen
   * —solo texto y el ícono de WhatsApp—. El error manda la jerarquía: va como
   * gancho, grande; el resto lo acompaña.
   */
  | {
      tipo: "punto";
      /** 1..3. Va chico en el rótulo de arriba. */
      paso: number;
      /** El error, como lo diría el que vende. Es el gancho: va grande. */
      titulo: string;
      /** Por qué te cuesta pedidos, en voz de la persona. Acompaña. */
      cuerpo: string;
    }
  /** Placa final del 06/C7: isotipo grande, la pregunta y el CTA. `resalte` se pinta de azul. */
  | { tipo: "cierre"; titulo: string; bajada: string; resalte: string };

export type Carrusel = {
  slug: string;
  /** Solo para la consola del script y el <title> de la ruta. */
  nombre: string;
  placas: readonly Placa[];
};

export const carruseles: readonly Carrusel[] = [
  {
    slug: "06",
    nombre: "Cuatro negocios, cuatro problemas distintos",
    placas: [
      {
        tipo: "portada",
        titulo: ["Cuatro negocios.", "Cuatro problemas", "distintos."],
        bajada: "La misma pregunta antes de escribir una línea de código.",
        pie: "4 proyectos reales",
      },
      {
        tipo: "proyecto",
        marca: "Cliente real",
        rubro: "Administradora de consorcios",
        lugar: "CABA",
        cita: "Necesitaba que la encontraran, y que el consorcista entendiera cómo trabaja antes de llamar.",
        tiene:
          "Seis secciones en una página, mapa de los barrios donde administran y WhatsApp directo con cada administradora, con el mensaje ya escrito.",
        ...delProyecto("duo-administracion"),
      },
      {
        tipo: "proyecto",
        marca: "Cliente real",
        rubro: "Inmobiliaria de barrio",
        lugar: "Villa Devoto",
        cita: "Dependía de los portales para que la encontraran, y de una llamada para contar cada propiedad.",
        tiene:
          "Cartera propia con buscador por operación, zona, precio y ambientes. Consulta por WhatsApp desde la ficha, con la propiedad ya mencionada.",
        ...delProyecto("inmobiliaria"),
      },
      {
        tipo: "proyecto",
        marca: "Demo",
        rubro: "Distribuidora de bebidas y comestibles",
        lugar: "demo",
        cita: "Vende por unidad lo que el resto vende por cajón: cientos de artículos con precio propio, respondidos uno por uno.",
        tiene:
          "19 categorías con buscador, ofertas a la vista y el pedido guardado en el navegador. Checkout en tres pasos, cerrado por WhatsApp.",
        ...delProyecto("distribuidora"),
        // La portada de la demo es un banner vacío ("Banner 1"); para la placa
        // sirve el catálogo con productos y precios reales
        // (scripts/captura-poster.mjs sobre /).
        poster: distribuidoraCarrusel,
        alt: "Catálogo de la distribuidora",
      },
      {
        tipo: "proyecto",
        marca: "Demo",
        rubro: "Tienda de mates y accesorios",
        lugar: "demo",
        cita: "Vendía por Instagram: sin cobro automático, sin stock real, cada precio contestado a mano.",
        tiene:
          "Stock por combinación de forma, material y color. Inscripción personalizada antes del carrito. Cobro con Mercado Pago y panel que se carga desde el celular.",
        ...delProyecto("tienda-mates"),
      },
      {
        tipo: "cierre",
        titulo: "¿Cuál de los cuatro se parece a tu negocio?",
        bajada:
          "Comentá TREVOO y te mandamos los cuatro sitios para que los recorras vos.",
        resalte: "TREVOO",
      },
    ],
  },
  {
    slug: "c7",
    nombre: "Web, tienda, panel o automatización: cuál necesitás vos",
    placas: [
      {
        tipo: "portada",
        titulo: ["Web.", "Tienda.", "Panel.", "Automatización."],
        bajada:
          "Cuatro nombres para cuatro problemas. Si no sabés cuál pedir, deslizá: cada placa es el tuyo dicho en voz alta.",
        pie: "4 servicios",
      },
      {
        tipo: "servicio",
        sintoma: "Estoy solo en Instagram y en Google no aparezco.",
        nombre: "Sitio web",
        promesa:
          "Que quien entre entienda qué hacés en segundos y dé el paso de escribirte. Claridad, velocidad y un diseño que trabaja.",
        ...delProyecto("duo-administracion"),
      },
      {
        tipo: "servicio",
        sintoma: "Vendo por mensaje, paso el CBU a mano y confirmo el stock cada vez.",
        nombre: "Tienda online",
        promesa:
          "Tu catálogo abierto las veinticuatro horas. El cliente elige, paga, y vos te enterás con el pedido ya cobrado.",
        ...delProyecto("tienda-mates"),
        marca: "Demo",
      },
      {
        tipo: "servicio",
        sintoma: "Para cambiar un precio o una foto tengo que llamar a alguien.",
        nombre: "Panel de gestión",
        promesa:
          "Precios, stock y pedidos en una sola pantalla. Cambiás una foto o un precio desde el celular, sin llamar a nadie.",
        poster: panelDistribuidora,
        alt: "Panel de gestión de una distribuidora",
        marca: "Demo",
      },
      {
        tipo: "servicio",
        sintoma: "Contesto los mismos veinte mensajes todos los días.",
        nombre: "Automatización",
        promesa:
          "El asistente de tu negocio atiende a todos, toma pedidos y confirma pagos mientras vos te ocupás de lo que importa.",
        poster: automatizacionPedido,
        alt: "Asistente de WhatsApp tomando un pedido y avisando cada paso",
        marca: "Demo",
        retrato: true,
      },
      {
        tipo: "cierre",
        titulo: "¿No sabés cuál de los cuatro es el tuyo?",
        bajada:
          "Mandanos un DM contando qué te está comiendo el día. Te decimos cuál necesitás — y si no necesitás ninguno, también.",
        resalte: "un DM",
      },
    ],
  },
  {
    slug: "c1",
    nombre: "Vender por catálogo de WhatsApp: 3 errores que te cuestan pedidos",
    placas: [
      {
        tipo: "portada",
        titulo: ["Tu catálogo de", "WhatsApp te está", "costando pedidos."],
        bajada:
          "Tres errores que cometés todos los días sin darte cuenta. Deslizá.",
        pie: "Para distribuidoras y mayoristas",
      },
      {
        tipo: "punto",
        paso: 1,
        titulo: "«Dejame que confirmo stock y te aviso»",
        cuerpo:
          "Cuando respondés eso, la venta ya se enfrió. El que estaba decidido tiene que esperarte, y mientras espera mira el catálogo del de al lado. La mitad de esas no vuelve.",
      },
      {
        tipo: "punto",
        paso: 2,
        titulo: "El catálogo que mandás ya quedó viejo",
        cuerpo:
          "Lo armaste hace un mes. Desde entonces cambiaste veinte precios y se te acabaron tres cosas. El cliente pide por ese PDF, vos le corregís medio pedido, y para cuando terminás ya lo hiciste dudar.",
      },
      {
        tipo: "punto",
        paso: 3,
        titulo: "El pedido lo armás a mano, scrolleando el chat",
        cuerpo:
          "Tres audios, un «agregame dos de esas», un «uh no, sacá lo último». Para juntarlo tenés que subir y bajar toda la conversación. Y siempre se escapa algo.",
      },
      {
        tipo: "cierre",
        titulo: "Los tres se arreglan con un catálogo de verdad.",
        bajada:
          "Precio y stock siempre al día, y el pedido que se arma solo. Comentá CATÁLOGO y te paso una demo de distribuidora andando para que la recorras.",
        resalte: "CATÁLOGO",
      },
    ],
  },
];

export function carruselPorSlug(slug: string): Carrusel | undefined {
  return carruseles.find((c) => c.slug === slug);
}

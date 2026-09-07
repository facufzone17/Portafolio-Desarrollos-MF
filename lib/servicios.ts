import type { StaticImageData } from "next/image";

import tiendasMates from "@/assets/servicios/tiendas-mates.webp";
import tiendasDistribuidora from "@/assets/servicios/tiendas-distribuidora.webp";
import tiendasDistribuidora2 from "@/assets/servicios/tiendas-distribuidora-2.webp";
import panelesMates from "@/assets/servicios/paneles-mates.webp";
import panelesDistribuidora from "@/assets/servicios/paneles-distribuidora.webp";
import panelesInmobiliaria from "@/assets/servicios/paneles-inmobiliaria.webp";
import sitiosDuo from "@/assets/servicios/sitios-duo.webp";
import sitiosEmezeta from "@/assets/servicios/sitios-emezeta.webp";
import sitiosRoot from "@/assets/servicios/sitios-root.webp";
import sitiosInmobiliaria from "@/assets/servicios/sitios-inmobiliaria.webp";
import iphoneIzquierda from "@/assets/automatizaciones/iphone-1.webp";
import iphoneDerecha from "@/assets/automatizaciones/iphone-2.webp";

/**
 * Servicios: cuatro franjas, una por rubro.
 *
 * Formato pedido por Facundo sobre la referencia applio.framer.website (la
 * misma que ya rige el hero, medida en vivo): una franja = imagen a un lado,
 * texto al otro, y el lado se alterna en cada una. El texto es titulo + una
 * frase; no hay viñetas, no hay rotulo, no hay numero de orden.
 *
 * Automatizaciones rompe el patron a proposito y por eso tiene otra `forma`:
 * dos telefonos, uno por costado, y el texto en el medio. Es el unico rubro
 * que no se muestra en una pantalla de escritorio —vive en WhatsApp— y es
 * tambien el unico al que se le permite un parrafo mas largo.
 *
 * Las capturas se importan (no un string "/servicios/x.webp") a proposito:
 * viven en `assets/`, fuera de `public/`, y Next.js les mete un hash del
 * contenido en la URL final. Reemplazar el archivo con el mismo nombre cambia
 * la URL sola — sin eso, el navegador de quien visita el sitio se queda con la
 * version vieja en cache indefinidamente.
 *
 * Los .webp salen de "Portafolio MF/Imagenes Que hacemos" con sharp: los PNG
 * originales pesan entre 0,8 y 1,9 MB cada uno y son trece. En webp calidad 86
 * quedan en 50-100 KB sin diferencia visible en pantalla.
 */

/** Una captura dentro del carrusel de un rubro. */
export type Vista = {
  /**
   * Que se ve. Va como alt de la imagen y como titulo de la ventana, asi que
   * tiene que nombrar al negocio, no describir la foto.
   */
  titulo: string;
  imagen: StaticImageData;
};

/** Uno de los dos telefonos que flanquean a Automatizaciones. */
export type Telefono = {
  imagen: StaticImageData;
  alt: string;
};

type Base = {
  id: string;
  /** El nombre del rubro. Es el titulo de la franja, sin adornos. */
  titulo: string;
  /** El valor agregado en una frase. Lo unico que se lee ademas del titulo. */
  bajada: string;
};

/**
 * Dos formas, no una con campos opcionales: el discriminante deja que
 * TypeScript garantice que el bloque de telefonos nunca reciba `vistas` ni el
 * de carrusel se quede sin ellas.
 */
export type Servicio =
  | (Base & {
      forma: "carrusel";
      /** De que lado cae la imagen en escritorio. Se alterna franja a franja. */
      lado: "derecha" | "izquierda";
      vistas: Vista[];
    })
  | (Base & {
      forma: "telefonos";
      /** Izquierdo y derecho, en ese orden. */
      telefonos: [Telefono, Telefono];
    });

export const servicios: Servicio[] = [
  {
    forma: "carrusel",
    id: "tiendas",
    titulo: "Tiendas",
    bajada:
      "Tu catálogo abierto las veinticuatro horas. El cliente elige, paga y vos te enterás con el pedido ya cobrado.",
    lado: "derecha",
    vistas: [
      { titulo: "Tienda de mates", imagen: tiendasMates },
      { titulo: "Distribuidora", imagen: tiendasDistribuidora },
      { titulo: "Distribuidora, el catálogo", imagen: tiendasDistribuidora2 },
    ],
  },
  {
    forma: "carrusel",
    id: "paneles",
    titulo: "Paneles de gestión",
    bajada:
      "Tu negocio visto de adentro. Precios, stock y pedidos en una sola pantalla: cambiás una foto o un precio desde el celular, sin llamar a nadie.",
    lado: "izquierda",
    vistas: [
      { titulo: "Panel de la tienda de mates", imagen: panelesMates },
      { titulo: "Panel de la distribuidora", imagen: panelesDistribuidora },
      { titulo: "Panel de la inmobiliaria", imagen: panelesInmobiliaria },
    ],
  },
  {
    forma: "carrusel",
    id: "sitios-web",
    titulo: "Sitios web",
    bajada:
      "Claridad, velocidad y diseño funcional. Hacemos que quien entre entienda tu propuesta en segundos y dé el paso de contactarte.",
    lado: "derecha",
    vistas: [
      { titulo: "Duo Administración", imagen: sitiosDuo },
      { titulo: "Emezeta", imagen: sitiosEmezeta },
      { titulo: "Root", imagen: sitiosRoot },
      { titulo: "Inmobiliaria", imagen: sitiosInmobiliaria },
    ],
  },
  {
    forma: "telefonos",
    id: "automatizaciones",
    titulo: "Automatizaciones",
    bajada:
      "Olvidate de responder veinte veces los mismos mensajes. El asistente de tu negocio atiende a todos, toma pedidos y confirma pagos mientras vos te ocupás de lo que importa.",
    telefonos: [
      { imagen: iphoneIzquierda, alt: "Conversación de WhatsApp con el asistente de una tienda" },
      { imagen: iphoneDerecha, alt: "El asistente tomando un pedido y confirmando el pago" },
    ],
  },
];

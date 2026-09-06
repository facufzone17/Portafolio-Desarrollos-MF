import type { StaticImageData } from "next/image";

import sitiosDuo from "@/assets/servicios/sitios-duo.jpeg";
import sitiosEmezeta from "@/assets/servicios/sitios-emezeta.jpeg";
import sitiosRoot from "@/assets/servicios/sitios-root.jpeg";
import tiendasDistribuidora from "@/assets/servicios/tiendas-distribuidora.png";
import tiendasMates from "@/assets/servicios/tiendas-mates.png";
import panelesDistribuidora from "@/assets/servicios/paneles-distribuidora.png";
import panelesInmobiliaria from "@/assets/servicios/paneles-inmobiliaria.png";
import panelesMates from "@/assets/servicios/paneles-mates.png";

/**
 * Lo que construimos, una seccion grande por rubro.
 *
 * Reemplaza a "Que hacemos" —la ronda de objetos 3D, que se borro— por el
 * patron de la referencia (markiqsaas.framer.website): un recuadro azul de
 * ancho completo y, apoyada arriba, una ventana con la captura real del
 * producto. Se ve el trabajo, no un icono que lo representa.
 *
 * Las capturas se importan (no un string "/servicios/x.png") a proposito:
 * viven en `assets/`, fuera de `public/`, y Next.js les mete un hash del
 * contenido en la URL final. Reemplazar el archivo con el mismo nombre cambia
 * la URL sola — sin eso, el navegador de quien visita el sitio se queda con la
 * version vieja en cache indefinidamente.
 *
 * Los huecos sin imagen NO son un olvido: se dibujan como recuadro punteado
 * con "Imagen N" para que Facundo pueda pedir "poné la imagen 3" sin
 * ambiguedad. Hoy le faltan las cuatro de automatizaciones.
 */
export type Vista = {
  /** Numero global dentro de la seccion de servicios, para poder pedirla. */
  numero: number;
  /** Que se ve en la captura. Encabeza la ventana. */
  titulo: string;
  /** La captura. Sin esto se dibuja el hueco marcado. */
  imagen?: StaticImageData;
  /** Slug del proyecto, si esa captura tiene ficha propia. */
  proyecto?: string;
};

/**
 * Una vista que si tiene captura.
 *
 * Existe para que el compilador garantice que no se dibuje una ventana
 * vacia: components/servicios/Ventana.tsx solo acepta este tipo, asi que el
 * rubro sin material no puede llegar ahi ni por descuido.
 */
export type VistaConCaptura = Vista & { imagen: StaticImageData };

export type Servicio = {
  id: string;
  /** El nombre de la seccion. Va como titulo grande. */
  titulo: string;
  /**
   * La frase que va al lado del panel: el beneficio en una linea, en las
   * palabras del dueño del negocio.
   *
   * No es el nombre del rubro repetido. El nombre ya esta tres veces en esa
   * franja (indice, rotulo del panel y titulo), y leer "Tiendas / Tiendas /
   * Tiendas" en tres columnas seguidas es exactamente la sensacion de
   * plantilla rellenada por una maquina.
   */
  promesa: string;
  /** Una linea: que problema resuelve, en palabras del negocio. */
  bajada: string;
  /** Lo que incluye. Tres o cuatro, cortas. */
  puntos: string[];
  vistas: Vista[];
};

export const servicios: Servicio[] = [
  {
    id: "sitios-web",
    titulo: "Sitios web",
    promesa: "Que te encuentren y entiendan qué hacés antes de llamarte.",
    bajada:
      "El lugar al que llega el que te busca. Explica a qué te dedicás, para quién trabajás y cómo contactarte, sin que tengas que atender el teléfono para contarlo.",
    puntos: [
      "Diseño propio, no una plantilla con tu logo encima",
      "Andando en el celular antes que en la computadora",
      "Contacto directo por WhatsApp desde cualquier página",
      "Preparado para que Google lo encuentre",
    ],
    vistas: [
      { numero: 1, titulo: "Duo Administración", imagen: sitiosDuo, proyecto: "duo-administracion" },
      { numero: 2, titulo: "Emezeta", imagen: sitiosEmezeta },
      { numero: 3, titulo: "Root", imagen: sitiosRoot },
    ],
  },
  {
    id: "tiendas",
    titulo: "Tiendas",
    promesa: "Vendé de madrugada y enterate con el pedido ya cobrado.",
    bajada:
      "Vender sin estar encima. Catálogo, stock, cupones y cobro automático: el cliente compra a las tres de la mañana y vos te enterás con el pedido ya pago.",
    puntos: [
      "Catálogo con variantes y stock por combinación",
      "Carrito con cupones y checkout con Mercado Pago",
      "Seguimiento del pedido sin crear cuenta",
      "Panel propio para cargar productos desde el celular",
    ],
    vistas: [
      { numero: 4, titulo: "Tienda de mates", imagen: tiendasMates, proyecto: "tienda-mates" },
      { numero: 5, titulo: "Distribuidora", imagen: tiendasDistribuidora, proyecto: "distribuidora" },
      { numero: 6, titulo: "Imagen 6" },
    ],
  },
  {
    id: "paneles",
    titulo: "Paneles",
    promesa: "Cambiá un precio o una foto vos, sin llamar a nadie.",
    bajada:
      "Tu negocio de adentro. Precios, stock, pedidos y métricas en una sola pantalla, con tu acceso, sin llamar a nadie para cambiar una foto.",
    puntos: [
      "Alta y edición de productos, precios y fotos",
      "Pedidos y estados en una sola pantalla",
      "Métricas de lo que se mira y lo que se vende",
      "Un acceso por persona, sin compartir contraseñas",
    ],
    vistas: [
      { numero: 7, titulo: "Panel de la tienda de mates", imagen: panelesMates, proyecto: "tienda-mates" },
      { numero: 8, titulo: "Panel de la distribuidora", imagen: panelesDistribuidora, proyecto: "distribuidora" },
      { numero: 9, titulo: "Panel de la inmobiliaria", imagen: panelesInmobiliaria, proyecto: "inmobiliaria" },
    ],
  },
  {
    id: "automatizaciones",
    titulo: "Automatizaciones",
    promesa: "Lo que respondés veinte veces por día, respondido solo.",
    bajada:
      "Lo que hacés todos los días a mano y no debería. Responder la misma consulta, pasar un pedido a una planilla, avisar que llegó: se hace solo.",
    puntos: [
      "Chatbot de WhatsApp que responde lo de siempre",
      "Pedidos y consultas que caen solos donde los mirás",
      "Avisos automáticos al cliente y a vos",
      "Conectado a lo que ya usás, sin cambiar de sistema",
    ],
    // FALTA: las capturas de automatizaciones. La carpeta
    // "Portafolio MF/Imagenes Que hacemos/Automatizaciones" esta vacia.
    vistas: [
      { numero: 10, titulo: "Imagen 10" },
      { numero: 11, titulo: "Imagen 11" },
      { numero: 12, titulo: "Imagen 12" },
    ],
  },
];

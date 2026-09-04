import type { StaticImageData } from "next/image";

import duoMiniatura from "@/assets/proyectos/duo-miniatura.webp";
import duoPoster from "@/assets/proyectos/duo-poster.webp";
import tiendaMatesMiniatura from "@/assets/proyectos/tienda-mates-miniatura.webp";
import tiendaMatesPoster from "@/assets/proyectos/tienda-mates-poster.webp";
import distribuidoraMiniatura from "@/assets/proyectos/distribuidora-miniatura.webp";
import distribuidoraPoster from "@/assets/proyectos/distribuidora-poster.webp";
import inmobiliariaMiniatura from "@/assets/proyectos/inmobiliaria-miniatura.webp";
import inmobiliariaPoster from "@/assets/proyectos/inmobiliaria-poster.webp";

/**
 * Los proyectos son datos, no codigo.
 *
 * Sumar una demo tiene que ser agregar una entrada aca, sin tocar el layout
 * de la grilla ni la plantilla de la ficha (§5.1 del brief).
 *
 * Las imagenes se importan (no un string "/proyectos/x.webp") a proposito:
 * viven en `assets/`, fuera de `public/`, y Next.js les mete un hash del
 * contenido en la URL final. Reemplazar el archivo con el mismo nombre
 * cambia la URL sola — sin eso, el navegador de quien visita el sitio se
 * queda con la version vieja en cache indefinidamente, porque para el
 * navegador es la misma URL de siempre. Nos comimos ese bug tres veces
 * seguidas actualizando fotos antes de mover esto aca.
 */
export type Categoria =
  | "Sitio web"
  | "Tienda"
  | "Panel admin"
  | "Sistema de gestión"
  | "Automatización"
  | "Landing page";

export type Proyecto = {
  slug: string;
  /** Nombre del negocio. Va arriba en la tarjeta. */
  nombre: string;
  /** El rubro, en palabras del cliente. Encabeza la ficha. */
  rubro: string;
  categorias: Categoria[];
  /** Una o dos lineas. Es lo que mas pesa en la tarjeta (§4.4). */
  resumen: string;
  /** Que tiene esa web. Va en la ficha. */
  detalle: string[];
  stack: string[];
  /** URL de produccion, la que se embebe. */
  url: string;
  /** Miniatura de la grilla. Lleva el nombre encima, asi que conviene que
   *  tenga aire en el centro. */
  imagen: StaticImageData;
  /**
   * Forma y lugar de la pieza en la version apilada de la vitrina.
   *
   * La galeria imita a formastudio.framer.ai: piezas de proporciones
   * distintas (una vertical, dos apaisadas, una panoramica) sueltas en una
   * grilla de 12 columnas, sin alinearse entre si. `proporcion` es el recorte
   * y `ubicacion` donde cae en lg+; en mobile todo se apila a ancho completo.
   *
   * Esta version se usa en mobile/tablet y con prefers-reduced-motion. En
   * escritorio con movimiento permitido manda `pista` (scroll horizontal).
   */
  proporcion: string;
  ubicacion: string;
  /**
   * Forma y carril de la pieza en la pista horizontal (escritorio, §4.4).
   *
   * `alto` fija la altura de la pieza dentro de la tira fijada a pantalla; el
   * ancho sale solo de `aspecto`. `carril` la sube o la baja respecto del
   * centro para recrear el desorden de formastudio sin que se alineen todas.
   */
  pista: { alto: string; aspecto: string; carril: string };
  /**
   * El `sizes` de esta pieza para <Image>, calculado a partir de cuanto
   * ocupa realmente en pantalla (su col-span sobre los 1400px de ancho
   * maximo del contenedor) y no un valor generico para toda la grilla.
   *
   * Sin esto: un `sizes` fijo (por ejemplo "800px" para todas) le queda
   * corto a una pieza panoramica de 11 columnas (~1226px reales) y Next.js
   * pide una imagen mas chica de la que hace falta — el navegador la estira
   * para llenar el hueco y se ve borrosa. Cada pieza pide lo suyo.
   */
  sizes: string;
  poster: StaticImageData;
  /** true si los datos que se ven son de ejemplo. Duo es un cliente real. */
  esDemo: boolean;
};

export const proyectos: Proyecto[] = [
  {
    slug: "duo-administracion",
    nombre: "Duo Administración",
    rubro: "Administradora de consorcios",
    categorias: ["Sitio web"],
    resumen:
      "Una administradora de consorcios de CABA que necesitaba que la encontraran y que los consorcistas entendieran cómo trabaja antes de llamar.",
    detalle: [
      "Seis secciones en una sola página: inicio, quiénes somos, nuestros clientes, cómo trabajamos, soporte técnico y legal, y contacto.",
      "Mapa interactivo de la Ciudad de Buenos Aires con los barrios donde administran edificios.",
      "Navegación por drawer lateral que marca en qué sección estás mientras scrolleás.",
      "Contacto directo por WhatsApp con cada administradora, con el mensaje ya escrito.",
      "Todo el contenido salió del material propio de la empresa: nada de texto de relleno.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "framer-motion"],
    // El dominio propio (duoadministracion.com.ar) hoy no resuelve: rechaza la
    // conexion y el iframe queda en blanco. Se apunta a la URL de Vercel, que
    // es la de produccion y se puede embeber. Volver al dominio cuando ande.
    url: "https://www.duoadministracion.com.ar",
    imagen: duoMiniatura,
    proporcion: "lg:aspect-[4/5]",
    ubicacion: "lg:col-start-1 lg:col-span-5 lg:row-start-1",
    pista: { alto: "h-[82vh]", aspecto: "aspect-[4/5]", carril: "self-center" },
    sizes: "(max-width: 1024px) 100vw, (max-width: 1440px) 42vw, 600px",
    poster: duoPoster,
    esDemo: false,
  },
  {
    slug: "tienda-mates",
    nombre: "Tienda de mates",
    rubro: "Tienda de mates y accesorios",
    categorias: ["Tienda", "Panel admin"],
    resumen:
      "Una tienda que hoy vende por Instagram y catálogo de WhatsApp: sin cobro automático, sin stock real y con cada consulta de precio respondida a mano.",
    detalle: [
      "Catálogo con variantes: la forma del mate por un lado y el material y color por otro, con stock por combinación.",
      "Ficha de producto con inscripción personalizada antes de agregar al carrito, para el mate de regalo.",
      "Carrito con cupones, y checkout con Mercado Pago Checkout Pro.",
      "Panel de administración: alta y edición de productos, fotos, precios y stock, todo pensado para cargarse desde el celular.",
      "Seguimiento del pedido sin necesidad de crear una cuenta.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Mercado Pago"],
    url: "https://tienda-mates-facufzone17s-projects.vercel.app/",
    imagen: tiendaMatesMiniatura,
    proporcion: "lg:aspect-[16/9]",
    ubicacion: "lg:col-start-8 lg:col-span-5 lg:row-start-1 lg:mt-[30vh]",
    pista: { alto: "h-[54vh]", aspecto: "aspect-[16/9]", carril: "self-center -translate-y-[8vh]" },
    sizes: "(max-width: 1024px) 100vw, (max-width: 1440px) 42vw, 600px",
    poster: tiendaMatesPoster,
    // Demo para pitchear el servicio: productos, precios y fotos son de
    // ejemplo (README.md y PRODUCT.md del repo). No hay cliente cerrado
    // todavía, asi que se marca — nunca un negocio de ejemplo sin avisar.
    esDemo: true,
  },
  {
    slug: "distribuidora",
    nombre: "Distribuidora",
    rubro: "Distribuidora de bebidas, comestibles y regalería",
    categorias: ["Tienda", "Panel admin", "Automatización"],
    resumen:
      "Una distribuidora que vende por unidad lo que el resto vende por cajón: cientos de artículos con precio propio, hoy respondidos uno por uno por WhatsApp.",
    detalle: [
      "Catálogo completo repartido en diecinueve categorías — de vinos y cervezas a snacks, aceites y regalería —, con paginado, orden por precio o nombre y filtros de disponible y en oferta.",
      "Buscador en el encabezado para llegar al producto escribiendo la marca, sin recorrer el menú.",
      "Precios y ofertas visibles, con el porcentaje de descuento y el precio anterior tachado.",
      "Pedido armado desde cualquier página con un botón, y guardado en el navegador: se puede cerrar y volver sin perderlo.",
      "Checkout en tres pasos: cómo lo recibe (retiro en el local o envío con costo según la zona), cómo paga y cómo contactarlo. El pedido se cierra por WhatsApp.",
      "Mínimo de envío a domicilio avisado en el carrito: cuánto le falta al cliente para llegar.",
      "Panel de administración con acceso propio para cargar productos, precios y ofertas.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase"],
    url: "https://don-antonio-distribuidora-demo.vercel.app",
    imagen: distribuidoraMiniatura,
    proporcion: "lg:aspect-[3/1]",
    ubicacion: "lg:col-start-2 lg:col-span-11 lg:row-start-2 lg:mt-[14vh]",
    pista: { alto: "h-[64vh]", aspecto: "aspect-[3/2]", carril: "self-center translate-y-[5vh]" },
    sizes: "(max-width: 1024px) 100vw, (max-width: 1440px) 90vw, 1280px",
    poster: distribuidoraPoster,
    // Demo para mostrar el servicio: el nombre del negocio, la direccion, los
    // telefonos y las resenas son de ejemplo (el propio sitio lo avisa en una
    // barra arriba). El catalogo si es de un surtido real de distribuidora.
    esDemo: true,
  },
  {
    slug: "inmobiliaria",
    nombre: "Inmobiliaria",
    rubro: "Inmobiliaria de barrio en Villa Devoto",
    categorias: ["Sitio web", "Panel admin"],
    resumen:
      "Una inmobiliaria con cartera repartida por toda la Capital, que hasta ahora dependía de los portales para que la encontraran y de una llamada para contar cada propiedad.",
    detalle: [
      "Buscador en la portada por operación, tipo de propiedad y barrio: el que llega sabiendo lo que busca entra directo al resultado.",
      "Cartera completa con filtros de operación, tipo, zona, precio y ambientes, y el conteo de resultados siempre a la vista.",
      "Ficha de cada propiedad con fotos, ambientes y metros, descripción, servicios del edificio, ubicación en el mapa y propiedades similares al pie.",
      "Consulta por WhatsApp desde la ficha, con la propiedad ya mencionada en el mensaje.",
      "Página de tasación con el paso a paso y un formulario que arma el mensaje de WhatsApp completo: el dueño lo revisa y lo manda.",
      "Panel propio con login para administrar la cartera y ver las métricas del sitio.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    url: "https://dakar-propiedades.vercel.app",
    imagen: inmobiliariaMiniatura,
    proporcion: "lg:aspect-[16/9]",
    ubicacion: "lg:col-start-1 lg:col-span-7 lg:row-start-3 lg:mt-[10vh]",
    pista: { alto: "h-[60vh]", aspecto: "aspect-[8/5]", carril: "self-start mt-[4vh]" },
    sizes: "(max-width: 1024px) 100vw, (max-width: 1440px) 60vw, 820px",
    poster: inmobiliariaPoster,
    // La cartera, la direccion, el telefono y la resena son del negocio real:
    // no son datos de ejemplo. Lo unico de relleno es el numero de WhatsApp.
    esDemo: false,
  },
];

export function proyectoPorSlug(slug: string): Proyecto | undefined {
  return proyectos.find((p) => p.slug === slug);
}

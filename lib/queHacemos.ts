/**
 * Los 4 sectores de "Que hacemos".
 *
 * Cada sector es un objeto 3D que flota en una ronda (ver
 * `components/que-hacemos/tres/`), y adentro lleva tarjetas: los demos de
 * Desarrollos MF. Al hacer clic en el objeto se abre la ventana grande y ahi
 * se muestran esas tarjetas una al lado de la otra.
 *
 * Hoy los demos estan vacios a proposito: dicen "Imagen 1", "Imagen 2"...
 * numerados de corrido en toda la seccion, para que se pueda pedir "poné la
 * imagen 7" sin ambiguedad. El material viejo (los videos y capturas de la
 * vitrina anterior) salio de `public/` y quedo en
 * `Portafolio MF/material-viejo/`.
 */
export type Sector = "sitios" | "tiendas" | "paneles" | "automatizaciones";

export type Demo = {
  /** Numero global dentro de la seccion: 1 a 12. */
  numero: number;
  /** Nombre del demo, cuando lo tenga. Sin el va la etiqueta "Imagen N". */
  titulo?: string;
  /** Captura o video del demo. Sin esto, la tarjeta se dibuja vacia. */
  src?: string;
  /** Link a la demo viva, si se puede visitar. */
  url?: string;
};

export type Item = {
  id: Sector;
  /** Lo unico escrito debajo del objeto. */
  etiqueta: string;
  /** Texto para lectores de pantalla: el objeto solo no dice nada. */
  descripcionIcono: string;
  /** Las tarjetas que lleva adentro, de izquierda a derecha. */
  demos: Demo[];
};

/** Tres tarjetas por sector, numeradas de corrido: 1-3, 4-6, 7-9, 10-12. */
function demos(desde: number): Demo[] {
  return [desde, desde + 1, desde + 2].map((numero) => ({ numero }));
}

export const items: Item[] = [
  {
    id: "sitios",
    etiqueta: "Sitios web",
    descripcionIcono: "Ventana de navegador con un globo terraqueo",
    // Los titulos salen del nombre de archivo que trajo Facundo: si alguno se
    // llama distinto de verdad, se corrige aca y cambia en los dos lados.
    demos: [
      { numero: 1, titulo: "Duo Administración", src: "/demos/sitios/duo.webp" },
      { numero: 2, titulo: "Emezeta", src: "/demos/sitios/emezeta.webp" },
      { numero: 3, titulo: "Root", src: "/demos/sitios/root.webp" },
    ],
  },
  {
    id: "tiendas",
    etiqueta: "Tiendas",
    descripcionIcono: "Carrito de compras",
    demos: demos(4),
  },
  {
    id: "paneles",
    etiqueta: "Paneles de gestión",
    descripcionIcono: "Monitor con controles, un grafico y un engranaje",
    demos: demos(7),
  },
  {
    id: "automatizaciones",
    etiqueta: "Automatizaciones",
    descripcionIcono: "Dos engranajes engranados",
    demos: demos(10),
  },
];

import * as THREE from "three";
import type { Item, Sector } from "@/lib/queHacemos";
import {
  abanicoTarjetas,
  aro,
  barra,
  COLOR_PANTALLA,
  COLOR_TARJETA,
  engranaje,
  esfera,
  marco,
  marcoHorizontal,
  type Materiales,
} from "./piezas";

/**
 * Los cuatro objetos de la ronda, armados en alambre.
 *
 * El carrito es el que puso Facundo como referencia y manda: los otros tres
 * estan construidos con el mismo tubo, el mismo radio y la misma escala
 * (~2,2 unidades de ancho) para que se lean como un juego y no como cuatro
 * dibujos sueltos.
 *
 * Cada objeto queda centrado en su propio origen. La ronda los ubica.
 */

function tarjetasDe(m: Materiales, item: Item, y: number, z: number) {
  const g = abanicoTarjetas(m.tarjeta, item.demos);
  g.position.set(0, y, z);
  // La escena lo busca por esta marca para levantarlas al hacer clic.
  g.userData.tarjetas = true;
  return g;
}

/**
 * Un panel macizo que tapa lo que hay detras.
 *
 * Los objetos son de alambre, asi que las tarjetas se veian enteras a traves
 * de ellos y quedaban flotando en el aire. Estos paneles son los que les dan
 * cuerpo: van entre las tarjetas (z negativo) y los tubos del frente (z 0),
 * asi que ocultan la tarjeta sin taparse a si mismos con el dibujo.
 *
 * Las tarjetas no cambian de tamaño: siguen siendo las mismas, y lo que se ve
 * de ellas es lo que asoma por arriba del panel.
 */
function panel(ancho: number, alto: number, color: number, opaco = false) {
  const material = opaco
    ? // Del color del fondo y sin luz: no se ve, pero tapa. Es lo que hace que
      // la tarjeta parezca entrar dentro del objeto.
      new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
    : new THREE.MeshStandardMaterial({
        color,
        roughness: 0.55,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });
  return new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), material);
}

/** Sitios web: ventana de navegador con un globo adentro. */
function sitios(m: Materiales, item: Item) {
  const g = new THREE.Group();
  const a = m.alambre;

  g.add(marco(a, 2.2, 1.6));
  g.add(barra(a, [-1.1, 0.42, 0], [1.1, 0.42, 0]));

  // La barra de navegacion, maciza y blanca (el mismo blanco de las
  // tarjetas). Le da peso al icono y, sobre todo, tapa la parte baja de las
  // tarjetas: antes se veian enteras a traves del marco y parecian pegadas
  // atras en vez de salir de adentro.
  const navegacion = panel(2.2, 0.38, COLOR_TARJETA);
  navegacion.position.set(0, 0.61, -0.06);
  g.add(navegacion);

  // Los puntos y la barra de direccion quedan por delante del blanco.
  [-0.92, -0.76, -0.6].forEach((x) => {
    const punto = esfera(a, 0.055);
    punto.position.set(x, 0.61, 0);
    g.add(punto);
  });
  g.add(barra(a, [-0.35, 0.61, 0], [0.35, 0.61, 0], 0.05));

  // Globo: tres aros bastan. Un cuarto ya no aporta lectura, solo mallas.
  const globo = new THREE.Group();
  globo.add(aro(a, 0.42, 0.035));
  const meridiano = aro(a, 0.42, 0.035);
  meridiano.rotation.y = Math.PI / 2;
  globo.add(meridiano);
  const ecuador = aro(a, 0.42, 0.035);
  ecuador.rotation.x = Math.PI / 2;
  globo.add(ecuador);
  const tropico = aro(a, 0.3, 0.03);
  tropico.rotation.x = Math.PI / 2;
  tropico.position.y = 0.28;
  globo.add(tropico);
  globo.position.set(0, -0.12, 0);
  g.add(globo);

  g.add(tarjetasDe(m, item, 1.05, -0.24));
  return g;
}

/** Tiendas: el carrito de la referencia. */
function tiendas(m: Materiales, item: Item) {
  const g = new THREE.Group();
  const a = m.alambre;
  const r = 0.045;

  // Canasto: aro de arriba, aro de abajo mas chico, y los verticales.
  g.add(marcoHorizontal(a, 2.0, 1.0, 0.55, 0.055));
  g.add(marcoHorizontal(a, 1.82, 0.9, 0.2, r));
  g.add(marcoHorizontal(a, 1.64, 0.84, -0.15, 0.055));

  const arriba: [number, number][] = [
    [-1, -0.5], [-1, 0.5], [1, -0.5], [1, 0.5],
  ];
  arriba.forEach(([x, z]) => {
    g.add(barra(a, [x, 0.55, z], [x * 0.82, -0.15, z * 0.84], 0.055));
  });

  // Alambres de las cuatro caras: es lo que hace que se lea como canasto.
  [-0.5, 0, 0.5].forEach((x) => {
    g.add(barra(a, [x, 0.55, 0.5], [x * 0.82, -0.15, 0.42], r));
    g.add(barra(a, [x, 0.55, -0.5], [x * 0.82, -0.15, -0.42], r));
  });
  [-0.17, 0.17].forEach((z) => {
    g.add(barra(a, [-1, 0.55, z], [-0.82, -0.15, z * 0.84], r));
    g.add(barra(a, [1, 0.55, z], [0.82, -0.15, z * 0.84], r));
  });

  // Piso del canasto.
  [-0.4, 0, 0.4].forEach((x) => {
    g.add(barra(a, [x, -0.15, -0.42], [x, -0.15, 0.42], r));
  });

  // Manija.
  g.add(barra(a, [-1, 0.55, -0.5], [-1.02, 0.82, -0.92], 0.06));
  g.add(barra(a, [1, 0.55, -0.5], [1.02, 0.82, -0.92], 0.06));
  g.add(barra(a, [-1.02, 0.82, -0.92], [1.02, 0.82, -0.92], 0.06));

  // Chasis y ruedas.
  const patas: [number, number][] = [
    [-0.82, -0.42], [-0.82, 0.42], [0.82, -0.42], [0.82, 0.42],
  ];
  patas.forEach(([x, z]) => {
    g.add(barra(a, [x, -0.15, z], [x * 0.95, -0.78, z * 1.12], 0.05));
  });
  g.add(barra(a, [-0.78, -0.78, -0.47], [0.78, -0.78, -0.47], 0.05));
  g.add(barra(a, [-0.78, -0.78, 0.47], [0.78, -0.78, 0.47], 0.05));

  patas.forEach(([x, z]) => {
    const rueda = aro(a, 0.11, 0.045);
    rueda.position.set(x * 0.95, -0.9, z * 1.12);
    g.add(rueda);
  });

  g.add(tarjetasDe(m, item, 0.95, 0.02));
  return g;
}

/** Paneles de gestion: el monitor con sus controles. */
function paneles(m: Materiales, item: Item) {
  const g = new THREE.Group();
  const a = m.alambre;

  g.add(marco(a, 2.2, 1.5, 0, 0.055));
  g.add(barra(a, [0, -0.75, 0], [0, -1.08, 0], 0.06));
  g.add(barra(a, [-0.38, -1.08, 0], [0.38, -1.08, 0], 0.06));

  // La pantalla es maciza: tapa las tarjetas, que quedan asomando por arriba,
  // a medio salir, en vez de verse enteras a traves del monitor como si
  // flotaran detras.
  const pantalla = panel(2.2, 1.5, COLOR_PANTALLA, true);
  pantalla.position.set(0, 0, -0.06);
  g.add(pantalla);

  // Deslizador.
  g.add(barra(a, [-0.82, 0.34, 0], [-0.24, 0.34, 0], 0.04));
  const perilla = esfera(a, 0.1);
  perilla.position.set(-0.6, 0.34, 0);
  g.add(perilla);

  // Torta.
  const torta = aro(a, 0.26, 0.055);
  torta.position.set(0.18, 0.3, 0);
  g.add(torta);
  g.add(barra(a, [0.18, 0.3, 0], [0.18, 0.56, 0], 0.04));
  g.add(barra(a, [0.18, 0.3, 0], [0.4, 0.16, 0], 0.04));

  // Jerarquia.
  const caja = new THREE.BoxGeometry(0.28, 0.16, 0.1);
  const nodos: [number, number][] = [[0.82, 0.46], [0.66, 0.06], [0.98, 0.06]];
  nodos.forEach(([x, y]) => {
    const n = new THREE.Mesh(caja, a);
    n.position.set(x, y, 0);
    g.add(n);
  });
  g.add(barra(a, [0.82, 0.38, 0], [0.82, 0.26, 0], 0.03));
  g.add(barra(a, [0.66, 0.26, 0], [0.98, 0.26, 0], 0.03));
  g.add(barra(a, [0.66, 0.26, 0], [0.66, 0.14, 0], 0.03));
  g.add(barra(a, [0.98, 0.26, 0], [0.98, 0.14, 0], 0.03));

  // Interruptor.
  g.add(barra(a, [-0.76, -0.32, 0], [-0.5, -0.32, 0], 0.13));
  const tope = esfera(a, 0.09);
  tope.position.set(-0.5, -0.32, 0.06);
  g.add(tope);

  // Engranaje: gira, porque es lo unico del panel que representa proceso.
  const eng = engranaje(a, { radio: 0.24, tubo: 0.055, dientes: 8, velocidad: 0.5 });
  eng.position.set(0.28, -0.3, 0);
  g.add(eng);

  g.add(tarjetasDe(m, item, 1.0, -0.24));
  return g;
}

/** Automatizaciones: dos engranajes engranados, girando al reves uno del otro. */
function automatizaciones(m: Materiales, item: Item) {
  const g = new THREE.Group();
  const a = m.alambre;

  const grande = engranaje(a, { radio: 0.62, tubo: 0.1, dientes: 8, velocidad: 0.35 });
  grande.position.set(-0.32, -0.28, 0);
  g.add(grande);

  const chico = engranaje(a, { radio: 0.4, tubo: 0.085, dientes: 6, velocidad: -0.54 });
  chico.position.set(0.62, 0.42, 0);
  g.add(chico);

  g.add(tarjetasDe(m, item, 0.86, -0.34));
  return g;
}

const constructores: Record<Sector, (m: Materiales, item: Item) => THREE.Group> = {
  sitios,
  tiendas,
  paneles,
  automatizaciones,
};

export function construirObjeto(m: Materiales, item: Item) {
  const g = constructores[item.id](m, item);
  g.userData.sector = item.id;
  return g;
}

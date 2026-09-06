/**
 * Esquinas continuas (squircle) para los marcos de dispositivo.
 *
 * `border-radius` dibuja un cuarto de elipse: la curvatura salta de golpe de
 * cero a maxima justo donde empieza la esquina, y ese salto es lo que hace que
 * un marco hecho a mano se vea "de CSS" al lado de un iPhone real. Apple usa
 * una superelipse, donde la curvatura entra progresiva.
 *
 * Se resuelve con `clip-path: url(#id)` sobre un <clipPath> con
 * `clipPathUnits="objectBoundingBox"`, que trabaja en coordenadas 0..1 y por lo
 * tanto escala con el elemento. Eso tiene una trampa: el escalado es NO
 * uniforme (la caja del telefono es mucho mas alta que ancha), asi que un radio
 * de 0,15 en las dos direcciones saldria estirado y las esquinas quedarian
 * ovaladas.
 *
 * Por eso el radio se declara como fraccion del ANCHO y el vertical se deriva
 * multiplicando por la proporcion: `ry = rx * (ancho / alto)`. Despues del
 * estirado, las dos vuelven a medir lo mismo en pixeles.
 */

/**
 * Exponente de la superelipse. 5 es el valor que mejor aproxima la esquina
 * continua de iOS: con 2 vuelve a ser una elipse comun y con 8 la esquina se
 * empieza a leer como un rectangulo apenas matado.
 */
const N = 5;

/** Puntos por esquina. 20 ya no se distingue de una curva continua. */
const PASOS = 20;

const redondear = (v: number) => Math.round(v * 10000) / 10000;

/**
 * Path de un rectangulo con esquinas de superelipse, en coordenadas 0..1.
 *
 * @param rx radio horizontal, en fraccion del ancho de la caja
 * @param ry radio vertical, en fraccion del alto de la caja
 */
function pathSuperelipse(rx: number, ry: number): string {
  const p: string[] = [];

  /**
   * f y g son las dos mitades de la superelipse. Cumplen g^N + f^N = 1 (porque
   * (cos^(2/N))^N + (sin^(2/N))^N = cos² + sin² = 1), que es exactamente la
   * ecuacion de la superelipse: por eso la curva es la forma real y no una
   * aproximacion a ojo.
   */
  const f = (t: number) => Math.pow(Math.sin(t), 2 / N);
  const g = (t: number) => Math.pow(Math.cos(t), 2 / N);

  /**
   * Barre una esquina desde el desplazamiento `a` hasta el `b`, los dos
   * medidos respecto del centro de la esquina. Uno de los dos siempre es
   * puramente horizontal y el otro puramente vertical, que es lo que hace que
   * la curva empalme a filo con los lados rectos.
   *
   * Va con dos extremos explicitos y no con signos sueltos porque asi no se
   * puede barrer una esquina al reves sin que se note: los cuatro tramos se
   * leen en el orden en que se recorren.
   */
  const esquina = (
    cx: number,
    cy: number,
    a: [number, number],
    b: [number, number],
  ) => {
    for (let i = 0; i <= PASOS; i++) {
      const t = (i / PASOS) * (Math.PI / 2);
      const x = cx + a[0] * g(t) + b[0] * f(t);
      const y = cy + a[1] * g(t) + b[1] * f(t);
      p.push(`${redondear(x)} ${redondear(y)}`);
    }
  };

  // En el sentido del reloj, arrancando al final del lado de arriba.
  esquina(1 - rx, ry, [0, -ry], [+rx, 0]); // arriba derecha
  esquina(1 - rx, 1 - ry, [+rx, 0], [0, +ry]); // abajo derecha
  esquina(rx, 1 - ry, [0, +ry], [-rx, 0]); // abajo izquierda
  esquina(rx, ry, [-rx, 0], [0, -ry]); // arriba izquierda

  return `M ${p[0]} L ${p.slice(1).join(" L ")} Z`;
}

/**
 * Path para una caja de proporcion conocida, con un radio unico expresado en
 * fraccion del ancho. La proporcion entra para compensar el estirado.
 */
export function squircle(radioSobreAncho: number, ancho: number, alto: number) {
  return pathSuperelipse(radioSobreAncho, radioSobreAncho * (ancho / alto));
}

/* =====================================================================
 * Las cuatro formas de los marcos.
 *
 * Se calculan una vez al cargar el modulo: son constantes, no dependen de
 * nada en pantalla y no cuestan nada por render.
 * ===================================================================== */

/** iPhone: 9/19.5 es la proporcion real desde el iPhone X. */
export const IPHONE = { ancho: 9, alto: 19.5 } as const;
/** Grosor del bisel, en fraccion del ancho del marco. */
export const IPHONE_BISEL = 0.035;
/** Radio del marco, en fraccion del ancho. */
const IPHONE_RADIO = 0.15;

/** iPad: proporcion 3/4, bisel bastante mas grueso y parejo. */
export const IPAD = { ancho: 3, alto: 4 } as const;
export const IPAD_BISEL = 0.052;
const IPAD_RADIO = 0.055;

/**
 * La pantalla es el marco menos el bisel en las cuatro caras, asi que su caja
 * tiene otra proporcion y otro radio fisico. Las dos cosas se recalculan en
 * vez de reutilizar los numeros del marco: si no, la curva de la pantalla no
 * es concentrica con la del marco y el bisel se ve mas fino en las esquinas.
 */
function pantalla(
  caja: { ancho: number; alto: number },
  bisel: number,
  radio: number,
) {
  // El bisel se expresa en fraccion del ancho del marco, asi que en unidades
  // de la caja mide `bisel * ancho`.
  const b = bisel * caja.ancho;
  const ancho = caja.ancho - 2 * b;
  const alto = caja.alto - 2 * b;
  // Radio fisico de la pantalla = radio del marco menos el bisel.
  const radioFisico = radio * caja.ancho - b;
  return squircle(radioFisico / ancho, ancho, alto);
}

export const PATH_IPHONE_MARCO = squircle(IPHONE_RADIO, IPHONE.ancho, IPHONE.alto);
export const PATH_IPHONE_PANTALLA = pantalla(IPHONE, IPHONE_BISEL, IPHONE_RADIO);
export const PATH_IPAD_MARCO = squircle(IPAD_RADIO, IPAD.ancho, IPAD.alto);
export const PATH_IPAD_PANTALLA = pantalla(IPAD, IPAD_BISEL, IPAD_RADIO);

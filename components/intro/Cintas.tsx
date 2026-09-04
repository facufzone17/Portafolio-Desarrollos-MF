import { ICONOS } from "./Iconos";

/**
 * Las cintas de iconos que corren detras del monograma en la pantalla de
 * entrada.
 *
 * Cuatro hileras de iconos marrones, sin banda de fondo: flotan sobre el mismo
 * crema que el resto de la pantalla. Dos verticales pegadas contra el borde
 * derecho, y dos que cruzan la pagina en diagonal por la izquierda. Ninguna
 * empieza ni termina adentro del cuadro — todas entran y salen por los bordes,
 * que es lo que las hace leer como hileras que pasan y no como cuatro listas
 * apoyadas ahi.
 *
 * Cada una va a su ritmo y las de al lado van al reves: el contramovimiento es
 * lo que hace que se lean como un mecanismo y no como un unico bloque
 * deslizando.
 *
 * Como se mueven: NO hay `@keyframes`. Una animacion CSS de transform promueve
 * el elemento a su propia capa y se escapa del `overflow: hidden` de las dos
 * mitades de la intro, que es justamente lo que hace posible la apertura del
 * final (el mismo problema que ya costo una hora con `will-change` en el hero).
 * El desplazamiento lo escribe el mismo rAF que lleva el resto de la intro, en
 * cuatro custom properties (`--intro-cinta-a/b/c/d`), y el mapeo a transform
 * vive en globals.css.
 *
 * Cada cinta lleva la lista de iconos DOS veces y se desplaza medio alto: al
 * llegar, la segunda copia esta exactamente donde arrancaba la primera y el
 * salto no se ve. Por eso los items no usan `gap` sino un alto fijo (`--paso`):
 * con gap, la junta entre las dos copias mide un espacio de mas y el medio alto
 * deja de caer en el lugar exacto.
 */

/** Cuantas veces se repite la tanda de cuatro iconos dentro de una copia. */
const TANDAS = 4;

function Cinta({
  cinta,
  desde,
}: {
  /** Cual de las cuatro custom properties la mueve. */
  cinta: "a" | "b" | "c" | "d";
  /** Desde que icono arranca, para que las cuatro no vayan sincronizadas. */
  desde: number;
}) {
  const lista = Array.from({ length: TANDAS * ICONOS.length }, (_, i) => {
    const Icono = ICONOS[(i + desde) % ICONOS.length];
    return (
      <div key={i} data-intro-casillero>
        <Icono className="h-full w-auto" />
      </div>
    );
  });

  return (
    <div data-intro-cinta={cinta}>
      <div data-intro-tira>
        {/* Dos copias identicas: el bucle es el desplazamiento de media tira. */}
        {[0, 1].map((copia) => (
          <div key={copia} data-intro-copia>
            {lista}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Las cuatro cintas ubicadas sobre el escenario.
 *
 * Va antes del velo en el DOM: cuando el negro entra, las tapa.
 */
export function Cintas() {
  return (
    <div data-intro-cintas aria-hidden="true">
      {/* El par de la derecha, vertical, contra el borde. */}
      <div data-intro-grupo="derecha">
        <Cinta cinta="a" desde={0} />
        <Cinta cinta="b" desde={2} />
      </div>

      {/* El par de la izquierda, cruzando la pagina en diagonal. */}
      <div data-intro-grupo="izquierda">
        <Cinta cinta="c" desde={1} />
        <Cinta cinta="d" desde={3} />
      </div>
    </div>
  );
}

import { IPAD, IPAD_BISEL } from "@/lib/squircle";

/**
 * Marco de iPad en CSS puro. Misma logica que el iPhone: bisel con `padding`
 * en porcentaje, pantalla recortada con `overflow: hidden` y esquinas de
 * superelipse, y el contenido como hijo.
 *
 * Las tres diferencias con el telefono son de proporcion, no de estructura:
 *
 *  - Proporcion 3/4 en vez de 9/19.5.
 *  - Bisel bastante mas grueso (5,2% del ancho contra 3,5%) y parejo en las
 *    cuatro caras, que es lo que hace que se lea como tablet y no como un
 *    telefono agrandado.
 *  - Esquinas de radio proporcionalmente menor: un iPad tiene las esquinas
 *    mucho menos matadas que un iPhone respecto de su tamaño.
 *
 * En vez de isla lleva el punto de camara, apoyado sobre el bisel de arriba.
 * NO lleva barra de estado sintetica: el contenido que va adentro son sitios
 * con su propia barra de navegacion, y una barra de iPadOS encima competiria
 * con ella. El indicador de home si va, igual que en el telefono.
 *
 * Comparte las variables de color de bisel con MarcoIPhone (definidas en
 * `[data-marco]`), asi que los dos combinan cuando estan uno al lado del otro.
 */
export function MarcoIPad({
  children,
  className = "",
  etiqueta,
}: {
  children: React.ReactNode;
  /** Ancho, rotacion y posicion los pone quien lo usa. */
  className?: string;
  etiqueta?: string;
}) {
  const bisel = `${(IPAD_BISEL * 100).toFixed(2)}%`;

  /**
   * La camara va centrada en el bisel de arriba. El bisel mide
   * `IPAD_BISEL * ancho`, y `top` se resuelve contra el ALTO, asi que hay que
   * pasar la medida de un eje al otro multiplicando por la proporcion.
   */
  const camaraTop = `${((IPAD_BISEL / 2) * (IPAD.ancho / IPAD.alto) * 100).toFixed(2)}%`;

  return (
    <div
      data-marco
      className={className}
      style={{ aspectRatio: `${IPAD.ancho} / ${IPAD.alto}` }}
      role={etiqueta ? "img" : undefined}
      aria-label={etiqueta}
    >
      {/* Volumen arriba, en el canto de arriba a la derecha. */}
      <span data-marco-boton="der" style={{ top: "6%", height: "7%" }} />

      <div
        data-marco-cuerpo
        style={{ padding: bisel, clipPath: "url(#sq-ipad-marco)" }}
      >
        <div data-marco-camara style={{ top: camaraTop }} />

        <div data-marco-pantalla style={{ clipPath: "url(#sq-ipad-pantalla)" }}>
          <div data-marco-contenido>{children}</div>
          <div data-marco-indicador />
        </div>
      </div>
    </div>
  );
}

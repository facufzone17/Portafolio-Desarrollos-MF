import { IPHONE, IPHONE_BISEL } from "@/lib/squircle";
import { BarraEstado } from "./BarraEstado";

/**
 * Marco de iPhone en CSS puro, para envolver una captura.
 *
 * Reusable: el contenido va como hijo y el tamaño lo pone quien lo usa, con un
 * ancho en la clase. Todo lo de adentro esta en porcentaje del ancho del
 * marco, asi que el mismo componente sirve a 180px y a 420px sin tocar nada.
 *
 * La rotacion se aplica DESDE AFUERA (`className="rotate-[9deg]"`) y no rompe
 * nada: el marco no usa transform propio en ningun lado, asi que el `rotate`
 * de quien lo llama es el unico de la cadena. Por eso la isla y el indicador
 * se centran con `translate` y no con `transform`, que si se pisarian.
 *
 * El marco no recorta sus botones porque los botones NO estan adentro del
 * elemento recortado: cuelgan del contenedor y el cuerpo los tapa a medias.
 * Ver el bloque `[data-marco]` en globals.css.
 */
/**
 * Alto de la zona segura de arriba, en porcentaje del alto de la pantalla.
 *
 * En un iPhone real son unos 59pt sobre 852: la franja donde viven la hora y
 * la isla. La captura arranca DEBAJO de esa franja, que es lo que hace que la
 * isla no le caiga encima al encabezado de lo que se este mostrando.
 */
const ZONA_SEGURA = 6.9;

export function MarcoIPhone({
  children,
  className = "",
  hora = "9:41",
  etiqueta,
  fondo = "#000",
  barraColor = "#fff",
}: {
  /** La captura. Se recorta sola con la pantalla. */
  children: React.ReactNode;
  /** Ancho, rotacion y posicion los pone quien lo usa. */
  className?: string;
  hora?: string;
  /** Que se ve en la pantalla, para lectores de pantalla. */
  etiqueta?: string;
  /**
   * Color de la franja de arriba, detras de la hora y la isla.
   *
   * En un telefono real ahi se ve el fondo de la pagina, asi que conviene
   * pasarle el color de fondo de la captura: con el negro por defecto, una
   * captura clara queda con una banda negra que parece un error de recorte.
   */
  fondo?: string;
  /**
   * Color de la hora y los iconos. Blanco sobre una captura oscura, oscuro
   * sobre una clara: es lo que hace iOS, y sin esto la barra desaparece en la
   * mitad de los casos.
   */
  barraColor?: string;
}) {
  // El bisel, en porcentaje del ancho. Como `padding` mide siempre contra el
  // ancho, el mismo numero da un canto parejo en las cuatro caras.
  const bisel = `${(IPHONE_BISEL * 100).toFixed(2)}%`;

  return (
    <div
      data-marco
      className={className}
      style={
        {
          aspectRatio: `${IPHONE.ancho} / ${IPHONE.alto}`,
          "--marco-fondo": fondo,
          "--marco-contenido-top": `${ZONA_SEGURA}%`,
          "--marco-barra-color": barraColor,
        } as React.CSSProperties
      }
      role={etiqueta ? "img" : undefined}
      aria-label={etiqueta}
    >
      {/* Volumen arriba, volumen abajo, y encendido del otro lado. */}
      <span data-marco-boton="izq" style={{ top: "17.5%", height: "5.5%" }} />
      <span data-marco-boton="izq" style={{ top: "25%", height: "5.5%" }} />
      <span data-marco-boton="der" style={{ top: "22%", height: "8%" }} />

      <div
        data-marco-cuerpo
        style={{ padding: bisel, clipPath: "url(#sq-iphone-marco)" }}
      >
        <div
          data-marco-pantalla
          style={{ clipPath: "url(#sq-iphone-pantalla)" }}
        >
          <div data-marco-contenido>{children}</div>

          {/*
            La barra de estado y la isla van por encima de la captura y son
            independientes de ella: la captura puede ser cualquier cosa y el
            telefono sigue leyendose como un telefono.
          */}
          <BarraEstado hora={hora} conIsla />
          <div data-marco-isla />
          <div data-marco-indicador />
        </div>
      </div>
    </div>
  );
}

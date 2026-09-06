import {
  PATH_IPAD_MARCO,
  PATH_IPAD_PANTALLA,
  PATH_IPHONE_MARCO,
  PATH_IPHONE_PANTALLA,
} from "@/lib/squircle";

/**
 * Los cuatro recortes de esquina continua, definidos una sola vez.
 *
 * Van en un SVG aparte y no adentro de cada marco a proposito: un <clipPath>
 * se referencia por id, asi que dos telefonos en la misma pagina comparten la
 * misma definicion. Si cada componente trajera la suya, dos instancias
 * duplicarian el id y el navegador se queda con la primera — que es el tipo de
 * bug que aparece recien cuando alguien agrega el segundo dispositivo.
 *
 * El SVG no ocupa lugar ni se ve: es solo el diccionario de formas.
 */
export function DefinicionesMarcos() {
  return (
    <svg
      aria-hidden
      focusable="false"
      className="pointer-events-none absolute size-0"
    >
      <defs>
        {/*
          clipPathUnits="objectBoundingBox" hace que el path trabaje en
          coordenadas 0..1 y se estire solo al tamaño del elemento. La
          compensacion de la proporcion ya viene hecha en lib/squircle.ts.
        */}
        <clipPath id="sq-iphone-marco" clipPathUnits="objectBoundingBox">
          <path d={PATH_IPHONE_MARCO} />
        </clipPath>
        <clipPath id="sq-iphone-pantalla" clipPathUnits="objectBoundingBox">
          <path d={PATH_IPHONE_PANTALLA} />
        </clipPath>
        <clipPath id="sq-ipad-marco" clipPathUnits="objectBoundingBox">
          <path d={PATH_IPAD_MARCO} />
        </clipPath>
        <clipPath id="sq-ipad-pantalla" clipPathUnits="objectBoundingBox">
          <path d={PATH_IPAD_PANTALLA} />
        </clipPath>
      </defs>
    </svg>
  );
}
